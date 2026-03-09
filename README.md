# ASSBEP Health Platform

**"Improving Community Health Together — Améliorer la Santé de la Population Ensemble"**

A full-stack multilingual (EN/FR) health platform built for ASSBEP, featuring a public-facing website, admin backoffice CMS, and S3-compatible file storage.

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Production Deployment](#-production-deployment)
- [Environment Variables](#-environment-variables)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
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

## � Production Deployment

### EC2 Self-Hosted Runner Setup

This project uses **GitHub Actions** with a **self-hosted runner** on EC2 for automatic deployment.

#### Prerequisites
- EC2 instance (Ubuntu 20.04+ recommended)
- Docker installed on EC2
- GitHub repository access

#### Quick Setup

**1. On your EC2 instance:**

```bash
# Upload and run the setup script
curl -o setup-runner.sh https://raw.githubusercontent.com/YOUR_USERNAME/assbep-health-platform/main/.github/setup-runner.sh
chmod +x setup-runner.sh
./setup-runner.sh
```

**2. Configure GitHub Runner:**

- Go to your repository **Settings** → **Actions** → **Runners** → **New self-hosted runner**
- Run the configuration command provided by GitHub on your EC2
- Install as a service:
  ```bash
  sudo ./svc.sh install
  sudo ./svc.sh start
  ```

**3. Add GitHub Secrets:**

Go to **Settings** → **Secrets and variables** → **Actions** and add:

| Secret | Description |
|--------|-------------|
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | JWT secret key |
| `MINIO_ROOT_USER` | MinIO admin username |
| `MINIO_ROOT_PASSWORD` | MinIO admin password |
| `EC2_PUBLIC_IP` | Your EC2 public IP |

**4. Configure EC2 Security Group:**

Allow inbound traffic on ports: **22** (SSH), **3000** (Website), **3001** (Admin), **4000** (API), **9000** (MinIO API), **9001** (MinIO Console)

**5. Deploy:**

Push to `main` branch or manually trigger the workflow from **Actions** tab.

📖 **[Full Setup Guide](.github/RUNNER_SETUP.md)**

#### Manual Deployment on EC2

If you prefer manual deployment without CI/CD:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/assbep-health-platform.git
cd assbep-health-platform

# Create production environment file
cp .env.production.example .env
nano .env  # Edit with your values

# Deploy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View logs
docker compose logs -f

# Access your services
# Public: http://YOUR_EC2_IP:3000
# Admin:  http://YOUR_EC2_IP:3001
# API:    http://YOUR_EC2_IP:4000
```

---

## �🔐 Environment Variables

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

### File Upload Security

- File type validation (MIME type + extension)
- File size limits (configurable via env)
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
