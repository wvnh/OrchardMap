#!/usr/bin/env powershell

# run_migrations.ps1
# Script to run all SQL migrations in Supabase

Write-Host "🚀 Starting OrchardMap database migration..." -ForegroundColor Green

$migrationPath = ".\supabase\migrations"
$migrations = @(
    "001_create_enums.sql",
    "002_create_tables.sql", 
    "003_create_indexes.sql",
    "004_enable_rls.sql",
    "005_create_rls_policies.sql"
)

# Check if migration files exist
foreach ($migration in $migrations) {
    $filePath = Join-Path $migrationPath $migration
    if (-not (Test-Path $filePath)) {
        Write-Host "❌ Migration file not found: $filePath" -ForegroundColor Red
        exit 1
    }
}

Write-Host "📋 Found all migration files" -ForegroundColor Green

# Instructions for manual execution
Write-Host @"

📝 Manual Migration Steps:

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Execute the following files in order:

"@ -ForegroundColor Yellow

foreach ($migration in $migrations) {
    Write-Host "   → $migration" -ForegroundColor Cyan
}

Write-Host @"

🔗 Or use Supabase CLI:
   supabase db reset
   
💡 Copy and paste the content of each file into the SQL Editor,
   or use the Supabase CLI if you have it installed.

"@ -ForegroundColor Yellow

# Option to open files for copy-paste
$response = Read-Host "Would you like to open the migration files for copying? (y/N)"
if ($response -eq 'y' -or $response -eq 'Y') {
    foreach ($migration in $migrations) {
        $filePath = Join-Path $migrationPath $migration
        Write-Host "Opening $migration..." -ForegroundColor Green
        notepad $filePath
        Read-Host "Press Enter when you've copied the content and executed it in Supabase..."
    }
}

Write-Host "✅ Migration instructions completed!" -ForegroundColor Green