/**
 * Kubernetes Manifest Verifier
 * Validates image signature verification enforcement
 * Framework Mapping: SOC2 CC8.1, HIPAA 164.312(c)(1), ISO 27001 A.12.5.1
 */

export interface KubernetesResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    annotations?: { [key: string]: string };
    labels?: { [key: string]: string };
  };
  spec?: any;
}

export interface ContainerSpec {
  name: string;
  image: string;
  imagePullPolicy?: string;
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

  constructor(yamlContent: string) {
    // Simple YAML parsing - in production, use a proper YAML parser
    this.resources = this.parseYAML(yamlContent);
  }

  /**
   * Simple YAML parser (for demonstration - use js-yaml in production)
   */
  private parseYAML(yamlContent: string): KubernetesResource[] {
    const resources: KubernetesResource[] = [];
    const docs = yamlContent.split(/\n---\n/);

    for (const doc of docs) {
      if (doc.trim().length === 0) continue;

      try {
        // Extract basic fields using regex (simplified for demo)
        const apiVersionMatch = doc.match(/apiVersion:\s*(.+)/);
        const kindMatch = doc.match(/kind:\s*(.+)/);
        const nameMatch = doc.match(/name:\s*(.+)/);
        const namespaceMatch = doc.match(/namespace:\s*(.+)/);

        if (!apiVersionMatch || !kindMatch || !nameMatch) continue;

        const resource: KubernetesResource = {
          apiVersion: apiVersionMatch[1].trim(),
          kind: kindMatch[1].trim(),
          metadata: {
            name: nameMatch[1].trim(),
            namespace: namespaceMatch ? namespaceMatch[1].trim() : 'default',
          },
        };

        // Extract annotations
        const annotationsMatch = doc.match(/annotations:([\s\S]*?)(?=\n\w|\nspec:|$)/);
        if (annotationsMatch) {
          resource.metadata.annotations = this.parseKeyValue(annotationsMatch[1]);
        }

        // Extract container images
        const imageMatches = doc.matchAll(/image:\s*(.+)/g);
        const images: string[] = [];
        for (const match of imageMatches) {
          images.push(match[1].trim());
        }

        if (images.length > 0) {
          resource.spec = { images };
        }

        resources.push(resource);
      } catch (error) {
        // Skip malformed resources
        continue;
      }
    }

    return resources;
  }

  /**
   * Parse key-value pairs from YAML section
   */
  private parseKeyValue(text: string): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    const lines = text.split('\n');

    for (const line of lines) {
      const match = line.match(/^\s*([^:]+):\s*(.+)$/);
      if (match) {
        result[match[1].trim()] = match[2].trim().replace(/['"]/g, '');
      }
    }

    return result;
  }

  /**
   * Verify image signature enforcement
   */
  public verifyImageSignatures(): ImageVerificationResult {
    const findings: ImageVerificationFinding[] = [];
    let totalImages = 0;
    let verifiedImages = 0;

    // Check for workload resources
    const workloadKinds = ['Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob', 'Pod'];

    for (const resource of this.resources) {
      if (!workloadKinds.includes(resource.kind)) continue;

      const images = resource.spec?.images || [];

      for (const image of images) {
        totalImages++;

        const violations = this.checkImageCompliance(
          image,
          resource.metadata.annotations || {}
        );

        if (violations.length === 0) {
          verifiedImages++;
        } else {
          for (const violation of violations) {
            findings.push({
              resource_name: resource.metadata.name,
              resource_kind: resource.kind,
              namespace: resource.metadata.namespace || 'default',
              container_name: 'container', // Simplified for demo
              image,
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
