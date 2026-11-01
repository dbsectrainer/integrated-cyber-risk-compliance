import { Kpi, Incident, ComplianceStatus, Risk, RacI, ProjectTask } from '../types';

export const incidentData: Incident[] = [
  { id: 'INC-001', title: 'Anomalous Login Activity from Foreign IP', severity: 'Critical', status: 'Open', source: 'SIEM', timestamp: '2024-07-30T10:00:00Z' },
  { id: 'INC-002', title: 'Potential Malware on HR Server', severity: 'High', status: 'In Progress', source: 'SIEM', timestamp: '2024-07-30T09:30:00Z' },
  { id: 'INC-003', title: 'Phishing Email Reported by User', severity: 'Medium', status: 'Resolved', source: 'Email', timestamp: '2024-07-29T15:00:00Z' },
  { id: 'INC-004', title: 'Unusual Outbound Traffic from Dev Server', severity: 'High', status: 'Open', source: 'SIEM', timestamp: '2024-07-30T11:45:00Z'},
  { id: 'INC-005', title: 'Failed Authentication Spike', severity: 'Medium', status: 'In Progress', source: 'SIEM', timestamp: '2024-07-30T08:00:00Z'},
];

export const complianceData: ComplianceStatus[] = [
    {
        framework: 'NIST CSF',
        controls: { identify: 95, protect: 88, detect: 91, respond: 85, recover: 94 }
    },
];

export const riskData: Risk[] = [
  { id: 'RISK-101', title: 'Unpatched Production Servers', asset: 'SRV-PROD-01', category: 'Technical', impact: 'High', likelihood: 'Medium', score: 75, status: 'Open' },
  { id: 'RISK-102', title: 'Lack of Vendor Security Assessment', asset: 'Third-Party SaaS', category: 'Compliance', impact: 'Medium', likelihood: 'High', score: 68, status: 'Open' },
  { id: 'RISK-103', title: 'Insufficient Data Encryption at Rest', asset: 'Customer DB', category: 'Technical', impact: 'High', likelihood: 'Low', score: 55, status: 'Mitigated' },
  { id: 'RISK-104', title: 'Insider Threat from Disgruntled Employee', asset: 'All Systems', category: 'Operational', impact: 'High', likelihood: 'Low', score: 52, status: 'Accepted' },
  { id: 'RISK-105', title: 'Denial of Service (DoS) Attack', asset: 'Public Web Servers', category: 'Technical', impact: 'Medium', likelihood: 'Medium', score: 45, status: 'Open' },
  { id: 'RISK-106', title: 'Data Loss due to Backup Failure', asset: 'Financial Records', category: 'Operational', impact: 'High', likelihood: 'Low', score: 58, status: 'Mitigated' },
];

export const raciData: RacI[] = [
    { activity: 'Incident Triage & Response', ciso: 'A', soc: 'R', devops: 'C', pmo: 'I', compliance: 'I' },
    { activity: 'Risk Assessment', ciso: 'A', compliance: 'R', soc: 'C', devops: 'I', pmo: 'I' },
    { activity: 'Control Implementation', ciso: 'A', devops: 'R', pmo: 'C', soc: 'I', compliance: 'C' },
    { activity: 'Compliance Auditing', ciso: 'A', compliance: 'R', pmo: 'I', soc: 'C', devops: 'C' },
    { activity: 'Executive Reporting', ciso: 'R', pmo: 'A', compliance: 'C', soc: 'I', devops: 'I' },
];

export const projectPlanData: ProjectTask[] = [
    { id: 1, name: 'Phase 1: Discovery & Planning', start: 1, end: 2, dependencies: [], owner: 'PMO', status: 'completed' },
    { id: 2, name: 'SIEM Integration (Splunk)', start: 3, end: 5, dependencies: [1], owner: 'DevOps', status: 'completed' },
    { id: 3, name: 'ITSM Integration (ServiceNow)', start: 4, end: 6, dependencies: [1], owner: 'DevOps', status: 'in-progress' },
    { id: 4, name: 'GRC Integration (Archer)', start: 6, end: 8, dependencies: [1], owner: 'Compliance', status: 'in-progress' },
    { id: 5, name: 'Phase 2: Dashboard Development', start: 7, end: 10, dependencies: [2, 3], owner: 'DevOps', status: 'not-started' },
    { id: 6, name: 'UAT & Testing', start: 11, end: 11, dependencies: [4, 5], owner: 'PMO', status: 'not-started' },
    { id: 7, name: 'Go-Live & Rollout', start: 12, end: 12, dependencies: [6], owner: 'PMO', status: 'not-started' },
];

// Sample data. KPIs that can be derived from the other datasets are derived, so the dashboard is internally consistent.
export const CRITICAL_RISK_THRESHOLD = 70;
const openCriticalRisks = riskData.filter((r) => r.status === 'Open' && r.score > CRITICAL_RISK_THRESHOLD).length;
const csfValues = Object.values(complianceData[0].controls);
const csfAverage = Math.round(csfValues.reduce((a, b) => a + b, 0) / csfValues.length);

export const kpiData: Kpi[] = [
  { title: 'MTTD (Mean Time to Detect)', value: '45 mins', change: '-12%', changeType: 'decrease', description: 'vs. last 30 days' },
  { title: 'MTTR (Mean Time to Respond)', value: '3.5 hours', change: '-8%', changeType: 'decrease', description: 'vs. last 30 days' },
  { title: 'Control Coverage (NIST)', value: `${csfAverage}%`, change: '+3%', changeType: 'increase', description: 'mean of CSF functions' },
  { title: 'Open Critical Risks', value: String(openCriticalRisks), change: '+1', changeType: 'increase', description: `open, score > ${CRITICAL_RISK_THRESHOLD}` },
];
