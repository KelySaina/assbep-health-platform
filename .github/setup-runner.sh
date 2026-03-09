# Quick Start Script for EC2 Runner Setup

echo "🚀 ASSBEP Health Platform - EC2 Runner Setup"
echo "=============================================="
echo ""

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script must be run on your EC2 Linux instance"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Run: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi

echo "✅ Docker is installed"

# Check if user is in docker group
if ! groups | grep -q docker; then
    echo "⚠️  Adding current user to docker group..."
    sudo usermod -aG docker $USER
    echo "⚠️  Please logout and login again for docker group to take effect"
    echo "   Then run this script again"
    exit 1
fi

echo "✅ User has docker permissions"

# Create actions-runner directory
if [ -d "actions-runner" ]; then
    echo "⚠️  actions-runner directory already exists"
    read -p "Remove and reinstall? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd actions-runner
        sudo ./svc.sh stop 2>/dev/null || true
        sudo ./svc.sh uninstall 2>/dev/null || true
        cd ..
        rm -rf actions-runner
    else
        echo "❌ Aborted"
        exit 1
    fi
fi

echo "📁 Creating actions-runner directory..."
mkdir -p actions-runner && cd actions-runner

# Download latest runner
echo "⬇️  Downloading GitHub Actions runner..."
RUNNER_VERSION="2.313.0"
curl -o actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz -L \
    https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

echo "📦 Extracting runner..."
tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

echo ""
echo "✅ GitHub Actions runner files are ready!"
echo ""
echo "📋 NEXT STEPS:"
echo "============="
echo ""
echo "1. Go to your GitHub repository:"
echo "   https://github.com/YOUR_USERNAME/assbep-health-platform/settings/actions/runners/new"
echo ""
echo "2. Select 'Linux' and 'x64'"
echo ""
echo "3. Copy the './config.sh' command with your token and run it here"
echo "   Example:"
echo "   ./config.sh --url https://github.com/YOUR_USERNAME/assbep-health-platform --token YOUR_TOKEN"
echo ""
echo "4. After configuration, install as a service:"
echo "   sudo ./svc.sh install"
echo "   sudo ./svc.sh start"
echo ""
echo "5. Check status:"
echo "   sudo ./svc.sh status"
echo ""
