# ICRAF Control Verifier - Runbook

## Overview

This runbook provides operational guidance for running, maintaining, and troubleshooting the ICRAF Control Verifier system. The Control Verifier automates the verification of security controls across infrastructure, applications, and CI/CD processes.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Quick Start](#quick-start)
3. [Automated Controls](#automated-controls)
4. [Running Verifications](#running-verifications)
5. [Interpreting Results](#interpreting-results)
6. [Remediation Procedures](#remediation-procedures)
7. [Sample Files](#sample-files)
8. [Policy Files](#policy-files)
9. [Troubleshooting](#troubleshooting)
10. [Compliance Framework Mapping](#compliance-framework-mapping)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    ICRAF Control Verifier                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Terraform   │  │  Kubernetes  │  │   CI/CD      │    │
│  │  Verifier    │  │  Verifier    │  │   Verifier   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                               │
│                   ┌────────▼────────┐                      │
│                   │  Control Map    │                      │
│                   │  (SOC2/HIPAA/   │                      │
│                   │   ISO 27001)    │                      │
│                   └─────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐         ┌─────────┐         ┌─────────┐
    │  OPA    │         │ Kyverno │         │ detect- │
    │ Policy  │         │ Policy  │         │ secrets │
    └─────────┘         └─────────┘         └─────────┘
```

### Data Flow

1. **Input**: Sample files (Terraform JSON, K8s YAML, CI logs) are loaded
2. **Parsing**: Verifiers parse and extract relevant security configurations
3. **Verification**: Each verifier checks compliance against defined policies
4. **Mapping**: Results are mapped to compliance frameworks (SOC2, HIPAA, ISO)
5. **Output**: Status (PASS/FAIL), findings, and remediation guidance

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/integrated-cyber-risk-compliance.git
cd integrated-cyber-risk-compliance

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`.

### First Run

1. Navigate to the **Verifier** tab in the sidebar
2. The system will automatically run all three control verifications
3. Review the control status table for PASS/FAIL results
4. Click "Details" on any control to see findings and remediation steps

---

## Automated Controls

### CTRL-001: Encryption at Rest for Storage Resources

**Objective**: Ensure all storage resources have encryption enabled

**Scope**:
- AWS S3 buckets
- AWS EBS volumes
- AWS RDS clusters and instances
- AWS DynamoDB tables
- AWS EFS file systems

**Policy**: `/policies/terraform/encryption-at-rest.rego`

**Verification Method**: Parse Terraform plan JSON

**Frameworks**:
- SOC2 CC6.1, CC6.7
- HIPAA 164.312(a)(2)(iv), 164.312(e)(2)(ii)
- ISO 27001 A.10.1.1, A.18.1.5

**Expected Configuration**:
```hcl
# S3 Bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.example.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# EBS Volume
resource "aws_ebs_volume" "example" {
  encrypted = true
  kms_key_id = "arn:aws:kms:..."
}

# RDS Cluster
resource "aws_rds_cluster" "example" {
  storage_encrypted = true
  kms_key_id = "arn:aws:kms:..."
}
```

---

### CTRL-002: Container Image Signature Verification

**Objective**: Ensure all container images are signed and verified

**Scope**:
- Kubernetes Deployments
- StatefulSets
- DaemonSets
- Jobs and CronJobs

**Policy**: `/policies/kubernetes/image-signature-verification.yaml`

**Verification Method**: Parse Kubernetes manifests

**Frameworks**:
- SOC2 CC8.1, CC7.2
- HIPAA 164.312(c)(1), 164.308(a)(5)(ii)(B)
- ISO 27001 A.12.5.1, A.14.2.8

**Expected Configuration**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  annotations:
    cosign.sigstore.dev/signature: "verified"
spec:
  template:
    spec:
      containers:
      - name: app
        # Must use digest reference
        image: registry.company.com/app:v1.0.0@sha256:abc123...
```

**Required**:
1. Image referenced by SHA256 digest
2. Image from approved registry
3. Signature verification annotation present
4. No `:latest` tag

---

### CTRL-003: Secrets Detection in Source Code

**Objective**: Prevent hardcoded secrets in repositories

**Scope**:
- All source code files
- Configuration files
- Scripts and automation

**Policy**: `/policies/ci-cd/secrets-detection.yaml`

**Verification Method**: Parse CI/CD logs for detect-secrets output

**Frameworks**:
- SOC2 CC6.1, CC6.6, CC7.4
- HIPAA 164.312(a)(1), 164.308(a)(4)(ii)(B)
- ISO 27001 A.9.4.1, A.9.2.1, A.18.1.3

**Secret Types Detected**:
- AWS Access Keys and Secret Keys
- Private Keys (RSA, SSH)
- API Keys and Tokens
- Database credentials
- JWT tokens
- High-entropy strings
- OAuth tokens

**Expected**: Clean CI log with no secrets detected

---

## Running Verifications

### Manual Verification

#### 1. Terraform Plans

```bash
# Generate Terraform plan
cd infrastructure/
terraform plan -out=tfplan

# Convert to JSON
terraform show -json tfplan > plan.json

# Run verification (in app)
# Upload plan.json to samples/terraform/custom/
```

#### 2. Kubernetes Manifests

```bash
# Export current deployments
kubectl get deployments -A -o yaml > deployments.yaml

# Run verification (in app)
# Upload deployments.yaml to samples/kubernetes/custom/
```

#### 3. CI/CD Logs

```bash
# Get latest CI run logs
# From Jenkins:
curl -u user:token https://jenkins.company.com/job/build/lastBuild/consoleText > build.log

# From GitLab:
gitlab-ci-log download --job-id 12345 > build.log

# Run verification (in app)
# Upload build.log to samples/ci-logs/custom/
```

### Automated Verification

The verifier automatically runs on component mount and can be triggered:

```typescript
// In Verifier component
const runVerifications = async () => {
  // Automatically fetches and verifies all sample files
}
```

---

## Interpreting Results

### Status Indicators

| Status | Icon | Meaning | Action Required |
|--------|------|---------|-----------------|
| PASS | ✓ Green | Control is fully compliant | Continue monitoring |
| FAIL | ✗ Red | Control has violations | Immediate remediation required |
| PENDING | ⏳ Yellow | Verification in progress | Wait for completion |

### Severity Levels

| Severity | Color | Response Time | Escalation |
|----------|-------|---------------|------------|
| CRITICAL | Red | Immediate (< 4 hours) | CISO, Security Team |
| HIGH | Orange | Same Day (< 24 hours) | Security Team, DevOps |
| MEDIUM | Yellow | 3-5 Business Days | Team Lead |
| LOW | Blue | 2 Weeks | Standard Process |

### Findings

Each finding includes:
- **Resource**: Specific resource that failed
- **Issue**: Description of the compliance violation
- **Severity**: Risk level
- **Remediation**: Step-by-step fix instructions

---

## Remediation Procedures

### CTRL-001: Encryption at Rest Failures

**Scenario**: S3 bucket without encryption

**Steps**:
1. Identify the bucket: `aws_s3_bucket.legacy_bucket`
2. Add encryption configuration:
   ```hcl
   resource "aws_s3_bucket_server_side_encryption_configuration" "legacy_bucket" {
     bucket = aws_s3_bucket.legacy_bucket.id
     rule {
       apply_server_side_encryption_by_default {
         sse_algorithm = "aws:kms"
         kms_master_key_id = aws_kms_key.s3.id
       }
     }
   }
   ```
3. Apply changes: `terraform apply`
4. Verify: Re-run verification

**Scenario**: EBS volume unencrypted

**Steps**:
1. **Cannot encrypt existing volume** - Must create snapshot and new encrypted volume
2. Create snapshot:
   ```bash
   aws ec2 create-snapshot --volume-id vol-xxx --description "Pre-encryption backup"
   ```
3. Create encrypted volume from snapshot:
   ```bash
   aws ec2 create-volume --snapshot-id snap-xxx --encrypted --kms-key-id arn:aws:kms:...
   ```
4. Update Terraform:
   ```hcl
   resource "aws_ebs_volume" "app_volume" {
     encrypted = true
     kms_key_id = aws_kms_key.ebs.id
   }
   ```

---

### CTRL-002: Image Signature Failures

**Scenario**: Unsigned image deployment

**Steps**:

1. **Sign the image**:
   ```bash
   # Install cosign
   brew install cosign

   # Generate keypair (one-time)
   cosign generate-key-pair

   # Sign image
   cosign sign --key cosign.key registry.company.com/app:v1.0.0

   # Verify
   cosign verify --key cosign.pub registry.company.com/app:v1.0.0
   ```

2. **Get image digest**:
   ```bash
   docker inspect registry.company.com/app:v1.0.0 --format='{{index .RepoDigests 0}}'
   # Output: registry.company.com/app:v1.0.0@sha256:abc123...
   ```

3. **Update manifest**:
   ```yaml
   spec:
     template:
       metadata:
         annotations:
           cosign.sigstore.dev/signature: "verified"
       spec:
         containers:
         - name: app
           image: registry.company.com/app:v1.0.0@sha256:abc123...
   ```

4. **Deploy**:
   ```bash
   kubectl apply -f deployment.yaml
   ```

---

### CTRL-003: Secrets Detection Failures

**Scenario**: Hardcoded AWS keys found

**CRITICAL - Immediate Actions**:

1. **Rotate credentials immediately**:
   ```bash
   # Deactivate compromised key
   aws iam update-access-key --access-key-id AKIA... --status Inactive --user-name app-user

   # Create new key
   aws iam create-access-key --user-name app-user

   # Update in secret manager
   aws secretsmanager update-secret --secret-id prod/aws-creds --secret-string '{"key":"NEW_KEY"}'
   ```

2. **Remove from code**:
   ```python
   # BEFORE (WRONG)
   AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"

   # AFTER (CORRECT)
   import boto3
   from botocore.exceptions import ClientError

   def get_secret():
       session = boto3.session.Session()
       client = session.client(service_name='secretsmanager')
       response = client.get_secret_value(SecretId='prod/aws-creds')
       return json.loads(response['SecretString'])
   ```

3. **Remove from git history**:
   ```bash
   # Using BFG Repo-Cleaner
   git clone --mirror https://github.com/org/repo.git
   bfg --delete-files secrets.txt repo.git
   cd repo.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

4. **Install pre-commit hooks**:
   ```bash
   pip install pre-commit detect-secrets

   cat > .pre-commit-config.yaml << EOF
   repos:
   - repo: https://github.com/Yelp/detect-secrets
     rev: v1.4.0
     hooks:
     - id: detect-secrets
       args: ['--baseline', '.secrets.baseline']
   EOF

   pre-commit install
   ```

5. **Create incident ticket**:
   - Project: SEC
   - Priority: P1
   - Summary: "Hardcoded credentials exposed in repository"
   - Notify: security@company.com, ciso@company.com

---

## Sample Files

### Directory Structure

```
samples/
├── terraform/
│   ├── passing/
│   │   └── encrypted-s3.json       # All storage encrypted
│   └── failing/
│       └── unencrypted-storage.json # Missing encryption
├── kubernetes/
│   ├── passing/
│   │   └── signed-deployment.yaml  # Signed images with digests
│   └── failing/
│       └── unsigned-deployment.yaml # Unsigned, no digests
└── ci-logs/
    ├── passing/
    │   └── clean-build.log         # No secrets detected
    └── failing/
        └── secrets-detected.log    # Multiple secrets found
```

### Using Sample Files

**For Testing**:
- Use `failing/` samples to see what violations look like
- Use `passing/` samples to verify correct configurations

**For Demonstrations**:
- Show executives the `failing/` results to illustrate risks
- Show `passing/` results to demonstrate proper controls

**For Training**:
- Have developers review failing samples
- Teach remediation using the examples

---

## Policy Files

### OPA Policy: Terraform Encryption

**File**: `policies/terraform/encryption-at-rest.rego`

**Language**: Rego (Open Policy Agent)

**How it works**:
1. Loads Terraform plan JSON
2. Identifies storage resources (S3, EBS, RDS, etc.)
3. Checks for encryption configuration
4. Returns violations with remediation

**Testing**:
```bash
# Install OPA
brew install opa

# Test policy
opa eval -i samples/terraform/failing/unencrypted-storage.json \
         -d policies/terraform/encryption-at-rest.rego \
         "data.terraform.encryption.violations"
```

---

### Kyverno Policy: Image Signatures

**File**: `policies/kubernetes/image-signature-verification.yaml`

**Language**: YAML (Kyverno)

**How it works**:
1. Intercepts pod creation events
2. Verifies image signatures using Cosign
3. Checks for digest references
4. Blocks deployments that fail

**Deployment**:
```bash
# Install Kyverno
kubectl apply -f https://raw.githubusercontent.com/kyverno/kyverno/main/config/install.yaml

# Apply policy
kubectl apply -f policies/kubernetes/image-signature-verification.yaml

# Test
kubectl run test --image=nginx:latest
# Expected: Blocked by policy
```

---

### Secrets Detection Policy

**File**: `policies/ci-cd/secrets-detection.yaml`

**Language**: YAML (ConfigMap)

**How it works**:
1. CI pipeline runs detect-secrets scan
2. Detects hardcoded credentials, keys, tokens
3. Fails build if secrets found
4. Logs findings to CI output

**Integration**:
```yaml
# .gitlab-ci.yml
security-scan:
  stage: test
  script:
    - pip install detect-secrets
    - detect-secrets scan --all-files
    - |
      if [ $? -ne 0 ]; then
        echo "CRITICAL: Secrets detected! Build failed."
        exit 1
      fi
```

---

## Troubleshooting

### Issue: Verifier not loading samples

**Symptom**: "Failed to load sample file" error

**Cause**: Sample files not in public directory

**Fix**:
```bash
# Ensure samples are accessible
cp -r samples/ public/samples/

# Or update vite.config.ts
export default defineConfig({
  publicDir: 'samples',
})
```

---

### Issue: False positive on encryption check

**Symptom**: S3 bucket marked as unencrypted but it has encryption

**Cause**: Encryption configured outside Terraform plan

**Fix**:
1. Add encryption to Terraform configuration
2. Or add exemption in policy:
   ```rego
   exempted_buckets := {"legacy-bucket-name"}

   is_exempt(resource) {
     resource.values.bucket == exempted_buckets[_]
   }
   ```

---

### Issue: Image signature verification fails

**Symptom**: All images marked as unverified

**Cause**: Missing Cosign public key or incorrect annotation format

**Fix**:
1. Verify annotation format:
   ```yaml
   metadata:
     annotations:
       cosign.sigstore.dev/signature: "verified"
   ```
2. Update Kyverno policy with correct public key

---

### Issue: CI logs parser not detecting secrets

**Symptom**: Known secrets in logs but verifier shows PASS

**Cause**: Log format doesn't match expected pattern

**Fix**:
Update `ciLogsVerifier.ts` regex patterns:
```typescript
// Adjust regex to match your CI tool's format
const findingMatch = line.match(/SECRET_FOUND:\s*(.+)/);
```

---

## Compliance Framework Mapping

### SOC2 Trust Services Criteria

| Control | SOC2 Criteria | Description |
|---------|---------------|-------------|
| CTRL-001 | CC6.1 | Logical and Physical Access Controls |
| CTRL-001 | CC6.7 | Encryption of Data at Rest |
| CTRL-002 | CC8.1 | Change Management |
| CTRL-002 | CC7.2 | System Monitoring |
| CTRL-003 | CC6.1 | Logical Access Security |
| CTRL-003 | CC6.6 | Confidential Information Protection |

### HIPAA Security Rule

| Control | HIPAA Rule | Description |
|---------|------------|-------------|
| CTRL-001 | 164.312(a)(2)(iv) | Encryption and Decryption |
| CTRL-001 | 164.312(e)(2)(ii) | Encryption Mechanism |
| CTRL-002 | 164.312(c)(1) | Integrity Controls |
| CTRL-002 | 164.308(a)(5)(ii)(B) | Malicious Software Protection |
| CTRL-003 | 164.312(a)(1) | Access Control |

### ISO 27001:2022

| Control | ISO Control | Description |
|---------|-------------|-------------|
| CTRL-001 | A.10.1.1 | Cryptographic Controls Policy |
| CTRL-001 | A.18.1.5 | Regulation of Cryptographic Controls |
| CTRL-002 | A.12.5.1 | Software Installation Control |
| CTRL-002 | A.14.2.8 | System Security Testing |
| CTRL-003 | A.9.4.1 | Information Access Restriction |
| CTRL-003 | A.18.1.3 | Protection of Records |

---

## Contact & Support

### Security Team
- **Email**: security@company.com
- **Slack**: #security-team
- **On-Call**: PagerDuty (Security-OnCall)

### Compliance Team
- **Email**: compliance@company.com
- **Slack**: #compliance

### DevOps Team
- **Email**: devops@company.com
- **Slack**: #devops

### Emergency Response
- **Critical Issues**: Page Security On-Call via PagerDuty
- **Incident Tickets**: https://jira.company.com/browse/SEC

---

## Appendix

### A. Glossary

- **OPA**: Open Policy Agent - Policy engine for cloud-native environments
- **Kyverno**: Kubernetes-native policy management
- **Cosign**: Container signing and verification tool
- **detect-secrets**: Yelp's tool for preventing secrets in code
- **Terraform Plan**: Execution plan showing infrastructure changes

### B. References

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [SOC2 Trust Services Criteria](https://www.aicpa.org/soc)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/)
- [ISO 27001:2022](https://www.iso.org/standard/27001)
- [Cosign Documentation](https://docs.sigstore.dev/cosign/overview/)
- [Kyverno Documentation](https://kyverno.io/docs/)
- [OPA Documentation](https://www.openpolicyagent.org/docs/)

### C. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-15 | Initial runbook creation |

---

**Document Owner**: Security Team
**Last Updated**: 2025-01-15
**Next Review**: 2025-04-15
