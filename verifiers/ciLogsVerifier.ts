/**
 * CI/CD Logs Verifier
 * Validates secrets detection and prevention
 * Framework Mapping: SOC2 CC6.1, CC6.6, HIPAA 164.312(a)(1), ISO 27001 A.9.4.1
 */

export interface SecretFinding {
  file: string;
  line: number;
  type: string;
  secret_preview: string;
  severity: string;
}

export interface SecretsVerificationResult {
  control: string;
  status: 'PASS' | 'FAIL';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  frameworks: string[];
  findings: SecretFinding[];
  summary: {
    total_files_scanned: number;
    files_with_secrets: number;
    total_secrets_found: number;
    build_status: 'SUCCESS' | 'FAILED';
  };
  remediation: string[];
}

export class CILogsVerifier {
  private logContent: string;
  private logLines: string[];

  constructor(logContent: string) {
    this.logContent = logContent;
    this.logLines = logContent.split('\n');
  }

  /**
   * Verify that no secrets are detected in the repository
   */
  public verifySecretsDetection(): SecretsVerificationResult {
    const findings: SecretFinding[] = [];
    let buildStatus: 'SUCCESS' | 'FAILED' = 'SUCCESS';

    // Parse the log for secrets detection results
    const secretsDetected = this.parseSecretsFromLog();

    if (secretsDetected.length > 0) {
      findings.push(...secretsDetected);
      buildStatus = 'FAILED';
    }

    // Get files scanned count
    const filesScanned = this.getFilesScannedCount();

    const filesWithSecrets = new Set(findings.map((f) => f.file)).size;

    return {
      control: 'Secrets Detection and Prevention',
      status: findings.length === 0 ? 'PASS' : 'FAIL',
      severity: 'CRITICAL',
      frameworks: [
        'SOC2 CC6.1',
        'SOC2 CC6.6',
        'HIPAA 164.312(a)(1)',
        'ISO 27001 A.9.4.1',
      ],
      findings,
      summary: {
        total_files_scanned: filesScanned,
        files_with_secrets: filesWithSecrets,
        total_secrets_found: findings.length,
        build_status: buildStatus,
      },
      remediation: this.getRemediation(findings.length > 0),
    };
  }

  /**
   * Parse secrets findings from CI log output
   */
  private parseSecretsFromLog(): SecretFinding[] {
    const findings: SecretFinding[] = [];
    let inFindingBlock = false;
    let currentFinding: Partial<SecretFinding> = {};

    for (const line of this.logLines) {
      // Detect start of finding
      if (/Finding\s+\d+:/.test(line)) {
        inFindingBlock = true;
        currentFinding = {};
        continue;
      }

      if (inFindingBlock) {
        // Parse file path
        const fileMatch = line.match(/File:\s*(.+)/);
        if (fileMatch) {
          currentFinding.file = fileMatch[1].trim();
        }

        // Parse line number
        const lineMatch = line.match(/Line:\s*(\d+)/);
        if (lineMatch) {
          currentFinding.line = parseInt(lineMatch[1], 10);
        }

        // Parse secret type
        const typeMatch = line.match(/Type:\s*(.+)/);
        if (typeMatch) {
          currentFinding.type = typeMatch[1].trim();
        }

        // Parse secret (preview)
        const secretMatch = line.match(/(?:Secret|Pattern):\s*(.+)/);
        if (secretMatch) {
          const secret = secretMatch[1].trim();
          // Mask the secret for display
          currentFinding.secret_preview = this.maskSecret(secret);
          currentFinding.severity = this.getSeverityForSecretType(currentFinding.type || '');
        }

        // Check if finding is complete
        if (
          currentFinding.file &&
          currentFinding.line &&
          currentFinding.type &&
          currentFinding.secret_preview
        ) {
          findings.push(currentFinding as SecretFinding);
          inFindingBlock = false;
          currentFinding = {};
        }

        // Empty line ends finding block
        // Empty log message (after the "[timestamp] LEVEL:" prefix) ends the block
        if (line.replace(/^\[[^\]]*\]\s*\w+:/, '').trim() === '') {
          inFindingBlock = false;
        }
      }
    }

    return findings;
  }

  /**
   * Get the number of files scanned from the log
   */
  private getFilesScannedCount(): number {
    for (const line of this.logLines) {
      const match = line.match(/Scanned (\d+) files/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 0;
  }

  /**
   * Mask a secret for safe display
   */
  private maskSecret(secret: string): string {
    if (secret.length <= 8) {
      return '***';
    }
    return secret.substring(0, 4) + '***' + secret.substring(secret.length - 4);
  }

  /**
   * Get severity based on secret type
   */
  private getSeverityForSecretType(type: string): string {
    const criticalTypes = ['AWS Secret Key', 'Private Key', 'Database Password'];
    const highTypes = ['AWS Access Key', 'Generic API Key', 'JWT Token'];

    if (criticalTypes.some((t) => type.includes(t))) {
      return 'CRITICAL';
    } else if (highTypes.some((t) => type.includes(t))) {
      return 'HIGH';
    } else {
      return 'MEDIUM';
    }
  }

  /**
   * Get remediation steps
   */
  private getRemediation(hasViolations: boolean): string[] {
    if (!hasViolations) {
      return [
        'Continue monitoring for secrets in future commits',
        'Maintain pre-commit hooks for secrets detection',
        'Regularly update secrets detection rules',
        'Conduct periodic security awareness training',
      ];
    }

    return [
      'IMMEDIATE: Stop the deployment pipeline',
      'IMMEDIATE: Rotate all exposed credentials',
      'Remove hardcoded secrets from source code',
      'Use environment variables or secret management service (AWS Secrets Manager, HashiCorp Vault)',
      'Remove secrets from git history using BFG Repo-Cleaner or git-filter-repo',
      'Add affected files to .gitignore',
      'Install pre-commit hooks (detect-secrets) to prevent future incidents',
      'Review and update access logs to assess potential compromise',
      'Create security incident ticket and notify security team',
      'Document the incident for compliance audit trail',
    ];
  }

  /**
   * Check if the build passed policy gates
   */
  public checkPolicyGate(): boolean {
    for (const line of this.logLines) {
      if (line.includes('✓ Pipeline completed successfully')) {
        return true;
      }
      if (line.includes('✗ Pipeline FAILED')) {
        return false;
      }
    }
    return false;
  }
}

/**
 * Convenience function to verify CI logs
 */
export function verifyCILogs(logContent: string): SecretsVerificationResult {
  const verifier = new CILogsVerifier(logContent);
  return verifier.verifySecretsDetection();
}
