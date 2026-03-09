# 🚀 Quick Deployment Guide

## TL;DR - Get Running in 10 Minutes

### Step 1: Setup EC2 Runner (5 minutes)

```bash
# 1. SSH into your EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# 2. Run this one command
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-x64-2.313.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.313.0.tar.gz

# 3. Go to GitHub → Settings → Actions → Runners → New self-hosted runner
# Copy and run the ./config.sh command they give you

# 4. Install as service
sudo ./svc.sh install && sudo ./svc.sh start
```

### Step 2: Add GitHub Secrets (2 minutes)

Go to **Settings → Secrets → Actions** and add:

```
POSTGRES_PASSWORD     = MySecurePass123!
JWT_SECRET           = (run: openssl rand -base64 64)
MINIO_ROOT_USER      = minioadmin
MINIO_ROOT_PASSWORD  = MinioPass123!
EC2_PUBLIC_IP        = 54.123.45.67
```

### Step 3: Deploy (3 minutes)

```bash
# On your local machine
git push origin main

# Or trigger manually from GitHub Actions tab
```

### Step 4: Access Your App

- 🌐 Website: `http://YOUR_EC2_IP:3000`
- 🔐 Admin: `http://YOUR_EC2_IP:3001` (admin@assbep.org / admin123)
- 🔌 API: `http://YOUR_EC2_IP:4000/api`
- 📦 MinIO: `http://YOUR_EC2_IP:9001`

---

## Important Files

- 📖 [**Full Setup Guide**](.github/RUNNER_SETUP.md) - Detailed instructions
- ✅ [**Deployment Checklist**](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- 🔧 [**GitHub Workflow**](.github/workflows/deploy.yml) - CI/CD configuration
- 🐳 [**Production Compose**](docker-compose.prod.yml) - Production overrides

---

## Troubleshooting

### Runner offline?
```bash
sudo ./svc.sh status
sudo ./svc.sh restart
```

### Docker permission denied?
```bash
sudo usermod -aG docker ubuntu
# Then logout and login
```

### Services not starting?
```bash
cd ~/actions-runner/_work/assbep-health-platform/assbep-health-platform
docker compose logs
```

### Need to redeploy?
```bash
# Manual redeploy on EC2
cd ~/actions-runner/_work/assbep-health-platform/assbep-health-platform
docker compose down
docker compose up -d --build
```

---

## Security Checklist After Deployment

- [ ] Change default admin password
- [ ] Update all secrets to strong passwords
- [ ] Restrict Security Group Rules (admin panel to specific IPs)
- [ ] Setup SSL/HTTPS with domain
- [ ] Enable automatic backups
- [ ] Setup monitoring

---

⚡ **That's it!** Your platform is live on EC2 with automatic deployments.
