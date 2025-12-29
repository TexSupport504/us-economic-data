@echo off
echo ========================================
echo  US Economic Data Dashboard Setup
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    exit /b 1
)

:: Show Node version
echo [OK] Node.js found:
node --version
echo.

:: Install dependencies
echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed
echo.

:: Check for .env.local
if not exist .env.local (
    echo [2/3] Creating .env.local from template...
    copy .env.example .env.local >nul
    echo [OK] Created .env.local
    echo.
    echo ========================================
    echo  ACTION REQUIRED:
    echo ========================================
    echo.
    echo  1. Get a FREE FRED API key from:
    echo     https://fred.stlouisfed.org/docs/api/api_key.html
    echo.
    echo  2. Edit .env.local and replace:
    echo     your_fred_api_key_here
    echo     with your actual API key
    echo.
    echo ========================================
) else (
    echo [2/3] .env.local already exists
    echo [OK] Environment configured
)
echo.

:: Done
echo [3/3] Setup complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser.
echo.
