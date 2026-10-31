# ICRAF: Integrated Cyber Risk and Compliance Dashboard

> Integrated Cyber Risk and Compliance Automation Framework (ICRAF) — a browser-based unified dashboard for CMMC 2.0, NIST 800-171, and multi-framework compliance tracking with automated control verification.

[![TypeScript](https://img.shields.io/badge/typescript-5.8-blue.svg)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev/) [![CMMC 2.0](https://img.shields.io/badge/CMMC-2.0-red.svg)](https://dodcio.defense.gov/CMMC/) [![NIST 800-171](https://img.shields.io/badge/NIST-800--171-blue.svg)](https://csrc.nist.gov/publications/detail/sp/800/171/rev-3/final) [![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Overview

1. Browser-based, no-backend compliance dashboard built with React 19 and TypeScript, running entirely client-side via Vite.
2. Provides a unified security posture view combining KPI telemetry, NIST CSF radar coverage, incident tracking, and an interactive risk register in a single pane of glass.
3. Documents the CMMC 2.0 / NIST 800-171 control mapping (110 Level 2 practices) in `CMMC-MAPPING.md`. **An interactive CMMC tracker view is not yet implemented** (see Known Limitations and `ROADMAP.md`).
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
│  │  Interactive │   │  Project    │   │  Executive  │ │
│  │  Risk        │   │    Plan     │   │     Deck    │ │
│  │  Register    │   │  (Timeline) │   │  (Slide     │ │
│  │  (Sortable,  │   │             │   │   Briefing) │ │
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

### CMMC 2.0 Mapping (documentation only)

`CMMC-MAPPING.md` maps CMMC 2.0 domains and practices to NIST 800-171 / 800-53. It is a reference document; **there is no CMMC screen in the UI today**, and the Control Verifier covers only the three controls above. Note that the official CMMC 2.0 Level 2 model has 14 domains and 110 practices; the "17 domains" wording in `CMMC-MAPPING.md` has not been reconciled with the official model and should be reviewed before being used for assessment.

### Interactive Risk Register and Governance Blueprint

The Risk Register provides a sortable, scored table of identified risks. Each entry carries an impact score, likelihood score, composite risk score, owner, and remediation status. Sorting by any column surfaces highest-priority items immediately.

The Governance Blueprint illustrates the automated data flow from SIEM (Splunk) through ITSM (ServiceNow) to GRC (Archer), with NIST CSF controls mapped to corresponding ITIL processes and a full RACI matrix for all key activities.

### Security and Compliance

- CMMC 2.0 / NIST 800-171 control mapping (reference document only)
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

# Typecheck, unit tests, production build
npm run check
```

The application runs entirely in the browser with no backend, no database, and no API keys required. Dashboard data comes from `data/mockData.ts`; the Verifier analyzes the files in `samples/`, which are bundled at build time.

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
- Six interactive views: Dashboard, Control Verifier, Governance Blueprint, Risk Register, Project Plan, Executive Deck
- Automated control verification logic implemented in `verifiers/` with real Terraform, Kubernetes, and CI log parsers
- Passing and failing sample fixture files present in `samples/` for all three controls
- OPA, Kyverno, and detect-secrets policy files present in `policies/`
- CMMC 2.0 domain/practice mapping documented in `CMMC-MAPPING.md` (reference only, no UI)
- Operational runbook present at `RUNBOOK.md`
- MIT license included
- No backend dependency — runs entirely client-side

### Verification

```bash
npm install
npm run check        # typecheck + unit tests + production build
npm run preview -- --port 4173 &   # serve the production build
node scripts/e2e.mjs               # Playwright e2e + screenshots (needs Playwright/Chromium)
```

Latest verified results, logs, and screenshots are in [`docs/evidence/verification-report.md`](docs/evidence/verification-report.md).

### Screenshots (captured from the running production build by `scripts/e2e.mjs`)

| View | Screenshot |
| --- | --- |
| Dashboard (desktop) | ![Dashboard](docs/evidence/screenshots/dashboard-desktop.png) |
| Control Verifier — failing samples, CTRL-003 details | ![Verifier failing](docs/evidence/screenshots/verifier-failing-details.png) |
| Control Verifier — passing samples | ![Verifier passing](docs/evidence/screenshots/verifier-passing.png) |
| Risk Register (sorted) | ![Risk register](docs/evidence/screenshots/risk-register-sorted.png) |
| Dashboard (mobile 390px) | ![Mobile](docs/evidence/screenshots/dashboard-mobile.png) |

### Known Limitations

- No CMMC tracker UI (mapping is documentation only).
- All dashboard data (KPIs, incidents, risks, project plan) is static mock data; no SIEM/ITSM/GRC integration exists.
- The Control Verifier runs against the bundled sample files only; there is no file-upload UI. Kubernetes parsing is regex-based (not a full YAML parser).
- No ESLint configuration; `npm run typecheck` is the static check.
- Inter font is loaded from Google Fonts; offline it falls back to the system sans-serif.
- Main JS bundle is ~657 kB (no code splitting).

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
├── tests/                        # Vitest unit tests for the verifiers
├── scripts/e2e.mjs               # Playwright e2e + screenshot capture
├── docs/evidence/                # Verification report, logs, screenshots
├── tailwind.config.js            # Tailwind (bundled, no CDN)
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
