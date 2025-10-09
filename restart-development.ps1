# restart-development.ps1
# Handig script om snel de ontwikkelomgeving op te starten

Write-Host "🌳 OrchardMap - Development Environment Startup" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host ""
Write-Host "1️⃣ Starting Supabase..." -ForegroundColor Yellow
supabase start

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase start failed!" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "2️⃣ Testing database setup..." -ForegroundColor Yellow
node test-setup.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database test had issues, but continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor Cyan
Write-Host "   Database Studio: http://127.0.0.1:54325" -ForegroundColor White
Write-Host "   API URL: http://127.0.0.1:54321" -ForegroundColor White
Write-Host "   Database: postgresql://postgres:postgres@127.0.0.1:54323/postgres" -ForegroundColor White
Write-Host ""
Write-Host "📋 Quick commands:" -ForegroundColor Cyan
Write-Host "   supabase db reset          - Reset database with all migrations" -ForegroundColor White
Write-Host "   node test-setup.js         - Test database setup" -ForegroundColor White
Write-Host "   supabase stop             - Stop all services" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   PROJECT-STATUS.md         - Complete status and next steps" -ForegroundColor White
Write-Host "   docs/user-stories.md      - All user stories" -ForegroundColor White
Write-Host "   docs/database-schema.md   - Database documentation" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"