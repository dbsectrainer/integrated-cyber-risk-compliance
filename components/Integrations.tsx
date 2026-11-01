import React, { useState } from 'react';
import Card from './shared/Card';
import { integrationService } from '../services/integrationService';
import { IntegrationConnector, IntegrationType } from '../types/integrations';
import { announce } from './shared/Announcer';

const STATUS_BADGE: Record<string, string> = {
  disconnected: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  connecting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 animate-pulse',
  connected: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  syncing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 animate-pulse',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const SAMPLE_SIEM_PAYLOAD = JSON.stringify(
  [
    {
      id: "SPLUNK-89211",
      source: "Splunk ES (Core Network)",
      timestamp: new Date().toISOString(),
      title: "Multiple Failed SSH Logins Followed by Successful Sudo (Possible Brute Force)",
      severity: "High",
      details: "Host ip-10-0-4-12 observed 45 failed attempts prior to privileged escalation from 192.168.1.104."
    },
    {
      id: "ELASTIC-3401",
      source: "Elastic Endpoint Security",
      timestamp: new Date().toISOString(),
      title: "Suspicious PowerShell Base64 Encoded Command on Bastion Host",
      severity: "Critical",
      details: "Process execution detected with encoded argument invoking remote IWR cradle."
    }
  ],
  null,
  2
);

const Integrations: React.FC = () => {
  const [connectors, setConnectors] = useState<IntegrationConnector[]>(() => integrationService.getConnectors());
  const [isLive, setIsLive] = useState<boolean>(() => integrationService.isLiveMode());
  const [testResult, setTestResult] = useState<{ id: string; message: string; success: boolean } | null>(null);
  const [importJson, setImportJson] = useState<string>(SAMPLE_SIEM_PAYLOAD);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | IntegrationType>('all');

  const handleToggleMode = () => {
    const next = !isLive;
    integrationService.setLiveMode(next);
    setIsLive(next);
    announce(next ? 'Switched to Live External Integrations Mode' : 'Switched to Sample Data Demo Mode');
  };

  const handleUpdate = (id: string, updates: Partial<IntegrationConnector>) => {
    const updated = integrationService.updateConnector(id, updates);
    setConnectors((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleTestConnection = async (id: string) => {
    const conn = connectors.find((c) => c.id === id);
    if (!conn) return;
    setTestResult(null);
    announce(`Testing connection to ${conn.name}`);
    const res = await integrationService.testConnection(id);
    setConnectors([...integrationService.getConnectors()]);
    setTestResult({ id, ...res });
    announce(`Connection test to ${conn.name}: ${res.success ? 'Success' : 'Failed'}`);
  };

  const handleImport = () => {
    setImportNotice(null);
    const result = integrationService.importExternalAlerts(importJson);
    if (result.errors) {
      setImportNotice(`Error parsing JSON: ${result.errors}`);
      announce('Failed to import JSON alerts');
    } else {
      setImportNotice(`Successfully ingested ${result.imported} real event(s) into active state.`);
      announce(`Successfully ingested ${result.imported} real events`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all connectors and clear imported events?')) {
      integrationService.resetAll();
      setConnectors([...integrationService.getConnectors()]);
      setIsLive(false);
      setTestResult(null);
      setImportNotice('All integrations reset to defaults.');
      announce('Integrations reset to default configuration');
    }
  };

  const filtered = connectors.filter((c) => activeTab === 'all' || c.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            External Integrations Hub
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Connect live enterprise SIEM, ITSM, and GRC systems or ingest real incident and risk event feeds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
            <span className="text-gray-700 dark:text-gray-300">Live External Mode:</span>
            <input
              type="checkbox"
              checked={isLive}
              onChange={handleToggleMode}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              aria-label="Toggle live external integration mode"
            />
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${isLive ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
              {isLive ? 'LIVE' : 'SAMPLE DATA'}
            </span>
          </label>
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'all'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All ({connectors.length})
        </button>
        <button
          onClick={() => setActiveTab('siem')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'siem'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          SIEM & Security Analytics
        </button>
        <button
          onClick={() => setActiveTab('itsm')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'itsm'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          ITSM & Ticketing
        </button>
        <button
          onClick={() => setActiveTab('grc')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'grc'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          GRC & Risk Management
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{c.name}</h3>
                <span className="text-xs uppercase tracking-wider text-gray-500 font-mono">{c.type}</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[c.status]}`}>
                <span className="sr-only">Status: </span>
                {c.status.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{c.description}</p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Endpoint URL</label>
                <input
                  type="text"
                  value={c.endpointUrl}
                  onChange={(e) => handleUpdate(c.id, { endpointUrl: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Authentication Token / API Key ({c.authHeaderKey || 'Token'})
                </label>
                <input
                  type="password"
                  value={c.authToken || ''}
                  placeholder="Enter secret token or API key..."
                  onChange={(e) => handleUpdate(c.id, { authToken: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 pt-1">
                <span>Sync Interval: {c.pollIntervalMinutes} min</span>
                <span>Records Synced: {c.recordsSynced}</span>
              </div>

              {c.lastSync && (
                <div className="text-[11px] text-gray-500">
                  Last successful sync: {new Date(c.lastSync).toLocaleTimeString()}
                </div>
              )}

              {c.lastError && (
                <div className="p-2 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs">
                  {c.lastError}
                </div>
              )}

              {testResult?.id === c.id && (
                <div
                  className={`p-2 rounded text-xs ${
                    testResult.success
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {testResult.message}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={c.enabled}
                    onChange={(e) => handleUpdate(c.id, { enabled: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Enabled</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection(c.id)}
                  disabled={c.status === 'connecting'}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-colors disabled:opacity-50"
                >
                  Test Connection
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Real Event Ingestion & Webhook Payload Dropzone
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Paste or upload real SIEM alerts (JSON format) to inject directly into the dashboard. When Live External Mode is active,
          these records override default sample data.
        </p>

        <textarea
          rows={7}
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-mono text-xs mb-3"
          placeholder="Paste SIEM JSON alert payload..."
          aria-label="Raw JSON SIEM alert payload input"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {importNotice && <span className="font-semibold text-indigo-600 dark:text-indigo-400">{importNotice}</span>}
          </div>
          <button
            onClick={handleImport}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm shadow-sm transition-colors"
          >
            Ingest Real Event Data
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Integrations;

