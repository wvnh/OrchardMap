#!/bin/bash
# migrate-database.sh - Database migration script
# Usage: ./scripts/migrate-database.sh [environment]

set -e

ENVIRONMENT=${1:-production}

echo "🗄️  OrchardMap Database Migration"
echo "=================================="
echo "Environment: $ENVIRONMENT"
echo ""

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI not found"
    echo "Install with: npm install -g supabase"
    exit 1
fi

# Load environment variables if .env exists
if [ -f .env ]; then
    source .env
fi

case $ENVIRONMENT in
    local)
        echo "1️⃣ Starting local Supabase..."
        supabase start
        
        echo ""
        echo "2️⃣ Resetting local database..."
        supabase db reset
        
        echo ""
        echo "3️⃣ Testing migrations..."
        node test-setup.js
        
        echo ""
        echo "✅ Local database ready!"
        echo "🔗 Studio: http://127.0.0.1:54325"
        ;;
        
    staging|production)
        # Verify we have project ref
        if [ -z "$SUPABASE_PROJECT_REF" ]; then
            echo "❌ Error: SUPABASE_PROJECT_REF not set"
            exit 1
        fi
        
        echo "⚠️  WARNING: This will modify the $ENVIRONMENT database"
        echo "Project: $SUPABASE_PROJECT_REF"
        read -p "Continue? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Migration cancelled"
            exit 0
        fi
        
        echo ""
        echo "1️⃣ Linking to Supabase project..."
        supabase link --project-ref "$SUPABASE_PROJECT_REF"
        
        echo ""
        echo "2️⃣ Checking migration status..."
        supabase migration list
        
        echo ""
        echo "3️⃣ Applying migrations..."
        supabase db push
        
        echo ""
        echo "4️⃣ Verifying migrations..."
        supabase db remote commit
        
        echo ""
        echo "✅ Migrations applied successfully!"
        ;;
        
    *)
        echo "❌ Error: Unknown environment '$ENVIRONMENT'"
        echo "Usage: $0 [local|staging|production]"
        exit 1
        ;;
esac

echo ""
echo "📊 Database Status:"
echo "  Migrations: $(ls supabase/migrations/*.sql | wc -l) files"
echo "  Environment: $ENVIRONMENT"
echo ""
