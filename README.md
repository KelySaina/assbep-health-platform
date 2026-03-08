# ASSBEP Health Platform

**"Improving Community Health Together — Améliorer la Santé de la Population Ensemble"**

A full-stack multilingual (EN/FR) health platform built for ASSBEP, featuring a public-facing website and an admin backoffice CMS.

## 🏗️ Architecture

```
assbep-health-platform/
├── public-website/    # Vue 3 + Vite — Port 3000
├── admin-backoffice/  # Vue 3 + Vite — Port 3001
└── api/               # NestJS + Prisma + PostgreSQL — Port 4000
```

## 🚀 Quick Start

### 🐳 Docker (Recommended)

**The easiest way to run the entire platform:**

```bash
# Start everything with one command
./start.sh

# Or manually
docker compose up -d --build

# Stop
docker compose down
```

**Access Points:**
- Public Website: http://localhost:3000
- Admin Backoffice: http://localhost:3001 (admin@assbep.org / admin123)
- API: http://localhost:4000/api
- PostgreSQL: localhost:5433

📖 **[Full Docker Documentation](./DOCKER.md)**

---

### 💻 Manual Setup (Development)

#### Prerequisites
- Node.js 18+
- PostgreSQL 14+

#### 1. Database Setup
```bash
createdb assbep
cd api
# Edit .env with your DATABASE_URL
npx prisma migrate dev --name init
npm run prisma:seed
```

#### 2. Start All Services
```bash
# Terminal 1 — API
cd api && npm run start:dev

# Terminal 2 — Public Website
cd public-website && npm run dev

# Terminal 3 — Admin
cd admin-backoffice && npm run dev
```

### Default Admin Login
- **Email:** admin@assbep.org
- **Password:** admin123

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#1E5AA8` |
| Primary Dark | `#143C73` |
| Primary Light | `#E8F1FB` |
| Headline Font | Poppins (600) |
| Body Font | Inter (400) |

## 📦 Tech Stack

**Frontend:** Vue 3, Vite 5, TailwindCSS, Vue Router 4, Vue I18n 9, Pinia, Axios
**Backend:** NestJS 10, Prisma 5, PostgreSQL, JWT, bcryptjs
# assbep-health-platform
