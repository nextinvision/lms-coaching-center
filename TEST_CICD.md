# 🧪 CI/CD Pipeline Testing Guide

## ✅ Local Setup Complete

The CI/CD pipeline has been set up locally. The following files have been created and committed to the branch `test/cicd-pipeline-setup`:

### Created Files:
- ✅ 9 GitHub Actions workflow files
- ✅ 6 deployment scripts
- ✅ 5 documentation files

---

## 🚀 How to Test the CI/CD Pipeline

### Method 1: Push Branch and Create PR (Recommended)

1. **Push the test branch to GitHub:**
   ```bash
   # If using HTTPS, you'll need to authenticate
   git push -u origin test/cicd-pipeline-setup
   
   # Or use GitHub CLI if installed
   gh auth login
   git push -u origin test/cicd-pipeline-setup
   ```

2. **Create a Pull Request:**
   - Go to: https://github.com/nextinvision/lms-coaching-center
   - Click "Compare & pull request" for the new branch
   - Create PR to `main` or `develop`
   - **This will automatically trigger the PR Validation workflow**

3. **Check GitHub Actions:**
   - Go to **Actions** tab
   - You should see "PR Validation" workflow running
   - It will run:
     - Lint & Type Check
     - Run Tests
     - Build Application

### Method 2: Test Production Deployment Workflow

1. **Go to GitHub Actions:**
   - Navigate to: https://github.com/nextinvision/lms-coaching-center/actions

2. **Run Production Deployment:**
   - Click on "Production Deployment" workflow
   - Click "Run workflow" button (top right)
   - Select branch: `main`
   - Optionally enter a version tag
   - Click "Run workflow"

3. **Monitor the Deployment:**
   - Watch the workflow progress
   - Check each job:
     - Validate Production Build
     - Deploy to Production
   - Verify deployment succeeds

### Method 3: Push Directly to Main (Auto-trigger)

If you have push access and want to test auto-deployment:

```bash
# Switch to main branch
git checkout main

# Merge test branch (or commit changes)
git merge test/cicd-pipeline-setup

# Push to main (will trigger production deployment)
git push origin main
```

**Note:** This will trigger automatic deployment if configured.

---

## 🔍 What to Check

### PR Validation Workflow

When a PR is created, check:

1. **Lint & Type Check Job:**
   - ✅ ESLint passes
   - ✅ TypeScript compiles without errors
   - ✅ Code formatting check passes

2. **Test Job:**
   - ✅ PostgreSQL service starts
   - ✅ MinIO service starts (if configured)
   - ✅ Tests run successfully
   - ✅ Coverage reports generated

3. **Build Job:**
   - ✅ Next.js application builds
   - ✅ `.next` directory created
   - ✅ No build errors

### Production Deployment Workflow

When deployment runs, check:

1. **Validation Job:**
   - ✅ Tests pass
   - ✅ Build succeeds

2. **Deploy Job:**
   - ✅ SSH connection to server works
   - ✅ Code pulled successfully
   - ✅ Dependencies installed
   - ✅ Database migrations run
   - ✅ Application built
   - ✅ PM2 restarted
   - ✅ Health check passes

---

## 🐛 Troubleshooting

### Workflow Not Triggering

**Problem:** Workflows don't run when pushing

**Solutions:**
1. Verify workflows are in `.github/workflows/` directory
2. Check workflow file syntax (must be valid YAML)
3. Ensure workflow is committed and pushed
4. Check GitHub Actions is enabled: Settings → Actions → General

### Tests Fail in CI

**Problem:** Tests pass locally but fail in CI

**Solutions:**
1. Check test logs in GitHub Actions
2. Verify environment variables in workflow
3. Ensure test database URL is correct
4. Check for missing dependencies

### SSH Connection Fails

**Problem:** Deployment fails with SSH error

**Solutions:**
1. Verify GitHub Secrets are configured correctly
2. Check `PROD_SSH_KEY` includes BEGIN/END lines
3. Verify `PROD_HOST` and `PROD_USERNAME` are correct
4. Test SSH connection manually:
   ```bash
   ssh -i ~/.ssh/github_actions_deploy root@72.62.194.231
   ```

### Build Fails

**Problem:** Build fails in CI/CD but works locally

**Solutions:**
1. Check build logs in GitHub Actions
2. Verify Node.js version matches (should be 20)
3. Check for missing environment variables
4. Verify all dependencies in `package.json`

---

## ✅ Success Criteria

The CI/CD pipeline is working correctly if:

- ✅ PR Validation workflow runs automatically on PR creation
- ✅ All tests pass
- ✅ Build succeeds
- ✅ Production deployment workflow can be triggered manually
- ✅ Deployment completes successfully
- ✅ Application is accessible after deployment

---

## 📊 Monitoring

### GitHub Actions Dashboard

- View all workflow runs: https://github.com/nextinvision/lms-coaching-center/actions
- View specific workflow: Actions → Select workflow name
- View job logs: Click on workflow run → Click on job name

### Server Monitoring

After deployment, check:
```bash
# Application status
pm2 status

# Application logs
pm2 logs lms-app

# Health check
./scripts/deployment/health-check.sh
```

---

## 🎯 Next Steps After Testing

1. **Merge Test Branch:**
   - If all tests pass, merge `test/cicd-pipeline-setup` to `main`

2. **Enable Branch Protection:**
   - Go to Settings → Branches
   - Add protection rule for `main`
   - Require status checks to pass

3. **Set Up Staging Environment:**
   - Configure staging server secrets (if using)
   - Test staging deployment workflow

4. **Monitor First Production Deployment:**
   - Watch logs carefully
   - Verify all services are running
   - Test critical application features

---

## 📚 Additional Resources

- [CI/CD Setup Guide](./CI_CD_SETUP.md)
- [GitHub Secrets Setup](./GITHUB_SECRETS_SETUP.md)
- [Deployment Scripts Documentation](./scripts/deployment/README.md)

---

**Ready to test!** 🚀

Once you push the branch or create a PR, the CI/CD pipeline will automatically run.

