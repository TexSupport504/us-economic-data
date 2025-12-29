#!/bin/bash

echo "========================================"
echo " US Economic Data Dashboard Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Show Node version
echo "[OK] Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "[1/3] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi
echo "[OK] Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "[2/3] Creating .env.local from template..."
    cp .env.example .env.local
    echo "[OK] Created .env.local"
    echo ""
    echo "========================================"
    echo " ACTION REQUIRED:"
    echo "========================================"
    echo ""
    echo " 1. Get a FREE FRED API key from:"
    echo "    https://fred.stlouisfed.org/docs/api/api_key.html"
    echo ""
    echo " 2. Edit .env.local and replace:"
    echo "    your_fred_api_key_here"
    echo "    with your actual API key"
    echo ""
    echo "========================================"
else
    echo "[2/3] .env.local already exists"
    echo "[OK] Environment configured"
fi
echo ""

# Done
echo "[3/3] Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
echo ""
