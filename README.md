
# ICRAF: Integrated Cyber Risk & Compliance Dashboard

## 1. Project Overview

This project is a high-fidelity, interactive proof-of-concept (PoC) for an **Integrated Cyber Risk and Compliance Automation Framework (ICRAF)**. It serves as a frontend prototype that simulates a unified dashboard, pulling together critical data streams from Security Information and Event Management (SIEM), IT Service Management (ITSM), and Governance, Risk, and Compliance (GRC) tools.

The dashboard provides a single pane of glass for executives, security managers, and compliance officers to monitor security posture, track key performance indicators (KPIs), manage risks, and oversee project execution in real-time. This prototype uses mock data to demonstrate the full potential of an integrated system before investing in backend development and API integrations.

## 2. Live Demo & Screenshots

This is a frontend application built to showcase the UI/UX and functionality of the ICRAF concept. It runs entirely in the browser with no backend dependencies.

*(A screenshot would be placed here in a full repository, showing the main dashboard view with its KPIs, incident list, and compliance chart.)*

## 3. Features

The prototype is organized into six distinct views, each addressing a key deliverable of the ICRAF project:

*   **📊 Unified Dashboard:**
    *   Displays critical KPIs like Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR).
    *   Features a live-updating list of recent high-severity incidents.
    *   Visualizes NIST Cybersecurity Framework (CSF) control coverage with a radar chart.

*   **🔍 Control Verifier (NEW):**
    *   **Automated verification** of security controls across infrastructure, applications, and CI/CD processes
    *   **Three automated controls:**
        1. Encryption at Rest for Storage Resources (Terraform)
        2. Container Image Signature Verification (Kubernetes)
        3. Secrets Detection in Source Code (CI/CD Logs)
    *   **Real-time compliance status** with green/red indicators
    *   **Framework mapping** to SOC2, HIPAA, and ISO 27001 requirements
    *   **Detailed findings** with severity levels and resource-specific issues
    *   **Remediation guidance** with step-by-step instructions
    *   **Sample files** demonstrating passing and failing scenarios
    *   **Policy files** in repository (OPA, Kyverno, detect-secrets)

*   **🛡️ Governance Blueprint:**
    *   Illustrates the automated data flow from SIEM (Splunk) → ITSM (ServiceNow) → GRC (Archer).
    *   Maps NIST CSF controls to corresponding ITIL processes.
    *   Presents a clear and concise RACI (Responsible, Accountable, Consulted, Informed) chart for key activities.

*   **⚖️ Interactive Risk Register:**
    *   Provides a detailed, sortable table of identified risks.
    *   Each risk is scored and color-coded based on impact and likelihood.
    *   Users can sort by any column (e.g., score, status, category) to quickly identify top priorities.

*   **📈 Project Plan (Gantt Chart):**
    *   Visualizes the project implementation plan with a clean Gantt chart interface.
    *   Tracks task timelines, owners, and status (Completed, In Progress, Not Started).

*   **🎬 Executive Presentation Deck:**
    *   An interactive, in-app slide deck designed for executive briefings.
    *   Clearly communicates the problem, the ICRAF solution, key benefits, and projected ROI.

## 4. Tech Stack

This project is built with modern, efficient, and scalable frontend technologies.

*   **Core Framework:** React
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Charting:** Recharts
*   **Icons:** Lucide React

## 5. File Structure

The codebase is organized logically to separate concerns and improve maintainability.

```
/
├── components/
│   ├── shared/         # Reusable components (Card, KpiCard)
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── Verifier.tsx    # Control verification view (NEW)
│   ├── Governance.tsx
│   ├── Presentation.tsx
│   ├── ProjectPlan.tsx
│   ├── RiskRegister.tsx
│   └── Sidebar.tsx
├── data/
│   ├── mockData.ts     # Mock data for dashboard
│   └── controlMap.ts   # Control-to-framework mappings (NEW)
├── verifiers/          # Verification logic (NEW)
│   ├── terraformVerifier.ts    # Terraform plan parser
│   ├── kubernetesVerifier.ts   # K8s manifest parser
│   └── ciLogsVerifier.ts       # CI log parser
├── samples/            # Test cases (NEW)
│   ├── terraform/
│   │   ├── passing/    # Encrypted resources
│   │   └── failing/    # Unencrypted resources
│   ├── kubernetes/
│   │   ├── passing/    # Signed images
│   │   └── failing/    # Unsigned images
│   └── ci-logs/
│       ├── passing/    # Clean builds
│       └── failing/    # Secrets detected
├── policies/           # Policy definitions (NEW)
│   ├── terraform/      # OPA policies
│   ├── kubernetes/     # Kyverno policies
│   └── ci-cd/          # Secrets detection config
├── App.tsx             # Main application router
├── constants.ts        # Navigation items
├── types.ts            # TypeScript definitions
├── RUNBOOK.md          # Operational runbook (NEW)
└── ...config files
```

## 6. How to Run Locally

To run this project in a local development environment, you would typically follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/icraf-dashboard.git
    cd icraf-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## 7. Control Verifier: From Dashboard to Proof

The Control Verifier transforms ICRAF from a visualization tool into a **verifiable security posture system**. Instead of just showing data, it **proves compliance** through automated verification.

### Key Capabilities

#### 1. **Verifiable Integrations**
   - Parses **Terraform plan JSON** for infrastructure-as-code verification
   - Analyzes **Kubernetes manifests** for container security compliance
   - Processes **CI/CD logs** for secrets detection results
   - All integrations are **mocked but verifiable** with real sample data

#### 2. **Three Automated Controls**

   **CTRL-001: Encryption at Rest**
   - Verifies all storage resources (S3, EBS, RDS) have encryption enabled
   - Framework mapping: SOC2 CC6.1, HIPAA 164.312(a)(2)(iv), ISO 27001 A.10.1.1
   - Policy: `/policies/terraform/encryption-at-rest.rego`

   **CTRL-002: Image Signature Verification**
   - Ensures container images are signed (Cosign/Sigstore) before deployment
   - Enforces image digest references and approved registries
   - Framework mapping: SOC2 CC8.1, HIPAA 164.312(c)(1), ISO 27001 A.12.5.1
   - Policy: `/policies/kubernetes/image-signature-verification.yaml`

   **CTRL-003: Secrets Detection**
   - Prevents hardcoded credentials in source code
   - Detects AWS keys, API tokens, private keys, and high-entropy strings
   - Framework mapping: SOC2 CC6.1, HIPAA 164.312(a)(1), ISO 27001 A.9.4.1
   - Policy: `/policies/ci-cd/secrets-detection.yaml`

#### 3. **Control Map Output**
   - **Green/Red Status**: Visual indicators for each control (PASS/FAIL)
   - **Framework Coverage**: Maps to SOC2, HIPAA, and ISO 27001 requirements
   - **Finding Details**: Resource-specific violations with severity levels
   - **Remediation Text**: Step-by-step instructions to fix each issue

#### 4. **Proof of Verification**
   - **Sample Files**: `/samples/` directory with passing and failing test cases
   - **Runbook**: Complete operational guide at `/RUNBOOK.md`
   - **Policy Files**: Actual OPA, Kyverno, and detect-secrets policies in `/policies/`
   - **Verifiable Results**: Real parsing and validation logic, not just UI mockups

### Using the Verifier

1. Click **🔍 Verifier** in the sidebar
2. System automatically runs all three control verifications
3. Review the **Control Status** table for PASS/FAIL indicators
4. Click **Details** on any control to see:
   - Summary statistics
   - Specific findings with resource addresses
   - Remediation steps
5. Check **Framework Coverage** to see SOC2/HIPAA/ISO mappings

### Sample Files Guide

**Passing Samples** (demonstrate correct configuration):
- `samples/terraform/passing/encrypted-s3.json` - All storage encrypted
- `samples/kubernetes/passing/signed-deployment.yaml` - Signed images with digests
- `samples/ci-logs/passing/clean-build.log` - No secrets detected

**Failing Samples** (demonstrate violations):
- `samples/terraform/failing/unencrypted-storage.json` - Missing encryption
- `samples/kubernetes/failing/unsigned-deployment.yaml` - Unsigned images
- `samples/ci-logs/failing/secrets-detected.log` - Multiple secrets found

### For Auditors and Compliance Teams

This verifier provides **evidence** for compliance frameworks:

- **SOC2 Type II**: Demonstrates automated controls for CC6.1, CC6.7, CC8.1
- **HIPAA**: Shows technical safeguards for 164.312 (encryption, integrity, access control)
- **ISO 27001**: Maps to Annex A controls (A.10.1.1, A.12.5.1, A.9.4.1)

See `RUNBOOK.md` for detailed compliance mapping tables.
