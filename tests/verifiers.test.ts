import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { verifyTerraformPlan } from '../verifiers/terraformVerifier';
import { verifyKubernetesManifests } from '../verifiers/kubernetesVerifier';
import { verifyCILogs } from '../verifiers/ciLogsVerifier';
import { raciData, riskData, kpiData, complianceData, projectPlanData, CRITICAL_RISK_THRESHOLD } from '../data/mockData';
import { CMMC_DOMAINS, CMMC_PRACTICES } from '../data/cmmcPractices';
import { computeReadiness, sanitizeStatuses, StatusMap } from '../data/cmmcScore';

const read = (p: string) => readFileSync(new URL(`../samples/${p}`, import.meta.url), 'utf8');

describe('terraform verifier', () => {
  it('fails unencrypted storage with per-resource findings', () => {
    const r = verifyTerraformPlan(read('terraform/failing/unencrypted-storage.json'));
    expect(r.status).toBe('FAIL');
    expect(r.findings.length).toBeGreaterThan(0);
    expect(r.summary.non_compliant_resources).toBe(r.findings.length);
  });
  it('passes encrypted storage', () => {
    const r = verifyTerraformPlan(read('terraform/passing/encrypted-s3.json'));
    expect(r.status).toBe('PASS');
    expect(r.findings).toHaveLength(0);
    expect(r.summary.compliance_percentage).toBe(100);
  });
  it('treats a plan with no storage resources as PASS', () => {
    const r = verifyTerraformPlan(JSON.stringify({ planned_values: { root_module: { resources: [] } } }));
    expect(r.status).toBe('PASS');
  });
});

describe('terraform verifier (robustness)', () => {
  it('finds storage resources inside child modules', () => {
    const plan = { planned_values: { root_module: { resources: [], child_modules: [{ address: 'module.x', resources: [
      { address: 'module.x.aws_ebs_volume.v', mode: 'managed', type: 'aws_ebs_volume', name: 'v', provider_name: 'aws', schema_version: 0, values: { encrypted: false } },
    ] }] } } };
    const r = verifyTerraformPlan(JSON.stringify(plan));
    expect(r.status).toBe('FAIL');
    expect(r.findings[0].resource_address).toBe('module.x.aws_ebs_volume.v');
  });
  it('rejects invalid JSON and non-plan documents with a clear error', () => {
    expect(() => verifyTerraformPlan('{nope')).toThrow(/not valid JSON/);
    expect(() => verifyTerraformPlan('{"foo":1}')).toThrow(/planned_values\.root_module/);
  });
});

describe('kubernetes verifier', () => {
  it('fails unsigned deployments', () => {
    const r = verifyKubernetesManifests(read('kubernetes/failing/unsigned-deployment.yaml'));
    expect(r.status).toBe('FAIL');
    expect(r.summary.total_images).toBe(4);
    expect(r.summary.verified_images).toBe(0);
  });
  it('reports real container names, includes initContainers and CronJobs', () => {
    const yml = `
apiVersion: batch/v1
kind: CronJob
metadata: { name: nightly, namespace: ops }
spec:
  jobTemplate:
    spec:
      template:
        spec:
          initContainers:
            - { name: prep, image: "busybox:latest" }
          containers:
            - { name: main, image: "docker.io/app:1.0" }
`;
    const r = verifyKubernetesManifests(yml);
    expect(r.summary.total_images).toBe(2);
    expect(r.findings.map((f) => f.container_name).sort()).toEqual(expect.arrayContaining(['main', 'prep']));
    expect(r.findings.every((f) => f.namespace === 'ops')).toBe(true);
  });
  it('throws a clear error for invalid YAML', () => {
    expect(() => verifyKubernetesManifests('a: [unclosed')).toThrow(/Invalid Kubernetes YAML/);
  });
  it('passes signed, digest-pinned deployments', () => {
    const r = verifyKubernetesManifests(read('kubernetes/passing/signed-deployment.yaml'));
    expect(r.status).toBe('PASS');
    expect(r.summary.total_images).toBe(2);
  });
});

describe('cmmc data and scoring', () => {
  it('has 14 domains, 110 unique practices, 17 at level 1', () => {
    expect(CMMC_DOMAINS).toHaveLength(14);
    expect(CMMC_PRACTICES).toHaveLength(110);
    expect(new Set(CMMC_PRACTICES.map((p) => p.id)).size).toBe(110);
    expect(CMMC_PRACTICES.filter((p) => p.level === 1)).toHaveLength(17);
    for (const p of CMMC_PRACTICES) expect(CMMC_DOMAINS.some((d) => d.code === p.domain)).toBe(true);
  });
  it('matches the official per-domain counts', () => {
    const expected: Record<string, number> = { AC: 22, AT: 3, AU: 9, CM: 9, IA: 11, IR: 3, MA: 6, MP: 9, PS: 2, PE: 6, RA: 3, CA: 4, SC: 16, SI: 7 };
    for (const [d, n] of Object.entries(expected)) expect(CMMC_PRACTICES.filter((p) => p.domain === d)).toHaveLength(n);
  });
  it('computes readiness, excluding not-applicable practices', () => {
    expect(computeReadiness({}).percent).toBe(0);
    const all: StatusMap = Object.fromEntries(CMMC_PRACTICES.map((p) => [p.id, 'implemented' as const]));
    expect(computeReadiness(all).percent).toBe(100);
    const mixed: StatusMap = { ...all, 'AC.L1-3.1.1': 'not-applicable', 'AC.L1-3.1.2': 'partial' };
    const r = computeReadiness(mixed);
    expect(r.total).toBe(109);
    expect(r.implemented).toBe(108);
    expect(r.partial).toBe(1);
    expect(r.notApplicable).toBe(1);
  });
  it('sanitizes unknown ids and invalid statuses from storage', () => {
    expect(sanitizeStatuses({ 'AC.L1-3.1.1': 'implemented', bogus: 'implemented', 'AC.L1-3.1.2': 'hacked' })).toEqual({ 'AC.L1-3.1.1': 'implemented' });
    expect(sanitizeStatuses(null)).toEqual({});
  });
});

describe('sample data integrity', () => {
  it('every RACI row has exactly one Accountable and one Responsible', () => {
    for (const row of raciData) {
      const codes = [row.ciso, row.pmo, row.soc, row.compliance, row.devops];
      expect(codes.filter((c) => c === 'A'), row.activity).toHaveLength(1);
      expect(codes.filter((c) => c === 'R'), row.activity).toHaveLength(1);
    }
  });
  it('KPIs agree with the risk register and CSF radar data', () => {
    const open = riskData.filter((r) => r.status === 'Open' && r.score > CRITICAL_RISK_THRESHOLD).length;
    expect(kpiData.find((k) => k.title === 'Open Critical Risks')!.value).toBe(String(open));
    const v = Object.values(complianceData[0].controls);
    expect(kpiData.find((k) => k.title.startsWith('Control Coverage'))!.value).toBe(`${Math.round(v.reduce((a, b) => a + b, 0) / v.length)}%`);
  });
  it('project plan tasks only depend on earlier-defined tasks and fit in 12 weeks', () => {
    for (const t of projectPlanData) {
      expect(t.end).toBeGreaterThanOrEqual(t.start);
      expect(t.end).toBeLessThanOrEqual(12);
      for (const d of t.dependencies) expect(d).toBeLessThan(t.id);
    }
  });
});

describe('ci log verifier', () => {
  it('reports every finding listed in the failing log (regression: Pattern-style finding was dropped)', () => {
    const r = verifyCILogs(read('ci-logs/failing/secrets-detected.log'));
    expect(r.status).toBe('FAIL');
    expect(r.findings).toHaveLength(5);
    expect(r.summary.files_with_secrets).toBe(4);
    expect(r.findings.some((f) => f.type === 'Private Key' && f.file === 'scripts/deploy.sh')).toBe(true);
  });
  it('never exposes full secrets', () => {
    const r = verifyCILogs(read('ci-logs/failing/secrets-detected.log'));
    for (const f of r.findings) expect(f.secret_preview).not.toContain('wJalrXUtnFEMI/K7MDENG');
  });
  it('passes the clean log', () => {
    const r = verifyCILogs(read('ci-logs/passing/clean-build.log'));
    expect(r.status).toBe('PASS');
    expect(r.summary.total_files_scanned).toBe(127);
  });
});
