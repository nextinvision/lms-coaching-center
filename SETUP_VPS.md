# VPS Setup Guide - Step by Step

## Current Status Analysis

✅ Credentials saved to `backups/old-credentials.json`
✅ `.env` file created
❌ Node.js not installed
❌ Docker services not running

## Step-by-Step Setup

### Step 1: Install Node.js (Required)

You need Node.js 20.16.0+ to run the migration scripts. Choose one method:

#### Option A: Using NVM (Recommended)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version
npm --version
```

#### Option B: Using NodeSource Repository

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify
node --version
npm --version
```

### Step 2: Install Docker & Docker Compose (If not installed)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get install docker-compose -y

# Verify
docker --version
docker-compose --version
```

### Step 3: Start PostgreSQL and MinIO

```bash
cd /root/lms-coaching-center
docker-compose up -d

# Wait for services to be ready (10-15 seconds)
sleep 15

# Verify services are running
docker ps
```

### Step 4: Install Project Dependencies

```bash
cd /root/lms-coaching-center
npm install
```

This will install all required packages including:
- Prisma (for database)
- MinIO client
- Cloudinary (temporary, for backup)
- Supabase client (temporary, for backup)
- TypeScript tools

### Step 5: Setup Local Database Schema

```bash
cd /root/lms-coaching-center
npm run db:migrate
```

This creates all database tables in your local PostgreSQL.

### Step 6: Backup Supabase Database

```bash
cd /root/lms-coaching-center

# Set old database URL (if not in .env)
export OLD_DATABASE_URL="postgresql://postgres.pzeofossaxrhjzbomofr:Lms123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Run backup
npm run backup:supabase
# Or: tsx scripts/backup-supabase.ts
```

This creates: `backups/backup-{timestamp}.json`

### Step 7: Migrate Database to Local PostgreSQL

```bash
cd /root/lms-coaching-center

# Find the backup file
BACKUP_FILE=$(ls -t backups/backup-*.json | head -1)
echo "Using backup: $BACKUP_FILE"

# Migrate
npm run migrate:database "$BACKUP_FILE"
# Or: tsx scripts/migrate-database.ts "$BACKUP_FILE"
```

### Step 8: Backup Cloudinary Files (Optional - can take time)

```bash
cd /root/lms-coaching-center

# Run backup
npm run backup:cloudinary
# Or: tsx scripts/backup-cloudinary.ts
```

This creates: `backups/cloudinary/cloudinary-metadata-{timestamp}.json`

### Step 9: Migrate Files to MinIO (If you backed up files)

```bash
cd /root/lms-coaching-center

# Find the metadata file
METADATA_FILE=$(ls -t backups/cloudinary/cloudinary-metadata-*.json | head -1)
echo "Using metadata: $METADATA_FILE"

# Migrate files
npm run migrate:files "$METADATA_FILE"
# Or: tsx scripts/migrate-files.ts "$METADATA_FILE"
```

### Step 10: Verify Migration

```bash
# Check database with Prisma Studio
npm run db:studio

# Or verify with psql
docker exec -it lms-postgres psql -U postgres -d lms_coaching_center -c "SELECT COUNT(*) FROM \"User\";"
```

## Alternative: Direct PostgreSQL Migration (If Docker not available)

If you have PostgreSQL installed directly on the VPS:

1. Update `.env` DATABASE_URL to your local PostgreSQL
2. Create database:
   ```bash
   createdb lms_coaching_center
   ```
3. Follow steps 6-10 above

## Verification Checklist

- [ ] Node.js installed and working
- [ ] Docker services running (postgres, minio)
- [ ] Dependencies installed (`npm install`)
- [ ] Database schema created (`npm run db:migrate`)
- [ ] Supabase backup created
- [ ] Data migrated to local PostgreSQL
- [ ] Files migrated to MinIO (if applicable)
- [ ] Verify data with `npm run db:studio`

## Troubleshooting

### Node.js Installation Issues
```bash
# Check if Node.js is installed
which node
node --version

# If not found, install using one of the methods above
```

### Docker Issues
```bash
# Check Docker status
systemctl status docker

# Start Docker if not running
systemctl start docker

# Check containers
docker ps -a
```

### Database Connection Issues
```bash
# Test PostgreSQL connection
docker exec -it lms-postgres psql -U postgres -c "SELECT version();"

# Check database exists
docker exec -it lms-postgres psql -U postgres -l
```

### Migration Errors
- Check backup file exists: `ls -la backups/backup-*.json`
- Verify credentials in `backups/old-credentials.json`
- Check network connectivity to Supabase
- Review error logs in console output

## Next Steps After Migration

1. **Test the application:**
   ```bash
   npm run dev
   ```

2. **Verify data:**
   - Login to application
   - Check all users, students, teachers
   - Verify content and files load correctly

3. **Clean up (optional):**
   - Remove temporary Cloudinary/Supabase dependencies
   - Remove backup files after verifying migration (keep them for a while though!)

## Quick Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker logs lms-postgres
docker logs lms-minio

# Access PostgreSQL
docker exec -it lms-postgres psql -U postgres -d lms_coaching_center

# Access MinIO Console
# Open: http://your-vps-ip:9001
# User: minioadmin
# Pass: minioadmin
```

