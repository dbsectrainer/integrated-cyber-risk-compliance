export enum View {
  Dashboard = 'DASHBOARD',
  Governance = 'GOVERNANCE',
  RiskRegister = 'RISK_REGISTER',
  ProjectPlan = 'PROJECT_PLAN',
  Presentation = 'PRESENTATION',
  Verifier = 'VERIFIER',
  Cmmc = 'CMMC',
  Integrations = 'INTEGRATIONS',
}

export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  source: 'SIEM' | 'Manual' | 'Email';
  timestamp: string;
}

export interface ComplianceStatus {
  framework: string;
  controls: {
    identify: number;
    protect: number;
    detect: number;
    respond: number;
    recover: number;
  };
}

export interface Risk {
  id: string;
  title: string;
  asset: string;
  category: 'Operational' | 'Technical' | 'Compliance';
  impact: 'High' | 'Medium' | 'Low';
  likelihood: 'High' | 'Medium' | 'Low';
  score: number;
  status: 'Open' | 'Mitigated' | 'Accepted';
}

export interface RacI {
  activity: string;
  ciso: 'R' | 'A' | 'C' | 'I';
  pmo: 'R' | 'A' | 'C' | 'I';
  soc: 'R' | 'A' | 'C' | 'I';
  compliance: 'R' | 'A' | 'C' | 'I';
  devops: 'R' | 'A' | 'C' | 'I';
}

export interface ProjectTask {
  id: number;
  name: string;
  start: number; // week number
  end: number; // week number
  dependencies: number[];
  owner: string;
  status: 'completed' | 'in-progress' | 'not-started';
}
