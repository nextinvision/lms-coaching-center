# Local Development Setup Guide

This guide will help you set up the LMS Coaching Center project for local development using PostgreSQL and MinIO.

## Prerequisites

- Node.js 20.16.0 or higher
- Docker and Docker Compose (for running PostgreSQL and MinIO)
- npm or yarn package manager

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lms-coaching-center
```

### 2. Start PostgreSQL and MinIO with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- MinIO on port 9000 (API) and 9001 (Console)

### 3. Access MinIO Console

Open your browser and navigate to:
- URL: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

The bucket `lms-storage` will be automatically created when you first upload a file. The MinIO storage service handles this automatically.

### 4. Install Dependencies

```bash
npm install
```

### 5. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file is already configured for local development. If needed, adjust the values:

- `DATABASE_URL`: PostgreSQL connection string
- `MINIO_*`: MinIO configuration (default values should work with docker-compose setup)

### 6. Set Up Database

Run Prisma migrations to create the database schema:

```bash
npm run db:migrate
```

### 7. Seed the Database (Optional)

Populate the database with initial data:

```bash
npm run db:seed
```

### 8. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/lms_coaching_center` |
| `MINIO_ENDPOINT` | MinIO server endpoint | `localhost` |
| `MINIO_PORT` | MinIO server port | `9000` |
| `MINIO_USE_SSL` | Use SSL for MinIO | `false` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `MINIO_BUCKET_NAME` | MinIO bucket name | `lms-storage` |
| `MINIO_PUBLIC_URL` | Public URL for MinIO | `http://localhost:9000` |
| `JWT_SECRET` | JWT secret key | (generated) |
| `NEXTAUTH_SECRET` | NextAuth secret | (generated) |

## File Storage Structure

Files are organized in MinIO as follows:

- **Images**: `images/{folder}/{timestamp}-{filename}`
- **PDFs**: `pdfs/{folder}/{timestamp}-{filename}`
- **Videos**: `videos/{folder}/{timestamp}-{filename}`
- **Profile Images**: `images/profiles/user-{userId}/{timestamp}-{filename}`

## Troubleshooting

### MinIO Connection Issues

If you're having trouble connecting to MinIO:

1. Check if MinIO is running: `docker ps | grep minio`
2. Verify the MinIO endpoint and port in `.env`
3. Check MinIO logs: `docker logs lms-minio`

### PostgreSQL Connection Issues

If you're having trouble connecting to PostgreSQL:

1. Check if PostgreSQL is running: `docker ps | grep postgres`
2. Verify the DATABASE_URL in `.env`
3. Check PostgreSQL logs: `docker logs lms-postgres`

### Database Migration Issues

If migrations fail:

1. Make sure PostgreSQL is running
2. Check if the database exists: `docker exec -it lms-postgres psql -U postgres -l`
3. Reset the database if needed: `npm run db:push -- --force-reset`

## Production Deployment

For production deployment:

1. Use a managed PostgreSQL service (AWS RDS, DigitalOcean, etc.)
2. Use a managed MinIO service or deploy MinIO in a production environment
3. Update environment variables with production values
4. Set `NODE_ENV=production`
5. Use secure, randomly generated secrets for `JWT_SECRET` and `NEXTAUTH_SECRET`
6. Enable SSL for MinIO (`MINIO_USE_SSL=true`)

## Stopping Services

To stop PostgreSQL and MinIO:

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

**Warning**: This will delete all database and file storage data!

