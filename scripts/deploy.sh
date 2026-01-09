#!/bin/bash
# Deployment script for VPS deployment
# This script is called by GitHub Actions but can also be run manually

set -e

DEPLOYMENT_DIR="/root/lms-coaching-center"
BACKUP_DIR="/root/lms-backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "🚀 Starting deployment process..."
echo "📁 Deployment directory: $DEPLOYMENT_DIR"
echo "⏰ Timestamp: $TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Navigate to deployment directory
cd "$DEPLOYMENT_DIR" || {
    echo "❌ Deployment directory not found: $DEPLOYMENT_DIR"
    exit 1
}

# Backup current deployment if .next exists
if [ -d ".next" ]; then
    echo "📦 Creating backup..."
    BACKUP_PATH="$BACKUP_DIR/backup-$TIMESTAMP"
    mkdir -p "$BACKUP_PATH"
    cp -r .next "$BACKUP_PATH/" 2>/dev/null || true
    cp package.json "$BACKUP_PATH/" 2>/dev/null || true
    echo "✅ Backup created at $BACKUP_PATH"
fi

# Check if deployment package exists
if [ ! -f "/tmp/deployment.tar.gz" ]; then
    echo "❌ Deployment package not found: /tmp/deployment.tar.gz"
    exit 1
fi

# Extract deployment package
echo "📦 Extracting deployment package..."
tar -xzf /tmp/deployment.tar.gz -C . --strip-components=1

# Install/update dependencies
echo "📥 Installing dependencies..."
npm ci --production --legacy-peer-deps || npm install --production --legacy-peer-deps

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy || echo "⚠️  Migration skipped (may already be up to date)"

# Restart application with PM2
echo "🚀 Restarting application..."
if pm2 list | grep -q "lms-app"; then
    pm2 restart lms-app --update-env
else
    pm2 start npm --name lms-app -- start
fi
pm2 save

# Wait for application to be ready
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application is healthy"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "⏳ Health check failed, retrying... ($RETRY_COUNT/$MAX_RETRIES)"
            sleep 5
        else
            echo "⚠️  Health check failed after $MAX_RETRIES attempts"
            echo "📋 Checking PM2 logs..."
            pm2 logs lms-app --lines 50 --nostream
            exit 1
        fi
    fi
done

# Cleanup old backups (keep last 5)
echo "🧹 Cleaning up old backups..."
cd "$BACKUP_DIR" || exit
ls -t | tail -n +6 | xargs rm -rf 2>/dev/null || true

# Cleanup deployment package
rm -f /tmp/deployment.tar.gz

# Show deployment info
if [ -f "$DEPLOYMENT_DIR/DEPLOYMENT_INFO.txt" ]; then
    echo ""
    echo "📋 Deployment Information:"
    cat "$DEPLOYMENT_DIR/DEPLOYMENT_INFO.txt"
fi

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Application URL: https://digischooler.com"
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs lms-app"


