#!/bin/bash
# backup-database.sh - Database backup script
# Usage: ./scripts/backup-database.sh [environment] [output_file]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE=${2:-"backup_${ENVIRONMENT}_${TIMESTAMP}.sql"}
BACKUP_DIR="backups"

echo "🗄️  OrchardMap Database Backup"
echo "=============================="
echo "Environment: $ENVIRONMENT"
echo "Output: $OUTPUT_FILE"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

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
        echo "1️⃣ Backing up local database..."
        
        # Dump local database
        supabase db dump -f "$BACKUP_DIR/$OUTPUT_FILE"
        
        if [ $? -eq 0 ]; then
            echo "✅ Local backup created successfully"
        else
            echo "❌ Backup failed"
            exit 1
        fi
        ;;
        
    production|staging)
        # Verify we have project ref
        if [ -z "$SUPABASE_PROJECT_REF" ]; then
            echo "❌ Error: SUPABASE_PROJECT_REF not set"
            echo "Please set this environment variable or add it to .env"
            exit 1
        fi
        
        echo "1️⃣ Connecting to Supabase project..."
        supabase link --project-ref "$SUPABASE_PROJECT_REF"
        
        echo ""
        echo "2️⃣ Creating backup..."
        
        # Dump remote database
        supabase db dump -f "$BACKUP_DIR/$OUTPUT_FILE"
        
        if [ $? -eq 0 ]; then
            echo "✅ Backup created successfully"
        else
            echo "❌ Backup failed"
            exit 1
        fi
        ;;
        
    *)
        echo "❌ Error: Unknown environment '$ENVIRONMENT'"
        echo "Usage: $0 [local|staging|production] [output_file]"
        exit 1
        ;;
esac

# Get file size
FILE_SIZE=$(du -h "$BACKUP_DIR/$OUTPUT_FILE" | cut -f1)

echo ""
echo "📊 Backup Information:"
echo "  File: $BACKUP_DIR/$OUTPUT_FILE"
echo "  Size: $FILE_SIZE"
echo "  Date: $(date)"
echo ""

# Compress backup
echo "3️⃣ Compressing backup..."
gzip "$BACKUP_DIR/$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup compressed: $BACKUP_DIR/$OUTPUT_FILE.gz"
    COMPRESSED_SIZE=$(du -h "$BACKUP_DIR/$OUTPUT_FILE.gz" | cut -f1)
    echo "  Compressed size: $COMPRESSED_SIZE"
else
    echo "⚠️  Compression failed, keeping uncompressed backup"
fi

echo ""
echo "✅ Backup completed successfully!"
echo ""
echo "📋 To restore this backup:"
echo "  1. Uncompress: gunzip $BACKUP_DIR/$OUTPUT_FILE.gz"
echo "  2. Restore: ./scripts/restore-database.sh $ENVIRONMENT $BACKUP_DIR/$OUTPUT_FILE"
echo ""

# Cleanup old backups (keep last 7)
echo "4️⃣ Cleaning up old backups..."
OLD_BACKUPS=$(ls -t "$BACKUP_DIR"/backup_${ENVIRONMENT}_*.sql.gz 2>/dev/null | tail -n +8)

if [ ! -z "$OLD_BACKUPS" ]; then
    echo "$OLD_BACKUPS" | xargs rm -f
    echo "✅ Removed old backups (keeping last 7)"
else
    echo "ℹ️  No old backups to clean up"
fi

echo ""
echo "🎉 Done!"
