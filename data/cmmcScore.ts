import { CMMC_DOMAINS, CMMC_PRACTICES, CmmcStatus } from './cmmcPractices';

export type StatusMap = Record<string, CmmcStatus>;

export const STATUS_LABELS: Record<CmmcStatus, string> = {
  'not-assessed': 'Not assessed',
  'not-implemented': 'Not implemented',
  partial: 'Partially implemented',
  implemented: 'Implemented',
  'not-applicable': 'Not applicable',
};

export const STATUS_VALUES = Object.keys(STATUS_LABELS) as CmmcStatus[];

export interface Readiness {
  total: number;        // practices in scope (excludes not-applicable)
  implemented: number;
  partial: number;
  notImplemented: number;
  notAssessed: number;
  notApplicable: number;
  percent: number;      // implemented / in-scope, rounded; partial counts as 0
}

export function computeReadiness(statuses: StatusMap, filter: (p: (typeof CMMC_PRACTICES)[number]) => boolean = () => true): Readiness {
  const r: Readiness = { total: 0, implemented: 0, partial: 0, notImplemented: 0, notAssessed: 0, notApplicable: 0, percent: 0 };
  for (const p of CMMC_PRACTICES) {
    if (!filter(p)) continue;
    const s = statuses[p.id] ?? 'not-assessed';
    if (s === 'not-applicable') { r.notApplicable++; continue; }
    r.total++;
    if (s === 'implemented') r.implemented++;
    else if (s === 'partial') r.partial++;
    else if (s === 'not-implemented') r.notImplemented++;
    else r.notAssessed++;
  }
  r.percent = r.total === 0 ? 0 : Math.round((r.implemented / r.total) * 100);
  return r;
}

export function readinessByDomain(statuses: StatusMap) {
  return CMMC_DOMAINS.map((d) => ({ domain: d, ...computeReadiness(statuses, (p) => p.domain === d.code) }));
}

/** Drop unknown ids / invalid statuses (e.g. stale or tampered localStorage). */
export function sanitizeStatuses(raw: unknown): StatusMap {
  const out: StatusMap = {};
  if (!raw || typeof raw !== 'object') return out;
  const ids = new Set(CMMC_PRACTICES.map((p) => p.id));
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (ids.has(k) && typeof v === 'string' && (STATUS_VALUES as string[]).includes(v)) out[k] = v as CmmcStatus;
  }
  return out;
}
