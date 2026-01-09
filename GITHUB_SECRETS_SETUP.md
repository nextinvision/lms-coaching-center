# GitHub Secrets Setup Guide

## ✅ SSH Key Generated Successfully!

The SSH key pair for GitHub Actions deployment has been generated and configured on the production server.

---

## 🔐 Private Key (Add to GitHub Secrets)

Copy the entire content below (including BEGIN and END lines) to GitHub Secrets as `PROD_SSH_KEY`:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACACItlDOq+f0TibpOT1lz+BWZprBlfVh5MQxdNsQqYQmwAAAJih4MgaoeDI
GgAAAAtzc2gtZWQyNTUxOQAAACACItlDOq+f0TibpOT1lz+BWZprBlfVh5MQxdNsQqYQmw
AAAEBNPbsGq8LAcPo35gytxqxb84hJsK6NU3dtr9lrxrIgHgIi2UM6r5/ROJuk5PWXP4FZ
mmsGV9WHkxDF02xCphCbAAAAFWdpdGh1Yi1hY3Rpb25zLWRlcGxveQ==
-----END OPENSSH PRIVATE KEY-----
```

---

## 📋 All GitHub Secrets Required

Go to: **https://github.com/nextinvision/lms-coaching-center/settings/secrets/actions**

Click **"New repository secret"** for each secret below:

### 1. PROD_HOST
- **Name:** `PROD_HOST`
- **Value:** `72.62.194.231`

### 2. PROD_USERNAME
- **Name:** `PROD_USERNAME`
- **Value:** `root`

### 3. PROD_SSH_KEY
- **Name:** `PROD_SSH_KEY`
- **Value:** (Copy the entire private key from above, including BEGIN and END lines)

### 4. PROD_SSH_PORT (Optional)
- **Name:** `PROD_SSH_PORT`
- **Value:** `22`
- *Note: This is optional if using default port 22*

### 5. PROD_DATABASE_URL
- **Name:** `PROD_DATABASE_URL`
- **Value:** `postgresql://postgres:postgres@localhost:5432/lms_coaching_center?schema=public`

---

## ✅ Verification Steps

### 1. Verify SSH Key on Server

The public key has been added to `~/.ssh/authorized_keys` on the production server.

You can verify by checking:
```bash
grep "github-actions-deploy" ~/.ssh/authorized_keys
```

### 2. Test SSH Connection Locally

```bash
ssh -i ~/.ssh/github_actions_deploy root@72.62.194.231
```

### 3. Add Secrets to GitHub

1. Go to: https://github.com/nextinvision/lms-coaching-center/settings/secrets/actions
2. Click **"New repository secret"**
3. Add each secret listed above
4. Click **"Add secret"**

### 4. Test the CI/CD Pipeline

1. Create a test branch:
   ```bash
   git checkout -b test/cicd-setup
   git commit --allow-empty -m "Test CI/CD pipeline"
   git push origin test/cicd-setup
   ```

2. Create a Pull Request to `main` or `develop`

3. Go to **Actions** tab and verify:
   - PR Validation workflow runs
   - All tests pass
   - Build succeeds

4. Test Production Deployment:
   - Go to **Actions** → **Production Deployment**
   - Click **Run workflow**
   - Select `main` branch
   - Click **Run workflow**
   - Verify deployment succeeds

---

## 🔍 Troubleshooting

### SSH Connection Fails

If GitHub Actions cannot connect via SSH:

1. **Verify public key is in authorized_keys:**
   ```bash
   cat ~/.ssh/authorized_keys | grep github-actions
   ```

2. **Check SSH permissions:**
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Verify private key in GitHub Secrets:**
   - Make sure you copied the ENTIRE key including BEGIN and END lines
   - No extra spaces or newlines

### Deployment Fails

If deployment fails:

1. **Check GitHub Actions logs:**
   - Go to Actions tab
   - Click on failed workflow
   - Review error messages

2. **Check server logs:**
   ```bash
   pm2 logs lms-app
   tail -f /var/log/lms-deployment.log
   ```

3. **Verify server access:**
   ```bash
   ssh root@72.62.194.231
   ```

---

## 📝 Key Information

- **Key Location:** `~/.ssh/github_actions_deploy`
- **Public Key:** `~/.ssh/github_actions_deploy.pub`
- **Key Type:** ED25519
- **Server:** 72.62.194.231
- **User:** root

---

## ✅ Status

- ✅ SSH key pair generated
- ✅ Public key added to server authorized_keys
- ✅ SSH connection test successful
- ⏳ **Next:** Add secrets to GitHub repository

---

**Last Updated:** January 9, 2026

