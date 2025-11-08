/**
 * Terraform Plan Verifier
 * Validates encryption at rest for all storage resources
 * Framework Mapping: SOC2 CC6.1, HIPAA 164.312(a)(2)(iv), ISO 27001 A.10.1.1
 */

export interface TerraformPlan {
  format_version?: string;
  terraform_version?: string;
  planned_values: {
    root_module: {
      resources: TerraformResource[];
    };
  };
}

export interface TerraformResource {
  address: string;
  mode: string;
  type: string;
  name: string;
  provider_name: string;
  schema_version: number;
  values: any;
}

export interface VerificationResult {
  control: string;
  status: 'PASS' | 'FAIL';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  frameworks: string[];
  findings: Finding[];
  summary: {
    total_resources: number;
    compliant_resources: number;
    non_compliant_resources: number;
    compliance_percentage: number;
  };
  remediation: string[];
}

export interface Finding {
  resource_address: string;
  resource_type: string;
  issue: string;
  severity: string;
  remediation: string;
}

const STORAGE_TYPES = [
  'aws_s3_bucket',
  'aws_ebs_volume',
  'aws_rds_cluster',
  'aws_rds_instance',
  'aws_db_instance',
  'aws_dynamodb_table',
  'aws_efs_file_system',
];

export class TerraformVerifier {
  private plan: TerraformPlan;

  constructor(planJson: string | TerraformPlan) {
    if (typeof planJson === 'string') {
      this.plan = JSON.parse(planJson);
    } else {
      this.plan = planJson;
    }
  }

  /**
   * Verify encryption at rest for all storage resources
   */
  public verifyEncryptionAtRest(): VerificationResult {
    const resources = this.plan.planned_values.root_module.resources;
    const storageResources = resources.filter((r) =>
      STORAGE_TYPES.includes(r.type)
    );

    const findings: Finding[] = [];
    let compliantCount = 0;

    for (const resource of storageResources) {
      const isEncrypted = this.isResourceEncrypted(resource, resources);

      if (isEncrypted) {
        compliantCount++;
      } else {
        findings.push({
          resource_address: resource.address,
          resource_type: resource.type,
          issue: `Storage resource does not have encryption at rest enabled`,
          severity: 'HIGH',
          remediation: this.getRemediationForType(resource.type),
        });
      }
    }

    const totalResources = storageResources.length;
    const nonCompliantCount = totalResources - compliantCount;
    const compliancePercentage =
      totalResources > 0 ? (compliantCount / totalResources) * 100 : 100;

    return {
      control: 'Encryption at Rest',
      status: findings.length === 0 ? 'PASS' : 'FAIL',
      severity: 'HIGH',
      frameworks: [
        'SOC2 CC6.1',
        'HIPAA 164.312(a)(2)(iv)',
        'ISO 27001 A.10.1.1',
      ],
      findings,
      summary: {
        total_resources: totalResources,
        compliant_resources: compliantCount,
        non_compliant_resources: nonCompliantCount,
        compliance_percentage: Math.round(compliancePercentage),
      },
      remediation: this.getGeneralRemediation(),
    };
  }

  /**
   * Check if a resource has encryption enabled
   */
  private isResourceEncrypted(
    resource: TerraformResource,
    allResources: TerraformResource[]
  ): boolean {
    switch (resource.type) {
      case 'aws_s3_bucket':
        return this.isS3Encrypted(resource, allResources);
      case 'aws_ebs_volume':
        return this.isEBSEncrypted(resource);
      case 'aws_rds_cluster':
      case 'aws_rds_instance':
      case 'aws_db_instance':
        return this.isRDSEncrypted(resource);
      case 'aws_dynamodb_table':
        return this.isDynamoDBEncrypted(resource);
      case 'aws_efs_file_system':
        return this.isEFSEncrypted(resource);
      default:
        return false;
    }
  }

  /**
   * Check S3 bucket encryption (requires separate encryption configuration resource)
   */
  private isS3Encrypted(
    bucket: TerraformResource,
    allResources: TerraformResource[]
  ): boolean {
    const bucketName = bucket.values.bucket;
    return allResources.some(
      (r) =>
        r.type === 'aws_s3_bucket_server_side_encryption_configuration' &&
        r.values.bucket === bucketName &&
        r.values.rule &&
        r.values.rule.length > 0
    );
  }

  /**
   * Check EBS volume encryption
   */
  private isEBSEncrypted(volume: TerraformResource): boolean {
    return volume.values.encrypted === true;
  }

  /**
   * Check RDS encryption
   */
  private isRDSEncrypted(db: TerraformResource): boolean {
    return db.values.storage_encrypted === true;
  }

  /**
   * Check DynamoDB encryption
   */
  private isDynamoDBEncrypted(table: TerraformResource): boolean {
    return (
      table.values.server_side_encryption &&
      Array.isArray(table.values.server_side_encryption) &&
      table.values.server_side_encryption.some((sse: any) => sse.enabled === true)
    );
  }

  /**
   * Check EFS encryption
   */
  private isEFSEncrypted(efs: TerraformResource): boolean {
    return efs.values.encrypted === true;
  }

  /**
   * Get remediation steps for a specific resource type
   */
  private getRemediationForType(resourceType: string): string {
    const remediationMap: { [key: string]: string } = {
      aws_s3_bucket:
        'Add aws_s3_bucket_server_side_encryption_configuration resource with AES256 or aws:kms encryption',
      aws_ebs_volume:
        "Set 'encrypted = true' and optionally specify 'kms_key_id' for the EBS volume",
      aws_rds_cluster:
        "Set 'storage_encrypted = true' and specify 'kms_key_id' for the RDS cluster",
      aws_rds_instance:
        "Set 'storage_encrypted = true' and specify 'kms_key_id' for the RDS instance",
      aws_db_instance:
        "Set 'storage_encrypted = true' and specify 'kms_key_id' for the RDS instance",
      aws_dynamodb_table:
        "Add server_side_encryption block with 'enabled = true'",
      aws_efs_file_system:
        "Set 'encrypted = true' and optionally specify 'kms_key_id'",
    };
    return remediationMap[resourceType] || 'Enable encryption for this resource';
  }

  /**
   * Get general remediation guidance
   */
  private getGeneralRemediation(): string[] {
    return [
      'Enable encryption at rest for all storage resources',
      'Use AWS KMS for key management and rotation',
      'Ensure encryption keys are properly managed and rotated',
      'Document encryption configuration in IaC templates',
      'Validate encryption settings in AWS Config',
      'Review and update security policies regularly',
    ];
  }
}

/**
 * Convenience function to verify a Terraform plan file
 */
export function verifyTerraformPlan(planJson: string): VerificationResult {
  const verifier = new TerraformVerifier(planJson);
  return verifier.verifyEncryptionAtRest();
}
