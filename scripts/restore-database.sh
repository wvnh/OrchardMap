#!/bin/bash
# restore-database.sh - Database restore script
# Usage: ./scripts/restore-database.sh [environment] [backup_file]

set -e

ENVIRONMENT=${1:-local}
BACKUP_FILE=$2

echo "🔄 OrchardMap Database Restore"
echo "=============================="
echo "Environment: $ENVIRONMENT"
echo "Backup file: $BACKUP_FILE"
echo ""

# Validate backup file
if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not specified"
    echo "Usage: $0 [local|staging|production] backup_file.sql"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    # Check if compressed version exists
    if [ -f "$BACKUP_FILE.gz" ]; then
        echo "📦 Found compressed backup, decompressing..."
        gunzip -k "$BACKUP_FILE.gz"
    else
        echo "❌ Error: Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

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

# Confirm before proceeding
echo "⚠️  WARNING: This will overwrite the $ENVIRONMENT database!"
echo "   All current data will be lost."
echo ""
read -p "Continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo ""

case $ENVIRONMENT in
    local)
        echo "1️⃣ Starting local Supabase (if not running)..."
        supabase start || true
        
        echo ""
        echo "2️⃣ Resetting local database..."
        supabase db reset
        
        echo ""
        echo "3️⃣ Restoring from backup..."
        psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" < "$BACKUP_FILE"
        
        if [ $? -eq 0 ]; then
            echo "✅ Database restored successfully"
        else
            echo "❌ Restore failed"
            exit 1
        fi
        ;;
        
    production|staging)
        # Verify we have project ref
        if [ -z "$SUPABASE_PROJECT_REF" ]; then
            echo "❌ Error: SUPABASE_PROJECT_REF not set"
            echo "Please set this environment variable"
            exit 1
        fi
        
        echo "1️⃣ Creating backup of current database (safety)..."
        SAFETY_BACKUP="backups/pre_restore_$(date +%Y%m%d_%H%M%S).sql"
        ./scripts/backup-database.sh "$ENVIRONMENT" "$SAFETY_BACKUP"
        
        echo ""
        echo "2️⃣ Connecting to Supabase project..."
        supabase link --project-ref "$SUPABASE_PROJECT_REF"
        
        echo ""
        echo "3️⃣ Restoring database..."
        echo "⚠️  This operation cannot be easily undone!"
        read -p "Are you ABSOLUTELY sure? (type 'yes' again): " CONFIRM2
        
        if [ "$CONFIRM2" != "yes" ]; then
            echo "Restore cancelled"
            exit 0
        fi
        
        # Get database connection string
        DB_URL=$(supabase db url)
        
        # Restore database
        psql "$DB_URL" < "$BACKUP_FILE"
        
        if [ $? -eq 0 ]; then
            echo "✅ Database restored successfully"
        else
            echo "❌ Restore failed"
            echo "Safety backup is available at: $SAFETY_BACKUP"
            exit 1
        fi
        ;;
        
    *)
        echo "❌ Error: Unknown environment '$ENVIRONMENT'"
        echo "Usage: $0 [local|staging|production] backup_file.sql"
        exit 1
        ;;
esac

echo ""
echo "4️⃣ Verifying restore..."

# Run test if available
if [ -f "test-setup.js" ]; then
    node test-setup.js
fi

echo ""
echo "✅ Restore completed successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Verify data integrity"
echo "  2. Test application functionality"
echo "  3. Check user access"
echo ""
