# 🔄 Development Workflow Guide

## 📋 Standard Git Workflow

This guide explains how to make changes locally and push them to GitHub, now that CI/CD is set up.

---

## 🚀 Basic Workflow (Quick Reference)

```bash
# 1. Make your changes
# ... edit files ...

# 2. Check what changed
git status

# 3. Stage your changes
git add .
# or specific files: git add path/to/file

# 4. Commit your changes
git commit -m "Description of your changes"

# 5. Push to GitHub
git push origin main
# or to a branch: git push origin your-branch-name
```

---

## 📝 Detailed Workflow Steps

### Step 1: Check Current Branch

```bash
cd /root/lms-coaching-center
git branch
# Make sure you're on the right branch (main or feature branch)
```

### Step 2: Make Your Changes

Edit files, add features, fix bugs, etc.

### Step 3: Check What Changed

```bash
git status                    # See modified files
git diff                     # See detailed changes
git diff path/to/file        # See changes in specific file
```

### Step 4: Stage Changes

```bash
# Stage all changes
git add .

# Or stage specific files
git add src/components/MyComponent.tsx
git add package.json

# Or stage by pattern
git add src/**/*.tsx
```

### Step 5: Commit Changes

```bash
git commit -m "feat: Add new feature"
# or
git commit -m "fix: Fix bug in login"
# or
git commit -m "docs: Update README"
```

**Commit Message Best Practices:**
- Use clear, descriptive messages
- Prefix with type: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, etc.
- Example: `feat: Add user authentication`
- Example: `fix: Resolve database connection issue`

### Step 6: Push to GitHub

```bash
# Push to main branch
git push origin main

# Push to feature branch
git push origin feature/my-feature

# Push and set upstream (first time for new branch)
git push -u origin branch-name
```

---

## 🌿 Branch Workflow (Recommended)

### Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/my-new-feature

# Make changes, commit, then push
git add .
git commit -m "feat: Add new feature"
git push -u origin feature/my-new-feature
```

### Create Pull Request

1. Push your branch
2. Go to GitHub
3. Click "Compare & pull request"
4. CI/CD will run automatically
5. After checks pass, merge PR

---

## 🔄 Common Scenarios

### Scenario 1: Direct Push to Main

```bash
# Make changes
vim src/app/page.tsx

# Commit
git add src/app/page.tsx
git commit -m "fix: Fix page layout issue"
git push origin main
```

**Note:** If Production Deployment is configured to auto-deploy on push to main, it will deploy automatically!

### Scenario 2: Feature Branch with PR

```bash
# Create feature branch
git checkout -b feature/user-profile

# Make changes
vim src/components/UserProfile.tsx

# Commit
git add src/components/UserProfile.tsx
git commit -m "feat: Add user profile component"

# Push branch
git push -u origin feature/user-profile

# Create PR on GitHub
# CI/CD will run automatically on PR
# Merge after checks pass
```

### Scenario 3: Update Existing Branch

```bash
# Make sure you're on the branch
git checkout feature/my-feature

# Pull latest changes
git pull origin feature/my-feature

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "fix: Update feature based on feedback"
git push origin feature/my-feature
```

### Scenario 4: Sync with Main

```bash
# Get latest from main
git checkout main
git pull origin main

# Update your feature branch
git checkout feature/my-feature
git merge main
# or: git rebase main

# Resolve conflicts if any, then push
git push origin feature/my-feature
```

---

## ⚡ Quick Commands Cheat Sheet

```bash
# Status and diff
git status                  # See what changed
git diff                    # See changes
git log --oneline -10       # Recent commits

# Staging
git add .                   # Stage all
git add file.txt           # Stage specific file
git reset                  # Unstage all

# Committing
git commit -m "message"    # Commit changes
git commit --amend         # Fix last commit

# Pushing
git push origin main       # Push to main
git push                   # Push current branch
git push -u origin branch  # Push new branch

# Branching
git checkout -b branch     # Create & switch
git branch                 # List branches
git checkout branch        # Switch branch

# Updating
git pull origin main       # Get latest changes
git fetch origin           # Fetch without merge
```

---

## 🎯 CI/CD Integration

### When You Push to Main

If Production Deployment is configured for auto-deployment:
1. ✅ Push to main
2. ✅ CI/CD runs automatically
3. ✅ Tests, lint, build
4. ✅ Deploy to production
5. ✅ Application updates!

### When You Push to Feature Branch

1. ✅ Push to branch
2. ✅ Create PR (optional - can push directly)
3. ✅ PR Validation runs (if PR created)
4. ✅ Tests run automatically
5. ✅ After PR merge, can trigger deployment

### Manual Deployment

Even with auto-deployment, you can manually trigger:

1. Go to GitHub Actions
2. Select "Production Deployment"
3. Click "Run workflow"
4. Choose branch and options
5. Deploy manually

---

## 🔐 Authentication

Since we set up SSH, pushing is easy:

```bash
# No password needed - SSH key is used automatically
git push origin main
```

If you ever need to check SSH:
```bash
ssh -T git@github.com
# Should say: "Hi nextinvision/lms-coaching-center! You've successfully authenticated"
```

---

## 🐛 Troubleshooting

### Push Fails - Authentication

```bash
# Test SSH connection
ssh -T git@github.com

# If fails, check SSH key
cat ~/.ssh/id_ed25519.pub

# Re-add key to GitHub if needed
# Go to: https://github.com/settings/keys
```

### Push Fails - Out of Sync

```bash
# Pull latest changes first
git pull origin main

# Resolve conflicts if any
# Then push again
git push origin main
```

### Push Fails - Branch Protection

If main branch has protection:
- Create feature branch
- Create PR
- Merge after review/approval

### Undo Last Commit

```bash
# Undo commit (keep changes)
git reset --soft HEAD~1

# Undo commit (discard changes)
git reset --hard HEAD~1
```

---

## 📚 Best Practices

1. **Use Descriptive Commit Messages**
   - `feat: Add user authentication` ✅
   - `fix stuff` ❌

2. **Commit Often, Push Regularly**
   - Small, focused commits
   - Push daily to avoid conflicts

3. **Use Feature Branches**
   - Create branch for each feature
   - Merge via PR after testing

4. **Test Before Pushing**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

5. **Pull Before Push**
   ```bash
   git pull origin main
   git push origin main
   ```

6. **Review Changes**
   ```bash
   git diff          # Review before committing
   git status        # Check what's staged
   ```

---

## 🎯 Typical Day-to-Day Workflow

```bash
# Morning: Get latest changes
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-task

# Work on changes
# ... make edits ...

# Test locally
npm run dev

# Commit changes
git add .
git commit -m "feat: Implement new feature"

# Push to GitHub
git push -u origin feature/my-task

# Create PR on GitHub
# Wait for CI/CD checks
# Merge PR after approval

# Update main
git checkout main
git pull origin main
```

---

## ✅ Summary

**For Quick Changes:**
```bash
git add .
git commit -m "Your message"
git push origin main
```

**For Feature Development:**
```bash
git checkout -b feature/name
# ... make changes ...
git add .
git commit -m "feat: Description"
git push -u origin feature/name
# Create PR on GitHub
```

**SSH is configured** - just push directly, no password needed! 🚀

---

**Ready to code and push!** Your CI/CD pipeline will handle the rest automatically.

