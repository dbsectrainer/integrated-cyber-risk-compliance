import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { verifyTerraformPlan } from '../verifiers/terraformVerifier';
import { verifyKubernetesManifests } from '../verifiers/kubernetesVerifier';
import { verifyCILogs } from '../verifiers/ciLogsVerifier';

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

describe('kubernetes verifier', () => {
  it('fails unsigned deployments', () => {
    const r = verifyKubernetesManifests(read('kubernetes/failing/unsigned-deployment.yaml'));
    expect(r.status).toBe('FAIL');
    expect(r.summary.total_images).toBe(4);
    expect(r.summary.verified_images).toBe(0);
  });
  it('passes signed, digest-pinned deployments', () => {
    const r = verifyKubernetesManifests(read('kubernetes/passing/signed-deployment.yaml'));
    expect(r.status).toBe('PASS');
    expect(r.summary.total_images).toBe(2);
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
