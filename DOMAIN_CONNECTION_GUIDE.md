# Domain Connection Guide - Step by Step

Your application is production-ready and accessible at **http://72.62.194.231**

Follow these steps to connect your domain:

## Step 1: Configure DNS Record

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add an A record:

```
Type: A
Host: @ (or leave blank for root domain)
Value: 72.62.194.231
TTL: 3600 (or default)

Also add for www subdomain:
Type: A
Host: www
Value: 72.62.194.231
TTL: 3600
```

**Wait 5-60 minutes** for DNS propagation.

## Step 2: Verify DNS Propagation

```bash
# Check if DNS is propagated
dig yourdomain.com
nslookup yourdomain.com

# Should return: 72.62.194.231
```

## Step 3: Update Nginx Configuration

Once DNS is propagated, update Nginx:

### Option A: Use the helper script (Easy)
```bash
cd /root/lms-coaching-center
./update-domain.sh yourdomain.com
```

### Option B: Manual update
```bash
# Edit Nginx config
nano /etc/nginx/sites-available/lms

# Change:
# server_name _;
# To:
# server_name yourdomain.com www.yourdomain.com;

# Test and reload
nginx -t
systemctl reload nginx
```

## Step 4: Update Environment Variables

```bash
cd /root/lms-coaching-center
nano .env

# Update these lines:
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Restart application
pm2 restart lms-app
```

## Step 5: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS (recommended: option 2)
```

Certbot will automatically:
- Obtain SSL certificate from Let's Encrypt
- Configure HTTPS in Nginx
- Set up auto-renewal
- Redirect HTTP to HTTPS

## Step 6: Verify Everything Works

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://yourdomain.com

# Test HTTPS
curl -I https://yourdomain.com

# Should return: HTTP/2 200
```

## Quick Checklist

- [ ] DNS A record added pointing to 72.62.194.231
- [ ] DNS propagation verified (waited 5-60 minutes)
- [ ] Nginx config updated with domain name
- [ ] Environment variables updated
- [ ] Application restarted
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] Application accessible via domain

## Troubleshooting

### DNS not resolving?
```bash
# Check DNS
dig yourdomain.com +short
# Should return: 72.62.194.231

# Wait longer (can take up to 48 hours, usually 5-60 minutes)
```

### Nginx 502 error?
```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs lms-app

# Restart app
pm2 restart lms-app
```

### SSL certificate issues?
```bash
# Check certbot logs
journalctl -u certbot

# Test certificate
certbot certificates

# Renew manually if needed
certbot renew
```

## Current Status

✅ **Production mode:** Active  
✅ **Public IP:** 72.62.194.231  
✅ **Port 80:** Working  
✅ **Nginx:** Configured  
✅ **PM2:** Running  
✅ **Ready for domain:** Yes

---

**Your application is ready! Just point your domain and follow the steps above.** 🚀

