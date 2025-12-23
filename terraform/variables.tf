variable "domain_name" {
  description = "Domain name for the CloudFront distribution (e.g., example.com)"
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the Angular app"
  type        = string
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS (optional, leave empty to use CloudFront default certificate)"
  type        = string
  default     = ""
}

variable "route53_hosted_zone_id" {
  description = "Route 53 hosted zone ID for the domain"
  type        = string
}

variable "enable_custom_domain" {
  description = "Whether to create Route 53 record pointing to CloudFront"
  type        = bool
  default     = true
}

variable "default_root_object" {
  description = "Default root object for CloudFront"
  type        = string
  default     = "index.html"
}

variable "price_class" {
  description = "CloudFront price class (PriceClass_All, PriceClass_200, PriceClass_100)"
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.price_class)
    error_message = "Price class must be one of: PriceClass_All, PriceClass_200, PriceClass_100"
  }
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Environment = "production"
    ManagedBy   = "terraform"
    Project     = "leanda"
  }
}

