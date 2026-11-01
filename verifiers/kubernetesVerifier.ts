/**
 * Kubernetes Manifest Verifier
 * Validates image signature verification enforcement
 * Framework Mapping: SOC2 CC8.1, HIPAA 164.312(c)(1), ISO 27001 A.12.5.1
 */

import { loadAll } from 'js-yaml';

export interface KubernetesResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    annotations?: { [key: string]: string };
    labels?: { [key: string]: string };
  };
  spec?: PodSpecLike & { template?: PodTemplateLike; jobTemplate?: { spec?: { template?: PodTemplateLike } } };
}

export interface ContainerSpec {
  name: string;
  image: string;
  imagePullPolicy?: string;
}

interface ContainerLike { name?: string; image?: string }
interface PodSpecLike { containers?: ContainerLike[]; initContainers?: ContainerLike[] }
interface PodTemplateLike { metadata?: { annotations?: Record<string, unknown> }; spec?: PodSpecLike }

interface WorkloadContainer {
  name: string;
  image: string;
  /** Merged resource + pod-template annotations */
  annotations: { [key: string]: string };
}

export interface ImageVerificationFinding {
  resource_name: string;
  resource_kind: string;
  namespace: string;
  container_name: string;
  image: string;
  issue: string;
  severity: string;
  remediation: string;
}

export interface ImageVerificationResult {
  control: string;
  status: 'PASS' | 'FAIL';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  frameworks: string[];
  findings: ImageVerificationFinding[];
  summary: {
    total_images: number;
    verified_images: number;
    unverified_images: number;
    compliance_percentage: number;
  };
  remediation: string[];
}

export class KubernetesVerifier {
  private resources: KubernetesResource[];

  /** @throws Error when the input is not valid YAML */
  constructor(yamlContent: string) {
    this.resources = KubernetesVerifier.parseYAML(yamlContent);
  }

  private static parseYAML(yamlContent: string): KubernetesResource[] {
    let docs: unknown[];
    try {
      docs = loadAll(yamlContent);
    } catch (e) {
      throw new Error(`Invalid Kubernetes YAML: ${e instanceof Error ? e.message.split('\n')[0] : String(e)}`, { cause: e });
    }
    return docs.filter(
      (d): d is KubernetesResource =>
        !!d && typeof d === 'object' && typeof (d as KubernetesResource).kind === 'string' && !!(d as KubernetesResource).metadata?.name
    );
  }

  private static stringMap(v: unknown): { [key: string]: string } {
    const out: { [key: string]: string } = {};
    if (v && typeof v === 'object') for (const [k, val] of Object.entries(v)) out[k] = String(val);
    return out;
  }

  /** Locate the pod spec/template for any supported workload kind. */
  private static podParts(r: KubernetesResource): { spec?: PodSpecLike; templateMeta?: PodTemplateLike['metadata'] } | null {
    switch (r.kind) {
      case 'Pod':
        return { spec: r.spec, templateMeta: undefined };
      case 'CronJob':
        return { spec: r.spec?.jobTemplate?.spec?.template?.spec, templateMeta: r.spec?.jobTemplate?.spec?.template?.metadata };
      case 'Deployment':
      case 'StatefulSet':
      case 'DaemonSet':
      case 'Job':
      case 'ReplicaSet':
        return { spec: r.spec?.template?.spec, templateMeta: r.spec?.template?.metadata };
      default:
        return null;
    }
  }

  private static containersOf(r: KubernetesResource): WorkloadContainer[] {
    const parts = KubernetesVerifier.podParts(r);
    if (!parts?.spec) return [];
    const annotations = {
      ...KubernetesVerifier.stringMap(r.metadata.annotations),
      ...KubernetesVerifier.stringMap(parts.templateMeta?.annotations),
    };
    const list = [...(parts.spec.initContainers ?? []), ...(parts.spec.containers ?? [])];
    return list.flatMap((c) =>
      c && typeof c.image === 'string' ? [{ name: String(c.name ?? 'container'), image: c.image, annotations }] : []
    );
  }

  /**
   * Verify image signature enforcement
   */
  public verifyImageSignatures(): ImageVerificationResult {
    const findings: ImageVerificationFinding[] = [];
    let totalImages = 0;
    let verifiedImages = 0;

    for (const resource of this.resources) {
      for (const container of KubernetesVerifier.containersOf(resource)) {
        totalImages++;

        const violations = this.checkImageCompliance(container.image, container.annotations);

        if (violations.length === 0) {
          verifiedImages++;
        } else {
          for (const violation of violations) {
            findings.push({
              resource_name: resource.metadata.name,
              resource_kind: resource.kind,
              namespace: resource.metadata.namespace || 'default',
              container_name: container.name,
              image: container.image,
              issue: violation.issue,
              severity: violation.severity,
              remediation: violation.remediation,
            });
          }
        }
      }
    }

    const unverifiedImages = totalImages - verifiedImages;
    const compliancePercentage =
      totalImages > 0 ? (verifiedImages / totalImages) * 100 : 100;

    return {
      control: 'Image Signature Verification',
      status: findings.length === 0 ? 'PASS' : 'FAIL',
      severity: 'HIGH',
      frameworks: [
        'SOC2 CC8.1',
        'HIPAA 164.312(c)(1)',
        'ISO 27001 A.12.5.1',
      ],
      findings,
      summary: {
        total_images: totalImages,
        verified_images: verifiedImages,
        unverified_images: unverifiedImages,
        compliance_percentage: Math.round(compliancePercentage),
      },
      remediation: this.getGeneralRemediation(),
    };
  }

  /**
   * Check if an image meets compliance requirements
   */
  private checkImageCompliance(
    image: string,
    annotations: { [key: string]: string }
  ): Array<{ issue: string; severity: string; remediation: string }> {
    const violations: Array<{ issue: string; severity: string; remediation: string }> = [];

    // Check 1: Image must have digest (immutability)
    if (!image.includes('@sha256:')) {
      violations.push({
        issue: 'Image does not include digest (sha256) for immutability',
        severity: 'HIGH',
        remediation:
          'Reference images by digest: registry.company.com/app:v1.0.0@sha256:...',
      });
    }

    // Check 2: No 'latest' tag
    if (image.includes(':latest')) {
      violations.push({
        issue: "Image uses 'latest' tag which is prohibited",
        severity: 'MEDIUM',
        remediation: 'Use specific semantic version tags (e.g., v1.0.0, v2.1.3)',
      });
    }

    // Check 3: Must be from approved registry
    const approvedRegistries = ['registry.company.com', 'gcr.io/company'];
    const isApprovedRegistry = approvedRegistries.some((registry) =>
      image.startsWith(registry)
    );

    if (!isApprovedRegistry) {
      violations.push({
        issue: 'Image is not from an approved/verified registry',
        severity: 'HIGH',
        remediation:
          'Use images from approved registries: registry.company.com or gcr.io/company',
      });
    }

    // Check 4: Must have signature verification annotation
    const hasSignatureAnnotation =
      annotations['cosign.sigstore.dev/signature'] === 'verified' ||
      annotations['image-signature'] !== undefined;

    if (!hasSignatureAnnotation && image.includes('registry.company.com')) {
      violations.push({
        issue: 'Image signature verification annotation missing',
        severity: 'HIGH',
        remediation:
          "Add annotation: cosign.sigstore.dev/signature: 'verified' to pod template",
      });
    }

    return violations;
  }

  /**
   * Get general remediation guidance
   */
  private getGeneralRemediation(): string[] {
    return [
      'Sign all container images using Cosign/Sigstore',
      'Reference images by digest (@sha256:...) for immutability',
      'Deploy Kyverno or Gatekeeper policies to enforce signature verification',
      'Use approved container registries only',
      'Implement automated signing in CI/CD pipeline',
      'Never use :latest tag in production',
      'Document image signing process in runbooks',
    ];
  }
}

/**
 * Convenience function to verify Kubernetes manifests
 */
export function verifyKubernetesManifests(yamlContent: string): ImageVerificationResult {
  const verifier = new KubernetesVerifier(yamlContent);
  return verifier.verifyImageSignatures();
}
