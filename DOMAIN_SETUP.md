# Domain Setup Guide

## Current IP Address

Your application is running on:

**Public IP:** Check below for your VPS IP address  
**Application Port:** 3000  
**Application URL:** http://YOUR_IP:3000

## Network Configuration

### Application Status
- ✅ **Next.js Application:** Running on port 3000
- ✅ **PostgreSQL:** Running on port 5432 (internal)
- ✅ **MinIO:** Running on ports 9000, 9001 (internal)

### Port Configuration

| Service | Port | Access Level |
|---------|------|--------------|
| Next.js App | 3000 | Public (needs domain) |
| MinIO API | 9000 | Internal (can be public) |
| MinIO Console | 9001 | Internal (can be public) |
| PostgreSQL | 5432 | Internal only |

## Domain Setup Steps

### Option 1: Direct Domain to IP (Simple)

1. **Get your VPS IP address** (check below)
2. **Update DNS A Record:**
   ```
   Type: A
   Name: @ (or www)
   Value: YOUR_VPS_IP
   TTL: 3600
   ```

3. **Access application:**
   - http://yourdomain.com:3000

### Option 2: Using Nginx Reverse Proxy (Recommended)

This allows you to access the app on standard ports (80/443) without port numbers.

#### Step 1: Install Nginx
```bash
apt update
apt install -y nginx
```

#### Step 2: Configure Nginx
Create `/etc/nginx/sites-available/lms`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Step 3: Enable Site
```bash
ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### Step 4: Setup SSL with Let's Encrypt (Recommended)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

This will automatically:
- Obtain SSL certificate
- Configure HTTPS
- Set up auto-renewal

### Option 3: Cloudflare (Alternative)

If using Cloudflare:

1. Add A record pointing to your VPS IP
2. Enable "Proxy" (orange cloud) for SSL
3. Configure Cloudflare SSL/TLS settings
4. Access via: https://yourdomain.com

## Firewall Configuration

Make sure your firewall allows connections:

```bash
# Check firewall status
ufw status

# Allow HTTP (port 80)
ufw allow 80/tcp

# Allow HTTPS (port 443)
ufw allow 443/tcp

# Allow application port (if not using reverse proxy)
ufw allow 3000/tcp

# Enable firewall if not enabled
ufw enable
```

## Environment Variable Update

After setting up domain, update your `.env` file:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

## Verification Checklist

- [ ] DNS A record points to VPS IP
- [ ] Firewall allows port 80/443 (or 3000)
- [ ] Nginx configured (if using reverse proxy)
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Environment variables updated
- [ ] Application accessible via domain
- [ ] All features working correctly

## Current Configuration

Your application is configured to run on:
- **Internal URL:** http://localhost:3000
- **Network URL:** http://YOUR_VPS_IP:3000

After domain setup, it will be accessible at:
- **Domain URL:** http://yourdomain.com (or https://yourdomain.com)

## Important Notes

1. **Port Forwarding:** If using direct IP access, remember to include port 3000 in URL
2. **SSL Certificate:** Always use HTTPS in production (Let's Encrypt is free)
3. **MinIO URLs:** Update `MINIO_PUBLIC_URL` in `.env` if MinIO needs public access
4. **Database:** Keep PostgreSQL on internal network only (port 5432)
5. **Environment:** Restart application after changing environment variables

## Testing

After domain setup:

1. **Test HTTP:**
   ```bash
   curl http://yourdomain.com
   ```

2. **Test HTTPS (if configured):**
   ```bash
   curl https://yourdomain.com
   ```

3. **Check Application:**
   - Open browser: http://yourdomain.com
   - Verify all pages load correctly
   - Test login and functionality

## Troubleshooting

### Domain not resolving?
- Check DNS propagation: `dig yourdomain.com`
- Verify A record points to correct IP
- Wait for DNS propagation (can take up to 48 hours)

### Connection refused?
- Check firewall: `ufw status`
- Verify application is running: `ps aux | grep next`
- Check port binding: `netstat -tlnp | grep 3000`

### SSL certificate issues?
- Verify domain points to correct IP
- Check Nginx configuration: `nginx -t`
- Review certbot logs: `journalctl -u certbot`

---

**Next Steps:**
1. Get your VPS IP address (shown below)
2. Configure DNS A record
3. Set up Nginx reverse proxy (recommended)
4. Install SSL certificate
5. Update environment variables
6. Restart application

