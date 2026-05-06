# CMMC 2.0 Mapping to NIST 800-53 & NIST 800-171

This document maps **CMMC 2.0** (Cybersecurity Maturity Model Certification) to NIST frameworks for compliance tracking and assessment.

## CMMC 2.0 Overview

**CMMC 2.0** is the Department of Defense (DoD) framework for contractor compliance. It includes:

- **3 Levels** (instead of 5) — Foundational, Advanced, Expert
- **17 Domains** — Grouped from NIST CSF and NIST 800-53
- **110 Practices** — Grouped by domain
- **DoD Mandate** — Required for federal prime contracts (as of Oct 2023)

## CMMC 2.0 Levels

| Level | Name | Scope | NIST Equivalent |
|-------|------|-------|---|
| **Level 1** | Foundational | Basic cyber hygiene (15 practices) | NIST 800-53 Low Baseline |
| **Level 2** | Advanced | Intermediate controls (110 practices) | NIST 800-53 Moderate Baseline |
| **Level 3** | Expert | Advanced & proactive controls (TBD) | NIST 800-53 High Baseline |

---

## CMMC 2.0 Domains & Practice Counts

| Domain | # Practices | NIST 800-53 Families | Description |
|--------|---|---|---|
| **AC** | Access Control | 16 | AC, AU, IA |
| **AT** | Awareness & Training | 6 | AT |
| **AU** | Audit & Accountability | 12 | AU, SI |
| **CA** | Assessment & Authorization | 6 | CA, RA |
| **CM** | Configuration Management | 13 | CM, SI, SA |
| **IA** | Identification & Authentication | 7 | IA, AC |
| **IR** | Incident Response | 9 | IR, SI |
| **MA** | Maintenance | 5 | MA, SI |
| **MP** | Media Protection | 4 | MP, SC |
| **PE** | Physical & Environmental | 5 | PE |
| **PL** | Planning | 6 | PL, PM |
| **PS** | Personnel Security | 4 | PS |
| **RA** | Risk Assessment | 5 | RA, CA |
| **SA** | System & Services Acquisition | 10 | SA, CM |
| **SC** | System & Communications Protection | 16 | SC |
| **SI** | System & Information Integrity | 11 | SI, AU |
| **SR** | Supply Chain Risk Management | 4 | SR, SA |
| | **TOTAL** | **110** | |

---

## CMMC Level 2 Practices (110 Total)

### Access Control (AC) — 16 Practices

**Foundational (L1):**
- AC-1.1: Identify and manage authorized users
- AC-1.2: Limit physical access to facilities and systems

**Advanced (L2):**
- AC-2.1: Approve and manage access to computing resources
- AC-2.2: Approve and manage access to data and information
- AC-3.1: Enforce least privilege
- AC-3.2: Require authorization for user provisioning
- AC-4.1: Prevent unauthorized access to data
- AC-5.1: Enforce access controls based on attributes
- AC-6.1: Manage privileges of accounts
- AC-6.2: Restrict privileged accounts
- AC-7.1: Enforce access control rules
- AC-8.1: Encrypt sensitive data (at rest + transit)
- AC-9.1: Manage data access based on roles
- AC-10.1: Enforce logical access control rules
- AC-11.1: Limit concurrent sessions
- AC-12.1: Enforce security requirements for remote access
- AC-13.1: Manage privileged remote access (e.g., VPN)

### Audit & Accountability (AU) — 12 Practices

**Foundational (L1):**
- AU-1.1: Log access to systems and data

**Advanced (L2):**
- AU-2.1: Identify and log security events
- AU-3.1: Centralize log management
- AU-4.1: Protect audit information
- AU-5.1: Conduct log reviews
- AU-6.1: Retain audit logs
- AU-7.1: Respond to detected security events
- AU-8.1: Perform log retention analysis
- AU-9.1: Collect audit evidence
- AU-10.1: Log external access
- AU-11.1: Alert on suspicious activity
- AU-12.1: Correlate audit logs across systems

### System & Communications Protection (SC) — 16 Practices

**Foundational (L1):**
- SC-1.1: Monitor network traffic
- SC-1.2: Protect wireless access

**Advanced (L2):**
- SC-2.1: Use encryption for sensitive data in transit
- SC-3.1: Separate network segments
- SC-4.1: Deny by default (firewall rules)
- SC-5.1: Implement VPN for remote access
- SC-6.1: Use secure protocols (TLS 1.2+)
- SC-7.1: Prevent unauthorized access to network
- SC-8.1: Implement intrusion detection
- SC-9.1: Protect against mobile malware
- SC-10.1: Manage network services
- SC-11.1: Encrypt removable media
- SC-12.1: Monitor and control removable media
- SC-13.1: Control network traffic at boundaries
- SC-14.1: Protect against wireless threats
- SC-15.1: Maintain network diagrams
- SC-16.1: Implement data loss prevention (DLP)

### System & Information Integrity (SI) — 11 Practices

**Foundational (L1):**
- SI-1.1: Identify and remove malware
- SI-1.2: Keep software up to date

**Advanced (L2):**
- SI-2.1: Deploy anti-malware tools
- SI-3.1: Monitor for security anomalies
- SI-4.1: Verify system and information integrity
- SI-5.1: Remediate discovered vulnerabilities
- SI-6.1: Implement vulnerability management
- SI-7.1: Perform security testing
- SI-8.1: Manage security updates (patches)
- SI-9.1: Restrict software installation
- SI-10.1: Monitor/alert on suspicious activity

### Incident Response (IR) — 9 Practices

**Advanced (L2):**
- IR-1.1: Create incident response plan
- IR-2.1: Test incident response plan
- IR-3.1: Identify and classify incidents
- IR-4.1: Respond to detected incidents
- IR-5.1: Report security events
- IR-6.1: Preserve incident evidence
- IR-7.1: Establish incident handling procedures
- IR-8.1: Conduct incident handling training
- IR-9.1: Manage incident information

### Risk Assessment (RA) — 5 Practices

**Advanced (L2):**
- RA-1.1: Conduct risk assessment
- RA-2.1: Develop risk mitigation plan
- RA-3.1: Review and update risk assessment
- RA-4.1: Assess supply chain risk
- RA-5.1: Manage risk remediation

### Other Domains (L2) — 56 Practices

*(Remaining domains include AT, CA, CM, IA, MA, MP, PE, PL, PS, SA, SR with multiple practices each)*

---

## CMMC Level 2 vs. NIST 800-171

**CMMC 2.0 Level 2** aligns with **NIST 800-171 Moderate baseline**:

| NIST 800-171 | CMMC 2.0 | Status |
|---|---|---|
| 110 security requirements | 110 practices | Full alignment |
| Grouped by 14 families | Grouped by 17 domains | CMMC domains broader |
| NIST 800-53 derived | NIST 800-53 derived | Common foundation |

### Key Differences

**NIST 800-171:**
- Focused on **protecting Controlled Unclassified Information (CUI)**
- More prescriptive (specific implementations)
- Used for DFARS/NIST SP 800-171 compliance

**CMMC 2.0:**
- Focused on **DoD contractor cybersecurity maturity**
- More outcome-based (what to achieve, not how)
- 3 levels of increasing maturity
- Certification via DoD-approved C3PAO assessors

---

## CMMC Assessment Process

### Pre-Assessment (Self-Evaluation)

1. **Determine target level** — Level 1, 2, or 3 (most contractors: Level 2)
2. **Assess current state** — Map to 110 practices
3. **Develop remediation plan** — Close gaps identified
4. **Implement controls** — Build out practices
5. **Document evidence** — Gather proof of implementation

### CMMC Assessment (C3PAO)

1. **Engage assessor** — Select DoD-approved C3PAO firm
2. **On-site assessment** — Verify practice implementation (1-5 days)
3. **Evidence review** — Review documentation + interviews
4. **Issue findings** — Non-conformances + remediation plans
5. **Receive certification** — Valid for 3 years

### Post-Assessment

- **Maintain compliance** — Annual surveillance audits
- **Address findings** — Implement corrective actions within 30-60 days
- **Sustain certification** — Monitor for 3-year validity

---

## CMMC Compliance Roadmap (12 Months)

| Phase | Months | Activities | Deliverables |
|-------|--------|-----------|---|
| **Assess** | 1-2 | Baseline assessment, gap analysis | Assessment report, remediation plan |
| **Remediate** | 3-8 | Implement L2 practices (90% focus) | Control evidence, policy documentation |
| **Validate** | 9 | Internal validation, final prep | Mock assessment report |
| **Assess** | 10-11 | C3PAO on-site assessment | CMMC certification (if approved) |
| **Maintain** | 12+ | Annual surveillance, continuous monitoring | Compliance evidence archive |

---

## CMMC Domains & NIST 800-53 Control Family Alignment

| CMMC Domain | NIST Families | Practices | L1 | L2 | L3 |
|---|---|---|---|---|---|
| AC (Access Control) | AC, AU, IA | 16 | 2 | 16 | — |
| AT (Awareness & Training) | AT | 6 | 0 | 6 | — |
| AU (Audit & Accountability) | AU, SI | 12 | 1 | 12 | — |
| CA (Assessment & Authorization) | CA, RA | 6 | 0 | 6 | — |
| CM (Configuration Management) | CM, SI, SA | 13 | 0 | 13 | — |
| IA (Identification & Authentication) | IA, AC | 7 | 0 | 7 | — |
| IR (Incident Response) | IR, SI | 9 | 0 | 9 | — |
| MA (Maintenance) | MA, SI | 5 | 0 | 5 | — |
| MP (Media Protection) | MP, SC | 4 | 0 | 4 | — |
| PE (Physical & Environmental) | PE | 5 | 0 | 5 | — |
| PL (Planning) | PL, PM | 6 | 0 | 6 | — |
| PS (Personnel Security) | PS | 4 | 0 | 4 | — |
| RA (Risk Assessment) | RA, CA | 5 | 0 | 5 | — |
| SA (System & Services Acquisition) | SA, CM | 10 | 0 | 10 | — |
| SC (System & Communications Protection) | SC | 16 | 2 | 16 | — |
| SI (System & Information Integrity) | SI, AU | 11 | 10 | 11 | — |
| SR (Supply Chain Risk Management) | SR, SA | 4 | 0 | 4 | — |

---

## Tools for CMMC Assessment

- **Nessus** — Vulnerability scanning
- **Tenable.io** — Cloud vulnerability management
- **Qualys** — Cloud-based vulnerability management
- **CISA's CSET** — Cybersecurity Self-Evaluation Tool
- **CyberArk** — Privileged access management
- **Microsoft Sentinel** — SIEM/security monitoring
- **AWS Security Hub** — Compliance monitoring (for cloud)

---

## References

- [CMMC Model v2.0](https://www.acq.osd.mil/cmmc/)
- [NIST 800-171](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-171r2.pdf)
- [NIST 800-53 Rev 5](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf)
- [DoD DFARS Requirements](https://www.acq.osd.mil/dfars/)
- [C3PAO Directory](https://www.acq.osd.mil/cmmc/dashboard/)

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-06  
**Maintained by:** BE EASY ENTERPRISES Federal Compliance Team
