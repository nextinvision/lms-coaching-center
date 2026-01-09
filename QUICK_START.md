# Quick Start Guide

## Prerequisites
- Docker and Docker Compose installed
- Node.js 20.16.0+ installed

## Steps to Get Started

### 1. Start Services
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- MinIO on `localhost:9000` (API) and `localhost:9001` (Console)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

The `.env` file is pre-configured for local development.

### 4. Setup Database
```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Application
```bash
npm run dev
```

Visit: http://localhost:3000

### 6. Access MinIO Console
- URL: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

## Troubleshooting

**MinIO not accessible?**
```bash
docker logs lms-minio
```

**PostgreSQL connection issues?**
```bash
docker logs lms-postgres
```

**Need to reset everything?**
```bash
docker-compose down -v
docker-compose up -d
npm run db:migrate
npm run db:seed
```

## Next Steps
- See [SETUP.md](./SETUP.md) for detailed setup
- See [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) for migration details

