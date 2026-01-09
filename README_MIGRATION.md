# Data Migration Setup Complete ✅

Your project has been configured with comprehensive backup and migration scripts to move your data from Supabase/Cloudinary to local PostgreSQL/MinIO.

## 📋 What's Been Created

### Backup Scripts
1. **`scripts/save-credentials.ts`** - Saves old credentials securely
2. **`scripts/backup-supabase.ts`** - Exports database from Supabase to JSON
3. **`scripts/backup-cloudinary.ts`** - Exports file metadata from Cloudinary

### Migration Scripts
4. **`scripts/migrate-database.ts`** - Imports data to local PostgreSQL
5. **`scripts/migrate-files.ts`** - Uploads files to MinIO and updates URLs

### Documentation
6. **`DATA_MIGRATION_GUIDE.md`** - Comprehensive migration guide
7. **`MIGRATION_QUICK_START.md`** - Quick start guide
8. **`MIGRATION_NOTES.md`** - Technical migration details

### Configuration
9. **`docker-compose.yml`** - Local PostgreSQL and MinIO setup
10. **`.env.example`** - Environment configuration template
11. **`.gitignore`** - Updated to exclude backup files

## 🚀 Quick Start

### 1. First Time Setup

```bash
# Save your old credentials
tsx scripts/save-credentials.ts

# Install dependencies (includes temporary Cloudinary for backups)
npm install

# Start local services
docker-compose up -d
```

### 2. Run Migration

```bash
# Step 1: Backup database
npm run backup:supabase

# Step 2: Backup files  
npm run backup:cloudinary

# Step 3: Setup local database
npm run db:migrate

# Step 4: Migrate database (replace with actual filename)
npm run migrate:database backups/backup-*.json

# Step 5: Migrate files (replace with actual filename)
npm run migrate:files backups/cloudinary/cloudinary-metadata-*.json
```

### 3. Verify

```bash
# Start the application
npm run dev

# Check database with Prisma Studio
npm run db:studio
```

## 📁 File Structure

```
lms-coaching-center/
├── scripts/
│   ├── save-credentials.ts      # Save old credentials
│   ├── backup-supabase.ts       # Backup database
│   ├── backup-cloudinary.ts     # Backup files
│   ├── migrate-database.ts      # Import database
│   └── migrate-files.ts         # Import files
├── backups/                      # Backup files (gitignored)
│   ├── old-credentials.json     # Saved credentials
│   ├── backup-*.json            # Database backups
│   └── cloudinary/              # File backups
├── DATA_MIGRATION_GUIDE.md      # Full migration guide
├── MIGRATION_QUICK_START.md     # Quick reference
└── MIGRATION_NOTES.md           # Technical details
```

## 🔐 Your Old Credentials (Saved)

Your old credentials have been hardcoded into `scripts/save-credentials.ts`:

- **Supabase Database**: `postgres.pzeofossaxrhjzbomofr@aws-1-ap-south-1`
- **Cloudinary**: `dbsdjfeby`

When you run `save-credentials.ts`, these will be saved to `backups/old-credentials.json`.

## ⚠️ Important Notes

1. **Backup Files**: All backup files are in `backups/` directory and are gitignored (contains sensitive data)

2. **Temporary Dependencies**: 
   - `cloudinary` and `@supabase/supabase-js` are added as devDependencies for backup scripts only
   - You can remove them after migration is complete

3. **Database URLs**: 
   - Migration preserves all relationships and foreign keys
   - File URLs are automatically updated to MinIO

4. **File Migration**:
   - Files are downloaded from Cloudinary and uploaded to MinIO
   - Original Cloudinary files are NOT deleted
   - Database URLs are updated automatically

## 🆘 Troubleshooting

### Scripts don't run
```bash
npm install  # Install dependencies first
```

### Can't connect to Supabase
- Check network connectivity
- Verify credentials in `backups/old-credentials.json`
- Try using DIRECT_URL instead of pooled connection

### MinIO connection errors
```bash
docker ps | grep minio  # Check if MinIO is running
docker logs lms-minio   # Check MinIO logs
```

### Database migration errors
- Check if local PostgreSQL is running: `docker ps | grep postgres`
- Verify `.env` file has correct DATABASE_URL
- Try: `npm run db:push -- --force-reset` (WARNING: deletes data)

## 📚 Next Steps

1. **Read the full guide**: See `DATA_MIGRATION_GUIDE.md` for detailed instructions
2. **Start migration**: Follow `MIGRATION_QUICK_START.md` for step-by-step process
3. **Verify data**: Use Prisma Studio to verify migrated data
4. **Test application**: Run `npm run dev` and test all features

## ✅ Checklist

- [ ] Run `save-credentials.ts` to save old credentials
- [ ] Install dependencies: `npm install`
- [ ] Start local services: `docker-compose up -d`
- [ ] Backup Supabase database
- [ ] Backup Cloudinary files
- [ ] Setup local database: `npm run db:migrate`
- [ ] Migrate database data
- [ ] Migrate files to MinIO
- [ ] Verify data in Prisma Studio
- [ ] Test application: `npm run dev`
- [ ] Verify all images/PDFs load correctly
- [ ] Test file uploads
- [ ] Clean up: Remove old credentials after migration complete

## 🎯 Support

For detailed information:
- **Setup**: See `SETUP.md`
- **Migration**: See `DATA_MIGRATION_GUIDE.md`
- **Quick Start**: See `MIGRATION_QUICK_START.md`
- **Technical Details**: See `MIGRATION_NOTES.md`

---

**Ready to migrate?** Start with `MIGRATION_QUICK_START.md`!

