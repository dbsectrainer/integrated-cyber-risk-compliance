/**
 * Control Map with Compliance Framework Mappings
 * Maps automated controls to SOC2, HIPAA, and ISO 27001 requirements
 */

export interface FrameworkControl {
  id: string;
  name: string;
  description: string;
}

export interface ControlMapping {
  control_id: string;
  control_name: string;
  description: string;
  category: 'Infrastructure' | 'Application' | 'Process';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  automated: boolean;
  frameworks: {
    soc2: FrameworkControl[];
    hipaa: FrameworkControl[];
    iso27001: FrameworkControl[];
  };
  implementation: string;
  verification_method: string;
}

export const CONTROL_MAP: ControlMapping[] = [
  {
    control_id: 'CTRL-001',
    control_name: 'Encryption at Rest for Storage Resources',
    description:
      'Ensures all storage resources (S3, EBS, RDS, etc.) have encryption at rest enabled to protect data confidentiality.',
    category: 'Infrastructure',
    severity: 'HIGH',
    automated: true,
    frameworks: {
      soc2: [
        {
          id: 'CC6.1',
          name: 'Logical and Physical Access Controls',
          description:
            'The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity\'s objectives.',
        },
        {
          id: 'CC6.7',
          name: 'Encryption of Data at Rest',
          description:
            'The entity restricts the transmission, movement, and removal of information to authorized internal and external users and processes, and protects it during transmission, movement, or removal to meet the entity\'s objectives.',
        },
      ],
      hipaa: [
        {
          id: '164.312(a)(2)(iv)',
          name: 'Encryption and Decryption',
          description:
            'Implement a mechanism to encrypt and decrypt electronic protected health information.',
        },
        {
          id: '164.312(e)(2)(ii)',
          name: 'Encryption',
          description:
            'Implement a mechanism to encrypt electronic protected health information whenever deemed appropriate.',
        },
      ],
      iso27001: [
        {
          id: 'A.10.1.1',
          name: 'Policy on the use of cryptographic controls',
          description:
            'A policy on the use of cryptographic controls for protection of information shall be developed and implemented.',
        },
        {
          id: 'A.18.1.5',
          name: 'Regulation of cryptographic controls',
          description:
            'Cryptographic controls shall be used in compliance with all relevant agreements, legislation and regulations.',
        },
      ],
    },
    implementation: 'Terraform plan validation using OPA policy engine',
    verification_method: 'Parse Terraform plan JSON and verify encryption settings',
  },
  {
    control_id: 'CTRL-002',
    control_name: 'Container Image Signature Verification',
    description:
      'Enforces that all container images are signed and verified before deployment to ensure supply chain security.',
    category: 'Application',
    severity: 'HIGH',
    automated: true,
    frameworks: {
      soc2: [
        {
          id: 'CC8.1',
          name: 'Change Management',
          description:
            'The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures to meet its objectives.',
        },
        {
          id: 'CC7.2',
          name: 'System Monitoring',
          description:
            'The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity\'s ability to meet its objectives; anomalies are analyzed to determine whether they represent security events.',
        },
      ],
      hipaa: [
        {
          id: '164.312(c)(1)',
          name: 'Integrity Controls',
          description:
            'Implement policies and procedures to protect electronic protected health information from improper alteration or destruction.',
        },
        {
          id: '164.308(a)(5)(ii)(B)',
          name: 'Protection from Malicious Software',
          description:
            'Implement procedures for guarding against, detecting, and reporting malicious software.',
        },
      ],
      iso27001: [
        {
          id: 'A.12.5.1',
          name: 'Installation of software on operational systems',
          description:
            'Procedures shall be implemented to control the installation of software on operational systems.',
        },
        {
          id: 'A.14.2.8',
          name: 'System security testing',
          description:
            'Testing of security functionality shall be carried out during development.',
        },
      ],
    },
    implementation: 'Kyverno/Gatekeeper policy enforcement in Kubernetes',
    verification_method:
      'Parse K8s manifests and verify Cosign signatures and digest references',
  },
  {
    control_id: 'CTRL-003',
    control_name: 'Secrets Detection in Source Code',
    description:
      'Prevents hardcoded secrets, credentials, and API keys from being committed to source code repositories.',
    category: 'Process',
    severity: 'CRITICAL',
    automated: true,
    frameworks: {
      soc2: [
        {
          id: 'CC6.1',
          name: 'Logical and Physical Access Controls',
          description:
            'The entity implements logical access security software to protect information assets from security events.',
        },
        {
          id: 'CC6.6',
          name: 'Encryption of Confidential Information',
          description:
            'The entity protects against the unauthorized access to confidential information.',
        },
        {
          id: 'CC7.4',
          name: 'Response to Security Incidents',
          description:
            'The entity responds to identified security incidents by executing a defined incident response program.',
        },
      ],
      hipaa: [
        {
          id: '164.312(a)(1)',
          name: 'Access Control',
          description:
            'Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights.',
        },
        {
          id: '164.308(a)(4)(ii)(B)',
          name: 'Isolate Healthcare Clearinghouse Functions',
          description:
            'If a healthcare clearinghouse is part of a larger organization, separate the healthcare clearinghouse from the larger organization.',
        },
      ],
      iso27001: [
        {
          id: 'A.9.4.1',
          name: 'Information access restriction',
          description:
            'Access to information and application system functions shall be restricted in accordance with the access control policy.',
        },
        {
          id: 'A.9.2.1',
          name: 'User registration and de-registration',
          description:
            'A formal user registration and de-registration process shall be implemented to enable assignment of access rights.',
        },
        {
          id: 'A.18.1.3',
          name: 'Protection of records',
          description:
            'Records shall be protected from loss, destruction, falsification, unauthorized access and unauthorized release.',
        },
      ],
    },
    implementation: 'CI/CD pipeline integration with detect-secrets and Trufflehog',
    verification_method: 'Parse CI logs for secrets detection scan results',
  },
];

/**
 * Get all unique frameworks
 */
export function getFrameworks(): string[] {
  return ['SOC2', 'HIPAA', 'ISO 27001'];
}

/**
 * Get controls by framework
 */
export function getControlsByFramework(framework: 'soc2' | 'hipaa' | 'iso27001'): ControlMapping[] {
  return CONTROL_MAP.filter(
    (control) => control.frameworks[framework] && control.frameworks[framework].length > 0
  );
}

/**
 * Get control by ID
 */
export function getControlById(controlId: string): ControlMapping | undefined {
  return CONTROL_MAP.find((control) => control.control_id === controlId);
}

/**
 * Get all automated controls
 */
export function getAutomatedControls(): ControlMapping[] {
  return CONTROL_MAP.filter((control) => control.automated);
}

/**
 * Summary statistics
 */
export function getControlSummary() {
  return {
    total_controls: CONTROL_MAP.length,
    automated_controls: CONTROL_MAP.filter((c) => c.automated).length,
    manual_controls: CONTROL_MAP.filter((c) => !c.automated).length,
    by_severity: {
      critical: CONTROL_MAP.filter((c) => c.severity === 'CRITICAL').length,
      high: CONTROL_MAP.filter((c) => c.severity === 'HIGH').length,
      medium: CONTROL_MAP.filter((c) => c.severity === 'MEDIUM').length,
      low: CONTROL_MAP.filter((c) => c.severity === 'LOW').length,
    },
    by_category: {
      infrastructure: CONTROL_MAP.filter((c) => c.category === 'Infrastructure').length,
      application: CONTROL_MAP.filter((c) => c.category === 'Application').length,
      process: CONTROL_MAP.filter((c) => c.category === 'Process').length,
    },
  };
}

/**
 * Framework coverage report
 */
export function getFrameworkCoverage() {
  return {
    soc2: {
      controls_mapped: getControlsByFramework('soc2').length,
      unique_requirements: new Set(
        CONTROL_MAP.flatMap((c) => c.frameworks.soc2.map((f) => f.id))
      ).size,
    },
    hipaa: {
      controls_mapped: getControlsByFramework('hipaa').length,
      unique_requirements: new Set(
        CONTROL_MAP.flatMap((c) => c.frameworks.hipaa.map((f) => f.id))
      ).size,
    },
    iso27001: {
      controls_mapped: getControlsByFramework('iso27001').length,
      unique_requirements: new Set(
        CONTROL_MAP.flatMap((c) => c.frameworks.iso27001.map((f) => f.id))
      ).size,
    },
  };
}
