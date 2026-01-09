# Migration Quick Start

## Step 1: Save Old Credentials

```bash
tsx scripts/save-credentials.ts
```

This saves your old Supabase and Cloudinary credentials to `backups/old-credentials.json`.

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including temporary Cloudinary dependency for backups.

## Step 3: Start Local Services

```bash
docker-compose up -d
```

This starts PostgreSQL and MinIO locally.

## Step 4: Backup Database

```bash
npm run backup:supabase
# Or: tsx scripts/backup-supabase.ts
```

This creates a backup file in `backups/backup-{timestamp}.json`.

## Step 5: Backup Files

```bash
npm run backup:cloudinary
# Or: tsx scripts/backup-cloudinary.ts
```

This creates metadata file in `backups/cloudinary/cloudinary-metadata-{timestamp}.json`.

## Step 6: Setup Local Database

```bash
npm run db:migrate
```

## Step 7: Migrate Database

```bash
npm run migrate:database backups/backup-*.json
# Or: tsx scripts/migrate-database.ts backups/backup-1234567890.json
```

Replace `backup-*.json` with your actual backup file name.

## Step 8: Migrate Files

```bash
npm run migrate:files backups/cloudinary/cloudinary-metadata-*.json
# Or: tsx scripts/migrate-files.ts backups/cloudinary/cloudinary-metadata-1234567890.json
```

Replace `cloudinary-metadata-*.json` with your actual metadata file name.

## Step 9: Verify

```bash
# Start the app
npm run dev

# Check database
npm run db:studio
```

## All-in-One Script

You can also create a migration script:

```bash
#!/bin/bash
set -e

echo "Step 1: Saving credentials..."
tsx scripts/save-credentials.ts

echo "Step 2: Installing dependencies..."
npm install

echo "Step 3: Starting services..."
docker-compose up -d

echo "Waiting for services to be ready..."
sleep 10

echo "Step 4: Backing up database..."
npm run backup:supabase

echo "Step 5: Backing up files..."
npm run backup:cloudinary

echo "Step 6: Setting up local database..."
npm run db:migrate

echo "Step 7: Migrating database..."
BACKUP_FILE=$(ls -t backups/backup-*.json | head -1)
npm run migrate:database "$BACKUP_FILE"

echo "Step 8: Migrating files..."
METADATA_FILE=$(ls -t backups/cloudinary/cloudinary-metadata-*.json | head -1)
npm run migrate:files "$METADATA_FILE"

echo "✅ Migration completed!"
echo "Run 'npm run dev' to start the application"
```

Save this as `migrate.sh` and run: `chmod +x migrate.sh && ./migrate.sh`

