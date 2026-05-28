#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🌱 Running database seed..."
npx ts-node --transpile-only -P tsconfig.json prisma/seed.ts || echo "⚠️  Seed skipped (data may already exist)"

echo "🚀 Starting API server..."
exec node dist/src/main
