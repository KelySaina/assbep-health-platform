#!/bin/bash

echo "🚀 Starting ASSBEP Health Platform..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start all services
echo "📦 Building and starting all containers..."
docker compose up -d --build

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check status
echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ ASSBEP Health Platform is ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Public Website:     http://localhost:3000"
echo "🔐 Admin Backoffice:   http://localhost:3001"
echo "🔌 API:                http://localhost:4000/api"
echo "🗄️  PostgreSQL:         localhost:5433"
echo ""
echo "👤 Admin Login:"
echo "   Email:    admin@assbep.org"
echo "   Password: admin123"
echo ""
echo "📋 View logs:          docker compose logs -f"
echo "🛑 Stop all:           docker compose down"
echo ""
