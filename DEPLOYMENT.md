# Deployment Guide - ASSBEP Health Platform

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Domain name configured (e.g., `yourdomain.com`)
- [ ] SSL certificates ready (Let's Encrypt, etc.)
- [ ] Server/VM with Docker installed
- [ ] Reverse proxy configured (Nginx, Traefik, Caddy)
- [ ] Backup strategy in place
- [ ] Monitoring tools ready

## 🚀 Production Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/KelySaina/assbep-health-platform.git
cd assbep-health-platform
```

### 2. Setup Environment Variables

```bash
# Copy production environment template
cp .env.production.example .env.production

# Edit with your actual values
nano .env.production
```

**⚠️ CRITICAL: Update these values:**
- All passwords (PostgreSQL, MinIO, JWT)
- Domain names and URLs
- CORS origins
- Email configuration
- SSL settings

### 3. Generate Secrets

```bash
# JWT Secret
openssl rand -base64 64

# Session Secret
openssl rand -base64 64

# MinIO Access Key
openssl rand -base64 32
```

Copy these to your `.env.production` file.

### 4. Build and Start Services

```bash
# Using production configuration
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build
```

### 5. Verify Services

```bash
# Check all containers are running
docker compose -f docker-compose.production.yml ps

# Check logs
docker compose -f docker-compose.production.yml logs -f

# Test API health
curl https://api.yourdomain.com/api/programs

# Test MinIO
curl https://minio.yourdomain.com/minio/health/live
```

### 6. Database Migration

```bash
# Run Prisma migrations
docker compose -f docker-compose.production.yml exec api npx prisma migrate deploy

# Seed initial data (optional)
docker compose -f docker-compose.production.yml exec api npx prisma db seed
```

### 7. Create First Admin User

Access the database or use API endpoints to create the first admin user.

```bash
# Option 1: Using Prisma Studio
docker compose -f docker-compose.production.yml exec api npx prisma studio

# Option 2: Using psql
docker compose -f docker-compose.production.yml exec postgres psql -U your_user -d your_db
```

## 🌐 Domain Configuration

### Recommended Setup

```
yourdomain.com           → Public Website (port 3000)
admin.yourdomain.com     → Admin Backoffice (port 3001)
api.yourdomain.com       → API (port 4000)
minio.yourdomain.com     → MinIO API (port 9000)
console.yourdomain.com   → MinIO Console (port 9001)
```

### Nginx Configuration Example

Create `/etc/nginx/sites-available/assbep`:

```nginx
# API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
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

# Public Website
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
    }
}

# Admin Backoffice
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# MinIO API
server {
    listen 80;
    server_name minio.yourdomain.com;

    # Increase body size for file uploads
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:9000;
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

# MinIO Console
server {
    listen 80;
    server_name console.yourdomain.com;

    location / {
        proxy_pass http://localhost:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/assbep /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL with Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates for all domains
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
sudo certbot --nginx -d minio.yourdomain.com
sudo certbot --nginx -d console.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## 🔧 Alternative: Using Traefik (Docker-native)

Create `docker-compose.traefik.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Dashboard
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@yourdomain.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$..."

volumes:
  letsencrypt:
```

Add labels to your services in `docker-compose.production.yml`:

```yaml
api:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.api.rule=Host(`api.yourdomain.com`)"
    - "traefik.http.routers.api.entrypoints=websecure"
    - "traefik.http.routers.api.tls.certresolver=letsencrypt"
```

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker compose -f docker-compose.production.yml logs -f

# Specific service
docker compose -f docker-compose.production.yml logs -f api

# Last 100 lines
docker compose -f docker-compose.production.yml logs --tail=100 api
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## 🔄 Updates & Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d --build

# Run migrations if needed
docker compose -f docker-compose.production.yml exec api npx prisma migrate deploy
```

### Database Backup

```bash
# Manual backup
docker compose -f docker-compose.production.yml exec postgres pg_dump -U your_user your_db > backup_$(date +%Y%m%d).sql

# Automated backup script (add to crontab)
0 2 * * * /path/to/backup-script.sh
```

Create `/usr/local/bin/backup-assbep.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/assbep"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker compose -f /opt/assbep/docker-compose.production.yml exec -T postgres \
  pg_dump -U your_user your_db | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# MinIO backup (optional - sync to S3)
# docker compose -f /opt/assbep/docker-compose.production.yml exec -T minio \
#   mc mirror local-minio/assbep-media s3://backup-bucket/

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

## 🛡️ Security Hardening

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Docker Security

```bash
# Run containers as non-root user (update Dockerfiles)
# Limit container resources in docker-compose.yml:

services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          memory: 512M
```

### Environment Protection

```bash
# Restrict .env file permissions
chmod 600 .env.production

# Never commit .env files
echo ".env.production" >> .gitignore
```

## 🆘 Troubleshooting

### Services won't start

```bash
# Check logs
docker compose -f docker-compose.production.yml logs

# Verify environment variables
docker compose -f docker-compose.production.yml config
```

### Database connection errors

```bash
# Check database is running
docker compose -f docker-compose.production.yml ps postgres

# Test connection
docker compose -f docker-compose.production.yml exec postgres \
  psql -U your_user -d your_db -c "SELECT version();"
```

### MinIO files not accessible

```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Verify bucket policy
docker compose -f docker-compose.production.yml exec minio \
  mc policy get local-minio/assbep-media
```

## 📞 Support

For issues, create an issue on GitHub or contact the development team.

---

**Last Updated:** March 8, 2026
