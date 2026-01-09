# Migration Notes: From Supabase/Cloudinary to Local PostgreSQL/MinIO

This document outlines the changes made to migrate from Supabase/Cloudinary to local PostgreSQL and MinIO.

## Changes Made

### 1. Dependencies

**Removed:**
- `@supabase/supabase-js` - Supabase client
- `cloudinary` - Cloudinary SDK
- `next-cloudinary` - Next.js Cloudinary integration

**Added:**
- `minio` - MinIO client for S3-compatible storage

### 2. Storage Service

**Created:**
- `/src/core/storage/minio.ts` - New MinIO storage service replacing both Supabase and Cloudinary storage

**Updated:**
- `/src/core/storage/fileUpload.ts` - Now uses MinIO instead of Cloudinary
- `/src/core/storage/fileDownload.ts` - Now uses MinIO instead of Supabase

### 3. API Routes

**Updated Routes:**
- `/src/app/api/content/upload/pdf/route.ts`
- `/src/app/api/content/upload/image/route.ts`
- `/src/app/api/content/upload/video/route.ts`
- `/src/app/api/settings/profile/upload-image/route.ts`

All routes now use `minioStorage` instead of `cloudinaryStorage`.

### 4. Configuration Files

**Updated:**
- `package.json` - Removed Supabase/Cloudinary dependencies, added MinIO
- `prisma/schema.prisma` - Removed `directUrl` requirement, updated comments
- `next.config.ts` - Updated image remote patterns for MinIO
- `.env.example` - Updated with MinIO configuration (created)

**Created:**
- `docker-compose.yml` - Local setup for PostgreSQL and MinIO
- `SETUP.md` - Comprehensive local setup guide

### 5. Legacy Support

**Updated:**
- `/lib/cloudinary.ts` - Now provides backward compatibility by using MinIO internally

### 6. Utilities

**Updated:**
- `/src/shared/utils/imageOptimization.ts` - Simplified to work with MinIO URLs

## Environment Variables

### Old (Supabase/Cloudinary)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
DIRECT_URL=...
```

### New (Local PostgreSQL/MinIO)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lms_coaching_center
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=lms-storage
MINIO_PUBLIC_URL=http://localhost:9000
```

## File Storage Structure

### MinIO Bucket Organization

Files are organized as follows in the `lms-storage` bucket:

```
lms-storage/
├── images/
│   ├── content/
│   │   └── batch-{batchId}/
│   │       └── subject-{subjectId}/
│   └── profiles/
│       └── user-{userId}/
├── pdfs/
│   └── content/
│       └── batch-{batchId}/
│           └── subject-{subjectId}/
│               └── chapter-{chapter}/
└── videos/
    └── content/
        └── batch-{batchId}/
            └── subject-{subjectId}/
```

## Breaking Changes

1. **Image Optimization**: Image optimization URLs no longer use Cloudinary transformations. Images are served directly from MinIO. This can be enhanced later with an image processing service.

2. **Public IDs**: The `publicId` field in API responses now contains the MinIO object path instead of Cloudinary public ID.

3. **Thumbnails**: Thumbnail generation is simplified - currently returns the same URL as the main image. This can be enhanced to generate actual thumbnails later.

## Migration Steps for Existing Data

If you have existing data in Supabase/Cloudinary:

1. **Database Migration**: Export your PostgreSQL data from Supabase and import it into your local database.

2. **File Migration**: Download all files from Cloudinary/Supabase and upload them to MinIO maintaining the same path structure.

3. **URL Updates**: Update all `fileUrl` fields in the database to point to the new MinIO URLs.

## Testing

After migration, test the following:

1. ✅ File uploads (PDF, Image, Video)
2. ✅ File downloads
3. ✅ Image display in UI
4. ✅ PDF viewing
5. ✅ Video playback
6. ✅ Profile image uploads
7. ✅ File deletion

## Next Steps

### Potential Enhancements

1. **Image Processing**: Integrate with an image processing service (e.g., Sharp) for on-the-fly image optimization and thumbnail generation.

2. **CDN Integration**: Use MinIO with a CDN for better performance in production.

3. **Backup Strategy**: Implement automated backups for MinIO data.

4. **Migration Scripts**: Create automated scripts to migrate existing data from Supabase/Cloudinary if needed.

## Support

For issues or questions:
- Check [SETUP.md](./SETUP.md) for local development setup
- Review [README.md](./README.md) for general information
- Open an issue in the repository

