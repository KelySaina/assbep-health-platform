# 🚀 EC2 Deployment Checklist

Complete this checklist to deploy ASSBEP Health Platform to your EC2 instance.

## Phase 1: EC2 Preparation

- [ ] **EC2 Instance Running**
  - Instance type: t3.medium or larger recommended
  - OS: Ubuntu 22.04 LTS
  - Storage: At least 20GB
  - Public IP assigned

- [ ] **Docker Installed on EC2**
  ```bash
  # If not installed, run:
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker ubuntu
  # Logout and login again
  ```

- [ ] **Security Group Configured**
  - Port 22 (SSH) - Your IP only
  - Port 3000 (Public Website) - 0.0.0.0/0
  - Port 3001 (Admin) - Your IP or company IPs
  - Port 4000 (API) - 0.0.0.0/0
  - Port 9000 (MinIO API) - 0.0.0.0/0 or restricted
  - Port 9001 (MinIO Console) - Your IP only

- [ ] **SSH Access Working**
  ```bash
  ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
  ```

## Phase 2: GitHub Repository Setup

- [ ] **Fork/Clone Repository** (if not done)
  ```bash
  git clone https://github.com/KelySaina/assbep-health-platform.git
  ```

- [ ] **Push to Your GitHub Repository**
  ```bash
  cd assbep-health-platform
  git remote set-url origin https://github.com/YOUR_USERNAME/assbep-health-platform.git
  git push origin main
  ```

## Phase 3: GitHub Self-Hosted Runner

- [ ] **SSH into EC2**
  ```bash
  ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
  ```

- [ ] **Download Runner Setup Script**
  ```bash
  cd ~
  # Option 1: If already in your repo
  curl -o setup-runner.sh https://raw.githubusercontent.com/YOUR_USERNAME/assbep-health-platform/main/.github/setup-runner.sh

  # Option 2: Manual setup
  mkdir actions-runner && cd actions-runner
  curl -o actions-runner-linux-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-x64-2.313.0.tar.gz
  tar xzf ./actions-runner-linux-x64-2.313.0.tar.gz
  ```

- [ ] **Get Runner Token from GitHub**
  1. Go to: `https://github.com/YOUR_USERNAME/assbep-health-platform/settings/actions/runners/new`
  2. Select: **Linux** and **x64**
  3. Copy the `./config.sh` command with the token

- [ ] **Configure Runner**
  ```bash
  # Paste the command from GitHub (example):
  ./config.sh --url https://github.com/YOUR_USERNAME/assbep-health-platform --token YOUR_UNIQUE_TOKEN_HERE

  # When prompted:
  # Name: ec2-production (or your choice)
  # Work folder: _work (default)
  # Labels: self-hosted,Linux,X64 (default)
  ```

- [ ] **Install Runner as Service**
  ```bash
  sudo ./svc.sh install
  sudo ./svc.sh start
  sudo ./svc.sh status  # Should show "active (running)"
  ```

- [ ] **Verify Runner is Online**
  - Go to: `https://github.com/YOUR_USERNAME/assbep-health-platform/settings/actions/runners`
  - Status should be **Idle** 🟢

## Phase 4: GitHub Secrets Configuration

Go to: `https://github.com/YOUR_USERNAME/assbep-health-platform/settings/secrets/actions`

Click **New repository secret** and add each of these:

- [ ] **POSTGRES_PASSWORD**
  ```
  Example: MySecureP@ssw0rd2024!
  ```

- [ ] **JWT_SECRET**
  ```bash
  # Generate with:
  openssl rand -base64 64
  ```

- [ ] **MINIO_ROOT_USER**
  ```
  Example: assbep-admin
  ```

- [ ] **MINIO_ROOT_PASSWORD**
  ```
  Example: MinIO@SecurePass123
  ```

- [ ] **EC2_PUBLIC_IP**
  ```
  Example: 54.123.45.67
  (Find it in EC2 console)
  ```

## Phase 5: First Deployment

- [ ] **Trigger Deployment**

  **Option A: Push to main branch**
  ```bash
  # On your local machine
  cd assbep-health-platform
  git add .
  git commit -m "Initial deployment setup"
  git push origin main
  ```

  **Option B: Manual trigger**
  1. Go to **Actions** tab
  2. Select **Deploy to EC2** workflow
  3. Click **Run workflow** → **Run workflow**

- [ ] **Monitor Deployment**
  1. Go to **Actions** tab in GitHub
  2. Click on the running workflow
  3. Watch the logs in real-time
  4. Wait for ✅ green checkmark

## Phase 6: Verification

- [ ] **Check Services are Running**
  ```bash
  # SSH into EC2
  ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

  # Navigate to deployment directory
  cd ~/actions-runner/_work/assbep-health-platform/assbep-health-platform

  # Check containers
  docker compose ps
  # All should show "Up" and "healthy"
  ```

- [ ] **Test Public Website**
  - Open: `http://YOUR_EC2_IP:3000`
  - Should see ASSBEP homepage

- [ ] **Test Admin Backoffice**
  - Open: `http://YOUR_EC2_IP:3001`
  - Login with default credentials:
    - Email: `admin@assbep.org`
    - Password: `admin123`

- [ ] **Test API**
  - Open: `http://YOUR_EC2_IP:4000/api/programs`
  - Should return JSON data

- [ ] **Test MinIO Console**
  - Open: `http://YOUR_EC2_IP:9001`
  - Login with your MINIO_ROOT_USER and MINIO_ROOT_PASSWORD

## Phase 7: Post-Deployment

- [ ] **Change Default Admin Password**
  - Login to admin backoffice
  - Go to User Management
  - Update admin password

- [ ] **Setup Automatic Backups**
  ```bash
  # SSH into EC2
  # Create backup script
  sudo nano /usr/local/bin/backup-assbep.sh
  ```

  ```bash
  #!/bin/bash
  DATE=$(date +%Y%m%d_%H%M%S)
  BACKUP_DIR="/home/ubuntu/backups"
  mkdir -p $BACKUP_DIR

  # Backup PostgreSQL
  docker exec assbep-postgres pg_dump -U postgres assbep > $BACKUP_DIR/assbep_db_$DATE.sql

  # Backup MinIO data
  docker exec assbep-minio mc mirror /data $BACKUP_DIR/minio_$DATE/

  # Keep only last 7 days
  find $BACKUP_DIR -name "assbep_db_*" -type f -mtime +7 -delete
  find $BACKUP_DIR -name "minio_*" -type d -mtime +7 -exec rm -rf {} \;
  ```

  ```bash
  sudo chmod +x /usr/local/bin/backup-assbep.sh

  # Add to crontab (daily at 2 AM)
  (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-assbep.sh") | crontab -
  ```

- [ ] **Setup Domain Name (Optional)**
  - Point your domain to EC2 IP
  - Configure SSL with Let's Encrypt
  - Setup reverse proxy (nginx/caddy)

- [ ] **Setup Monitoring (Optional)**
  - CloudWatch for EC2 metrics
  - Application monitoring (Sentry, LogRocket)
  - Uptime monitoring (UptimeRobot, Pingdom)

## Troubleshooting

### Runner Not Showing Online
```bash
sudo ./svc.sh status
sudo ./svc.sh stop
sudo ./svc.sh start
```

### Docker Permission Denied
```bash
sudo usermod -aG docker ubuntu
# Logout and login again
```

### Containers Not Starting
```bash
cd ~/actions-runner/_work/assbep-health-platform/assbep-health-platform
docker compose logs
docker compose down
docker compose up -d --build
```

### Out of Disk Space
```bash
df -h  # Check disk usage
docker system prune -a -f  # Clean up
```

### Check Deployment Logs
```bash
cd ~/actions-runner/_work/assbep-health-platform/assbep-health-platform
docker compose logs -f
```

## Useful Commands

```bash
# Restart all services
docker compose restart

# Stop all services
docker compose down

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f api
docker compose logs -f public-website

# Clean up
docker system prune -a

# Check resource usage
docker stats
```

## Support

- 📖 [Full Runner Setup Guide](.github/RUNNER_SETUP.md)
- 📖 [Main README](README.md)
- 🐛 [Report Issues](https://github.com/YOUR_USERNAME/assbep-health-platform/issues)

---

✅ **Deployment Complete!** Your ASSBEP Health Platform is now live on EC2!
