# Environment Variables Setup Guide

## 📋 Overview

This project uses environment variables to configure different aspects of the application. This guide explains how to set up environment variables for different environments.

## 🗂️ File Structure

```
.env.example                          # Root configuration template
.env.production.example               # Production configuration template
api/.env.example                      # API service configuration
admin-backoffice/.env.example         # Admin service configuration
admin-backoffice/.env.production.example
public-website/.env.example           # Public website configuration
public-website/.env.production.example
```

## 🚀 Quick Start (Development)

### 1. Root Environment (Docker Compose)

```bash
# Copy the example file
cp .env.example .env

# Edit with your values (default values work for local development)
nano .env
```

### 2. API Service

```bash
cd api
cp .env.example .env
# Default values work for local development
```

### 3. Admin Backoffice

```bash
cd admin-backoffice
cp .env.example .env
# Default values work for local development
```

### 4. Public Website

```bash
cd public-website
cp .env.example .env
# Default values work for local development
```

### 5. Start the services

```bash
docker compose up -d
```

## 🏭 Production Setup

### 1. Copy production templates

```bash
cp .env.production.example .env.production
cp admin-backoffice/.env.production.example admin-backoffice/.env.production
cp public-website/.env.production.example public-website/.env.production
```

### 2. **⚠️ CRITICAL: Update all secrets**

Before deploying, you MUST change:

#### Database
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`

#### MinIO (File Storage)
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_PUBLIC_URL` (your CDN or domain)
- `MINIO_USE_SSL=true`

#### API Security
- `JWT_SECRET` - Generate with: `openssl rand -base64 64`
- `SESSION_SECRET` - Generate with: `openssl rand -base64 64`
- `CORS_ORIGIN` (your actual domains)
- `API_URL` (your API domain)

#### Frontend URLs
- `VITE_API_URL` (in both admin and public website)
- Update all domain references from `localhost` to your actual domains

### 3. Generate Secure Secrets

```bash
# Generate JWT Secret
openssl rand -base64 64

# Generate Session Secret
openssl rand -base64 64

# Generate MinIO credentials (strong password)
openssl rand -base64 32
```

### 4. Update docker-compose for production

Use `docker-compose.production.yml` with:
```bash
docker compose -f docker-compose.production.yml up -d
```

## 🔐 Security Best Practices

### Never commit these files:
- `.env`
- `.env.production`
- `api/.env`
- `admin-backoffice/.env`
- `admin-backoffice/.env.production`
- `public-website/.env`
- `public-website/.env.production`

They are already in `.gitignore`.

### Secure storage
- Use secret management tools (AWS Secrets Manager, Azure Key Vault, etc.)
- Use environment variables in CI/CD pipelines
- Rotate secrets regularly

## 📝 Key Variables Explained

### MinIO Configuration

**Local Development:**
```env
MINIO_ENDPOINT=localhost:9000
MINIO_USE_SSL=false
MINIO_PUBLIC_URL=http://localhost:9000
```

**Production Options:**

**Option 1: Direct MinIO (with reverse proxy)**
```env
MINIO_ENDPOINT=minio.yourdomain.com
MINIO_USE_SSL=true
MINIO_PUBLIC_URL=https://minio.yourdomain.com
```

**Option 2: CDN Integration (Recommended)**
```env
MINIO_ENDPOINT=minio:9000  # Internal
MINIO_USE_SSL=true
MINIO_PUBLIC_URL=https://cdn.yourdomain.com
```

**Option 3: API Proxy**
```env
MINIO_ENDPOINT=minio:9000  # Internal
MINIO_USE_SSL=true
MINIO_PUBLIC_URL=https://api.yourdomain.com/files
```

### CORS Configuration

Must include all your frontend domains:

```env
# Development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Production
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com,https://www.yourdomain.com
```

### Database URL

Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

**Development (Docker):**
```env
DATABASE_URL=postgresql://assbep_user:assbep_password_2024@postgres:5432/assbep_health?schema=public
```

**Production (Managed Database):**
```env
DATABASE_URL=postgresql://user:pass@your-db-host.com:5432/production_db?schema=public&sslmode=require
```

## 🌍 Environment-Specific Variables

### Development
- Verbose logging (`LOG_LEVEL=debug`)
- Database logging enabled
- Relaxed rate limiting
- CORS allows localhost
- HTTP (no SSL)

### Production
- Minimal logging (`LOG_LEVEL=warn`)
- Database logging disabled
- Strict rate limiting
- CORS only for your domains
- HTTPS/SSL required
- Email verification enabled
- Analytics enabled

## 📦 Docker Compose Integration

The root `.env` file is automatically loaded by Docker Compose.

Variables are passed to services via the `environment` section in `docker-compose.yml`.

## 🧪 Testing Environment

Create `.env.test` for testing:

```bash
cp .env.example .env.test
# Modify for test database and settings
```

Use with:
```bash
docker compose --env-file .env.test up
```

## 🆘 Troubleshooting

### MinIO files not accessible
- Check `MINIO_PUBLIC_URL` matches your setup
- Verify `MINIO_USE_SSL` matches your protocol (http/https)
- Ensure bucket policy allows public read

### CORS errors
- Verify `CORS_ORIGIN` includes your frontend URL
- Check protocol (http vs https)
- Include port if non-standard

### Database connection failed
- Verify `DATABASE_URL` format
- Check database container is running: `docker compose ps`
- Verify credentials match postgres service

### JWT authentication issues
- Ensure `JWT_SECRET` is the same across all API instances
- Check `JWT_EXPIRES_IN` format (e.g., "7d", "24h")

## 📚 Additional Resources

- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [MinIO Configuration](https://min.io/docs/minio/linux/reference/minio-server/minio-server.html)
