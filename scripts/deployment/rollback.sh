#!/bin/bash
# Rollback Script
# This script allows you to rollback to a previous deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/root/lms-coaching-center"
PM2_APP_NAME="lms-app"
BACKUP_DIR="/root/lms-backups"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# List available backups
list_backups() {
    echo "Available backups:"
    echo "═══════════════════════════════════════════════════════════"
    ls -1dt "$BACKUP_DIR"/*/ 2>/dev/null | while read -r backup; do
        BACKUP_NAME=$(basename "$backup")
        BACKUP_DATE=$(stat -c %y "$backup" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1 || echo "Unknown")
        echo "  - $BACKUP_NAME ($BACKUP_DATE)"
    done
    echo "═══════════════════════════════════════════════════════════"
}

# Rollback to a specific backup
rollback() {
    BACKUP_NAME=$1
    
    if [ -z "$BACKUP_NAME" ]; then
        error "Please specify a backup name"
    fi
    
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    if [ ! -d "$BACKUP_PATH" ]; then
        error "Backup not found: $BACKUP_NAME"
    fi
    
    log "Rolling back to backup: $BACKUP_NAME"
    
    cd "$APP_DIR" || error "Application directory not found"
    
    # Restore .env file if it exists
    if [ -f "$BACKUP_PATH/.env.backup" ]; then
        log "Restoring .env file..."
        cp "$BACKUP_PATH/.env.backup" .env
    fi
    
    # Restore database if backup exists
    if [ -f "$BACKUP_PATH/database.sql" ]; then
        warning "Database backup found. Restoring database..."
        read -p "Are you sure you want to restore the database? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            docker exec -i lms-postgres psql -U postgres -d lms_coaching_center < "$BACKUP_PATH/database.sql" || error "Database restore failed"
            log "Database restored successfully"
        else
            log "Database restore skipped"
        fi
    fi
    
    # Restart application
    log "Restarting application..."
    pm2 restart "$PM2_APP_NAME" --update-env || pm2 start npm --name "$PM2_APP_NAME" -- start
    
    log "✅ Rollback completed!"
}

# Main menu
case "${1:-}" in
    list)
        list_backups
        ;;
    *)
        if [ -z "${1:-}" ]; then
            list_backups
            echo ""
            read -p "Enter backup name to rollback to: " BACKUP_NAME
            rollback "$BACKUP_NAME"
        else
            rollback "$1"
        fi
        ;;
esac


