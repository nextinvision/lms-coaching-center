# Production Mode Setup

## Current Status

- ✅ **Running:** Development mode (`next dev`)
- ✅ **Production Build:** Available (already built)

## Switch to Production Mode

### Step 1: Stop Development Server

```bash
# Find the process
ps aux | grep "next dev" | grep -v grep

# Kill the process (replace PID with actual process ID)
kill 31674
# Or kill all next processes
pkill -f "next dev"
```

### Step 2: Update Environment Variables

Update `.env` file:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

### Step 3: Rebuild (if needed)

```bash
cd /root/lms-coaching-center
npm run build
```

### Step 4: Start Production Server

```bash
npm run start
```

### Step 5: Run in Background (PM2 Recommended)

For production, use a process manager:

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "lms-app" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Production vs Development

| Feature | Development | Production |
|---------|-------------|------------|
| Performance | Slower | Optimized |
| Hot Reload | ✅ Yes | ❌ No |
| Error Messages | Detailed | Minimal |
| Source Maps | Full | Limited |
| Bundle Size | Larger | Optimized |
| Caching | Disabled | Enabled |
| Minification | No | Yes |
| Code Splitting | Basic | Advanced |

## Recommended Production Setup

1. **Use PM2 or systemd** for process management
2. **Set up Nginx** reverse proxy
3. **Enable HTTPS** with Let's Encrypt
4. **Configure firewall** properly
5. **Set up monitoring** and logging
6. **Enable auto-restart** on crashes

Would you like me to set up production mode now?

