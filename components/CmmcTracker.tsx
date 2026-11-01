import React, { useEffect, useMemo, useState } from 'react';
import Card from './shared/Card';
import { ALL_CMMC_PRACTICES, CMMC_DOMAINS, CMMC_LEVEL_3_PRACTICES, CMMC_PRACTICES, CmmcPractice, CmmcStatus } from '../data/cmmcPractices';
import { STATUS_LABELS, STATUS_VALUES, StatusMap, computeReadiness, readinessByDomain, sanitizeStatuses } from '../data/cmmcScore';
import { announce } from './shared/Announcer';

const STORAGE_KEY = 'icraf.cmmc.statuses.v1';

const load = (): StatusMap => {
  try {
    return sanitizeStatuses(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
    return {};
  }
};

const STATUS_STYLE: Record<CmmcStatus, string> = {
  'not-assessed': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'not-implemented': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  implemented: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'not-applicable': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
};

const CmmcTracker: React.FC = () => {
  const [statuses, setStatuses] = useState<StatusMap>(load);
  const [domain, setDomain] = useState('ALL');
  const [level, setLevel] = useState<'ALL' | '1' | '2' | '3'>('2');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CmmcStatus>('ALL');
  const [query, setQuery] = useState('');
  const [expandedPractice, setExpandedPractice] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
    } catch {
      /* storage unavailable (private mode / quota): keep in-memory state only */
    }
  }, [statuses]);

  const l2 = useMemo(() => computeReadiness(statuses, () => true, CMMC_PRACTICES), [statuses]);
  const l1 = useMemo(() => computeReadiness(statuses, (p) => p.level === 1, CMMC_PRACTICES), [statuses]);
  const l3 = useMemo(() => computeReadiness(statuses, () => true, CMMC_LEVEL_3_PRACTICES), [statuses]);
  const byDomain = useMemo(() => readinessByDomain(statuses, CMMC_PRACTICES), [statuses]);

  const activePractices: CmmcPractice[] = useMemo(() => {
    if (level === 'ALL') return ALL_CMMC_PRACTICES;
    if (level === '1') return ALL_CMMC_PRACTICES.filter((p) => p.level === 1);
    if (level === '3') return CMMC_LEVEL_3_PRACTICES;
    return CMMC_PRACTICES; // default '2' (= all 110 NIST SP 800-171 practices)
  }, [level]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activePractices.filter((p) => {
      if (domain !== 'ALL' && p.domain !== domain) return false;
      if (statusFilter !== 'ALL' && (statuses[p.id] ?? 'not-assessed') !== statusFilter) return false;
      if (q && !(p.id.toLowerCase().includes(q) || p.text.toLowerCase().includes(q) || p.nist.includes(q))) return false;
      return true;
    });
  }, [activePractices, domain, statusFilter, query, statuses]);

  const setStatus = (id: string, s: CmmcStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: s }));
    announce(`Updated ${id} status to ${STATUS_LABELS[s]}`);
  };

  const reset = () => {
    if (window.confirm('Reset all CMMC practice statuses to "Not assessed"?')) {
      setStatuses({});
      announce('Reset all practice statuses');
    }
  };

  const selectCls =
    'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-2 text-sm';

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">CMMC 2.0 Tracker</h2>
          <a
            href="https://dodcio.defense.gov/CMMC/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            Official DoD CMMC Assessment Guides &rarr;
          </a>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          14 domains · Levels 1 (17 FCI), Level 2 (110 CUI / NIST SP 800-171 Rev. 2), and Level 3 (24 enhanced / NIST SP 800-172).
          Assessment objectives and evaluation methods are aligned with official DoD CMMC Assessment Guides.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Level 2 readiness</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="l2-percent">{l2.percent}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{l2.implemented} of {l2.total} practices implemented</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Level 1 readiness</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="l1-percent">{l1.percent}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{l1.implemented} of {l1.total} practices implemented</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Level 3 enhanced readiness</div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400" data-testid="l3-percent">{l3.percent}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{l3.implemented} of {l3.total} enhanced practices implemented</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 dark:text-gray-400">Status breakdown (Level 2)</div>
          <div className="text-xs mt-2 space-y-1 text-gray-800 dark:text-gray-200">
            <div>Partial: {l2.partial} · Not implemented: {l2.notImplemented}</div>
            <div>Not assessed: {l2.notAssessed} · N/A: {l2.notApplicable}</div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Readiness by domain (Level 2)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3">
          {byDomain.map((d) => (
            <div key={d.domain.code}>
              <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
                <span>{d.domain.code} — {d.domain.name}</span>
                <span>{d.implemented}/{d.total}</span>
              </div>
              <div
                className="h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden"
                role="progressbar"
                aria-label={`${d.domain.name} readiness`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={d.percent}
              >
                <div className="h-full bg-green-600" style={{ width: `${d.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-3 mb-4 items-end">
          <label className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
            Search
            <input className={selectCls} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ID or keyword" />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
            Domain
            <select className={selectCls} value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="ALL">All domains</option>
              {CMMC_DOMAINS.map((d) => (
                <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
            Level
            <select className={selectCls} value={level} onChange={(e) => setLevel(e.target.value as 'ALL' | '1' | '2' | '3')}>
              <option value="2">Level 2 (all 110)</option>
              <option value="1">Level 1 only (17)</option>
              <option value="3">Level 3 enhanced (24)</option>
              <option value="ALL">All Levels (134)</option>
            </select>
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
            Status
            <select className={selectCls} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | CmmcStatus)}>
              <option value="ALL">Any status</option>
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </label>
          <button onClick={reset} className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Reset all
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" aria-live="polite" data-testid="row-count">
          Showing {rows.length} of {level === 'ALL' ? ALL_CMMC_PRACTICES.length : level === '3' ? CMMC_LEVEL_3_PRACTICES.length : CMMC_PRACTICES.length} practices
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="CMMC Practices and Assessment Table">
            <thead className="border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-2 px-3">Practice</th>
                <th scope="col" className="py-2 px-3">Requirement & Assessment Guide</th>
                <th scope="col" className="py-2 px-3">Evidence</th>
                <th scope="col" className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const s = statuses[p.id] ?? 'not-assessed';
                const isExpanded = expandedPractice === p.id;
                return (
                  <React.Fragment key={p.id}>
                    <tr className="border-b border-gray-200 dark:border-gray-700 align-top hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                      <td className="py-2 px-3 font-mono text-xs whitespace-nowrap text-gray-900 dark:text-gray-200">
                        <div className="flex items-center gap-1.5">
                          <span>{p.id}</span>
                          {p.level === 1 && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-sans text-[10px] font-semibold">L1</span>}
                          {p.level === 3 && <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-sans text-[10px] font-semibold">L3</span>}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-300">
                        <p>{p.text}</p>
                        {(p.assessmentGuideRef || p.assessmentMethod) && (
                          <button
                            type="button"
                            onClick={() => setExpandedPractice(isExpanded ? null : p.id)}
                            className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? 'Hide DoD Assessment Guide info' : 'View DoD Assessment Guide criteria'}
                          </button>
                        )}
                        {isExpanded && (
                          <div className="mt-2 p-2.5 rounded bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 space-y-1">
                            {p.assessmentGuideRef && (
                              <div className="font-semibold text-indigo-700 dark:text-indigo-300">
                                Ref: {p.assessmentGuideRef}
                              </div>
                            )}
                            {p.assessmentMethod && (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">Assessment Method:</span> {p.assessmentMethod}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">{p.evidenceControl ?? '—'}</td>
                      <td className="py-2 px-3">
                        <select
                          aria-label={`Status for ${p.id}`}
                          value={s}
                          onChange={(e) => setStatus(p.id, e.target.value as CmmcStatus)}
                          className={`rounded px-2 py-1 text-xs font-semibold border-0 ${STATUS_STYLE[s]}`}
                        >
                          {STATUS_VALUES.map((v) => (
                            <option key={v} value={v}>{STATUS_LABELS[v]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-gray-600 dark:text-gray-400">No practices match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CmmcTracker;
