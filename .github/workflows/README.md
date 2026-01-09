# GitHub Actions Workflows

This directory contains CI/CD workflows for the LMS Coaching Center application.

## Available Workflows

### 1. `pr-validation.yml`
- **Purpose:** Validates pull requests before merging
- **Triggers:** Pull requests to `main` or `develop`
- **Jobs:**
  - Lint and type check
  - Run tests with PostgreSQL and MinIO services
  - Build application

### 2. `ci.yml`
- **Purpose:** Continuous Integration for all branches
- **Triggers:** Pushes to `main`, `develop`, or `feature/**`
- **Jobs:**
  - Lint & Type Check
  - Run Tests
  - Build Application

### 3. `deploy-production.yml`
- **Purpose:** Production deployment (legacy - use production-deploy.yml instead)
- **Triggers:** Push to `main` or manual dispatch
- **Jobs:**
  - Pre-deployment checks
  - Deploy to production server
  - Verify deployment

### 4. `production-deploy.yml`
- **Purpose:** Production deployment with full validation
- **Triggers:** Manual dispatch or push to `main` branch
- **Jobs:**
  - Validate production build
  - Deploy to production
  - Create deployment tag
  - Notify deployment status

### 5. `deploy-staging.yml`
- **Purpose:** Staging environment deployment
- **Triggers:** Push to `develop` branch or manual dispatch
- **Jobs:**
  - Deploy to staging server

### 6. `development-deploy.yml`
- **Purpose:** Development environment deployment
- **Triggers:** Push to `develop` or `feature/**` branches
- **Jobs:**
  - Build and deploy to development server

### 7. `security-scan.yml`
- **Purpose:** Security vulnerability scanning
- **Triggers:** Push to `main`/`develop`, PRs, or daily schedule
- **Jobs:**
  - Dependency vulnerability scan (npm audit)
  - Code security scan (Trivy)

### 8. `codeql-analysis.yml`
- **Purpose:** CodeQL security analysis
- **Triggers:** Push to `main`/`develop`, PRs, or weekly schedule
- **Jobs:**
  - Analyze JavaScript/TypeScript code for security issues

## Required Secrets

### Production Deployment
- `PROD_HOST` - Production server IP
- `PROD_USERNAME` - SSH username
- `PROD_SSH_KEY` - SSH private key
- `PROD_SSH_PORT` - SSH port (optional, default: 22)
- `PROD_DATABASE_URL` - Production database URL

### Staging/Development Deployment (Optional)
- `DEV_HOST` - Development server IP
- `DEV_USERNAME` - SSH username
- `DEV_SSH_KEY` - SSH private key
- `DEV_SSH_PORT` - SSH port (optional)

### Legacy (for deploy-production.yml)
- `SSH_PRIVATE_KEY` - SSH private key
- `PRODUCTION_HOST` - Production server IP
- `PRODUCTION_USER` - SSH username
- `STAGING_HOST` - Staging server IP (optional)
- `STAGING_USER` - Staging username (optional)

## Workflow Execution

All workflows can be triggered manually from the GitHub Actions tab:
1. Go to **Actions** tab in your repository
2. Select the workflow you want to run
3. Click **Run workflow**
4. Select branch and options
5. Click **Run workflow**

## Monitoring

- View workflow runs: Repository → Actions tab
- View workflow logs: Click on any workflow run
- View deployment history: Environments → production

