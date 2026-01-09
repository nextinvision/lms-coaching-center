# CI/CD Pipeline Setup Guide

This document provides comprehensive instructions for setting up and using the CI/CD pipeline for the LMS Coaching Center application.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pipeline Architecture](#pipeline-architecture)
3. [GitHub Actions Workflows](#github-actions-workflows)
4. [Setting Up GitHub Secrets](#setting-up-github-secrets)
5. [Branch Strategy](#branch-strategy)
6. [Local Deployment Scripts](#local-deployment-scripts)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The CI/CD pipeline automates:
- **Testing**: Linting, type checking, and unit/integration tests
- **Building**: Next.js application builds
- **Deployment**: Automated deployment to production and staging environments
- **Monitoring**: Health checks and deployment verification

### Key Features

✅ **Automated Testing** on every PR and push  
✅ **Automatic Deployment** to production on main branch  
✅ **Staging Environment** for testing before production  
✅ **Rollback Capability** via backup system  
✅ **Health Checks** and monitoring  
✅ **Zero-Downtime Deployment** using PM2  

---

## 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Feature Branch / PR             │
        │   → CI Workflow                   │
        │   • Lint & Type Check             │
        │   • Run Tests                     │
        │   • Build Application             │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Develop Branch                  │
        │   → Deploy to Staging             │
        │   • Automated Staging Deployment  │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Main Branch                     │
        │   → Deploy to Production          │
        │   • Pre-deployment Checks         │
        │   • Automated Production Deploy   │
        │   • Health Check & Verification   │
        └───────────────────────────────────┘
                            │
                            ▼
                   Production Server
                   (digischooler.com)
```

---

## 🔄 GitHub Actions Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Pull requests to `main` or `develop`
- Pushes to `main`, `develop`, or `feature/**` branches
- Manual workflow dispatch

**Jobs:**
1. **Lint & Type Check**
   - Runs ESLint
   - Checks code formatting
   - TypeScript type checking

2. **Test**
   - Sets up PostgreSQL and MinIO services
   - Runs test suite with coverage
   - Uploads coverage reports to Codecov

3. **Build**
   - Builds Next.js application
   - Verifies build artifacts

### 2. Production Deployment (`.github/workflows/deploy-production.yml`)

**Triggers:**
- Pushes to `main` branch
- Manual workflow dispatch (with option to skip tests)

**Jobs:**
1. **Pre-Deployment Checks**
   - Runs linting (optional skip)
   - Type checking (optional skip)
   - Runs tests (optional skip)

2. **Deploy**
   - Connects to production server via SSH
   - Pulls latest code
   - Runs migrations
   - Builds application
   - Restarts PM2 process
   - Creates deployment tag

3. **Verify Deployment**
   - Health check on production URL
   - Verifies HTTP response

4. **Notify**
   - Deployment status summary

### 3. Staging Deployment (`.github/workflows/deploy-staging.yml`)

**Triggers:**
- Pushes to `develop` branch
- Manual workflow dispatch

**Jobs:**
- Deploys to staging environment
- Same process as production (without pre-checks)

---

## 🔐 Setting Up GitHub Secrets

To enable automated deployment, configure the following secrets in your GitHub repository:

### Step 1: Generate SSH Key Pair

On your local machine or CI server:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Don't set a passphrase (or CI won't be able to use it)
# This will create:
# - ~/.ssh/github_actions_deploy (private key)
# - ~/.ssh/github_actions_deploy.pub (public key)
```

### Step 2: Add Public Key to Production Server

```bash
# On production server (72.62.194.231)
# Add the public key to authorized_keys
cat github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 3: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `SSH_PRIVATE_KEY` | SSH private key content | Content of `~/.ssh/github_actions_deploy` |
| `PRODUCTION_HOST` | Production server IP or hostname | `72.62.194.231` or `digischooler.com` |
| `PRODUCTION_USER` | SSH username for production | `root` |
| `STAGING_HOST` | Staging server IP (if different) | `staging.example.com` |
| `STAGING_USER` | SSH username for staging | `root` |

**To get SSH private key content:**
```bash
cat ~/.ssh/github_actions_deploy
# Copy the entire output including -----BEGIN and -----END lines
```

### Step 4: Verify SSH Connection

Test the connection from your local machine:

```bash
ssh -i ~/.ssh/github_actions_deploy root@72.62.194.231
```

---

## 🌿 Branch Strategy

### Recommended Workflow

```
main (production)
  ↑
  └── develop (staging)
        ↑
        └── feature/your-feature-name
```

### Branch Rules

1. **`main`** branch
   - Protected branch (recommended)
   - Requires PR approval
   - Runs full CI/CD pipeline
   - Auto-deploys to production

2. **`develop`** branch
   - Development/staging branch
   - Runs CI checks
   - Auto-deploys to staging

3. **`feature/**` branches
   - Feature development
   - Runs CI checks
   - No automatic deployment

### Pull Request Process

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit
3. Push to GitHub: `git push origin feature/new-feature`
4. Create Pull Request to `develop` or `main`
5. CI pipeline runs automatically
6. Review and merge after CI passes
7. Automatic deployment (if merged to `main` or `develop`)

---

## 🛠️ Local Deployment Scripts

Manual deployment scripts are available for use on the server:

### Deploy Script

```bash
# Run deployment manually
cd /root/lms-coaching-center
./scripts/deployment/deploy.sh
```

**What it does:**
- Creates backup (database + .env)
- Pulls latest code
- Installs dependencies
- Runs migrations
- Builds application
- Restarts PM2
- Health check

### Rollback Script

```bash
# List available backups
./scripts/deployment/rollback.sh list

# Rollback to specific backup
./scripts/deployment/rollback.sh 20240109-123456
```

### Health Check Script

```bash
# Check all services status
./scripts/deployment/health-check.sh
```

**Checks:**
- PM2 application status
- PostgreSQL database
- MinIO storage
- Nginx web server
- HTTP endpoints
- SSL certificate status
- System resources

---

## 🔍 Monitoring & Logs

### View GitHub Actions Logs

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select the workflow run
4. View job logs

### View Application Logs

```bash
# PM2 logs
pm2 logs lms-app

# PM2 logs with lines limit
pm2 logs lms-app --lines 100

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Deployment logs
tail -f /var/log/lms-deployment.log
```

### Monitor Application Status

```bash
# PM2 monitoring
pm2 monit

# PM2 status
pm2 status

# Health check
./scripts/deployment/health-check.sh
```

---

## 🐛 Troubleshooting

### CI Pipeline Failures

**Linting errors:**
```bash
# Fix locally
npm run lint:fix
```

**Test failures:**
```bash
# Run tests locally
npm run test:ci

# Run specific test
npm test -- path/to/test.test.ts
```

**Build failures:**
```bash
# Build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Deployment Failures

**SSH connection issues:**
- Verify SSH keys are correctly configured
- Check firewall allows SSH connections
- Test SSH connection manually

**Application not starting:**
```bash
# Check PM2 logs
pm2 logs lms-app --err

# Check environment variables
cat .env

# Restart manually
pm2 restart lms-app --update-env
```

**Database migration failures:**
```bash
# Check migration status
npx prisma migrate status

# Run migrations manually
npx prisma migrate deploy

# Check database connection
docker exec lms-postgres pg_isready -U postgres
```

**Build failures on server:**
```bash
# Check Node.js version
node -v  # Should be 20.x

# Clear cache and rebuild
rm -rf node_modules .next
npm ci --legacy-peer-deps
npm run build
```

### Health Check Failures

If health check fails after deployment:

```bash
# Check application is running
pm2 status

# Check if port 3000 is accessible
curl http://localhost:3000

# Check Nginx configuration
nginx -t

# Check Nginx is proxying correctly
curl -I https://digischooler.com
```

---

## 📊 Best Practices

### Development

1. **Always run tests locally** before pushing
2. **Follow branch naming conventions** (`feature/`, `bugfix/`, `hotfix/`)
3. **Write meaningful commit messages**
4. **Keep PRs small and focused**
5. **Ensure CI passes before merging**

### Deployment

1. **Deploy during low-traffic hours** (when possible)
2. **Monitor logs after deployment**
3. **Test critical features after deployment**
4. **Keep backups before major deployments**
5. **Have a rollback plan ready**

### Security

1. **Never commit secrets** to repository
2. **Use environment variables** for configuration
3. **Rotate SSH keys** periodically
4. **Review GitHub Actions logs** regularly
5. **Keep dependencies updated**

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check server logs (`pm2 logs`, Nginx logs)
4. Run health check script
5. Check deployment script output

---

**Last Updated:** January 2026  
**Maintained by:** DevOps Team


