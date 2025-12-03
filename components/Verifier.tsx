import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, FileText, Terminal, Code } from 'lucide-react';
import Card from './shared/Card';
import { CONTROL_MAP, getControlSummary, getFrameworkCoverage } from '../data/controlMap';

// Import verifiers
import { verifyTerraformPlan } from '../verifiers/terraformVerifier';
import { verifyKubernetesManifests } from '../verifiers/kubernetesVerifier';
import { verifyCILogs } from '../verifiers/ciLogsVerifier';

interface ControlStatus {
  control_id: string;
  control_name: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  severity: string;
  frameworks: {
    soc2: string[];
    hipaa: string[];
    iso27001: string[];
  };
  findings: any[];
  summary: any;
  remediation: string[];
}

export default function Verifier() {
  const [controlStatuses, setControlStatuses] = useState<ControlStatus[]>([]);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runVerifications();
  }, []);

  const runVerifications = async () => {
    setLoading(true);

    const results: ControlStatus[] = [];

    // 1. Verify Terraform - Encryption at Rest
    try {
      // Test with both passing and failing samples
      const passingTfResponse = await fetch('/samples/terraform/passing/encrypted-s3.json');
      const passingTfContent = await passingTfResponse.text();

      const failingTfResponse = await fetch('/samples/terraform/failing/unencrypted-storage.json');
      const failingTfContent = await failingTfResponse.text();

      // For demo, we'll use the failing case to show violations
      const tfResult = verifyTerraformPlan(failingTfContent);

      results.push({
        control_id: 'CTRL-001',
        control_name: 'Encryption at Rest for Storage Resources',
        status: tfResult.status,
        severity: tfResult.severity,
        frameworks: {
          soc2: CONTROL_MAP[0].frameworks.soc2.map((f) => f.id),
          hipaa: CONTROL_MAP[0].frameworks.hipaa.map((f) => f.id),
          iso27001: CONTROL_MAP[0].frameworks.iso27001.map((f) => f.id),
        },
        findings: tfResult.findings,
        summary: tfResult.summary,
        remediation: tfResult.remediation,
      });
    } catch (error) {
      console.error('Terraform verification error:', error);
    }

    // 2. Verify Kubernetes - Image Signature Verification
    try {
      const failingK8sResponse = await fetch('/samples/kubernetes/failing/unsigned-deployment.yaml');
      const failingK8sContent = await failingK8sResponse.text();

      const k8sResult = verifyKubernetesManifests(failingK8sContent);

      results.push({
        control_id: 'CTRL-002',
        control_name: 'Container Image Signature Verification',
        status: k8sResult.status,
        severity: k8sResult.severity,
        frameworks: {
          soc2: CONTROL_MAP[1].frameworks.soc2.map((f) => f.id),
          hipaa: CONTROL_MAP[1].frameworks.hipaa.map((f) => f.id),
          iso27001: CONTROL_MAP[1].frameworks.iso27001.map((f) => f.id),
        },
        findings: k8sResult.findings,
        summary: k8sResult.summary,
        remediation: k8sResult.remediation,
      });
    } catch (error) {
      console.error('Kubernetes verification error:', error);
    }

    // 3. Verify CI Logs - Secrets Detection
    try {
      const failingCIResponse = await fetch('/samples/ci-logs/failing/secrets-detected.log');
      const failingCIContent = await failingCIResponse.text();

      const ciResult = verifyCILogs(failingCIContent);

      results.push({
        control_id: 'CTRL-003',
        control_name: 'Secrets Detection in Source Code',
        status: ciResult.status,
        severity: ciResult.severity,
        frameworks: {
          soc2: CONTROL_MAP[2].frameworks.soc2.map((f) => f.id),
          hipaa: CONTROL_MAP[2].frameworks.hipaa.map((f) => f.id),
          iso27001: CONTROL_MAP[2].frameworks.iso27001.map((f) => f.id),
        },
        findings: ciResult.findings,
        summary: ciResult.summary,
        remediation: ciResult.remediation,
      });
    } catch (error) {
      console.error('CI logs verification error:', error);
    }

    setControlStatuses(results);
    setLoading(false);
  };

  const getSummary = () => {
    const total = controlStatuses.length;
    const passed = controlStatuses.filter((c) => c.status === 'PASS').length;
    const failed = controlStatuses.filter((c) => c.status === 'FAIL').length;
    const compliancePercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    return { total, passed, failed, compliancePercentage };
  };

  const summary = getSummary();
  const selectedControlData = controlStatuses.find((c) => c.control_id === selectedControl);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600 dark:text-gray-400">Running control verifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔍 Control Verifier
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Automated verification of security controls across infrastructure, applications, and processes
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Controls</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</div>
            </div>
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
              <div className="text-2xl font-bold text-green-400">{summary.passed}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
              <div className="text-2xl font-bold text-red-400">{summary.failed}</div>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Compliance</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.compliancePercentage}%</div>
            </div>
            <AlertTriangle
              className={`h-8 w-8 ${
                summary.compliancePercentage >= 80
                  ? 'text-green-400'
                  : summary.compliancePercentage >= 60
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            />
          </div>
        </Card>
      </div>

      {/* Control Status Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Control Status</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time verification results with framework mappings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Control</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Severity</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">SOC2</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">HIPAA</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">ISO 27001</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Findings</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {controlStatuses.map((control) => (
                <tr
                  key={control.control_id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {control.status === 'PASS' ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-white font-medium">{control.control_id}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{control.control_name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        control.severity === 'CRITICAL'
                          ? 'bg-red-900/50 text-red-400'
                          : control.severity === 'HIGH'
                          ? 'bg-orange-900/50 text-orange-400'
                          : 'bg-yellow-900/50 text-yellow-400'
                      }`}
                    >
                      {control.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {control.frameworks.soc2.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded text-xs"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {control.frameworks.hipaa.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 bg-purple-900/30 text-purple-400 rounded text-xs"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {control.frameworks.iso27001.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded text-xs"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        control.findings.length > 0 ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {control.findings.length}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        setSelectedControl(
                          selectedControl === control.control_id ? null : control.control_id
                        )
                      }
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      {selectedControl === control.control_id ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Selected Control Details */}
      {selectedControl && selectedControlData && (
        <Card>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedControlData.control_name}
              </h2>
              <button
                onClick={() => setSelectedControl(null)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(selectedControlData.summary).map(([key, value]) => (
                <div key={key}>
                  <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {typeof value === 'number' && key.includes('percentage')
                      ? `${value}%`
                      : value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Findings */}
          {selectedControlData.findings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Findings ({selectedControlData.findings.length})
              </h3>
              <div className="space-y-3">
                {selectedControlData.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white mb-1">
                          {finding.resource_address ||
                            finding.resource_name ||
                            finding.file ||
                            'Finding'}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{finding.issue}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold">Type:</span>{' '}
                          {finding.resource_type || finding.type || 'N/A'}
                        </div>
                        <div className="text-sm text-blue-300 bg-blue-900/20 p-2 rounded">
                          <span className="font-semibold">Remediation:</span>{' '}
                          {finding.remediation}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remediation Steps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Remediation Steps</h3>
            <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4">
              <ol className="list-decimal list-inside space-y-2">
                {selectedControlData.remediation.map((step, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Card>
      )}

      {/* Framework Coverage */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Framework Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-900/20 rounded-lg">
            <div className="text-lg font-semibold text-blue-400 mb-2">SOC2</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {controlStatuses.filter((c) => c.frameworks.soc2.length > 0).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Controls Mapped</div>
          </div>
          <div className="p-4 bg-purple-900/20 rounded-lg">
            <div className="text-lg font-semibold text-purple-400 mb-2">HIPAA</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {controlStatuses.filter((c) => c.frameworks.hipaa.length > 0).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Controls Mapped</div>
          </div>
          <div className="p-4 bg-green-900/20 rounded-lg">
            <div className="text-lg font-semibold text-green-400 mb-2">ISO 27001</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {controlStatuses.filter((c) => c.frameworks.iso27001.length > 0).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Controls Mapped</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
