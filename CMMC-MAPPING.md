# CMMC 2.0 Mapping to NIST SP 800-171

Reference mapping used by the ICRAF CMMC Tracker (`data/cmmcPractices.ts`, view: **CMMC Tracker**).

> **Verify before use.** Requirement text is condensed from NIST SP 800-171 Rev. 2 and the identifiers follow the CMMC `DOMAIN.Lx-3.x.y` convention. This is a planning aid, not an assessment tool. Confirm against the official DoD CMMC Assessment Guides and the NIST publication before relying on it.

## CMMC 2.0 model

| Level | Name | Practices | Basis |
|---|---|---|---|
| 1 | Foundational | 17 | FAR 52.204-21 (15 basic safeguarding requirements, expressed as 17 CMMC practices) |
| 2 | Advanced | 110 | NIST SP 800-171 Rev. 2 (all 110 requirements; includes the 17 Level 1 practices) |
| 3 | Expert | 110 + 24 | NIST SP 800-171 plus a subset of NIST SP 800-172 (not tracked here) |

CMMC 2.0 has **14 domains** (the same 14 families as NIST SP 800-171). Earlier drafts of this document stated 17 domains; that was incorrect.

## Domains and practice counts (Level 2)

| Domain | Name | NIST family | Practices |
|---|---|---|---|
| AC | Access Control | 3.1 | 22 |
| AT | Awareness and Training | 3.2 | 3 |
| AU | Audit and Accountability | 3.3 | 9 |
| CM | Configuration Management | 3.4 | 9 |
| IA | Identification and Authentication | 3.5 | 11 |
| IR | Incident Response | 3.6 | 3 |
| MA | Maintenance | 3.7 | 6 |
| MP | Media Protection | 3.8 | 9 |
| PS | Personnel Security | 3.9 | 2 |
| PE | Physical Protection | 3.10 | 6 |
| RA | Risk Assessment | 3.11 | 3 |
| CA | Security Assessment | 3.12 | 4 |
| SC | System and Communications Protection | 3.13 | 16 |
| SI | System and Information Integrity | 3.14 | 7 |
| | **Total** | | **110** |

## Practices

Level 1 practices are marked **L1**. *Evidence* names the ICRAF Control Verifier control that supplies supporting (not sufficient) evidence.

### AC — Access Control (22)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| AC.L1-3.1.1 | L1 | Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems). |  |
| AC.L1-3.1.2 | L1 | Limit system access to the types of transactions and functions that authorized users are permitted to execute. |  |
| AC.L2-3.1.3 | L2 | Control the flow of CUI in accordance with approved authorizations. |  |
| AC.L2-3.1.4 | L2 | Separate the duties of individuals to reduce the risk of malevolent activity without collusion. |  |
| AC.L2-3.1.5 | L2 | Employ the principle of least privilege, including for specific security functions and privileged accounts. |  |
| AC.L2-3.1.6 | L2 | Use non-privileged accounts or roles when accessing nonsecurity functions. |  |
| AC.L2-3.1.7 | L2 | Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs. |  |
| AC.L2-3.1.8 | L2 | Limit unsuccessful logon attempts. |  |
| AC.L2-3.1.9 | L2 | Provide privacy and security notices consistent with applicable CUI rules. |  |
| AC.L2-3.1.10 | L2 | Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity. |  |
| AC.L2-3.1.11 | L2 | Terminate (automatically) a user session after a defined condition. |  |
| AC.L2-3.1.12 | L2 | Monitor and control remote access sessions. |  |
| AC.L2-3.1.13 | L2 | Employ cryptographic mechanisms to protect the confidentiality of remote access sessions. |  |
| AC.L2-3.1.14 | L2 | Route remote access via managed access control points. |  |
| AC.L2-3.1.15 | L2 | Authorize remote execution of privileged commands and remote access to security-relevant information. |  |
| AC.L2-3.1.16 | L2 | Authorize wireless access prior to allowing such connections. |  |
| AC.L2-3.1.17 | L2 | Protect wireless access using authentication and encryption. |  |
| AC.L2-3.1.18 | L2 | Control connection of mobile devices. |  |
| AC.L2-3.1.19 | L2 | Encrypt CUI on mobile devices and mobile computing platforms. |  |
| AC.L1-3.1.20 | L1 | Verify and control/limit connections to and use of external systems. |  |
| AC.L2-3.1.21 | L2 | Limit use of portable storage devices on external systems. |  |
| AC.L1-3.1.22 | L1 | Control CUI posted or processed on publicly accessible systems. |  |

### AT — Awareness and Training (3)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| AT.L2-3.2.1 | L2 | Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures. |  |
| AT.L2-3.2.2 | L2 | Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities. |  |
| AT.L2-3.2.3 | L2 | Provide security awareness training on recognizing and reporting potential indicators of insider threat. |  |

### AU — Audit and Accountability (9)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| AU.L2-3.3.1 | L2 | Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity. |  |
| AU.L2-3.3.2 | L2 | Ensure that the actions of individual system users can be uniquely traced to those users. |  |
| AU.L2-3.3.3 | L2 | Review and update logged events. |  |
| AU.L2-3.3.4 | L2 | Alert in the event of an audit logging process failure. |  |
| AU.L2-3.3.5 | L2 | Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity. |  |
| AU.L2-3.3.6 | L2 | Provide audit record reduction and report generation to support on-demand analysis and reporting. |  |
| AU.L2-3.3.7 | L2 | Provide a system capability that compares and synchronizes internal system clocks with an authoritative source to generate time stamps for audit records. |  |
| AU.L2-3.3.8 | L2 | Protect audit information and audit logging tools from unauthorized access, modification, and deletion. |  |
| AU.L2-3.3.9 | L2 | Limit management of audit logging functionality to a subset of privileged users. |  |

### CM — Configuration Management (9)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| CM.L2-3.4.1 | L2 | Establish and maintain baseline configurations and inventories of organizational systems throughout the respective system development life cycles. |  |
| CM.L2-3.4.2 | L2 | Establish and enforce security configuration settings for information technology products employed in organizational systems. |  |
| CM.L2-3.4.3 | L2 | Track, review, approve or disapprove, and log changes to organizational systems. |  |
| CM.L2-3.4.4 | L2 | Analyze the security impact of changes prior to implementation. |  |
| CM.L2-3.4.5 | L2 | Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems. |  |
| CM.L2-3.4.6 | L2 | Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities. |  |
| CM.L2-3.4.7 | L2 | Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services. |  |
| CM.L2-3.4.8 | L2 | Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the execution of authorized software. | CTRL-002 |
| CM.L2-3.4.9 | L2 | Control and monitor user-installed software. |  |

### IA — Identification and Authentication (11)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| IA.L1-3.5.1 | L1 | Identify system users, processes acting on behalf of users, and devices. |  |
| IA.L1-3.5.2 | L1 | Authenticate (or verify) the identities of users, processes, or devices, as a prerequisite to allowing access to organizational systems. |  |
| IA.L2-3.5.3 | L2 | Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts. |  |
| IA.L2-3.5.4 | L2 | Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts. |  |
| IA.L2-3.5.5 | L2 | Prevent reuse of identifiers for a defined period. |  |
| IA.L2-3.5.6 | L2 | Disable identifiers after a defined period of inactivity. |  |
| IA.L2-3.5.7 | L2 | Enforce a minimum password complexity and change of characters when new passwords are created. |  |
| IA.L2-3.5.8 | L2 | Prohibit password reuse for a specified number of generations. |  |
| IA.L2-3.5.9 | L2 | Allow temporary password use for system logons with an immediate change to a permanent password. |  |
| IA.L2-3.5.10 | L2 | Store and transmit only cryptographically-protected passwords. | CTRL-003 |
| IA.L2-3.5.11 | L2 | Obscure feedback of authentication information. |  |

### IR — Incident Response (3)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| IR.L2-3.6.1 | L2 | Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities. |  |
| IR.L2-3.6.2 | L2 | Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization. |  |
| IR.L2-3.6.3 | L2 | Test the organizational incident response capability. |  |

### MA — Maintenance (6)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| MA.L2-3.7.1 | L2 | Perform maintenance on organizational systems. |  |
| MA.L2-3.7.2 | L2 | Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance. |  |
| MA.L2-3.7.3 | L2 | Ensure equipment removed for off-site maintenance is sanitized of any CUI. |  |
| MA.L2-3.7.4 | L2 | Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems. |  |
| MA.L2-3.7.5 | L2 | Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete. |  |
| MA.L2-3.7.6 | L2 | Supervise the maintenance activities of maintenance personnel without required access authorization. |  |

### MP — Media Protection (9)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| MP.L2-3.8.1 | L2 | Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital. |  |
| MP.L2-3.8.2 | L2 | Limit access to CUI on system media to authorized users. |  |
| MP.L1-3.8.3 | L1 | Sanitize or destroy system media containing CUI before disposal or release for reuse. |  |
| MP.L2-3.8.4 | L2 | Mark media with necessary CUI markings and distribution limitations. |  |
| MP.L2-3.8.5 | L2 | Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas. |  |
| MP.L2-3.8.6 | L2 | Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards. |  |
| MP.L2-3.8.7 | L2 | Control the use of removable media on system components. |  |
| MP.L2-3.8.8 | L2 | Prohibit the use of portable storage devices when such devices have no identifiable owner. |  |
| MP.L2-3.8.9 | L2 | Protect the confidentiality of backup CUI at storage locations. |  |

### PS — Personnel Security (2)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| PS.L2-3.9.1 | L2 | Screen individuals prior to authorizing access to organizational systems containing CUI. |  |
| PS.L2-3.9.2 | L2 | Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers. |  |

### PE — Physical Protection (6)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| PE.L1-3.10.1 | L1 | Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals. |  |
| PE.L2-3.10.2 | L2 | Protect and monitor the physical facility and support infrastructure for organizational systems. |  |
| PE.L1-3.10.3 | L1 | Escort visitors and monitor visitor activity. |  |
| PE.L1-3.10.4 | L1 | Maintain audit logs of physical access. |  |
| PE.L1-3.10.5 | L1 | Control and manage physical access devices. |  |
| PE.L2-3.10.6 | L2 | Enforce safeguarding measures for CUI at alternate work sites. |  |

### RA — Risk Assessment (3)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| RA.L2-3.11.1 | L2 | Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI. |  |
| RA.L2-3.11.2 | L2 | Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified. |  |
| RA.L2-3.11.3 | L2 | Remediate vulnerabilities in accordance with risk assessments. |  |

### CA — Security Assessment (4)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| CA.L2-3.12.1 | L2 | Periodically assess the security controls in organizational systems to determine if the controls are effective in their application. |  |
| CA.L2-3.12.2 | L2 | Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems. |  |
| CA.L2-3.12.3 | L2 | Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls. |  |
| CA.L2-3.12.4 | L2 | Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems. |  |

### SC — System and Communications Protection (16)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| SC.L1-3.13.1 | L1 | Monitor, control, and protect communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of organizational systems. |  |
| SC.L2-3.13.2 | L2 | Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational systems. |  |
| SC.L2-3.13.3 | L2 | Separate user functionality from system management functionality. |  |
| SC.L2-3.13.4 | L2 | Prevent unauthorized and unintended information transfer via shared system resources. |  |
| SC.L1-3.13.5 | L1 | Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks. |  |
| SC.L2-3.13.6 | L2 | Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception). |  |
| SC.L2-3.13.7 | L2 | Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and communicating via some other connection to resources in external networks (i.e., split tunneling). |  |
| SC.L2-3.13.8 | L2 | Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards. |  |
| SC.L2-3.13.9 | L2 | Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity. |  |
| SC.L2-3.13.10 | L2 | Establish and manage cryptographic keys for cryptography employed in organizational systems. |  |
| SC.L2-3.13.11 | L2 | Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |  |
| SC.L2-3.13.12 | L2 | Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users present at the device. |  |
| SC.L2-3.13.13 | L2 | Control and monitor the use of mobile code. |  |
| SC.L2-3.13.14 | L2 | Control and monitor the use of Voice over Internet Protocol (VoIP) technologies. |  |
| SC.L2-3.13.15 | L2 | Protect the authenticity of communications sessions. |  |
| SC.L2-3.13.16 | L2 | Protect the confidentiality of CUI at rest. | CTRL-001 |

### SI — System and Information Integrity (7)

| ID | Level | Requirement | Evidence |
|---|---|---|---|
| SI.L1-3.14.1 | L1 | Identify, report, and correct system flaws in a timely manner. |  |
| SI.L1-3.14.2 | L1 | Provide protection from malicious code at designated locations within organizational systems. |  |
| SI.L2-3.14.3 | L2 | Monitor system security alerts and advisories and take action in response. |  |
| SI.L1-3.14.4 | L1 | Update malicious code protection mechanisms when new releases are available. |  |
| SI.L1-3.14.5 | L1 | Perform periodic scans of organizational systems and real-time scans of files from external sources as files are downloaded, opened, or executed. |  |
| SI.L2-3.14.6 | L2 | Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks. |  |
| SI.L2-3.14.7 | L2 | Identify unauthorized use of organizational systems. |  |

## Verifier evidence links

| Practice | Control | Rationale |
|---|---|---|
| SC.L2-3.13.16 | CTRL-001 Encryption at Rest | Terraform plan shows storage encryption enabled |
| CM.L2-3.4.8 | CTRL-002 Image Signature Verification | Approved-registry/signed-image policy approximates allow-listing of software |
| IA.L2-3.5.10 | CTRL-003 Secrets Detection | Detects hard-coded credentials; supports but does not demonstrate cryptographic protection of passwords |

These links are informational. A PASS in the Verifier does not mean a practice is implemented.
