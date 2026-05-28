# ASSBEP Health Platform

**"Improving Community Health Together — Améliorer la Santé de la Population Ensemble"**

A full-stack multilingual (EN/FR) health platform built for ASSBEP, featuring a public-facing website, admin backoffice CMS, and S3-compatible file storage.

## 📋 Table of Contents

- [Architecture](#-architecture)
  - [System Architecture](#system-architecture-diagram)
  - [Database Schema](#-database-schema)
  - [Deployment Architecture](#deployment-architecture-diagram)
  - [Multilingual Data Flow](#multilingual-data-flow-diagram)
- [Quick Start](#-quick-start)
- [Production Deployment](#-production-deployment)
  - [EC2 GitHub Runner Setup](#ec2-github-runner-setup)
  - [API-Only Deployment (Oracle VM)](#api-only-deployment-oracle-vm)
  - [Deployment Checklist](#deployment-checklist)
- [Environment Variables](#-environment-variables)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting-common-issues)
- [Security](#-security)

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

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Applications"
        PUB[Public Website<br/>Vue 3 + Vite<br/>Port 3000]
        ADMIN[Admin Backoffice<br/>Vue 3 + Pinia<br/>Port 3001]
    end

    subgraph "Backend API"
        API[NestJS API<br/>Port 4000]
        AUTH[JWT Auth<br/>Module]
        PRISMA[Prisma ORM]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Database<br/>Port 5433)]
        MINIO[MinIO S3<br/>Storage<br/>Port 9000/9001]
    end

    subgraph "Services"
        PROG[Programs Service]
        ART[Articles Service]
        RES[Resources Service]
        MED[Media Service]
        PHRASES[Translations Service]
    end

    PUB -->|HTTP REST| API
    ADMIN -->|HTTP REST + Auth| API

    API --> AUTH
    API --> PRISMA
    API --> PROG
    API --> ART
    API --> RES
    API --> MED
    API --> PHRASES

    PRISMA --> DB
    MED --> MINIO

    PROG -.->|Multilingual| DB
    ART -.->|Multilingual| DB
    RES -.->|Multilingual| DB
    PHRASES -.->|i18n| DB

    style PUB fill:#3b82f6,color:#fff
    style ADMIN fill:#1e5aa8,color:#fff
    style API fill:#10b981,color:#fff
    style DB fill:#f59e0b,color:#fff
    style MINIO fill:#ef4444,color:#fff
```

---

## 📊 Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Article : "authors"

    Program ||--|{ ProgramTranslation : "has"
    Article ||--|{ ArticleTranslation : "has"
    Resource ||--|{ ResourceTranslation : "has"

    User {
        uuid id PK
        string email UK
        string password
        string name
        enum role
        datetime created_at
        datetime updated_at
    }

    Program {
        uuid id PK
        string slug UK
        string category
        string image
        int order
        boolean published
        datetime created_at
        datetime updated_at
    }

    ProgramTranslation {
        uuid id PK
        uuid program_id FK
        string language
        string title
        text description
        text content
    }

    Article {
        uuid id PK
        string slug UK
        string category
        string image
        uuid author_id FK
        boolean published
        datetime published_at
        datetime created_at
        datetime updated_at
    }

    ArticleTranslation {
        uuid id PK
        uuid article_id FK
        string language
        string title
        text excerpt
        text content
    }

    Resource {
        uuid id PK
        string type
        string file_url
        boolean published
        int order
        datetime created_at
        datetime updated_at
    }

    ResourceTranslation {
        uuid id PK
        uuid resource_id FK
        string language
        string title
        text description
    }

    Partner {
        uuid id PK
        string name
        string logo
        string website
        int order
    }

    Phrase {
        uuid id PK
        string key
        string group
        string language
        text value
    }

    Media {
        uuid id PK
        string filename
        string url
        string type
        string alt_text
        int size
        datetime created_at
    }

    ContactRequest {
        uuid id PK
        string name
        string email
        string subject
        text message
        boolean read
        datetime created_at
    }

    SiteSetting {
        uuid id PK
        string key UK
        text value
    }
```

### Database Tables Overview

#### 👥 **Users**
- Authentication and authorization
- Role-based access: SUPER_ADMIN, EDITOR, TRANSLATOR
- Authors articles

#### 🏥 **Programs** (Health Programs)
- Main program entity with metadata
- Separate translations table for EN/FR content
- Category filtering and ordering

#### 📰 **Articles** (Blog/News)
- Blog posts and news articles
- Multilingual content (EN/FR)
- Author tracking and publication dates

#### 📚 **Resources** (Downloadable Resources)
- Guides, videos, documents
- File storage in MinIO S3
- Type categorization

#### 🤝 **Partners**
- Partner organizations
- Logo and website links
- Display ordering

#### 🌐 **Phrases** (i18n Translations)
- Dynamic UI translations
- Grouped by section (general, stats, etc.)
- Language-specific content

#### 📁 **Media**
- Central media library
- MinIO S3 storage integration
- Type detection (image/video/document)

#### 📧 **Contact Requests**
- Contact form submissions
- Read/unread tracking

#### ⚙️ **Site Settings**
- Site-wide configuration
- Stats (people_helped, programs_launched, volunteers, partners)
- Flexible key-value storage

### Multilingual Architecture

All content uses a **translation table pattern**:
- **Main table** → Invariant data (ID, dates, flags, metadata)
- **Translation table** → Language-specific content (title, description, content)

**Example:**
```sql
-- Main entity
programs(id, slug, category, image, published, ...)

-- Translations
program_translations(id, program_id, language, title, description, content)
```

### Deployment Architecture Diagram

```mermaid
graph TB
    subgraph "Development"
        DEV[👨‍💻 Developer]
        GIT[GitHub Repository]
    end

    subgraph "CI/CD Pipeline"
        GHA[GitHub Actions<br/>Workflow]
        RUNNER[Self-Hosted Runner<br/>on EC2]
    end

    subgraph "Production - EC2 Instance"
        subgraph "Docker Containers"
            PUB_C[Public Website<br/>Container<br/>:3000]
            ADMIN_C[Admin Backoffice<br/>Container<br/>:3001]
            API_C[API Container<br/>:4000]
            DB_C[(PostgreSQL<br/>Container<br/>:5433)]
            MINIO_C[MinIO Container<br/>:9000/:9001]
        end
    end

    subgraph "Alternative - Oracle VM"
        subgraph "API-Only Deployment"
            CADDY[Caddy Reverse Proxy<br/>HTTPS :443]
            API_O[API Container]
            DB_O[(PostgreSQL)]
            MINIO_O[MinIO]
        end
        VERCEL1[Vercel<br/>Public Website]
        VERCEL2[Vercel<br/>Admin Backoffice]
    end

    subgraph "Users"
        PUBLIC[👥 Public Users]
        ADMINS[👨‍💼 Administrators]
    end

    DEV -->|git push| GIT
    GIT -->|webhook| GHA
    GHA -->|triggers| RUNNER
    RUNNER -->|docker compose| PUB_C
    RUNNER -->|docker compose| ADMIN_C
    RUNNER -->|docker compose| API_C
    RUNNER -->|docker compose| DB_C
    RUNNER -->|docker compose| MINIO_C

    PUBLIC -->|HTTP| PUB_C
    ADMINS -->|HTTP| ADMIN_C
    PUB_C -->|REST| API_C
    ADMIN_C -->|REST| API_C
    API_C -->|SQL| DB_C
    API_C -->|S3 API| MINIO_C

    VERCEL1 -->|HTTPS| CADDY
    VERCEL2 -->|HTTPS| CADDY
    CADDY -->|Proxy| API_O
    API_O --> DB_O
    API_O --> MINIO_O

    style DEV fill:#6366f1,color:#fff
    style GIT fill:#000,color:#fff
    style GHA fill:#2088ff,color:#fff
    style PUB_C fill:#3b82f6,color:#fff
    style ADMIN_C fill:#1e5aa8,color:#fff
    style API_C fill:#10b981,color:#fff
    style DB_C fill:#f59e0b,color:#fff
    style MINIO_C fill:#ef4444,color:#fff
    style CADDY fill:#06b6d4,color:#fff
    style VERCEL1 fill:#000,color:#fff
    style VERCEL2 fill:#000,color:#fff
```

### Multilingual Data Flow Diagram

```mermaid
sequenceDiagram
    participant User as 👤 User (Browser)
    participant Web as 🌐 Public Website
    participant API as 🔌 API
    participant DB as 🗄️ PostgreSQL
    participant S3 as 📦 MinIO S3

    Note over User,S3: Homepage Loading (French)

    User->>Web: Visit homepage (lang: fr)
    Web->>API: GET /api/programs?language=fr
    API->>DB: SELECT FROM programs/program_translations
    DB-->>API: Programs with FR translations
    API-->>Web: JSON Programs (FR)

    Web->>API: GET /api/articles?language=fr
    API->>DB: SELECT FROM articles/article_translations
    DB-->>API: Articles with FR translations
    API-->>Web: JSON Articles (FR)

    Web->>API: GET /api/settings/stats
    API->>DB: SELECT FROM site_settings
    DB-->>API: Stats (people_helped, programs_launched, etc)
    API-->>Web: JSON Stats
    Web->>Web: Animate numbers

    Web->>API: GET /api/phrases?language=fr
    API->>DB: SELECT FROM phrases WHERE language='fr'
    DB-->>API: All FR phrases
    API-->>Web: JSON i18n phrases

    Web->>S3: GET /storage/assbep-media/program-image.jpg
    S3-->>Web: Image

    Web-->>User: Complete page in French

    Note over User,S3: Language Switch

    User->>Web: Click EN flag
    Web->>Web: Change i18n locale
    Web->>API: GET /api/programs?language=en
    API->>DB: SELECT ... WHERE language='en'
    DB-->>API: Programs EN
    API-->>Web: JSON Programs (EN)
    Web-->>User: Content updated in English
```

---

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

## 🌐 Production Deployment

### EC2 GitHub Runner Setup

This project uses **GitHub Actions** with a **self-hosted runner** on EC2 for automatic deployment.

#### Quick Deploy (10 Minutes)

**Step 1: Setup EC2 Runner (5 minutes)**

```bash
# 1. SSH into your EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# 2. Download and configure runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-x64-2.313.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.313.0.tar.gz

# 3. Go to GitHub → Settings → Actions → Runners → New self-hosted runner
# Copy and run the ./config.sh command they give you

# 4. Install as service
sudo ./svc.sh install && sudo ./svc.sh start
```

**Step 2: Add GitHub Secrets (2 minutes)**

Go to **Settings → Secrets → Actions** and add:

| Secret | Example Value | Description |
|--------|---------------|-------------|
| `POSTGRES_PASSWORD` | `MySecurePass123!` | PostgreSQL database password |
| `JWT_SECRET` | Run: `openssl rand -base64 64` | JWT token secret |
| `MINIO_ROOT_USER` | `minioadmin` | MinIO admin username |
| `MINIO_ROOT_PASSWORD` | `MinioPass123!` | MinIO admin password |
| `EC2_PUBLIC_IP` | `54.123.45.67` | Your EC2 public IP |

**Step 3: Deploy (3 minutes)**

```bash
# On your local machine
git push origin main

# Or trigger manually from GitHub Actions tab
```

**Step 4: Access Your App**

- 🌐 Website: `http://YOUR_EC2_IP:3000`
- 🔐 Admin: `http://YOUR_EC2_IP:3001` (admin@assbep.org / admin123)
- 🔌 API: `http://YOUR_EC2_IP:4000/api`
- 📦 MinIO: `http://YOUR_EC2_IP:9001`

#### Detailed GitHub Runner Setup

##### Prerequisites
- ✅ EC2 instance running (Ubuntu 22.04+ recommended, t3.medium or larger)
- ✅ Docker installed on EC2
- ✅ SSH access to EC2
- ✅ GitHub repository admin access
- ✅ At least 20GB storage

##### Install Docker on EC2

```bash
# If Docker is not installed
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
# Logout and login again
```

##### Configure EC2 Security Group

Open these inbound ports:

| Port | Service | Source |
|------|---------|--------|
| 22 | SSH | Your IP only |
| 3000 | Public Website | 0.0.0.0/0 |
| 3001 | Admin Backoffice | Your IP or company IPs |
| 4000 | API | 0.0.0.0/0 |
| 9000 | MinIO API | 0.0.0.0/0 or restricted |
| 9001 | MinIO Console | Your IP only |

##### Setup Runner on EC2

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Create runner directory
mkdir actions-runner && cd actions-runner

# Download runner
curl -o actions-runner-linux-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-x64-2.313.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.313.0.tar.gz
```

##### Get Runner Token from GitHub

1. Go to: `https://github.com/YOUR_USERNAME/assbep-health-platform/settings/actions/runners/new`
2. Select: **Linux** and **x64**
3. Copy the `./config.sh` command with the token

##### Configure and Start Runner

```bash
# Run the config command from GitHub (example):
./config.sh --url https://github.com/YOUR_USERNAME/assbep-health-platform --token YOUR_UNIQUE_TOKEN_HERE

# During configuration:
# - Name: ec2-production (or your choice)
# - Work folder: _work (default)
# - Labels: self-hosted,Linux,X64 (default)

# Install as service
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status  # Should show "active (running)"
```

##### Verify Runner Status

Go to: `https://github.com/YOUR_USERNAME/assbep-health-platform/settings/actions/runners`

Status should be **Idle** 🟢

##### Trigger First Deployment

**Option A: Push to main branch**
```bash
# On your local machine
cd assbep-health-platform
git add .
git commit -m "Initial deployment setup"
git push origin main
```

**Option B: Manual trigger**
1. Go to **Actions** tab in GitHub
2. Select **Deploy to EC2** workflow
3. Click **Run workflow** → **Run workflow**

##### Monitor Deployment

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Watch the deployment progress in real-time
4. Wait for ✅ green checkmark

##### Post-Deployment Verification

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Check containers
cd ~/actions-runner/_work/assbep-health-platform/assbep-health-platform
docker compose ps  # All should show "Up" and "healthy"
```

##### Useful Runner Commands

```bash
# View runner logs
sudo journalctl -u actions.runner.* -f

# Stop/Start/Restart runner
sudo ./svc.sh stop
sudo ./svc.sh start
sudo ./svc.sh restart

# Check status
sudo ./svc.sh status

# Uninstall runner service
sudo ./svc.sh uninstall

# Remove runner registration
./config.sh remove --token YOUR_REMOVAL_TOKEN
```

---

### API-Only Deployment (Oracle VM)

Deploy the backend separately on Oracle VM with Caddy for HTTPS, while frontends stay on Vercel.

#### Prerequisites

- Oracle VM with Ubuntu
- Public IP address
- Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Docker installed

#### VM Preparation

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

#### Setup API Deployment

```bash
# Clone repository
git clone https://github.com/KelySaina/assbep-health-platform.git
cd assbep-health-platform

# Create production environment file
cp .env.api.production.example .env.api.production
nano .env.api.production
```

#### Environment Configuration

Edit `.env.api.production` with:

```env
# Your Oracle VM hostname (use sslip.io for free SSL)
API_HOSTNAME=YOUR_ORACLE_PUBLIC_IP.sslip.io

# MinIO configuration
MINIO_PUBLIC_URL=https://YOUR_ORACLE_PUBLIC_IP.sslip.io/storage
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=your-secret-key
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your-secret-key

# CORS - Add your Vercel URLs
CORS_ORIGIN=https://assbep-public.vercel.app,https://assbep-admin.vercel.app,https://assbep-public-*.vercel.app,https://assbep-admin-*.vercel.app

# Database
POSTGRES_PASSWORD=your-secure-password

# Security
JWT_SECRET=generate-with-openssl-rand-base64-64
SESSION_SECRET=generate-with-openssl-rand-base64-64
```

**Important:** `MINIO_ACCESS_KEY` must match `MINIO_ROOT_USER`, and `MINIO_SECRET_KEY` must match `MINIO_ROOT_PASSWORD`.

#### Deploy Backend Stack

```bash
# Start services
docker compose --env-file .env.api.production -f docker-compose.api.yml up -d --build

# Check status
docker compose --env-file .env.api.production -f docker-compose.api.yml ps
docker compose --env-file .env.api.production -f docker-compose.api.yml logs -f api
```

The API container automatically:
- Runs Prisma migrations
- Seeds the database
- Starts the NestJS server

#### Verify API Deployment

Test these URLs:
- `https://YOUR_ORACLE_PUBLIC_IP.sslip.io/healthz`
- `https://YOUR_ORACLE_PUBLIC_IP.sslip.io/api/programs`
- `https://YOUR_ORACLE_PUBLIC_IP.sslip.io/storage/<bucket>/<file>` (for uploads)

#### Connect Vercel Frontends

Set this environment variable in both Vercel projects:

```env
VITE_API_URL=https://YOUR_ORACLE_PUBLIC_IP.sslip.io/api
```

Then redeploy both `public-website` and `admin-backoffice` on Vercel.

#### Update CORS for Vercel Previews

After deploying to Vercel, update `CORS_ORIGIN` in `.env.api.production`:

```env
CORS_ORIGIN=https://assbep-public.vercel.app,https://assbep-admin.vercel.app,https://assbep-public-*.vercel.app,https://assbep-admin-*.vercel.app
```

Restart the backend:

```bash
docker compose --env-file .env.api.production -f docker-compose.api.yml up -d
```

---

### Deployment Checklist

Use this checklist for complete EC2 deployment:

#### ✅ Phase 1: EC2 Preparation

- [ ] EC2 instance running (t3.medium+, Ubuntu 22.04, 20GB+ storage, public IP)
- [ ] Docker installed
- [ ] Security group configured with required ports
- [ ] SSH access working

#### ✅ Phase 2: GitHub Repository

- [ ] Repository forked/cloned
- [ ] Pushed to your GitHub account

#### ✅ Phase 3: GitHub Runner

- [ ] SSH into EC2
- [ ] Downloaded and extracted runner
- [ ] Configured runner with GitHub token
- [ ] Installed runner as service
- [ ] Verified runner shows as "Idle" in GitHub

#### ✅ Phase 4: GitHub Secrets

- [ ] `POSTGRES_PASSWORD` added
- [ ] `JWT_SECRET` added (generated with `openssl rand -base64 64`)
- [ ] `MINIO_ROOT_USER` added
- [ ] `MINIO_ROOT_PASSWORD` added
- [ ] `EC2_PUBLIC_IP` added

#### ✅ Phase 5: First Deployment

- [ ] Triggered deployment (push or manual)
- [ ] Monitored workflow in Actions tab
- [ ] Deployment completed successfully

#### ✅ Phase 6: Verification

- [ ] All containers running and healthy
- [ ] Public website accessible
- [ ] Admin backoffice accessible and can login
- [ ] API responding to requests
- [ ] MinIO console accessible

#### ✅ Phase 7: Post-Deployment

- [ ] Changed default admin password
- [ ] Updated all secrets to strong passwords
- [ ] Configured automatic backups
- [ ] Restricted admin panel to specific IPs
- [ ] Setup monitoring

#### ✅ Phase 8: Production Hardening (Optional)

- [ ] Setup domain name with SSL/TLS
- [ ] Configure reverse proxy (nginx/Caddy)
- [ ] Enable HTTPS
- [ ] Setup log rotation
- [ ] Configure firewall rules
- [ ] Setup backup automation

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
- Virus scanning recommended for production

### Authentication Security

- JWT tokens with configurable expiration
- bcrypt password hashing
- Session secrets rotation
- Rate limiting on authentication endpoints

### Environment Security

**Generate Secure Secrets:**
```bash
# JWT Secret
openssl rand -base64 64

# Session Secret
openssl rand -base64 64

# Strong password
openssl rand -base64 32
```

### Production Security Checklist

- [ ] Change all default passwords immediately
- [ ] Use strong, unique secrets for JWT and sessions
- [ ] Restrict admin backoffice access to specific IPs
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure firewall rules properly
- [ ] Disable unnecessary ports
- [ ] Keep Docker images updated
- [ ] Regular security audits
- [ ] Monitor access logs
- [ ] Setup fail2ban for SSH protection
- [ ] Enable automatic security updates
- [ ] Backup encryption for sensitive data

### Recommended Security Group Rules

| Port | Source | Purpose |
|------|--------|---------|
| 22 | Your IP only | SSH access |
| 80 | 0.0.0.0/0 | HTTP (redirect to HTTPS) |
| 443 | 0.0.0.0/0 | HTTPS |
| 3000 | 0.0.0.0/0 or CloudFlare IPs | Public website |
| 3001 | Your company IPs only | Admin panel |
| 4000 | 0.0.0.0/0 or Frontend IPs | API access |
| 9000 | Internal only or API only | MinIO API |
| 9001 | Your IP only | MinIO console |
| 5432 | Internal only (Docker network) | PostgreSQL |

### SSL/TLS Setup

**For production, use a reverse proxy with Let's Encrypt:**

```bash
# Install Certbot
sudo apt install certbot

# Get certificate (for Nginx)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

**Or use Caddy (automatically handles SSL):**

See `docker-compose.api.yml` for Caddy configuration example.

---

## 🆘 Troubleshooting Common Issues

### GitHub Runner Issues

**Runner is offline**
```bash
# On EC2, check service status
sudo ./svc.sh status

# Restart the service
sudo ./svc.sh stop
sudo ./svc.sh start

# View logs
sudo journalctl -u actions.runner.* -f
```

**Docker permission denied**
```bash
# Add user to docker group
sudo usermod -aG docker ubuntu

# Restart runner service
sudo ./svc.sh stop
sudo ./svc.sh start

# Or logout and login again
exit
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Containers not starting after deployment**
```bash
# SSH into EC2 and check logs
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd ~/actions-runner/_work/assbep-health-platform/assbep-health-platform
docker compose logs
```

**Disk space issues**
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove old containers and images
docker compose down
docker system prune -a --volumes
```

### API Deployment Issues

**HTTPS not working**
- Verify ports 80 and 443 are open in security group
- Verify `API_HOSTNAME` points to correct public IP
- Check no other service is binding ports 80 or 443
- Check Caddy logs: `docker compose logs caddy`

**Login works but uploads fail**
- Check `MINIO_PUBLIC_URL` is correct
- Verify Caddy `/storage/*` proxy is active
- Check MinIO container health: `docker compose ps minio`
- Test MinIO directly: `http://YOUR_IP:9001`

**CORS errors in browser**
- Verify `CORS_ORIGIN` includes exact Vercel URLs
- Add wildcard preview URLs: `https://assbep-*.vercel.app`
- Restart API after changing env: `docker compose restart api`

### General Docker Issues

**Services won't start**
```bash
# Check logs
docker compose logs

# Rebuild containers
docker compose down
docker compose up -d --build

# Check individual service
docker compose logs -f api
```

**Database connection errors**
```bash
# Check database is running
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U postgres -d assbep -c "SELECT version();"

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d
```

**MinIO files not accessible**
```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Access MinIO console
open http://localhost:9001

# Check bucket exists
docker compose exec minio mc ls local/
```

**Port already in use**
```bash
# Find what's using the port (e.g., 3000)
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
```

### Frontend Issues

**VITE_API_URL not working**
- Verify environment variable is set correctly
- Rebuild frontend: `docker compose up -d --build public-website`
- Check browser console for actual API URL being called
- Verify API is accessible: `curl http://YOUR_IP:4000/api/programs`

**Translations not loading**
- Check API `/api/phrases` endpoint
- Verify database has seeded phrases
- Check browser network tab for API calls
- Clear browser cache

### Performance Issues

**Slow response times**
```bash
# Check container resources
docker stats

# Check EC2 instance metrics
# In AWS Console: CloudWatch → EC2 → Your instance

# Upgrade instance type if needed
# Stop instance → Actions → Instance Settings → Change Instance Type
```

**Database slow queries**
```bash
# Access Prisma Studio
cd api
npx prisma studio

# Check database size
docker compose exec postgres psql -U postgres -d assbep -c "\l+"

# Analyze queries
docker compose logs postgres | grep "duration:"
```

### Backup and Recovery

**Create database backup**
```bash
# Backup database
docker compose exec postgres pg_dump -U postgres assbep > backup-$(date +%Y%m%d).sql

# Restore database
cat backup-20260311.sql | docker compose exec -T postgres psql -U postgres assbep
```

**Backup MinIO files**
```bash
# Backup MinIO data
docker compose exec minio mc mirror local/assbep-media /backup/minio/

# Or copy volume directly
sudo cp -r /var/lib/docker/volumes/assbep-health-platform_minio-data/_data ./minio-backup
```

**Complete backup script**
```bash
#!/bin/bash
# Save as /usr/local/bin/backup-assbep.sh

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/home/ubuntu/backups/$DATE"

mkdir -p $BACKUP_DIR

# Database backup
docker compose exec -T postgres pg_dump -U postgres assbep > $BACKUP_DIR/database.sql

# MinIO backup
docker compose exec minio mc mirror local/assbep-media $BACKUP_DIR/minio/

# Compress
tar -czf /home/ubuntu/backups/assbep-$DATE.tar.gz -C /home/ubuntu/backups $DATE
rm -rf $BACKUP_DIR

# Keep only last 7 backups
ls -t /home/ubuntu/backups/*.tar.gz | tail -n +8 | xargs rm -f

echo "Backup completed: assbep-$DATE.tar.gz"
```

**Schedule automatic backups**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-assbep.sh >> /var/log/assbep-backup.log 2>&1
```

---

## � Additional Resources

### Useful Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f api

# Restart a service
docker compose restart api

# Rebuild a service
docker compose up -d --build api

# Check service status
docker compose ps

# Execute command in container
docker compose exec api npm run prisma:studio

# Remove all containers and volumes (WARNING: deletes data)
docker compose down -v

# Clean up Docker system
docker system prune -a
```

### Database Commands

```bash
# Access PostgreSQL
docker compose exec postgres psql -U postgres -d assbep

# Run migrations
docker compose exec api npm run prisma:migrate

# Generate Prisma client
docker compose exec api npm run prisma:generate

# Seed database
docker compose exec api npm run prisma:seed

# Open Prisma Studio
cd api && npx prisma studio

# Database backup
docker compose exec postgres pg_dump -U postgres assbep > backup.sql

# Database restore
cat backup.sql | docker compose exec -T postgres psql -U postgres assbep
```

### Monitoring and Logs

```bash
# View real-time logs
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100

# View logs for specific time
docker compose logs --since 2024-01-01T00:00:00

# Container resource usage
docker stats

# Disk usage
docker system df

# Container inspection
docker compose exec api sh
```

### Development Workflow

```bash
# Local development (no Docker)
cd api && npm run start:dev
cd admin-backoffice && npm run dev
cd public-website && npm run dev

# Build for production
cd api && npm run build
cd admin-backoffice && npm run build
cd public-website && npm run build

# Lint code
npm run lint

# Format code
npm run format

# Run tests (if configured)
npm run test
```

### Default Credentials

**Production deployment creates these defaults:**

- **Admin User**
  - Email: `admin@assbep.org`
  - Password: `admin123`
  - **⚠️ CHANGE IMMEDIATELY IN PRODUCTION**

- **MinIO Console**
  - Username: Set via `MINIO_ROOT_USER`
  - Password: Set via `MINIO_ROOT_PASSWORD`
  - Default: `minioadmin` / `minioadmin`

### Environment Templates

The project includes these environment templates:

```
.env.example                      # Main Docker Compose env
.env.api.production.example       # API-only deployment
api/.env.example                  # API service env
admin-backoffice/.env.example     # Admin frontend env
public-website/.env.example       # Public frontend env
```

### Quick Reference URLs

**Local Development:**
- Public Website: http://localhost:3000
- Admin Backoffice: http://localhost:3001
- API: http://localhost:4000/api
- API Health: http://localhost:4000/healthz
- MinIO Console: http://localhost:9001
- PostgreSQL: localhost:5433

**Production (EC2):**
- Public Website: http://YOUR_EC2_IP:3000
- Admin Backoffice: http://YOUR_EC2_IP:3001
- API: http://YOUR_EC2_IP:4000/api
- MinIO Console: http://YOUR_EC2_IP:9001

**API-Only (Oracle VM with sslip.io):**
- API: https://YOUR_ORACLE_IP.sslip.io/api
- Health: https://YOUR_ORACLE_IP.sslip.io/healthz
- Storage: https://YOUR_ORACLE_IP.sslip.io/storage/
- MinIO Console: https://YOUR_ORACLE_IP.sslip.io:9001

### Performance Tips

1. **Use CDN for static assets** - CloudFlare or AWS CloudFront
2. **Enable Gzip compression** - Already enabled in Nginx/Caddy
3. **Optimize images** - Use WebP format, compress before upload
4. **Database indexing** - Prisma schema includes key indexes
5. **Caching strategy** - Use Redis for session storage (optional)
6. **Horizontal scaling** - Use load balancer with multiple API instances
7. **Database connection pooling** - Prisma handles this automatically

### Migration from Other Platforms

If migrating from another CMS:

1. Export data to JSON/CSV format
2. Create Prisma seed script with your data
3. Adjust schema if needed
4. Run migrations and seed
5. Upload media files to MinIO
6. Update file references in database

### Contributing

If you want to contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Need Help?

- 📖 Check the [Troubleshooting](#-troubleshooting-common-issues) section
- 💬 Open an issue on GitHub
- 📧 Contact: contact@assbep.org
- 📚 Read NestJS docs: https://docs.nestjs.com
- 📚 Read Vue docs: https://vuejs.org
- 📚 Read Prisma docs: https://www.prisma.io/docs

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

**Last Updated:** March 11, 2026
