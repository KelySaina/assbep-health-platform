# ASSBEP Health Platform

**"Improving Community Health Together — Améliorer la Santé de la Population Ensemble"**

A full-stack multilingual (EN/FR) health platform built for ASSBEP, featuring a public-facing website, admin backoffice CMS, and S3-compatible file storage.

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Production Deployment](#-production-deployment)
- [API Documentation](#-api-documentation)
- [Development](#-development)

## 🏗️ Architecture

```
assbep-health-platform/
├── public-website/      # Vue 3 + Vite — Port 3000
├── admin-backoffice/    # Vue 3 + Vite — Port 3001
├── api/                 # NestJS + Prisma + PostgreSQL — Port 4000
└── docker-compose.yml   # Complete Docker setup
```

**Services:**
- **PostgreSQL** (5433) - Database
- **MinIO** (9000/9001) - S3-compatible file storage
- **API** (4000) - NestJS backend
- **Public Website** (3000) - Vue 3 frontend
- **Admin Backoffice** (3001) - Vue 3 CMS

## 🚀 Quick Start

### 🐳 Docker (Recommended)

**Start the entire platform with one command:**

```bash
# Clone the repository
git clone https://github.com/KelySaina/assbep-health-platform.git
cd assbep-health-platform

# Start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

**Access Points:**
- 🌐 **Public Website:** http://localhost:3000
- 🔐 **Admin Backoffice:** http://localhost:3001
- 🔌 **API:** http://localhost:4000/api
- 📦 **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin)
- 🗄️ **PostgreSQL:** localhost:5433

**Default Admin Login:**
- Email: `admin@assbep.org`
- Password: `admin123`

---

## 🔐 Environment Variables

### Development Setup

For local development, the default values work out of the box. To customize:

```bash
# Copy environment templates
cp .env.example .env
cp api/.env.example api/.env
cp admin-backoffice/.env.example admin-backoffice/.env
cp public-website/.env.example public-website/.env

# Edit as needed
nano .env
```

### Production Setup

```bash
# Copy production templates
cp .env.production.example .env.production
cp admin-backoffice/.env.production.example admin-backoffice/.env.production
cp public-website/.env.production.example public-website/.env.production

# ⚠️ CRITICAL: Update all secrets and domains
nano .env.production
```

### Key Environment Variables

#### Database
```env
POSTGRES_USER=assbep_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=assbep_health
DATABASE_URL=postgresql://user:pass@postgres:5432/db
```

#### MinIO (File Storage)
```env
MINIO_ENDPOINT=minio              # or your domain
MINIO_PORT=9000
MINIO_USE_SSL=false               # true in production
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=assbep-media
MINIO_PUBLIC_URL=http://localhost:9000  # CDN URL in production
```

#### API Security
```env
JWT_SECRET=generate_with_openssl_rand_base64_64
SESSION_SECRET=generate_with_openssl_rand_base64_64
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
PORT=4000
```

#### Frontend
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_TITLE=ASSBEP Health Platform
```

**Generate Secure Secrets:**
```bash
# JWT Secret
openssl rand -base64 64

# Session Secret
openssl rand -base64 64
```

---

## ✨ Features

### Public Website
- 🌍 **Multilingual** (English/French) with i18n
- 📱 **Responsive Design** - Mobile-first approach
- 📰 **News & Articles** - Dynamic blog system
- 🏥 **Health Programs** - Program listing and details
- 📚 **Resources** - Downloadable health resources
- 🤝 **Partners** - Partner organization showcase
- 📞 **Contact Form** - Email integration
- 🗺️ **Google Maps** - Location integration

### Admin Backoffice
- 🔐 **JWT Authentication** - Secure login system
- 👥 **User Management** - CRUD operations for users
- 📝 **Content Management**:
  - Articles/News (bilingual)
  - Health Programs (bilingual)
  - Partners
  - Translations (phrase management)
  - Settings (site-wide configuration)
- 📁 **Media Library**:
  - File upload with drag & drop
  - Auto file type detection
  - Preview (images, videos, documents)
  - Copy URL to clipboard
  - Bulk delete
- 🎨 **Custom Modals** - No native browser alerts
- 🔔 **Toast Notifications** - User feedback
- 📊 **Dashboard** - Analytics overview

### API Features
- 🔒 **JWT Authentication** - Secure endpoints
- 🗄️ **Prisma ORM** - Type-safe database access
- 📤 **File Upload** - Multer + MinIO integration
- 🌐 **CORS** - Configurable origins
- ⚡ **Rate Limiting** - DDoS protection
- 📧 **Email** - SMTP integration ready
- 🔍 **Validation** - Request validation pipes
- 🎯 **RESTful API** - Standard endpoints

---

## 📦 Tech Stack

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS 3
- **Routing:** Vue Router 4
- **State Management:** Pinia
- **Internationalization:** Vue I18n 9
- **HTTP Client:** Axios
- **Notifications:** Vue Toastification

### Backend
- **Framework:** NestJS 10
- **ORM:** Prisma 5
- **Database:** PostgreSQL 16
- **Authentication:** JWT + bcryptjs
- **File Upload:** Multer
- **Storage:** MinIO (S3-compatible)
- **Validation:** class-validator

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx (for static files)
- **Reverse Proxy:** Nginx/Traefik ready

---

## 🌐 Production Deployment

### Pre-Deployment Checklist

- [ ] Domain name configured
- [ ] SSL certificates ready
- [ ] Server with Docker installed
- [ ] Reverse proxy configured (Nginx/Traefik)
- [ ] Backup strategy in place
- [ ] Environment variables set

### Deployment Steps

#### 1. Prepare Environment

```bash
# On your server
git clone https://github.com/KelySaina/assbep-health-platform.git
cd assbep-health-platform

# Setup production environment
cp .env.production.example .env.production
nano .env.production
```

#### 2. Update Critical Variables

**⚠️ MUST CHANGE:**
- All passwords (PostgreSQL, MinIO, JWT)
- `MINIO_PUBLIC_URL` → Your CDN/domain
- `CORS_ORIGIN` → Your actual domains
- `VITE_API_URL` → Production API URL
- SSL settings (`MINIO_USE_SSL=true`)

#### 3. Deploy with Docker

```bash
# Build and start
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build

# Check status
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f
```

#### 4. Run Database Migrations

```bash
# Apply migrations
docker compose -f docker-compose.production.yml exec api npx prisma migrate deploy

# Seed initial data (optional)
docker compose -f docker-compose.production.yml exec api npx prisma db seed
```

### Domain Configuration

**Recommended Setup:**
```
yourdomain.com           → Public Website (3000)
admin.yourdomain.com     → Admin Backoffice (3001)
api.yourdomain.com       → API (4000)
minio.yourdomain.com     → MinIO (9000)
console.yourdomain.com   → MinIO Console (9001)
```

### Nginx Reverse Proxy Example

```nginx
# API
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Public Website
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}

# Admin Backoffice
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}

# MinIO (Files)
server {
    listen 443 ssl http2;
    server_name minio.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
sudo certbot --nginx -d minio.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Database Backup

```bash
# Manual backup
docker compose -f docker-compose.production.yml exec postgres \
  pg_dump -U your_user your_db > backup_$(date +%Y%m%d).sql

# Restore
docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U your_user your_db < backup.sql
```

---

## 📚 API Documentation

### Authentication Endpoints

**POST** `/api/auth/login`
```json
{
  "email": "admin@assbep.org",
  "password": "admin123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "admin@assbep.org", "role": "ADMIN" }
}
```

### Programs

- **GET** `/api/programs` - List all programs
- **GET** `/api/programs/admin` - Admin list (with all translations)
- **GET** `/api/programs/:id` - Get single program
- **POST** `/api/programs` - Create program (Auth required)
- **PUT** `/api/programs/:id` - Update program (Auth required)
- **DELETE** `/api/programs/:id` - Delete program (Auth required)

### Articles

- **GET** `/api/articles` - List all articles
- **GET** `/api/articles/admin` - Admin list (with all translations)
- **GET** `/api/articles/:id` - Get single article
- **POST** `/api/articles` - Create article (Auth required)
- **PUT** `/api/articles/:id` - Update article (Auth required)
- **DELETE** `/api/articles/:id` - Delete article (Auth required)

### Media

- **GET** `/api/media` - List all media
- **POST** `/api/media/upload` - Upload file (Auth required)
  - FormData: `file`, `alt_text`, `type`
- **PUT** `/api/media/:id` - Update media metadata (Auth required)
- **DELETE** `/api/media/:id` - Delete media (Auth required)

### Partners

- **GET** `/api/partners` - List all partners
- **POST** `/api/partners` - Create partner (Auth required)
- **PUT** `/api/partners/:id` - Update partner (Auth required)
- **DELETE** `/api/partners/:id` - Delete partner (Auth required)

### Translations

- **GET** `/api/phrases` - List all translation phrases
- **POST** `/api/phrases` - Create phrase (Auth required)
- **PUT** `/api/phrases/:id` - Update phrase (Auth required)
- **DELETE** `/api/phrases/:id` - Delete phrase (Auth required)

### Settings

- **GET** `/api/settings` - Get all settings
- **PUT** `/api/settings` - Update settings (Auth required)

### Users

- **GET** `/api/users` - List all users (Auth required)
- **POST** `/api/users` - Create user (Auth required)
- **PUT** `/api/users/:id` - Update user (Auth required)
- **DELETE** `/api/users/:id` - Delete user (Auth required)

---

## 💻 Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development Without Docker

#### 1. Database Setup

```bash
# Install PostgreSQL
# Create database
createdb assbep_health

# Setup environment
cd api
cp .env.example .env
# Edit .env with your DATABASE_URL
```

#### 2. Install Dependencies

```bash
# API
cd api
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed

# Admin Backoffice
cd admin-backoffice
npm install

# Public Website
cd public-website
npm install
```

#### 3. Start Services

```bash
# Terminal 1 - API
cd api
npm run start:dev

# Terminal 2 - Admin
cd admin-backoffice
npm run dev

# Terminal 3 - Public
cd public-website
npm run dev
```

### Project Structure

```
assbep-health-platform/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Seed data
│   │   └── migrations/        # Migration history
│   └── src/
│       ├── articles/          # Articles module
│       ├── auth/              # Authentication
│       ├── media/             # File upload & storage
│       ├── partners/          # Partners module
│       ├── phrases/           # Translations
│       ├── programs/          # Programs module
│       ├── settings/          # Site settings
│       ├── users/             # User management
│       └── prisma/            # Prisma service
│
├── admin-backoffice/
│   └── src/
│       ├── pages/             # Admin pages
│       ├── stores/            # Pinia stores
│       ├── router/            # Vue Router
│       ├── i18n/              # Translations
│       └── layouts/           # Layout components
│
└── public-website/
    └── src/
        ├── pages/             # Public pages
        ├── components/        # Vue components
        ├── stores/            # Pinia stores
        ├── router/            # Vue Router
        └── i18n/              # Translations
```

### Design System

| Token | Value |
|-------|-------|
| Primary Color | `#1E5AA8` |
| Primary Dark | `#143C73` |
| Primary Light | `#E8F1FB` |
| Headline Font | Poppins (600) |
| Body Font | Inter (400) |

### Common Commands

```bash
# Docker
docker compose up -d              # Start all services
docker compose down               # Stop all services
docker compose logs -f api        # View API logs
docker compose ps                 # List containers
docker compose restart api        # Restart API

# Database
npx prisma studio                 # Open Prisma Studio
npx prisma migrate dev            # Create migration
npx prisma generate              # Generate client
npx prisma db seed               # Seed database

# Development
npm run dev                       # Start dev server
npm run build                     # Build for production
npm run lint                      # Run linter
```

---

## 🔒 Security

### Production Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS/SSL everywhere
- [ ] Update CORS to specific domains
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] MinIO access restricted
- [ ] Environment variables secured
- [ ] API authentication enforced

### File Upload Security

- File type validation (MIME type + extension)
- File size limits (configurable via env)
- Virus scanning recommended for production
- Public read-only access for media bucket

---

## 🆘 Troubleshooting

### Services won't start
```bash
# Check logs
docker compose logs

# Rebuild containers
docker compose down
docker compose up -d --build
```

### Database connection errors
```bash
# Check database is running
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U postgres -d assbep -c "SELECT version();"
```

### MinIO files not accessible
```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Access MinIO console
open http://localhost:9001
```

### CORS errors
- Verify `CORS_ORIGIN` includes your frontend URLs
- Check protocol (http vs https)
- Restart API after env changes

---

## 📄 License

This project is proprietary software developed for ASSBEP.

---

## 👥 Contributors

Developed by the ASSBEP development team.

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Contact: contact@assbep.org

---

**Last Updated:** March 8, 2026
