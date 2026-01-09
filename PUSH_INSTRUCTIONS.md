# 🚀 How to Push CI/CD Workflows to GitHub

## Current Situation

- ✅ You're in the correct directory: `/root/lms-coaching-center`
- ✅ You're on the test branch: `test/cicd-pipeline-setup`
- ✅ CI/CD workflows are committed locally
- ❌ Push failed due to authentication

---

## 🔐 Option 1: Use GitHub Personal Access Token (Easiest)

1. **Create a Personal Access Token on GitHub:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name: "CI/CD Push Token"
   - Select scopes: `repo` (full control)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using the token:**
   ```bash
   cd /root/lms-coaching-center
   git push -u origin test/cicd-pipeline-setup
   ```
   
   When prompted:
   - Username: `your-github-username`
   - Password: `paste-your-token-here` (NOT your GitHub password!)

3. **Or embed token in URL (one-time):**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/nextinvision/lms-coaching-center.git
   git push -u origin test/cicd-pipeline-setup
   ```
   Replace `YOUR_TOKEN` with your actual token.

---

## 🔑 Option 2: Switch to SSH Remote (Recommended for Future)

1. **Check if you have SSH key:**
   ```bash
   ls -la ~/.ssh/id_*.pub
   ```

2. **If no SSH key, generate one:**
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   # Press Enter for default location
   # Press Enter for no passphrase (or set one)
   ```

3. **Add SSH key to GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key
   - Save

4. **Change remote to SSH:**
   ```bash
   cd /root/lms-coaching-center
   git remote set-url origin git@github.com:nextinvision/lms-coaching-center.git
   git push -u origin test/cicd-pipeline-setup
   ```

---

## 🌐 Option 3: Use GitHub UI (No Command Line)

If authentication is difficult, you can add files via GitHub web interface:

1. **Go to GitHub:**
   https://github.com/nextinvision/lms-coaching-center

2. **Create the test branch:**
   - Click "main" branch dropdown
   - Type: `test/cicd-pipeline-setup`
   - Click "Create branch: test/cicd-pipeline-setup from 'main'"

3. **Add workflow files:**
   - Go to: https://github.com/nextinvision/lms-coaching-center/tree/test/cicd-pipeline-setup
   - Navigate to `.github/workflows/` folder
   - Click "Add file" → "Create new file"
   - Copy content from your local files:
     - `production-deploy.yml`
     - `pr-validation.yml`
     - `security-scan.yml`
     - etc.

4. **Or upload all files at once:**
   - Use GitHub Desktop
   - Or use `gh` CLI if installed

---

## 📤 Option 4: Use GitHub CLI (If Installed)

```bash
# Install GitHub CLI (if not installed)
# Ubuntu/Debian:
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Authenticate
gh auth login

# Push
cd /root/lms-coaching-center
git push -u origin test/cicd-pipeline-setup
```

---

## ✅ After Successful Push

Once pushed, you can:

1. **Create Pull Request:**
   - Go to: https://github.com/nextinvision/lms-coaching-center
   - Click "Pull requests" → "New pull request"
   - Base: `main` ← Compare: `test/cicd-pipeline-setup`
   - Create PR

2. **Verify Workflows Appear:**
   - Go to: https://github.com/nextinvision/lms-coaching-center/actions
   - You should see "PR Validation" running on the PR

3. **Merge PR:**
   - After CI passes, merge the PR
   - This adds all workflows to `main` branch

4. **Test Production Deployment:**
   - Go to Actions → "Production Deployment"
   - Click "Run workflow"
   - Select `main` branch and run

---

## 🎯 Quick Recommendation

**Fastest way right now:**
1. Create Personal Access Token on GitHub
2. Run: `git push -u origin test/cicd-pipeline-setup`
3. Use token as password when prompted

**Or:**
Use GitHub UI to manually add the workflow files (Option 3)

---

## 📝 Files That Need to Be Pushed

These are the new CI/CD files:
- `.github/workflows/pr-validation.yml`
- `.github/workflows/production-deploy.yml`
- `.github/workflows/development-deploy.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/security-scan.yml`
- `.github/workflows/codeql-analysis.yml`
- `.github/workflows/README.md`
- Plus deployment scripts and documentation

All are already committed to your local `test/cicd-pipeline-setup` branch, just need to push!

