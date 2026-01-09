# ⚡ Quick Reference Guide

## 🚨 Common Issues & Solutions

### Issue: "fatal: not a git repository"

**Problem:**
```
fatal: not a git repository (or any of the parent directories): .git
```

**Cause:**
- You're not in the project directory
- You're in `/root` or another directory without a `.git` folder

**Solution:**
```bash
# Always change to project directory first
cd /root/lms-coaching-center

# Then run git commands
git status
git add .
git commit -m "Your message"
git push origin main
```

**Quick Check:**
```bash
# Check current directory
pwd
# Should show: /root/lms-coaching-center

# Verify git repository
git status
# Should show repository status (not an error)
```

---

## 📍 Always Remember

**Git commands must be run from the project directory:**
```
/root/lms-coaching-center  ✅ Correct
/root                      ❌ Wrong
/home                      ❌ Wrong
```

---

## 🔧 Quick Fix Commands

```bash
# Navigate to project
cd /root/lms-coaching-center

# Verify you're in the right place
pwd
ls -la .git  # Should exist

# Then proceed with git commands
git status
git add .
git commit -m "Your changes"
git push origin main
```

---

## 💡 Pro Tips

1. **Always check directory first:**
   ```bash
   pwd
   ```

2. **Use full path:**
   ```bash
   cd /root/lms-coaching-center
   ```

3. **Create an alias (optional):**
   ```bash
   alias lms='cd /root/lms-coaching-center'
   # Then just type: lms
   ```

4. **Add to your shell profile:**
   ```bash
   echo 'alias lms="cd /root/lms-coaching-center"' >> ~/.bashrc
   source ~/.bashrc
   # Now you can just type: lms
   ```

---

## 📋 Complete Workflow (Always)

```bash
# Step 1: Go to project directory
cd /root/lms-coaching-center

# Step 2: Check status
git status

# Step 3: Make your changes
# ... edit files ...

# Step 4: Stage changes
git add .

# Step 5: Commit
git commit -m "Your message"

# Step 6: Push
git push origin main
```

---

**Remember: Always `cd /root/lms-coaching-center` first!** 🎯

