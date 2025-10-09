@echo off
REM restart-development.bat
REM Handig script om snel de ontwikkelomgeving op te starten

echo 🌳 OrchardMap - Development Environment Startup
echo ================================================

echo.
echo 1️⃣ Starting Supabase...
supabase start

if %errorlevel% neq 0 (
    echo ❌ Supabase start failed!
    pause
    exit /b 1
)

echo.
echo 2️⃣ Testing database connection...
node test-database-admin.js

if %errorlevel% neq 0 (
    echo ⚠️  Database test had issues, but continuing...
)

echo.
echo ✅ Development environment is ready!
echo.
echo 🔗 Useful URLs:
echo    Database Studio: http://127.0.0.1:54323
echo    API URL: http://127.0.0.1:54321
echo    Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres
echo.
echo 📋 Quick commands:
echo    supabase db reset          - Reset database with all migrations
echo    node test-rls-comprehensive.js  - Test all RLS policies
echo    supabase stop             - Stop all services
echo.
echo 📚 Documentation:
echo    PROJECT-STATUS.md         - Complete status and next steps
echo    docs/user-stories.md      - All user stories
echo    docs/database-schema.md   - Database documentation
echo.
pause