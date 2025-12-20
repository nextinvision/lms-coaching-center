# Deployment Guide

## Prerequisites

- Node.js 20.16.0 or higher
- PostgreSQL database (Supabase recommended)
- Cloudinary account for image storage
- Supabase account for database and file storage
- Vercel account (recommended) or Railway/Render for hosting

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
NEXTAUTH_SECRET="your-nextauth-secret"

# CSRF
CSRF_SECRET="your-csrf-secret-key"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## Deployment Steps

### 1. Database Setup

1. Create a Supabase project
2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Seed database (optional):
   ```bash
   npm run db:seed
   ```

### 2. Vercel Deployment (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

4. Add environment variables in Vercel dashboard

5. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Railway Deployment

1. Create a new Railway project
2. Connect your GitHub repository
3. Add environment variables
4. Railway will automatically detect Next.js and deploy

### 4. Custom Domain Setup

1. Add your domain in hosting provider dashboard
2. Configure DNS records:
   - A record pointing to hosting IP
   - CNAME for www subdomain
3. Enable SSL/HTTPS (automatic with Vercel)

## Post-Deployment

### 1. Verify Deployment

- Check all routes are accessible
- Test authentication flow
- Verify file uploads work
- Test API endpoints

### 2. Monitoring

- Set up error tracking (Sentry recommended)
- Configure uptime monitoring
- Set up analytics (Google Analytics or Plausible)

### 3. Backup Strategy

- Database: Supabase automatic backups
- Files: Cloudinary automatic backups
- Code: GitHub repository

### 4. Performance Optimization

- Enable CDN for static assets
- Configure caching headers
- Monitor Core Web Vitals
- Optimize images

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting

### Build Failures

- Check Node.js version compatibility
- Verify all environment variables are set
- Check Prisma schema is valid

### Runtime Errors

- Check database connection
- Verify API keys are correct
- Review error logs in hosting dashboard

### Performance Issues

- Enable caching
- Optimize database queries
- Use CDN for static assets
- Implement pagination

## Security Checklist

- [ ] All environment variables are set
- [ ] JWT_SECRET is strong and unique
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] CSRF protection is active
- [ ] File uploads are validated
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection (input sanitization)

## Support

For issues or questions:
- Check logs in hosting dashboard
- Review error tracking service
- Consult documentation
- Contact support team

