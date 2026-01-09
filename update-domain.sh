#!/bin/bash
# Script to update domain configuration
# Usage: ./update-domain.sh yourdomain.com

if [ -z "$1" ]; then
    echo "Usage: ./update-domain.sh yourdomain.com"
    exit 1
fi

DOMAIN=$1

echo "Updating domain configuration for: $DOMAIN"
echo ""

# Update Nginx configuration
echo "1. Updating Nginx configuration..."
sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/lms

# Update .env file
echo "2. Updating environment variables..."
cd /root/lms-coaching-center
sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://$DOMAIN|" .env
sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://$DOMAIN|" .env

# Test Nginx configuration
echo "3. Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "4. Reloading Nginx..."
    systemctl reload nginx
    
    echo "5. Restarting application..."
    pm2 restart lms-app
    
    echo ""
    echo "✅ Domain configuration updated!"
    echo ""
    echo "Next step: Install SSL certificate"
    echo "Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

