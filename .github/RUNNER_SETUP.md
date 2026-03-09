# GitHub Self-Hosted Runner Setup for EC2

This guide walks you through setting up your EC2 instance as a GitHub self-hosted runner.

## Prerequisites

- ✅ EC2 instance running (Ubuntu recommended)
- ✅ Docker installed on EC2
- ✅ SSH access to EC2
- ✅ GitHub repository admin access

## Step 1: SSH into Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## Step 2: Install GitHub Actions Runner

### 2.1 Go to GitHub Repository Settings

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Actions** → **Runners**
3. Click **New self-hosted runner**
4. Select **Linux** and **x64**
5. Copy the commands provided (they include a unique token)

### 2.2 Run the Setup Commands on EC2

GitHub will provide commands similar to these:

```bash
# Create a folder for the runner
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-x64-2.313.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.313.0.tar.gz

# Configure the runner
./config.sh --url https://github.com/YOUR_USERNAME/assbep-health-platform --token YOUR_TOKEN

# During configuration:
# - Name: ec2-runner (or your preferred name)
# - Work folder: _work (default)
# - Labels: self-hosted,Linux,X64 (default)
```

### 2.3 Install Runner as a Service

```bash
# Install the service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

## Step 3: Configure GitHub Repository Secrets

Go to your repository **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

| Secret Name | Example Value | Description |
|-------------|---------------|-------------|
| `POSTGRES_PASSWORD` | `your-secure-password-123` | PostgreSQL database password |
| `JWT_SECRET` | `your-jwt-secret-key-change-me` | JWT token secret for API |
| `MINIO_ROOT_USER` | `minioadmin` | MinIO admin username |
| `MINIO_ROOT_PASSWORD` | `minioadmin123` | MinIO admin password |
| `EC2_PUBLIC_IP` | `54.123.45.67` | Your EC2 public IP address |

## Step 4: Configure EC2 Security Group

Ensure your EC2 security group allows inbound traffic on these ports:

| Port | Service | Source |
|------|---------|--------|
| 22 | SSH | Your IP |
| 3000 | Public Website | 0.0.0.0/0 |
| 3001 | Admin Backoffice | Your IP or specific IPs |
| 4000 | API | 0.0.0.0/0 |
| 9000 | MinIO API | 0.0.0.0/0 or specific IPs |
| 9001 | MinIO Console | Your IP |
| 5433 | PostgreSQL | (Optional, not recommended publicly) |

## Step 5: Verify Runner Installation

1. Go to your repository **Settings** → **Actions** → **Runners**
2. You should see your runner listed as **Idle** (green)
3. If it shows **Offline**, check the service status on EC2:
   ```bash
   sudo ./svc.sh status
   ```

## Step 6: Test Deployment

### Option 1: Push to main/master branch
```bash
git push origin main
```

### Option 2: Manually trigger workflow
1. Go to **Actions** tab in GitHub
2. Select **Deploy to EC2** workflow
3. Click **Run workflow** → **Run workflow**

## Step 7: Monitor Deployment

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Watch the deployment progress in real-time

## Troubleshooting

### Runner is offline
```bash
# On EC2, check service status
sudo ./svc.sh status

# Restart the service
sudo ./svc.sh stop
sudo ./svc.sh start
```

### Docker permission denied
```bash
# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Restart runner service
sudo ./svc.sh stop
sudo ./svc.sh start

# Or logout and login again
exit
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Containers not starting
```bash
# SSH into EC2 and check logs
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd /home/ubuntu/actions-runner/_work/assbep-health-platform/assbep-health-platform
docker compose logs
```

### Check disk space
```bash
df -h  # Check disk usage
docker system prune -a  # Clean up unused containers/images
```

## Useful Commands

```bash
# View runner logs
sudo journalctl -u actions.runner.* -f

# Stop runner service
sudo ./svc.sh stop

# Start runner service
sudo ./svc.sh start

# Uninstall runner service
sudo ./svc.sh uninstall

# Remove runner registration
./config.sh remove --token YOUR_REMOVAL_TOKEN
```

## Post-Deployment Access

After successful deployment, access your services:

- **Public Website**: http://YOUR_EC2_PUBLIC_IP:3000
- **Admin Backoffice**: http://YOUR_EC2_PUBLIC_IP:3001
- **API**: http://YOUR_EC2_PUBLIC_IP:4000/api
- **MinIO Console**: http://YOUR_EC2_PUBLIC_IP:9001

## Security Recommendations

1. **Use environment-specific passwords** (not the defaults)
2. **Restrict admin backoffice access** to specific IPs
3. **Enable HTTPS** using a reverse proxy (nginx) with Let's Encrypt
4. **Use secrets** for all sensitive data (don't hardcode)
5. **Regular backups** of PostgreSQL and MinIO data
6. **Monitor disk usage** - Set up alerts
7. **Update runner regularly** - Check for GitHub runner updates

## Next Steps

- [ ] Set up domain name and SSL/TLS
- [ ] Configure backup automation
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure log aggregation
- [ ] Set up staging environment
