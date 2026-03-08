# ASSBEP Health Platform - Docker Setup 🐳

Complete dockerized deployment of the ASSBEP Health Platform including PostgreSQL database, NestJS API, Vue 3 public website, and admin backoffice.

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Stack                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Public     │  │    Admin     │  │  PostgreSQL  │     │
│  │   Website    │  │  Backoffice  │  │   Database   │     │
│  │   (Vue 3)    │  │   (Vue 3)    │  │   Postgres   │     │
│  │  Port 3000   │  │  Port 3001   │  │  Port 5433   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────┬───────┴──────────────────┘              │
│                   │                                         │
│           ┌───────▼────────┐                                │
│           │   NestJS API   │                                │
│           │   Port 4000    │                                │
│           └────────────────┘                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose v2.0+

### Start All Services

```bash
# From the project root
cd /home/kely/ASSBEP/assbep-health-platform

# Build and start all containers
docker compose up -d --build

# View logs
docker compose logs -f

# Check status
docker compose ps
```

### Stop All Services

```bash
docker compose down

# Stop and remove volumes (WARNING: deletes all data)
docker compose down -v
```

## 📦 Services

### 🌐 Public Website (Vue 3 + Vite)
- **URL**: http://localhost:3000
- **Tech**: Vue 3, Vite 5, TailwindCSS 3.4, Vue Router 4, Vue I18n 9
- **Features**:
  - Bilingual (EN/FR)
  - Programs, Blog, Resources, Partners, Contact
  - Server-side routing with Nginx

### 🔐 Admin Backoffice (Vue 3 + Vite)
- **URL**: http://localhost:3001
- **Login**: `admin@assbep.org` / `admin123`
- **Tech**: Vue 3, Vite 5, TailwindCSS, Pinia, Axios
- **Features**:
  - CRUD for Programs, Articles, Resources, Partners, Users
  - Translation management
  - Media library
  - Site settings

### 🔌 NestJS API
- **URL**: http://localhost:4000
- **Docs**: Explore endpoints at `/api/*`
- **Tech**: NestJS 10, Prisma 5, PostgreSQL, JWT Auth
- **Features**:
  - RESTful API
  - JWT authentication
  - Role-based access (SUPER_ADMIN, EDITOR, TRANSLATOR)
  - Auto-migration & seeding on startup

### 🗄️ PostgreSQL Database
- **Host**: localhost:5433 (mapped from container port 5432)
- **Database**: `assbep`
- **User**: `postgres`
- **Password**: `postgres`
- **Persistence**: Docker volume `postgres_data`

## 🔧 Configuration

### Environment Variables

API environment variables are set in `docker-compose.yml`:

```yaml
DATABASE_URL: postgresql://postgres:postgres@postgres:5432/assbep?schema=public
JWT_SECRET: assbep-secret-key-change-in-production
PORT: 4000
```

### Port Mappings

| Service | Container Port | Host Port |
|---------|---------------|-----------|
| Public Website | 80 | 3000 |
| Admin Backoffice | 80 | 3001 |
| NestJS API | 4000 | 4000 |
| PostgreSQL | 5432 | 5433 |

**Note**: PostgreSQL is mapped to port 5433 on the host to avoid conflicts with locally-running PostgreSQL instances.

## 📊 Database

### Migrations

Prisma migrations run automatically when the API container starts:

```bash
# Inside the container, entrypoint runs:
npx prisma migrate deploy
```

### Seed Data

The database is automatically seeded on first run with:

- **1 Admin User**: `admin@assbep.org` (password: `admin123`)
- **5 Programs**: Maternal Health, Vaccination, Nutrition, Wellness, Outreach
- **3 Articles**: Community news and health tips
- **5 Partners**: WHO, UNICEF, Red Cross, Ministry of Health, Community Foundation
- **6 Site Settings**: Contact info, office hours, etc.

### Manual Database Access

```bash
# Connect to PostgreSQL from host
psql -h localhost -p 5433 -U postgres -d assbep

# Or exec into the container
docker exec -it assbep-postgres psql -U postgres -d assbep
```

### Reset Database

```bash
# Stop containers and remove volumes
docker compose down -v

# Start fresh
docker compose up -d
```

## 🛠️ Development

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f public-website
docker compose logs -f admin-backoffice
docker compose logs -f postgres
```

### Rebuilding a Single Service

```bash
# Rebuild only the API
docker compose up -d --build api

# Rebuild frontends
docker compose up -d --build public-website admin-backoffice
```

### Exec into Containers

```bash
# API container
docker exec -it assbep-api sh

# Database container
docker exec -it assbep-postgres sh
```

### Prisma Studio (Database GUI)

```bash
# Run Prisma Studio inside the API container
docker exec -it assbep-api npx prisma studio
```

Then visit http://localhost:5555

## 🧪 Testing the API

### Authentication

```bash
# Login as admin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@assbep.org","password":"admin123"}'

# Returns JWT token
```

### Public Endpoints (No Auth)

```bash
# Get all programs
curl http://localhost:4000/api/programs

# Get partners
curl http://localhost:4000/api/partners

# Get articles
curl http://localhost:4000/api/articles

# Get site settings
curl http://localhost:4000/api/settings
```

### Protected Endpoints (Requires JWT)

```bash
# Get all users (admin only)
curl http://localhost:4000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Project Structure

```
assbep-health-platform/
├── docker-compose.yml          # Main orchestration file
├── .dockerignore              # Global Docker ignore
│
├── api/                       # NestJS Backend
│   ├── Dockerfile            # Multi-stage build (Node Alpine)
│   ├── docker-entrypoint.sh  # Migrations + seed + start
│   ├── .dockerignore
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts          # Seed data
│   │   └── migrations/      # Migration history
│   └── src/                 # NestJS source code
│
├── public-website/           # Vue 3 Public Site
│   ├── Dockerfile           # Multi-stage: build + nginx
│   ├── nginx.conf          # Nginx config with SPA routing
│   ├── .dockerignore
│   └── src/                # Vue source code
│
└── admin-backoffice/        # Vue 3 Admin CMS
    ├── Dockerfile           # Multi-stage: build + nginx
    ├── nginx.conf          # Nginx config with SPA routing
    ├── .dockerignore
    └── src/                # Vue source code
```

## 🔐 Security Notes

### ⚠️ Production Checklist

Before deploying to production:

1. **Change JWT Secret**: Update `JWT_SECRET` in `docker-compose.yml`
2. **Change DB Password**: Update PostgreSQL password
3. **Change Admin Password**: After first login, update the admin user password
4. **Use HTTPS**: Set up SSL/TLS certificates (e.g., Let's Encrypt)
5. **Environment Variables**: Use Docker secrets or external env files
6. **Firewall**: Restrict port access (only expose 80/443)
7. **Update CORS**: Update allowed origins in `api/src/main.ts`

### Current Defaults (Development Only)

- Database: `postgres:postgres`
- Admin: `admin@assbep.org:admin123`
- JWT Secret: `assbep-secret-key-change-in-production`

## 🐛 Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Check what's using the port
sudo lsof -i :3000  # or :3001, :4000, :5433

# Change ports in docker-compose.yml
ports:
  - "3002:80"  # Change host port
```

### API Health Check Failing

```bash
# Check API logs
docker compose logs api

# Check if API is responding
curl http://localhost:4000/api/programs
```

### Database Connection Issues

```bash
# Check PostgreSQL logs
docker compose logs postgres

# Verify database is healthy
docker compose ps

# Reset database
docker compose down -v && docker compose up -d
```

### Permission Errors

```bash
# Ensure docker-entrypoint.sh is executable
chmod +x api/docker-entrypoint.sh
```

## 📝 Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f [service]

# Rebuild and restart
docker compose up -d --build

# Remove all containers and volumes
docker compose down -v

# Check service health
docker compose ps

# Exec into container
docker exec -it [container-name] sh

# View resource usage
docker stats
```

## 🎯 Access Points

Once all containers are running:

| Service | URL | Credentials |
|---------|-----|------------|
| Public Website | http://localhost:3000 | - |
| Admin Backoffice | http://localhost:3001 | admin@assbep.org / admin123 |
| API | http://localhost:4000/api/* | JWT required for protected routes |
| PostgreSQL | localhost:5433 | postgres / postgres |

## 📄 License

This project is part of the ASSBEP Health Platform initiative.

## 🤝 Support

For issues or questions, please check the logs first:

```bash
docker compose logs -f
```

Common issues are documented in the Troubleshooting section above.

---

**Built with ❤️ for Community Health**
