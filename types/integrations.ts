export type IntegrationType = 'siem' | 'itsm' | 'grc';

export type IntegrationProvider =
  | 'splunk'
  | 'elastic'
  | 'sentinel'
  | 'generic_siem'
  | 'servicenow'
  | 'jira'
  | 'pagerduty'
  | 'servicenow_grc'
  | 'onetrust'
  | 'archer';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'syncing';

export interface IntegrationConnector {
  id: string;
  name: string;
  type: IntegrationType;
  provider: IntegrationProvider;
  description: string;
  enabled: boolean;
  endpointUrl: string;
  authHeaderKey?: string;
  authToken?: string;
  pollIntervalMinutes: number;
  status: ConnectionStatus;
  lastSync?: string;
  lastError?: string;
  recordsSynced: number;
}

export interface IngestedAlert {
  id: string;
  source: string;
  timestamp: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  details: string;
  rawPayload?: Record<string, unknown>;
}

export interface IngestedRisk {
  id: string;
  source: string;
  category: string;
  riskName: string;
  inherentScore: number;
  residualScore: number;
  status: 'Open' | 'Mitigating' | 'Accepted' | 'Closed';
  owner: string;
}

