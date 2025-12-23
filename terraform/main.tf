# Data source to get current AWS account ID
data "aws_caller_identity" "current" {}

# Data source to get S3 bucket
data "aws_s3_bucket" "app_bucket" {
  bucket = var.s3_bucket_name
}

# CloudFront Origin Access Control (OAC)
resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "${var.domain_name}-oac"
  description                       = "OAC for ${var.domain_name} S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Response Headers Policy for security headers
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name    = replace("${var.domain_name}-security-headers", ".", "-")
  comment = "Security headers policy for ${var.domain_name}"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "app_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Angular SPA distribution for ${var.domain_name}"
  default_root_object = var.default_root_object
  price_class         = var.price_class

  aliases = var.acm_certificate_arn != "" ? [var.domain_name] : []

  origin {
    domain_name              = data.aws_s3_bucket.app_bucket.bucket_regional_domain_name
    origin_id                = "S3-${var.s3_bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  # Custom error responses for SPA routing
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 300
  }

  # Viewer certificate
  dynamic "viewer_certificate" {
    for_each = var.acm_certificate_arn != "" ? [1] : []
    content {
      acm_certificate_arn      = var.acm_certificate_arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1.2_2021"
    }
  }

  dynamic "viewer_certificate" {
    for_each = var.acm_certificate_arn == "" ? [1] : []
    content {
      cloudfront_default_certificate = true
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = var.tags
}

# S3 Bucket Policy to allow CloudFront OAC access
resource "aws_s3_bucket_policy" "cloudfront_access" {
  bucket = data.aws_s3_bucket.app_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipalReadOnly"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${data.aws_s3_bucket.app_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.app_distribution.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.app_distribution]
}

# Ensure S3 bucket has public access blocked
resource "aws_s3_bucket_public_access_block" "app_bucket" {
  bucket = data.aws_s3_bucket.app_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Route 53 Record pointing to CloudFront
resource "aws_route53_record" "cloudfront_alias" {
  count           = var.enable_custom_domain ? 1 : 0
  zone_id         = var.route53_hosted_zone_id
  name            = var.domain_name
  type            = "A"
  allow_overwrite = true

  alias {
    name                   = aws_cloudfront_distribution.app_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.app_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# Route 53 Record for IPv6 (AAAA)
resource "aws_route53_record" "cloudfront_alias_ipv6" {
  count           = var.enable_custom_domain && aws_cloudfront_distribution.app_distribution.is_ipv6_enabled ? 1 : 0
  zone_id         = var.route53_hosted_zone_id
  name            = var.domain_name
  type            = "AAAA"
  allow_overwrite = true

  alias {
    name                   = aws_cloudfront_distribution.app_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.app_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

