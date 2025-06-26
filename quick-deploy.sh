#!/bin/bash

echo "🚀 Quick Deploy - Invoice Generator"
echo "=================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Database Setup${NC}"
echo "1. Go to https://www.mongodb.com/atlas"
echo "2. Create free account"
echo "3. Create new cluster (Shared - free)"
echo "4. Create database user"
echo "5. Add IP: 0.0.0.0/0"
echo "6. Get connection string"
echo ""

echo -e "${YELLOW}Step 2: Prepare Environment${NC}"
read -p "Enter your MongoDB connection string: " MONGODB_URI
read -p "Enter a secure JWT secret: " JWT_SECRET

# Create backend .env
echo "Creating backend/.env..."
cat > backend/.env << EOF
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
PORT=5000
NODE_ENV=production
EOF

echo -e "${GREEN}✅ Backend .env created!${NC}"

# Create frontend .env
echo "Creating frontend/.env..."
cat > frontend/.env << EOF
VITE_API_URL=https://your-backend-url.onrender.com/api
EOF

echo -e "${GREEN}✅ Frontend .env created!${NC}"

echo ""
echo -e "${YELLOW}Step 3: Deploy Backend to Render${NC}"
echo "1. Go to https://render.com"
echo "2. Sign up with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub repo"
echo "5. Configure:"
echo "   - Name: invoice-backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Environment: Node"
echo "6. Add Environment Variables:"
echo "   - MONGODB_URI: $MONGODB_URI"
echo "   - JWT_SECRET: $JWT_SECRET"
echo "   - NODE_ENV: production"
echo "7. Click 'Create Web Service'"
echo ""

read -p "Enter your Render backend URL (e.g., https://invoice-backend.onrender.com): " BACKEND_URL

# Update frontend .env with actual backend URL
sed -i "s|https://your-backend-url.onrender.com|$BACKEND_URL|g" frontend/.env

echo -e "${GREEN}✅ Frontend .env updated with backend URL!${NC}"

echo ""
echo -e "${YELLOW}Step 4: Deploy Frontend to Netlify${NC}"
echo "1. Go to https://netlify.com"
echo "2. Sign up with GitHub"
echo "3. Click 'New site from Git'"
echo "4. Connect your GitHub repo"
echo "5. Configure:"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "6. Click 'Deploy site'"
echo ""

echo -e "${GREEN}🎉 Deployment setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Render"
echo "2. Deploy frontend to Netlify"
echo "3. Test your application"
echo ""
echo "Your app will be available at:"
echo "- Backend: $BACKEND_URL"
echo "- Frontend: https://your-site-name.netlify.app" 