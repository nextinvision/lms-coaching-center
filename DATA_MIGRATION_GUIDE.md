# Data Migration Guide

This guide will help you migrate your data from Supabase/Cloudinary to local PostgreSQL/MinIO.

## Prerequisites

1. **Node.js and dependencies installed**
   ```bash
   npm install
   ```

2. **Local PostgreSQL and MinIO running**
   ```bash
   docker-compose up -d
   ```

3. **Environment variables set**
   - Old Supabase credentials (for backup)
   - Old Cloudinary credentials (for backup)
   - New local PostgreSQL connection (in `.env`)
   - New MinIO configuration (in `.env`)

## Migration Process Overview

The migration process consists of 4 main steps:

1. **Backup Supabase Database** → Export data to JSON
2. **Backup Cloudinary Files** → Export file metadata and download files
3. **Migrate Database** → Import data to local PostgreSQL
4. **Migrate Files** → Upload files to MinIO and update URLs

## Step-by-Step Migration

### Step 1: Backup Supabase Database

Create a backup of your Supabase database:

```bash
# Set old database URL
export OLD_DATABASE_URL="postgresql://postgres.pzeofossaxrhjzbomofr:Lms123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Run backup script
tsx scripts/backup-supabase.ts
```

This will create:
- `backups/backup-{timestamp}.json` - Full database backup
- `backups/backup-summary-{timestamp}.json` - Summary of records

**Output:**
```
✓ Backed up User: 150 records
✓ Backed up Student: 120 records
✓ Backed up Teacher: 20 records
...
✓ Backup saved to: backups/backup-1234567890.json
```

### Step 2: Backup Cloudinary Files

Export file metadata and optionally download files:

```bash
# Set Cloudinary credentials (or use .env)
export CLOUDINARY_CLOUD_NAME="dbsdjfeby"
export CLOUDINARY_API_KEY="451429197878122"
export CLOUDINARY_API_SECRET="HHje4yAyBJZ8sDlh363Sde_8MUk"

# Run backup script
tsx scripts/backup-cloudinary.ts
```

This will create:
- `backups/cloudinary/cloudinary-metadata-{timestamp}.json` - File metadata
- `backups/cloudinary/files/` - Downloaded files (optional, can be large)

**Output:**
```
✓ Found 500 files in Cloudinary
✓ Metadata saved to: backups/cloudinary/cloudinary-metadata-1234567890.json
✓ Downloaded 500/500 files...
```

### Step 3: Prepare Local Database

Ensure your local database is set up:

```bash
# Run migrations
npm run db:migrate

# (Optional) If you want a fresh start
# npm run db:push -- --force-reset
```

### Step 4: Migrate Database

Import data from backup to local PostgreSQL:

```bash
# Replace with your actual backup file name
tsx scripts/migrate-database.ts backups/backup-1234567890.json
```

This will:
- Import all data respecting foreign key constraints
- Skip duplicate records
- Preserve all relationships

**Output:**
```
Migrating User...
  ✓ Migrated 150 records
Migrating AcademicYear...
  ✓ Migrated 5 records
...
✅ Database migration completed!
⚠️  Note: File URLs still point to Cloudinary.
```

### Step 5: Migrate Files to MinIO

Upload files to MinIO and update database URLs:

```bash
# Replace with your actual metadata file name
tsx scripts/migrate-files.ts backups/cloudinary/cloudinary-metadata-1234567890.json
```

This will:
- Download files from Cloudinary
- Upload to MinIO with proper folder structure
- Update all database URLs

**Output:**
```
[1/500] Migrating: lms/content/batch-123/file.pdf
  Downloading: lms/content/batch-123/file.pdf...
  ✓ Migrated to: http://localhost:9000/lms-storage/pdfs/content/batch-123/file.pdf

...

📊 Migration Summary:
  ✓ Successfully migrated: 495
  ❌ Failed: 5

✓ Updated 200 Content records
✓ Updated 50 Assignment records
✓ Updated 100 User profile images
```

## Troubleshooting

### Database Backup Issues

**Problem:** Connection timeout or authentication error

**Solution:**
- Verify your Supabase credentials
- Check network connectivity
- Try using `DIRECT_URL` instead of pooled connection:
  ```bash
  export OLD_DATABASE_URL="postgresql://postgres.pzeofossaxrhjzbomofr:Lms123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
  ```

### Cloudinary Backup Issues

**Problem:** API rate limits or missing files

**Solution:**
- The script handles rate limits with delays
- Check Cloudinary credentials
- Some files might be deleted - errors are logged

### Database Migration Issues

**Problem:** Foreign key constraint errors

**Solution:**
- The migration order is designed to respect constraints
- If issues persist, check the backup file for data integrity
- You can manually fix data and re-run migration (uses `skipDuplicates: true`)

**Problem:** Duplicate key errors

**Solution:**
- The script uses `skipDuplicates: true` to handle duplicates
- If you see duplicate errors, you may need to clean the database first:
  ```bash
  npm run db:push -- --force-reset
  ```

### File Migration Issues

**Problem:** Large files timing out

**Solution:**
- Increase timeout in the script if needed
- Migrate in batches by editing the metadata file
- Files that fail are logged in `backups/migration-errors-{timestamp}.json`

**Problem:** MinIO connection errors

**Solution:**
- Verify MinIO is running: `docker ps | grep minio`
- Check MinIO credentials in `.env`
- Verify MinIO console is accessible: http://localhost:9001

## Post-Migration Verification

After migration, verify your data:

### 1. Check Database Records

```bash
# Use Prisma Studio to browse data
npm run db:studio
```

### 2. Check File URLs

```sql
-- Check Content table
SELECT id, title, fileUrl FROM "Content" LIMIT 10;

-- Check Assignment table
SELECT id, title, fileUrl FROM "Assignment" WHERE fileUrl IS NOT NULL LIMIT 10;

-- Verify URLs point to MinIO
SELECT COUNT(*) FROM "Content" WHERE fileUrl LIKE '%localhost:9000%';
```

### 3. Test File Access

- Visit the MinIO console: http://localhost:9001
- Browse the `lms-storage` bucket
- Try downloading a few files to verify they're accessible

### 4. Test Application

```bash
npm run dev
```

- Log in and verify content loads
- Check if images display correctly
- Test PDF downloads
- Verify profile images work

## Rollback Plan

If you need to rollback:

1. **Database:** Use the backup JSON files to restore to Supabase
2. **Files:** Files remain in Cloudinary (we only downloaded/uploaded)
3. **Local Data:** Can be deleted:
   ```bash
   docker-compose down -v  # WARNING: Deletes all data
   ```

## Migration Checklist

- [ ] Backup Supabase database
- [ ] Backup Cloudinary files (metadata)
- [ ] Verify local PostgreSQL is running
- [ ] Verify local MinIO is running
- [ ] Run database migrations on local DB
- [ ] Import database backup
- [ ] Verify database records
- [ ] Migrate files to MinIO
- [ ] Verify file URLs updated
- [ ] Test application functionality
- [ ] Verify all images load
- [ ] Verify all PDFs are accessible
- [ ] Update application configuration
- [ ] Test user authentication
- [ ] Test file uploads
- [ ] Document any issues or manual fixes needed

## Notes

- **File URLs:** The migration updates URLs in the database. Old Cloudinary URLs in logs or external references won't be updated automatically.
- **Performance:** File migration can take a while depending on the number and size of files. Plan accordingly.
- **Storage:** Ensure you have enough disk space for downloaded files and MinIO storage.
- **Backup:** Keep your backup files safe until you've verified the migration is complete.

## Getting Help

If you encounter issues:

1. Check the error logs in `backups/migration-errors-{timestamp}.json`
2. Review the migration scripts for details
3. Check Docker logs: `docker logs lms-postgres` and `docker logs lms-minio`
4. Verify all environment variables are set correctly

## Quick Reference

```bash
# Full migration process
export OLD_DATABASE_URL="postgresql://..."
export CLOUDINARY_CLOUD_NAME="..."
export CLOUDINARY_API_KEY="..."
export CLOUDINARY_API_SECRET="..."

# Step 1: Backup database
tsx scripts/backup-supabase.ts

# Step 2: Backup files
tsx scripts/backup-cloudinary.ts

# Step 3: Migrate database
tsx scripts/migrate-database.ts backups/backup-*.json

# Step 4: Migrate files
tsx scripts/migrate-files.ts backups/cloudinary/cloudinary-metadata-*.json

# Step 5: Verify
npm run db:studio
npm run dev
```

