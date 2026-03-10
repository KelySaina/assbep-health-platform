# API Deployment

This repository can deploy the backend separately on your Oracle VM with:

- Caddy for HTTPS
- PostgreSQL for the database
- MinIO for file storage
- NestJS API

The frontend apps stay on Vercel.

## 1. What to deploy first

Deploy the backend first.

You need the final API URL before the Vercel apps can call it reliably.

Use a free hostname based on your VM public IP:

`YOUR_ORACLE_PUBLIC_IP.sslip.io`

Example:

`129.146.10.20.sslip.io`

## 2. VM preparation

Open these inbound ports on the Oracle VM:

- `22` for SSH
- `80` for HTTP
- `443` for HTTPS

Do not expose `5432`, `9000`, or `9001` publicly.

Install Docker and Compose plugin on Ubuntu:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

## 3. Copy the repo and create env

```bash
git clone https://github.com/KelySaina/assbep-health-platform.git
cd assbep-health-platform
cp .env.api.production.example .env.api.production
```

Edit `.env.api.production` and set at minimum:

- `API_HOSTNAME=YOUR_ORACLE_PUBLIC_IP.sslip.io`
- `MINIO_PUBLIC_URL=https://YOUR_ORACLE_PUBLIC_IP.sslip.io/storage`
- `CORS_ORIGIN` with your two Vercel project URLs
- all secrets and passwords

## 4. Start the backend stack

```bash
docker compose --env-file .env.api.production -f docker-compose.api.yml up -d --build
```

Check status:

```bash
docker compose --env-file .env.api.production -f docker-compose.api.yml ps
docker compose --env-file .env.api.production -f docker-compose.api.yml logs -f api
```

The API container automatically:

- runs Prisma migrations
- runs the seed script
- starts the NestJS server

Default seeded admin user:

- email: `admin@assbep.org`
- password: `admin123`

Change that password immediately after first login.

## 5. Verify the API

Test these URLs in your browser:

- `https://YOUR_ORACLE_PUBLIC_IP.sslip.io/healthz`
- `https://YOUR_ORACLE_PUBLIC_IP.sslip.io/api/programs`

If uploads are used, uploaded files will be served from:

- `https://YOUR_ORACLE_PUBLIC_IP.sslip.io/storage/<bucket>/<file>`

## 6. Connect Vercel

Set this env var in both Vercel projects:

```env
VITE_API_URL=https://YOUR_ORACLE_PUBLIC_IP.sslip.io/api
```

Then redeploy `public-website` and `admin-backoffice`.

## 7. Update CORS when Vercel URLs are known

The API supports wildcard origin patterns for Vercel previews.

Example:

```env
CORS_ORIGIN=https://assbep-public.vercel.app,https://assbep-admin.vercel.app,https://assbep-public-*.vercel.app,https://assbep-admin-*.vercel.app
```

After editing `.env.api.production`, restart the backend:

```bash
docker compose --env-file .env.api.production -f docker-compose.api.yml up -d
```

## 8. Common problems

If HTTPS does not come up:

- verify ports `80` and `443` are open
- verify `API_HOSTNAME` points to the VM public IP
- verify no other service is already binding ports `80` or `443`

If login works but uploads fail:

- check `MINIO_PUBLIC_URL`
- check Caddy `/storage/*` proxy is active
- check `minio` container health

If the browser reports CORS errors:

- verify `CORS_ORIGIN`
- make sure you included the exact Vercel production URL
- add wildcard preview URLs if preview deployments must work