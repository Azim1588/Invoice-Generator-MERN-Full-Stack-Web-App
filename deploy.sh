#!/bin/bash

echo "🚀 Starting Invoice Generator Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ Backend .env file not found!${NC}"
    echo "Please create backend/.env with:"
    echo "MONGODB_URI=your_mongodb_connection_string"
    echo "JWT_SECRET=your_jwt_secret"
    echo "PORT=5000"
    exit 1
fi

# Build frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd frontend
npm install
npm run build
cd ..

# Check if build was successful
if [ ! -d "frontend/dist" ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully!${NC}"

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

echo -e "${GREEN}✅ Backend dependencies installed!${NC}"

echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy backend to your chosen platform"
echo "2. Update frontend API URL"
echo "3. Deploy frontend to your chosen platform"
echo ""
echo "Recommended platforms:"
echo "- Backend: Render, Railway, or Heroku"
echo "- Frontend: Netlify, Vercel, or GitHub Pages" 