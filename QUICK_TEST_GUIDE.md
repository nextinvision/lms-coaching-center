# 🚀 Quick CI/CD Test Guide

## ✅ Ready to Test!

The CI/CD pipeline is set up and ready. Here are the fastest ways to test it:

---

## Method 1: Test Production Deployment (Easiest)

This doesn't require pushing code - you can test immediately:

1. **Go to GitHub Actions:**
   ```
   https://github.com/nextinvision/lms-coaching-center/actions
   ```

2. **Find "Production Deployment" workflow:**
   - Click on "Production Deployment" in the left sidebar
   - Or search for it in the workflow list

3. **Run the workflow:**
   - Click **"Run workflow"** button (top right)
   - Select branch: `main`
   - Optionally enter version: `1.0.0`
   - Click **"Run workflow"**

4. **Monitor the deployment:**
   - Watch the workflow progress
   - Check each step:
     - ✅ Validate Production Build
     - ✅ Deploy to Production
   - Look for green checkmarks ✅

5. **Verify on server:**
   ```bash
   # SSH to server
   ssh root@72.62.194.231
   
   # Check PM2 status
   pm2 status
   
   # Check logs
   pm2 logs lms-app --lines 50
   ```

---

## Method 2: Test PR Validation (Requires Push)

1. **Push the test branch:**
   ```bash
   # If you have git credentials configured
   git push -u origin test/cicd-pipeline-setup
   ```

2. **Create Pull Request:**
   - Go to: https://github.com/nextinvision/lms-coaching-center
   - Click "Pull requests" → "New pull request"
   - Base: `main` ← Compare: `test/cicd-pipeline-setup`
   - Click "Create pull request"

3. **Watch CI Run:**
   - The "PR Validation" workflow will start automatically
   - Check the "Checks" tab on the PR
   - Wait for all checks to complete

---

## Method 3: Test CI Workflow (Any Branch Push)

1. **Make a small change:**
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: Trigger CI workflow"
   git push origin test/cicd-pipeline-setup
   ```

2. **Check GitHub Actions:**
   - Go to Actions tab
   - You should see "CI - Development & Testing" workflow running

---

## ✅ What to Expect

### Successful Production Deployment:
- ✅ All validation checks pass
- ✅ SSH connection to server succeeds
- ✅ Code pulled and built successfully
- ✅ PM2 restarts application
- ✅ Health check passes
- ✅ Application accessible at https://digischooler.com

### Successful PR Validation:
- ✅ Lint & Type Check passes
- ✅ Tests run successfully
- ✅ Build succeeds
- ✅ All checks show green ✅

---

## 🔍 Quick Verification Commands

After deployment, verify on server:

```bash
# Check application is running
pm2 status

# View recent logs
pm2 logs lms-app --lines 50

# Check health
curl http://localhost:3000

# Run health check script
cd /root/lms-coaching-center
./scripts/deployment/health-check.sh
```

---

## 🐛 If Something Fails

1. **Check GitHub Actions Logs:**
   - Click on the failed workflow
   - Click on the failed job
   - Expand failed steps to see error messages

2. **Common Issues:**
   - **SSH Connection Failed:** Check GitHub Secrets (PROD_SSH_KEY, PROD_HOST, PROD_USERNAME)
   - **Tests Failed:** Check test logs, may need to fix tests
   - **Build Failed:** Check build logs, may be missing dependencies

3. **Check Server:**
   ```bash
   ssh root@72.62.194.231
   pm2 logs lms-app --err
   ```

---

## 📊 Expected Workflow Runs

After testing, you should see:

1. **PR Validation** - Runs on every PR
2. **CI - Development & Testing** - Runs on pushes
3. **Production Deployment** - Manual trigger or on main branch push
4. **Security Scan** - Runs daily or on PRs

---

## 🎯 Next Steps After Successful Test

1. ✅ Merge test branch to main (if tests pass)
2. ✅ Enable branch protection on main
3. ✅ Set up staging environment (optional)
4. ✅ Configure deployment notifications (optional)

---

**Ready to test! Start with Method 1 (Production Deployment) for the quickest test.** 🚀

