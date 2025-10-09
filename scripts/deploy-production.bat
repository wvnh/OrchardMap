@echo off
REM deploy-production.bat - Windows deployment script
REM Usage: scripts\deploy-production.bat

echo 🚀 OrchardMap Production Deployment
echo ====================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ❌ Error: .env file not found
    echo Please create .env from .env.example and configure it
    pause
    exit /b 1
)

echo 1️⃣ Checking dependencies...
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Supabase CLI not found. Please install it first.
    echo Run: npm install -g supabase
    pause
    exit /b 1
)

echo ✅ Dependencies OK
echo.

echo ⚠️  WARNING: This will deploy to PRODUCTION
set /p CONFIRM="Continue? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo Deployment cancelled
    pause
    exit /b 0
)

echo.
echo 2️⃣ Running database migrations...
supabase db push
if %errorlevel% neq 0 (
    echo ❌ Database migration failed
    pause
    exit /b 1
)
echo ✅ Database migrations completed

echo.
echo 3️⃣ Building frontend...
if not exist node_modules (
    echo Installing dependencies...
    npm ci
)

npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Build completed

echo.
echo 4️⃣ Deploying to hosting platform...
echo Please deploy the ./dist directory to your hosting platform
echo Or configure deployment tokens in your .env file

echo.
echo 🎉 Deployment preparation complete!
echo.
echo 📋 Next steps:
echo   - Upload ./dist directory to your hosting platform
echo   - Verify the application works correctly
echo   - Check database connectivity
echo.
pause
