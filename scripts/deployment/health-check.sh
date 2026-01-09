#!/bin/bash
# Health Check Script
# This script checks the health of all services

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_status() {
    local service=$1
    local command=$2
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $service: Running"
        return 0
    else
        echo -e "${RED}❌${NC} $service: Not Running"
        return 1
    fi
}

check_http() {
    local url=$1
    local name=$2
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✅${NC} $name: HTTP $HTTP_CODE"
        return 0
    else
        echo -e "${RED}❌${NC} $name: HTTP $HTTP_CODE"
        return 1
    fi
}

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}           Health Check - $(date)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check PM2 Application
echo "Application Status:"
if pm2 list | grep -q "lms-app"; then
    STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="lms-app") | .pm2_env.status')
    CPU=$(pm2 jlist | jq -r '.[] | select(.name=="lms-app") | .monit.cpu')
    MEM=$(pm2 jlist | jq -r '.[] | select(.name=="lms-app") | .monit.memory')
    echo -e "${GREEN}✅${NC} PM2 Application: $STATUS (CPU: ${CPU}%, Memory: ${MEM}MB)"
else
    echo -e "${RED}❌${NC} PM2 Application: Not Found"
fi

echo ""

# Check Services
echo "Services Status:"
check_status "PostgreSQL" "docker exec lms-postgres pg_isready -U postgres"
check_status "MinIO" "curl -f http://localhost:9000/minio/health/live"
check_status "Nginx" "systemctl is-active --quiet nginx"
check_status "PM2" "pm2 ping"

echo ""

# Check HTTP Endpoints
echo "HTTP Endpoints:"
check_http "http://localhost:3000" "Local Application"
check_http "https://digischooler.com" "Production Domain (HTTPS)"
check_http "http://digischooler.com" "Production Domain (HTTP)"

echo ""

# Check Disk Space
echo "System Resources:"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}')
echo -e "${BLUE}💾${NC} Disk Usage: $DISK_USAGE"

MEM_USAGE=$(free -h | awk '/^Mem:/ {print $3 "/" $2}')
echo -e "${BLUE}💾${NC} Memory Usage: $MEM_USAGE"

echo ""

# Check SSL Certificate
echo "SSL Certificate:"
CERT_EXPIRY=$(certbot certificates 2>/dev/null | grep -A 2 "digischooler.com" | grep "Expiry Date" | awk '{print $3, $4, $5}' || echo "Not found")
if [ "$CERT_EXPIRY" != "Not found" ]; then
    echo -e "${GREEN}✅${NC} SSL Certificate expires: $CERT_EXPIRY"
else
    echo -e "${YELLOW}⚠️${NC} SSL Certificate information not available"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"


