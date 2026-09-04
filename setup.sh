#!/bin/bash

# Jarvis AI Assistant API - Setup Script
# یہ script سب کچھ خود بخود سیٹ اپ کرے گی

set -e

echo "╔════════════════════════════════════════════╗"
echo "║  🤖 JARVIS AI ASSISTANT API - SETUP       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Step 1: Check Node.js
echo "📋 Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js 18+"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Step 2: Check MongoDB
echo ""
echo "📋 Step 2: Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally"
    echo "   Using Docker Compose instead..."
    echo "   (Make sure Docker is installed)"
else
    echo "✅ MongoDB found"
fi

# Step 3: Install dependencies
echo ""
echo "📋 Step 3: Installing npm dependencies..."
npm install
echo "✅ Dependencies installed"

# Step 4: Create .env file
echo ""
echo "📋 Step 4: Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created (update with your API keys)"
else
    echo "ℹ️  .env file already exists"
fi

# Step 5: Build TypeScript
echo ""
echo "📋 Step 5: Building TypeScript..."
npm run build
echo "✅ Build complete"

# Step 6: Summary
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║     ✅ Setup Complete!                    ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🚀 To start the API, run:"
echo ""
echo "   Option 1 - Development:"
echo "   npm run dev"
echo ""
echo "   Option 2 - Production:"
echo "   npm start"
echo ""
echo "   Option 3 - With Docker:"
echo "   docker-compose up"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update .env with your GROQ_API_KEY"
echo "   2. Ensure MongoDB is running"
echo ""
echo "🌐 API will be available at: http://localhost:3000"
echo "💬 Health check: curl http://localhost:3000/api/health"
echo ""
