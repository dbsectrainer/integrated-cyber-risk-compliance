# Policy: Encryption at Rest for All Storage Resources
# Framework Mapping: SOC2 CC6.1, HIPAA 164.312(a)(2)(iv), ISO 27001 A.10.1.1
# Severity: HIGH
# Description: Ensures all storage resources (S3, EBS, RDS) have encryption enabled

package terraform.encryption

import future.keywords.if
import future.keywords.in

# Default deny
default allow = false

# List of storage resource types that must be encrypted
storage_types := {
    "aws_s3_bucket",
    "aws_ebs_volume",
    "aws_rds_cluster",
    "aws_rds_instance",
    "aws_db_instance",
    "aws_dynamodb_table",
    "aws_efs_file_system"
}

# Extract all resources from Terraform plan
resources[r] {
    r := input.planned_values.root_module.resources[_]
}

# Check S3 bucket encryption
s3_encrypted(resource) if {
    resource.type == "aws_s3_bucket"
    # Look for corresponding encryption configuration
    some encryption_resource in resources
    encryption_resource.type == "aws_s3_bucket_server_side_encryption_configuration"
    encryption_resource.values.bucket == resource.values.bucket
}

# Check EBS volume encryption
ebs_encrypted(resource) if {
    resource.type == "aws_ebs_volume"
    resource.values.encrypted == true
}

# Check RDS encryption
rds_encrypted(resource) if {
    resource.type in ["aws_rds_cluster", "aws_db_instance"]
    resource.values.storage_encrypted == true
}

# Check DynamoDB encryption
dynamodb_encrypted(resource) if {
    resource.type == "aws_dynamodb_table"
    resource.values.server_side_encryption[_].enabled == true
}

# Check EFS encryption
efs_encrypted(resource) if {
    resource.type == "aws_efs_file_system"
    resource.values.encrypted == true
}

# Main encryption check
is_encrypted(resource) if {
    s3_encrypted(resource)
}

is_encrypted(resource) if {
    ebs_encrypted(resource)
}

is_encrypted(resource) if {
    rds_encrypted(resource)
}

is_encrypted(resource) if {
    dynamodb_encrypted(resource)
}

is_encrypted(resource) if {
    efs_encrypted(resource)
}

# Find all unencrypted storage resources
unencrypted_resources[resource] {
    resource := resources[_]
    resource.type in storage_types
    not is_encrypted(resource)
}

# Violation details for reporting
violations[violation] {
    resource := unencrypted_resources[_]
    violation := {
        "resource_address": resource.address,
        "resource_type": resource.type,
        "resource_name": resource.name,
        "severity": "HIGH",
        "control": "Encryption at Rest",
        "frameworks": ["SOC2 CC6.1", "HIPAA 164.312(a)(2)(iv)", "ISO 27001 A.10.1.1"],
        "message": sprintf("Storage resource '%s' does not have encryption at rest enabled", [resource.address]),
        "remediation": get_remediation(resource.type)
    }
}

# Remediation guidance per resource type
get_remediation(resource_type) = remediation {
    remediation_map := {
        "aws_s3_bucket": "Add aws_s3_bucket_server_side_encryption_configuration resource with AES256 or aws:kms encryption",
        "aws_ebs_volume": "Set 'encrypted = true' and optionally specify 'kms_key_id' for the EBS volume",
        "aws_rds_cluster": "Set 'storage_encrypted = true' and specify 'kms_key_id' for the RDS cluster",
        "aws_db_instance": "Set 'storage_encrypted = true' and specify 'kms_key_id' for the RDS instance",
        "aws_dynamodb_table": "Add server_side_encryption block with 'enabled = true'",
        "aws_efs_file_system": "Set 'encrypted = true' and optionally specify 'kms_key_id'"
    }
    remediation := remediation_map[resource_type]
}

# Policy passes if no violations
allow if {
    count(violations) == 0
}

# Summary for reporting
summary = result {
    total_storage := count([r | r := resources[_]; r.type in storage_types])
    encrypted_count := count([r | r := resources[_]; r.type in storage_types; is_encrypted(r)])
    unencrypted_count := count(unencrypted_resources)

    result := {
        "total_storage_resources": total_storage,
        "encrypted_resources": encrypted_count,
        "unencrypted_resources": unencrypted_count,
        "compliance_percentage": (encrypted_count / total_storage) * 100,
        "policy_status": allow,
        "violations": violations
    }
}
