@echo off
REM Jarvis AI Assistant API - Windows Setup Script
REM یہ script سب کچھ خود بخود سیٹ اپ کرے گی

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║  🤖 JARVIS AI ASSISTANT API - SETUP       ║
echo ╚════════════════════════════════════════════╝
echo.

REM Step 1: Check Node.js
echo 📋 Step 1: Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js 18+
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo ✅ %%i found

REM Step 2: Install dependencies
echo.
echo 📋 Step 2: Installing npm dependencies...
call npm install
if errorlevel 1 (
    echo ❌ npm install failed
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Step 3: Create .env file
echo.
echo 📋 Step 3: Setting up environment variables...
if not exist .env (
    copy .env.example .env >nul
    echo ✅ .env file created ^(update with your API keys^)
) else (
    echo ℹ️  .env file already exists
)

REM Step 4: Build TypeScript
echo.
echo 📋 Step 4: Building TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Build complete

REM Step 5: Summary
echo.
echo ╔════════════════════════════════════════════╗
echo ║     ✅ Setup Complete!                    ║
echo ╚════════════════════════════════════════════╝
echo.
echo 🚀 To start the API, run:
echo.
echo    Option 1 - Development:
echo    npm run dev
echo.
echo    Option 2 - Production:
echo    npm start
echo.
echo    Option 3 - With Docker:
echo    docker-compose up
echo.
echo 📝 Don't forget to:
echo    1. Update .env with your GROQ_API_KEY
echo    2. Ensure MongoDB is running
echo.
echo 🌐 API will be available at: http://localhost:3000
echo 💬 Health check: curl http://localhost:3000/api/health
echo.
pause
