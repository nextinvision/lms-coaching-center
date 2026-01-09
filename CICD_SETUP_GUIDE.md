# CI/CD Pipeline Setup Guide

This guide explains how to set up and use the CI/CD pipelines for the LMS Coaching Center application.

## 📋 Overview

The CI/CD pipeline consists of 4 main workflows:

1. **PR Validation** - Runs on every pull request
2. **Development Deployment** - Auto-deploys to development server
3. **Production Deployment** - Manual deployment to production with approval
4. **Security Scan** - Daily security vulnerability scans

---

## 🔧 Prerequisites

### GitHub Repository Setup

1. Ensure your repository is on GitHub: `https://github.com/nextinvision/lms-coaching-center.git`
2. Ensure you have admin access to configure GitHub Actions and secrets

### Server Requirements

- SSH access to production/development servers
- Node.js 20+ installed
- PM2 installed and configured
- PostgreSQL and MinIO running (via Docker)
- Proper firewall configuration

---

## 🔐 GitHub Secrets Configuration

To enable automated deployments, you need to configure GitHub Secrets.

### Access GitHub Secrets

1. Go to your repository: `https://github.com/nextinvision/lms-coaching-center`
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret below

### Required Secrets for Production

#### Production Server Secrets

```
PROD_HOST          = 72.62.194.231
PROD_USERNAME      = root
PROD_SSH_KEY       = (Your SSH private key - see below)
PROD_SSH_PORT      = 22 (optional, defaults to 22)
PROD_DATABASE_URL  = postgresql://postgres:postgres@localhost:5432/lms_coaching_center?schema=public
```

#### Development Server Secrets (Optional)

```
DEV_HOST           = (Your dev server IP)
DEV_USERNAME       = root
DEV_SSH_KEY        = (Your SSH private key)
DEV_SSH_PORT       = 22
DEV_DATABASE_URL   = (Your dev database URL)
```

### How to Generate SSH Key for GitHub Actions

1. **On your local machine**, generate a new SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
   ```

2. **Add public key to your server:**
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@72.62.194.231
   ```
   
   Or manually:
   ```bash
   cat ~/.ssh/github_actions_deploy.pub | ssh root@72.62.194.231 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

3. **Add private key to GitHub Secrets:**
   ```bash
   cat ~/.ssh/github_actions_deploy
   ```
   Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)
   Paste it as the value for `PROD_SSH_KEY` in GitHub Secrets

4. **Test SSH connection:**
   ```bash
   ssh -i ~/.ssh/github_actions_deploy root@72.62.194.231
   ```

---

## 📝 Workflow Details

### 1. PR Validation Workflow

**Trigger:** Automatically on every pull request to `main` or `develop`

**What it does:**
- ✅ Checks out code
- ✅ Sets up Node.js 20
- ✅ Installs dependencies
- ✅ Runs ESLint
- ✅ Type checks with TypeScript
- ✅ Runs tests with Jest
- ✅ Builds the application
- ✅ Validates build output

**Status:** Must pass before PR can be merged (if branch protection is enabled)

**File:** `.github/workflows/pr-validation.yml`

---

### 2. Development Deployment Workflow

**Trigger:** Push to `develop` branch

**What it does:**
- ✅ Validates and builds the application
- ✅ Creates deployment package
- ✅ Transfers package to development server via SCP
- ✅ Runs deployment script on server
- ✅ Restarts application with PM2

**Configuration:**
- Requires `DEV_*` secrets to be configured
- Deploys to `/root/lms-coaching-center-dev` on dev server
- Runs with PM2 process name: `lms-app-dev`

**File:** `.github/workflows/development-deploy.yml`

---

### 3. Production Deployment Workflow

**Trigger:** 
- Manual trigger via GitHub Actions UI (recommended)
- Push to `main` branch (optional)
- Tag push (e.g., `v1.0.0`)

**What it does:**
- ✅ Runs full validation (tests, linting, type checking)
- ✅ Builds production application
- ✅ Creates backup of current deployment
- ✅ Transfers deployment package to production server
- ✅ Runs deployment script
- ✅ Verifies deployment with health check
- ✅ Creates deployment tag (if version specified)

**Configuration:**
- Requires approval (GitHub Environments feature)
- Requires `PROD_*` secrets to be configured
- Deploys to `/root/lms-coaching-center` on production server
- Runs with PM2 process name: `lms-app`

**Manual Deployment Steps:**

1. Go to **Actions** tab in GitHub
2. Select **Production Deployment** workflow
3. Click **Run workflow**
4. Choose branch (usually `main`)
5. Optionally enter version tag (e.g., `1.0.0`)
6. Optionally skip tests (not recommended)
7. Click **Run workflow**
8. Wait for validation to pass
9. Approve deployment (if environment protection is enabled)
10. Monitor deployment progress

**File:** `.github/workflows/production-deploy.yml`

---

### 4. Security Scan Workflow

**Trigger:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Daily at 2 AM UTC (scheduled)

**What it does:**
- ✅ Scans npm dependencies for vulnerabilities
- ✅ Scans code for security issues with Trivy
- ✅ Uploads results to GitHub Security tab

**File:** `.github/workflows/security-scan.yml`

---

## 🚀 Deployment Process

### Automatic Deployment (Development)

```bash
# 1. Create and push to develop branch
git checkout -b develop
git push origin develop

# 2. GitHub Actions automatically:
#    - Validates the code
#    - Builds the application
#    - Deploys to development server
```

### Manual Deployment (Production)

#### Option 1: Via GitHub Actions UI (Recommended)

1. **Navigate to Actions:**
   - Go to your repository on GitHub
   - Click on **Actions** tab
   - Select **Production Deployment** workflow

2. **Run workflow:**
   - Click **Run workflow**
   - Select branch: `main`
   - Enter version (optional): `1.0.0`
   - Click **Run workflow**

3. **Monitor progress:**
   - Watch the workflow run
   - Wait for validation to complete
   - Approve deployment (if required)
   - Verify deployment success

#### Option 2: Via Git Push to Main

```bash
# Push to main triggers deployment (if enabled)
git checkout main
git merge develop
git push origin main
```

#### Option 3: Via Git Tag

```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 🔄 Rollback Procedure

If a deployment fails or causes issues, you can rollback to a previous backup:

### On Production Server

```bash
cd /root/lms-coaching-center

# List available backups
ls -1t /root/lms-backups | head -5

# Rollback to specific backup
/root/lms-coaching-center/scripts/rollback.sh backup-20260109-120000
```

### Manual Rollback

```bash
cd /root/lms-coaching-center

# Stop application
pm2 stop lms-app

# Restore from backup
BACKUP_DIR="/root/lms-backups/backup-20260109-120000"
rm -rf .next
cp -r $BACKUP_DIR/.next .

# Restart application
pm2 restart lms-app
```

---

## 📊 Monitoring Deployments

### GitHub Actions

- View workflow runs: **Actions** tab in GitHub
- View logs: Click on any workflow run
- View deployment history: Click on **Environments** → **production**

### On Server

```bash
# Check application status
pm2 status

# View application logs
pm2 logs lms-app

# View recent deployments
ls -lht /root/lms-backups | head -10

# Check deployment info
cat /root/lms-coaching-center/DEPLOYMENT_INFO.txt
```

---

## 🔍 Troubleshooting

### Deployment Fails - SSH Connection Error

**Problem:** Cannot connect to server via SSH

**Solution:**
1. Verify SSH key is correctly added to GitHub Secrets
2. Test SSH connection manually: `ssh -i ~/.ssh/github_actions_deploy root@72.62.194.231`
3. Verify server IP address is correct
4. Check firewall allows SSH connections

### Deployment Fails - Build Error

**Problem:** Application build fails during deployment

**Solution:**
1. Check build logs in GitHub Actions
2. Run build locally: `npm run build`
3. Verify all dependencies are in `package.json`
4. Check for TypeScript errors: `npx tsc --noEmit`

### Deployment Fails - Application Not Starting

**Problem:** Deployment completes but application doesn't start

**Solution:**
1. SSH into server and check logs: `pm2 logs lms-app`
2. Verify environment variables in `.env` file
3. Check database connection: `docker ps | grep postgres`
4. Check MinIO connection: `docker ps | grep minio`
5. Manually restart: `pm2 restart lms-app`

### Tests Fail in CI/CD

**Problem:** Tests pass locally but fail in CI/CD

**Solution:**
1. Check test logs in GitHub Actions
2. Ensure test database URL is correct
3. Verify all test dependencies are installed
4. Run tests locally: `npm run test:ci`

---

## 🛡️ Branch Protection (Recommended)

To ensure code quality, enable branch protection for `main`:

1. Go to **Settings** → **Branches**
2. Add branch protection rule for `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require deployments to succeed before merging

---

## 📈 Best Practices

1. **Always test locally first:**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

2. **Use feature branches:**
   - Create feature branches from `develop`
   - Open PR to `develop` for testing
   - Merge to `main` only after thorough testing

3. **Monitor deployments:**
   - Check GitHub Actions after each deployment
   - Monitor application logs after deployment
   - Verify application is accessible

4. **Keep backups:**
   - Backups are automatically created before each deployment
   - Keep at least the last 5 backups
   - Test rollback procedure periodically

5. **Security:**
   - Keep SSH keys secure
   - Rotate SSH keys periodically
   - Review security scan reports regularly

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

## ✅ Setup Checklist

- [ ] GitHub repository is accessible
- [ ] SSH key pair generated
- [ ] SSH public key added to server
- [ ] SSH private key added to GitHub Secrets
- [ ] All required GitHub Secrets configured
- [ ] Branch protection enabled (recommended)
- [ ] Test PR validation workflow
- [ ] Test development deployment (if using)
- [ ] Test production deployment manually
- [ ] Verify rollback procedure works

---

**🎉 Your CI/CD pipeline is now ready!**

For questions or issues, check the troubleshooting section or review the workflow logs in GitHub Actions.


