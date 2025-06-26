#!/bin/bash

echo "🚀 Vercel Deployment Script for Invoice Generator"
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Prerequisites Check${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are installed${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI is installed${NC}"

echo ""
echo -e "${YELLOW}Step 2: Backend Deployment${NC}"
echo "Before deploying frontend to Vercel, you need to deploy your backend first."
echo ""
echo "Recommended backend platforms:"
echo "1. Render (https://render.com) - Free tier available"
echo "2. Railway (https://railway.app) - Free tier available"
echo "3. Heroku (https://heroku.com) - Paid"
echo ""
read -p "Have you deployed your backend? (y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please deploy your backend first, then run this script again.${NC}"
    echo "See VERCEL_DEPLOYMENT.md for backend deployment instructions."
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Get Backend URL${NC}"
read -p "Enter your backend URL (e.g., https://invoice-backend.onrender.com): " BACKEND_URL

# Remove trailing slash if present
BACKEND_URL=${BACKEND_URL%/}

echo -e "${GREEN}✅ Backend URL: $BACKEND_URL${NC}"

echo ""
echo -e "${YELLOW}Step 4: Build Frontend${NC}"
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

echo ""
echo -e "${YELLOW}Step 5: Deploy to Vercel${NC}"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel..."
    vercel login
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to your Vercel dashboard"
    echo "2. Add environment variable: VITE_API_URL=$BACKEND_URL/api"
    echo "3. Redeploy if needed"
    echo ""
    echo "Your app should be available at the URL shown above."
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Please check the error messages above."
fi

cd .. 