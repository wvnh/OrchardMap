#!/bin/bash
# deploy-production.sh - Production deployment script
# Usage: ./scripts/deploy-production.sh

set -e  # Exit on error

echo "🚀 OrchardMap Production Deployment"
echo "===================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env from .env.example and configure it"
    exit 1
fi

# Load environment variables
source .env

# Verify required variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Please check your .env file"
    exit 1
fi

echo "1️⃣ Checking dependencies..."
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "✅ Dependencies OK"
echo ""

# Ask for confirmation
echo "⚠️  WARNING: This will deploy to PRODUCTION"
echo "Project: $VITE_SUPABASE_URL"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "2️⃣ Running database migrations..."

# Check if already linked
if [ ! -f .git/hooks/pre-commit ]; then
    echo "Linking to Supabase project..."
    supabase link --project-ref "${SUPABASE_PROJECT_REF}"
fi

echo "Pushing database migrations..."
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed"
else
    echo "❌ Database migration failed"
    exit 1
fi

echo ""
echo "3️⃣ Building frontend..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Build
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "4️⃣ Deploying to hosting platform..."

# Deploy based on available tokens
if [ ! -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo "Deploying to Netlify..."
    npx netlify-cli deploy --prod --dir=dist
elif [ ! -z "$VERCEL_TOKEN" ]; then
    echo "Deploying to Vercel..."
    npx vercel --prod
else
    echo "⚠️  No hosting platform token found"
    echo "Please deploy manually or configure NETLIFY_AUTH_TOKEN or VERCEL_TOKEN"
    echo ""
    echo "Build artifacts are in ./dist directory"
fi

echo ""
echo "5️⃣ Verifying deployment..."

# Simple health check
echo "Testing production URL..."
if [ ! -z "$VITE_APP_URL" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$VITE_APP_URL")
    if [ $HTTP_CODE -eq 200 ]; then
        echo "✅ Production site is accessible"
    else
        echo "⚠️  Warning: Got HTTP $HTTP_CODE from $VITE_APP_URL"
    fi
fi

echo ""
echo "=================================================="
echo "🎉 Deployment Complete!"
echo "=================================================="
echo ""
echo "🔗 Production URL: $VITE_APP_URL"
echo "🗄️  Database: $VITE_SUPABASE_URL"
echo ""
echo "📋 Next steps:"
echo "  - Verify the application works correctly"
echo "  - Check database connectivity"
echo "  - Monitor error logs"
echo "  - Test user authentication"
echo ""
