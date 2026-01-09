#!/bin/bash
# Rollback script for production deployment
# Usage: ./scripts/rollback.sh [backup-timestamp]

set -e

BACKUP_DIR="/root/lms-backups"
DEPLOYMENT_DIR="/root/lms-coaching-center"

if [ -z "$1" ]; then
    echo "📋 Available backups:"
    ls -1t "$BACKUP_DIR" 2>/dev/null | head -5
    echo ""
    echo "Usage: $0 [backup-timestamp]"
    echo "Example: $0 backup-20260109-120000"
    exit 1
fi

BACKUP_NAME="$1"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

if [ ! -d "$BACKUP_PATH" ]; then
    echo "❌ Backup not found: $BACKUP_PATH"
    exit 1
fi

echo "⚠️  WARNING: This will rollback to backup: $BACKUP_NAME"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Rollback cancelled"
    exit 0
fi

echo "🔄 Starting rollback process..."
cd "$DEPLOYMENT_DIR" || exit 1

# Stop the application
echo "🛑 Stopping application..."
pm2 stop lms-app || true

# Restore .next directory
if [ -d "$BACKUP_PATH/.next" ]; then
    echo "📦 Restoring .next directory..."
    rm -rf .next
    cp -r "$BACKUP_PATH/.next" .
fi

# Restore package.json if it exists
if [ -f "$BACKUP_PATH/package.json" ]; then
    echo "📦 Restoring package.json..."
    cp "$BACKUP_PATH/package.json" .
fi

# Restart application
echo "🚀 Restarting application..."
pm2 restart lms-app || pm2 start npm --name lms-app -- start
pm2 save

# Wait for application to be ready
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Rollback completed successfully"
    echo "🌐 Application URL: https://digischooler.com"
else
    echo "⚠️  Health check failed, but rollback completed"
    echo "📋 Check logs: pm2 logs lms-app"
fi


