output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.app_distribution.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.app_distribution.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.app_distribution.domain_name
}

output "cloudfront_url" {
  description = "CloudFront distribution URL"
  value       = "https://${aws_cloudfront_distribution.app_distribution.domain_name}"
}

output "custom_domain_url" {
  description = "Custom domain URL (if enabled)"
  value       = var.enable_custom_domain ? "https://${var.domain_name}" : null
}

output "origin_access_control_id" {
  description = "Origin Access Control ID"
  value       = aws_cloudfront_origin_access_control.s3_oac.id
}

output "route53_record_name" {
  description = "Route 53 record name (if created)"
  value       = var.enable_custom_domain ? aws_route53_record.cloudfront_alias[0].name : null
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = var.s3_bucket_name
}

output "distribution_status" {
  description = "CloudFront distribution status"
  value       = aws_cloudfront_distribution.app_distribution.status
}

