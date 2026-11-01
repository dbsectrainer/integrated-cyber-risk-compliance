import { describe, it, expect, beforeEach } from 'vitest';
import { IntegrationService, DEFAULT_CONNECTORS } from '../services/integrationService';

const store = new Map<string, string>();
const storageMock = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
  clear: () => { store.clear(); },
};
// @ts-expect-error polyfill for vitest node env
globalThis.localStorage = storageMock;

describe('IntegrationService (SIEM / ITSM / GRC)', () => {
  let service: IntegrationService;

  beforeEach(() => {
    store.clear();
    service = new IntegrationService();
  });

  it('initializes with all default connectors spanning SIEM, ITSM, and GRC', () => {
    const connectors = service.getConnectors();
    expect(connectors).toHaveLength(DEFAULT_CONNECTORS.length);
    expect(connectors.some((c) => c.type === 'siem')).toBe(true);
    expect(connectors.some((c) => c.type === 'itsm')).toBe(true);
    expect(connectors.some((c) => c.type === 'grc')).toBe(true);
    expect(service.isLiveMode()).toBe(false);
  });

  it('updates connector configuration and persists to storage', () => {
    service.updateConnector('conn-splunk', {
      enabled: true,
      endpointUrl: 'https://splunk.production.corp:8088/services/collector',
      authToken: 'splunk-hec-token-secret-999',
    });

    const reloaded = new IntegrationService();
    const splunk = reloaded.getConnectors().find((c) => c.id === 'conn-splunk');
    expect(splunk?.enabled).toBe(true);
    expect(splunk?.endpointUrl).toBe('https://splunk.production.corp:8088/services/collector');
    expect(splunk?.authToken).toBe('splunk-hec-token-secret-999');
  });

  it('tests connection and validates endpoint format', async () => {
    service.updateConnector('conn-elastic', {
      endpointUrl: 'invalid-url',
    });
    const failRes = await service.testConnection('conn-elastic');
    expect(failRes.success).toBe(false);

    service.updateConnector('conn-elastic', {
      endpointUrl: 'https://elastic.corp.internal:9200',
      authToken: 'token-with-sufficient-length',
    });
    const passRes = await service.testConnection('conn-elastic');
    expect(passRes.success).toBe(true);
    const conn = service.getConnectors().find((c) => c.id === 'conn-elastic');
    expect(conn?.status).toBe('connected');
    expect(conn?.lastSync).toBeDefined();
  });

  it('ingests external SIEM JSON payloads and normalizes incidents', () => {
    const payload = JSON.stringify([
      {
        id: 'SEC-9901',
        source: 'Splunk Alert',
        title: 'Unauthorized S3 Bucket Modification',
        severity: 'Critical',
        timestamp: '2026-10-31T20:00:00Z',
      },
    ]);

    const res = service.importExternalAlerts(payload);
    expect(res.imported).toBe(1);
    expect(res.errors).toBeUndefined();

    // In demo mode, normalized returns empty so mockData is preserved
    expect(service.getNormalizedIncidents()).toHaveLength(0);

    // In live mode, normalized returns ingested incidents
    service.setLiveMode(true);
    const incidents = service.getNormalizedIncidents();
    expect(incidents).toHaveLength(1);
    expect(incidents[0].id).toBe('SEC-9901');
    expect(incidents[0].severity).toBe('Critical');
  });

  it('handles invalid JSON payloads gracefully', () => {
    const res = service.importExternalAlerts('invalid-json-content{');
    expect(res.imported).toBe(0);
    expect(res.errors).toBeDefined();
  });
});
