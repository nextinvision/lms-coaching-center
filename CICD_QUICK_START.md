# CI/CD Quick Start Guide

Quick reference for setting up and using the CI/CD pipeline.

## ⚡ Quick Setup (5 Minutes)

### Step 1: Generate SSH Key

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Add public key to server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@72.62.194.231

# Copy private key (you'll add this to GitHub Secrets)
cat ~/.ssh/github_actions_deploy
```

### Step 2: Add GitHub Secrets

Go to: `https://github.com/nextinvision/lms-coaching-center/settings/secrets/actions`

Add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `PROD_HOST` | Server IP | `72.62.194.231` |
| `PROD_USERNAME` | SSH username | `root` |
| `PROD_SSH_KEY` | Private key content | (paste from Step 1) |
| `PROD_DATABASE_URL` | Database URL | `postgresql://postgres:postgres@localhost:5432/lms_coaching_center?schema=public` |

### Step 3: Test Deployment

1. Go to **Actions** tab
2. Select **Production Deployment**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**
6. Approve deployment when prompted

Done! ✅

---

## 🚀 Common Commands

### Deploy to Production

**Via GitHub UI:**
1. Actions → Production Deployment → Run workflow

**Via Git Tag:**
```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

### Rollback Deployment

```bash
# SSH to server
ssh root@72.62.194.231

# List backups
ls -1t /root/lms-backups | head -5

# Rollback
/root/lms-coaching-center/scripts/rollback.sh backup-20260109-120000
```

### Check Deployment Status

**On GitHub:**
- Actions tab → View workflow runs

**On Server:**
```bash
pm2 status
pm2 logs lms-app --lines 50
```

---

## 📋 Workflow Triggers

| Workflow | Trigger | Auto-Deploy |
|----------|---------|-------------|
| PR Validation | Pull Request | No |
| Development | Push to `develop` | Yes (if configured) |
| Production | Manual / Push to `main` | Manual approval |
| Security Scan | Daily / PR | No |

---

## 🔍 Quick Troubleshooting

**Deployment failed?**
- Check Actions logs
- Verify SSH key in GitHub Secrets
- Test SSH connection manually

**App not starting?**
```bash
pm2 logs lms-app
pm2 restart lms-app
```

**Need to rollback?**
- Check backups: `ls /root/lms-backups`
- Run rollback script with backup name

---

For detailed information, see [CICD_SETUP_GUIDE.md](./CICD_SETUP_GUIDE.md)


