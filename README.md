# ICRAF: Integrated Cyber Risk and Compliance Dashboard

> Integrated Cyber Risk and Compliance Automation Framework (ICRAF) — a browser-based unified dashboard for CMMC 2.0, NIST 800-171, and multi-framework compliance tracking with automated control verification.

[![TypeScript](https://img.shields.io/badge/typescript-5.8-blue.svg)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev/) [![CMMC 2.0](https://img.shields.io/badge/CMMC-2.0-red.svg)](https://dodcio.defense.gov/CMMC/) [![NIST 800-171](https://img.shields.io/badge/NIST-800--171-blue.svg)](https://csrc.nist.gov/publications/detail/sp/800/171/rev-3/final) [![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Overview

1. Browser-based, no-backend compliance dashboard built with React 19 and TypeScript, running entirely client-side via Vite.
2. Provides a unified security posture view combining KPI telemetry, NIST CSF radar coverage, incident tracking, and an interactive risk register in a single pane of glass.
3. Tracks all 17 CMMC 2.0 domains across 110 practices with practice-by-practice maturity scoring at Foundational (L1), Advanced (L2), and Expert (L3) levels, aligned to NIST 800-171.
4. Includes an automated Control Verifier that parses Terraform plan JSON, Kubernetes manifests, and CI/CD log files to produce pass/fail compliance evidence mapped to SOC2, HIPAA, and ISO 27001.
5. Features a Governance Blueprint illustrating the SIEM-to-ITSM-to-GRC automated data flow with NIST CSF-to-ITIL mappings and a full RACI matrix.
6. Ships with sample passing and failing fixture files, OPA/Kyverno/detect-secrets policy files, and a complete operational runbook to support auditor review and evidence collection.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Browser Application (React + Vite)         │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                    App.tsx (Router)              │   │
│  └──────┬──────────────────────────────────────┬───┘   │
│         │                                      │        │
│  ┌──────▼──────┐   ┌──────────────┐   ┌───────▼─────┐ │
│  │  Unified    │   │   Control    │   │  Governance  │ │
│  │  Dashboard  │   │   Verifier   │   │  Blueprint   │ │
│  │  (KPIs,     │   │  (Terraform/ │   │  (SIEM→ITSM  │ │
│  │  Incidents, │   │   K8s/CI-CD  │   │  →GRC, RACI) │ │
│  │  CSF Radar) │   │   checks)    │   └──────────────┘ │
│  └─────────────┘   └──────┬───────┘                    │
│                            │                            │
│  ┌──────────────┐   ┌──────▼──────┐   ┌─────────────┐ │
│  │  Interactive │   │    CMMC     │   │  Executive  │ │
│  │  Risk        │   │   Tracker   │   │     Deck    │ │
│  │  Register    │   │  (17 domains│   │  (Slide     │ │
│  │  (Sortable,  │   │  110 pract.)│   │   Briefing) │ │
│  │   Scored)    │   └─────────────┘   └─────────────┘ │
│  └──────────────┘                                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Mock Data Layer                       │   │
│  │  data/mockData.ts  │  data/controlMap.ts         │   │
│  │  verifiers/        │  samples/  │  policies/     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Key Features

### Unified Dashboard

The main dashboard aggregates security telemetry into a single view for security managers and executives. It surfaces the metrics most critical for day-to-day operations and board-level reporting.

- Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR) KPI cards
- Live-updating high-severity incident feed
- NIST Cybersecurity Framework (CSF) control coverage visualized as a radar chart
- Color-coded risk scoring and status indicators throughout

### Control Verifier

The Control Verifier transforms ICRAF from a visualization tool into a verifiable security posture system. Rather than displaying static data, it parses real file formats and produces auditable pass/fail results.

| Control | Source | Frameworks Mapped |
| --- | --- | --- |
| CTRL-001: Encryption at Rest | Terraform plan JSON | SOC2 CC6.1, HIPAA 164.312(a)(2)(iv), ISO 27001 A.10.1.1 |
| CTRL-002: Image Signature Verification | Kubernetes manifests | SOC2 CC8.1, HIPAA 164.312(c)(1), ISO 27001 A.12.5.1 |
| CTRL-003: Secrets Detection | CI/CD log files | SOC2 CC6.1, HIPAA 164.312(a)(1), ISO 27001 A.9.4.1 |

Each control produces resource-level findings, severity ratings, and step-by-step remediation guidance. Passing and failing sample fixture files are included under `samples/` for auditor review.

### CMMC 2.0 Tracking

The CMMC tracker covers the full scope of CMMC 2.0 requirements for DoD contractors, with individual practice tracking across all 17 domains.

- All 17 CMMC domains: AC, AU, CM, IA, IR, MA, MP, PE, PL, PS, RA, SA, SC, SI, SR
- 110 practices tracked individually with implementation status
- Three maturity levels: Foundational (L1), Advanced (L2), Expert (L3)
- Real-time readiness score and executive-ready certification roadmap
- NIST 800-171 cross-reference built into each practice entry
- Integrated with the Control Verifier for automated evidence collection on AC, SC, and SI families

### Interactive Risk Register and Governance Blueprint

The Risk Register provides a sortable, scored table of identified risks. Each entry carries an impact score, likelihood score, composite risk score, owner, and remediation status. Sorting by any column surfaces highest-priority items immediately.

The Governance Blueprint illustrates the automated data flow from SIEM (Splunk) through ITSM (ServiceNow) to GRC (Archer), with NIST CSF controls mapped to corresponding ITIL processes and a full RACI matrix for all key activities.

### Security and Compliance

- CMMC 2.0 (all three levels, 17 domains, 110 practices)
- NIST SP 800-171 Rev 3 (Moderate baseline, Level 2 alignment)
- NIST Cybersecurity Framework (CSF) — Identify, Protect, Detect, Respond, Recover
- SOC2 Type II — CC6.1, CC6.7, CC8.1 automated evidence
- HIPAA Technical Safeguards — 164.312 encryption, integrity, access control
- ISO 27001 Annex A — A.9.4.1, A.10.1.1, A.12.5.1
- OPA (Open Policy Agent), Kyverno, and detect-secrets policy files included in repository

---

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Local Development

```bash
# Clone the repository
git clone https://github.com/dbsectrainer/integrated-cyber-risk-compliance.git
cd integrated-cyber-risk-compliance

# Install dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm run dev
```

The application runs entirely in the browser with no backend, no database, and no API keys required. All data is sourced from the mock data layer in `data/mockData.ts`.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The output in `dist/` is a static bundle that can be served from any static hosting provider (S3, GitHub Pages, Netlify, Vercel, etc.).

---

## Production Ready Status

**Frontend prototype complete — compliance evidence infrastructure in place**

- React 19 + TypeScript 5.8 + Vite 6 build pipeline with no compilation errors
- Six fully interactive views: Dashboard, Control Verifier, Governance Blueprint, Risk Register, CMMC Tracker, Executive Deck
- Automated control verification logic implemented in `verifiers/` with real Terraform, Kubernetes, and CI log parsers
- Passing and failing sample fixture files present in `samples/` for all three controls
- OPA, Kyverno, and detect-secrets policy files present in `policies/`
- CMMC 2.0 full domain and practice mapping documented in `CMMC-MAPPING.md`
- Operational runbook present at `RUNBOOK.md`
- MIT license included
- No backend dependency — runs entirely client-side

### Verification

```bash
# Install and build
npm install
npm run build
# Expected: vite build completes with no errors, dist/ directory created

# Start dev server
npm run dev
# Expected: Local server available at http://localhost:3000
# Navigate to Verifier tab — all three controls run automatically
# Navigate to CMMC tab — 17 domains and 110 practices display with status
```

---

## Project Structure

```
integrated-cyber-risk-compliance/
├── components/
│   ├── shared/
│   │   ├── Card.tsx              # Reusable card wrapper
│   │   └── KpiCard.tsx           # KPI metric display card
│   ├── Dashboard.tsx             # Unified dashboard view
│   ├── Governance.tsx            # Governance blueprint view
│   ├── Presentation.tsx          # Executive slide deck view
│   ├── ProjectPlan.tsx           # Project plan / Gantt view
│   ├── RiskRegister.tsx          # Interactive risk register
│   ├── Sidebar.tsx               # Navigation sidebar
│   └── Verifier.tsx              # Control verifier view
├── contexts/
│   └── ThemeContext.tsx          # Theme context provider
├── data/
│   ├── controlMap.ts             # Control-to-framework mappings
│   └── mockData.ts               # Mock data for all views
├── verifiers/
│   ├── ciLogsVerifier.ts         # CI/CD log parser
│   ├── kubernetesVerifier.ts     # Kubernetes manifest parser
│   └── terraformVerifier.ts      # Terraform plan JSON parser
├── samples/
│   ├── ci-logs/
│   │   ├── failing/secrets-detected.log
│   │   └── passing/clean-build.log
│   ├── kubernetes/
│   │   ├── failing/unsigned-deployment.yaml
│   │   └── passing/signed-deployment.yaml
│   └── terraform/
│       ├── failing/unencrypted-storage.json
│       └── passing/encrypted-s3.json
├── policies/
│   ├── ci-cd/secrets-detection.yaml
│   ├── kubernetes/image-signature-verification.yaml
│   └── terraform/encryption-at-rest.rego
├── App.tsx                       # Main application router
├── constants.ts                  # Navigation items and constants
├── index.html                    # HTML entry point
├── index.tsx                     # React entry point
├── types.ts                      # TypeScript type definitions
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── CMMC-MAPPING.md               # Full CMMC 2.0 domain/practice listing
├── RUNBOOK.md                    # Operational runbook
└── ROADMAP.md                    # Project roadmap
```

---

## BE EASY ENTERPRISES Federal Portfolio

| Showcase Project | Repository | Description |
| --- | --- | --- |
| **Secure RAG Pipeline** | [Secure-Generative-AI-Platform-on-AWS](https://github.com/dbsectrainer/Secure-Generative-AI-Platform-on-AWS) | AWS Bedrock + RAG with FedRAMP High alignment |
| **DevSecOps CI/CD** | [dod-cybersec-ops-framework](https://github.com/dbsectrainer/dod-cybersec-ops-framework) | DoD 8570 / NIST RMF aligned pipeline |
| **Zero Trust Architecture** | [AEGIS](https://github.com/dbsectrainer/AEGIS) | FedRAMP High + NIST 800-207 Zero Trust |
| **FedRAMP Control Automation** | [nist_800_53_scanner](https://github.com/dbsectrainer/nist_800_53_scanner) | NIST 800-53 Rev 5 compliance scanner |
| **Federal AI Governance** | [ai-safety-governance](https://github.com/dbsectrainer/ai-safety-governance) | EO 14110 / OMB M-24-10 aligned |
| **CMMC 2.0 Dashboard** | **[integrated-cyber-risk-compliance](https://github.com/dbsectrainer/integrated-cyber-risk-compliance)** | **This repo** |
| **FedRAMP 30-Day Guide** | [cloud-security-best-practices](https://github.com/dbsectrainer/cloud-security-best-practices) | Day-by-day FedRAMP implementation roadmap |
| **Agentic AI Workflow** | [federal-doc-triage-agent](https://github.com/dbsectrainer/federal-doc-triage-agent) | Production-ready LangGraph + Bedrock triage agent |

---

## Author

**Donnivis Baker** — [github.com/dbsectrainer](https://github.com/dbsectrainer)
**BE EASY ENTERPRISES** — Federal IT Modernization & Cybersecurity

For questions, partnerships, or federal engagement inquiries, open an issue or reach out directly.

**Document Version:** 1.0 | **Last Updated:** 2026-06-15 | **CMMC 2.0:** Level 2 (Advanced)
