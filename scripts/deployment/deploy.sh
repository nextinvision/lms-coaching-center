#!/bin/bash
# Production Deployment Script
# This script automates the deployment process on the production server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/root/lms-coaching-center"
PM2_APP_NAME="lms-app"
LOG_FILE="/var/log/lms-deployment.log"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    warning "Not running as root. Some commands may require sudo."
fi

log "Starting deployment process..."

# Navigate to application directory
cd "$APP_DIR" || error "Application directory not found: $APP_DIR"

# Create backup before deployment
log "Creating backup..."
BACKUP_DIR="/root/lms-backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup database
log "Backing up database..."
docker exec lms-postgres pg_dump -U postgres lms_coaching_center > "$BACKUP_DIR/database.sql" 2>/dev/null || warning "Database backup failed"

# Backup .env file
if [ -f .env ]; then
    cp .env "$BACKUP_DIR/.env.backup"
fi

# Backup PM2 process list
pm2 save > /dev/null 2>&1 || true

log "Backup created at: $BACKUP_DIR"

# Pull latest changes
log "Pulling latest changes from git..."
git fetch origin || error "Failed to fetch from git"
git reset --hard origin/main || error "Failed to reset to main branch"
git clean -fd || warning "Failed to clean untracked files"

# Check Node.js version
log "Checking Node.js version..."
NODE_VERSION=$(node -v)
log "Node.js version: $NODE_VERSION"

# Install dependencies
log "Installing dependencies..."
npm ci --legacy-peer-deps || error "Failed to install dependencies"

# Generate Prisma Client
log "Generating Prisma Client..."
npx prisma generate || error "Failed to generate Prisma Client"

# Run database migrations
log "Running database migrations..."
npx prisma migrate deploy || error "Database migration failed"

# Build application
log "Building application..."
npm run build || error "Build failed"

# Check if build was successful
if [ ! -d ".next" ]; then
    error "Build failed: .next directory not found"
fi

log "Build successful!"

# Restart application with PM2
log "Restarting application..."
if pm2 list | grep -q "$PM2_APP_NAME"; then
    pm2 restart "$PM2_APP_NAME" --update-env || error "Failed to restart application"
else
    pm2 start npm --name "$PM2_APP_NAME" -- start || error "Failed to start application"
fi

# Save PM2 process list
pm2 save || warning "Failed to save PM2 process list"

# Wait a moment for the application to start
sleep 3

# Health check
log "Performing health check..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$HEALTH_CHECK" != "200" ] && [ "$HEALTH_CHECK" != "301" ] && [ "$HEALTH_CHECK" != "302" ]; then
    warning "Health check returned HTTP $HEALTH_CHECK. Application might not be responding correctly."
else
    log "Health check passed! (HTTP $HEALTH_CHECK)"
fi

# Cleanup old backups (keep last 10)
log "Cleaning up old backups..."
find /root/lms-backups -maxdepth 1 -type d -name "20*" | sort -r | tail -n +11 | xargs rm -rf 2>/dev/null || true

log "✅ Deployment completed successfully!"
log "Application is running at: https://digischooler.com"
log "PM2 Status:"
pm2 status "$PM2_APP_NAME"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✅ Deployment Summary${NC}"
echo "═══════════════════════════════════════════════════════════"
echo "Application: $PM2_APP_NAME"
echo "Status: $(pm2 jlist | jq -r '.[] | select(.name=="'$PM2_APP_NAME'") | .pm2_env.status')"
echo "URL: https://digischooler.com"
echo "Backup: $BACKUP_DIR"
echo "═══════════════════════════════════════════════════════════"


