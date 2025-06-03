#!/bin/bash
# SSL Certificate Setup Script for Food Delivery Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SSL_DIR="./nginx/ssl"
DOMAIN="${1:-localhost}"
COUNTRY="US"
STATE="California"
CITY="San Francisco"
ORG="Food Delivery Platform"
OU="IT Department"

echo -e "${GREEN}🔐 SSL Certificate Setup for Food Delivery Platform${NC}"
echo "=================================="

# Create SSL directory
mkdir -p "$SSL_DIR"

if [ "$DOMAIN" = "localhost" ]; then
    echo -e "${YELLOW}📋 Creating self-signed certificate for local development...${NC}"
    
    # Generate private key
    openssl genrsa -out "$SSL_DIR/key.pem" 2048
    
    # Generate certificate signing request
    openssl req -new -key "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.csr" \
        -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG/OU=$OU/CN=$DOMAIN"
    
    # Generate self-signed certificate
    openssl x509 -req -days 365 -in "$SSL_DIR/cert.csr" -signkey "$SSL_DIR/key.pem" \
        -out "$SSL_DIR/cert.pem" \
        -extfile <(
            echo 'subjectAltName = @alt_names'
            echo '[alt_names]'
            echo 'DNS.1 = localhost'
            echo 'DNS.2 = *.localhost'
            echo 'IP.1 = 127.0.0.1'
            echo 'IP.2 = ::1'
        )
    
    # Clean up CSR file
    rm "$SSL_DIR/cert.csr"
    
    echo -e "${GREEN}✅ Self-signed certificate created successfully!${NC}"
    echo -e "${YELLOW}⚠️  Note: You'll need to accept the security warning in your browser${NC}"
    
else
    echo -e "${YELLOW}📋 Setting up Let's Encrypt certificate for domain: $DOMAIN${NC}"
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        echo -e "${RED}❌ certbot is not installed. Please install it first:${NC}"
        echo "  - Ubuntu/Debian: sudo apt-get install certbot"
        echo "  - CentOS/RHEL: sudo yum install certbot"
        echo "  - macOS: brew install certbot"
        exit 1
    fi
    
    # Create temporary nginx config for domain validation
    cat > "$SSL_DIR/temp-nginx.conf" << EOF
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name $DOMAIN;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }
}
EOF
    
    echo -e "${YELLOW}📋 Please ensure your domain $DOMAIN points to this server's IP address${NC}"
    echo -e "${YELLOW}📋 Then run: sudo certbot certonly --webroot -w /var/www/certbot -d $DOMAIN${NC}"
    echo -e "${YELLOW}📋 After obtaining certificates, copy them to:${NC}"
    echo "  - Certificate: $SSL_DIR/cert.pem"
    echo "  - Private Key: $SSL_DIR/key.pem"
    
    # Create directory for certbot webroot
    mkdir -p "/var/www/certbot"
fi

# Set proper permissions
chmod 600 "$SSL_DIR/key.pem" 2>/dev/null || true
chmod 644 "$SSL_DIR/cert.pem" 2>/dev/null || true

echo -e "${GREEN}🎉 SSL setup completed!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update your .env.prod with the correct domain"
echo "2. Deploy with: ./deploy.sh deploy prod"
echo "3. Access your application at: https://$DOMAIN"

# Display certificate information
if [ -f "$SSL_DIR/cert.pem" ]; then
    echo ""
    echo -e "${GREEN}📋 Certificate Information:${NC}"
    openssl x509 -in "$SSL_DIR/cert.pem" -text -noout | grep -E "(Subject:|DNS:|IP Address:|Not Before|Not After)"
fi
