#!/bin/bash

echo "🚀 Pushing Invoice Generator Pro to existing repository"
echo "Repository: https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Repository URL
REPO_URL="https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
fi

# Check if remote exists and set it
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}Adding remote repository...${NC}"
    git remote add origin "$REPO_URL"
else
    echo -e "${YELLOW}Updating remote repository...${NC}"
    git remote set-url origin "$REPO_URL"
fi

# Check for sensitive files
echo -e "${YELLOW}Checking for sensitive files...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${RED}❌ Warning: backend/.env file found!${NC}"
    echo "This file contains sensitive information and should not be committed."
    read -p "Do you want to remove it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm backend/.env
        echo -e "${GREEN}✅ backend/.env removed${NC}"
    fi
fi

if [ -f "frontend/.env" ]; then
    echo -e "${RED}❌ Warning: frontend/.env file found!${NC}"
    echo "This file contains sensitive information and should not be committed."
    read -p "Do you want to remove it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm frontend/.env
        echo -e "${GREEN}✅ frontend/.env removed${NC}"
    fi
fi

# Fetch existing repository
echo -e "${YELLOW}Fetching existing repository...${NC}"
git fetch origin

# Check if main branch exists remotely
if git ls-remote --heads origin main | grep -q main; then
    echo -e "${YELLOW}Main branch exists remotely. Pulling latest changes...${NC}"
    git pull origin main --allow-unrelated-histories
else
    echo -e "${YELLOW}Main branch doesn't exist remotely. Creating it...${NC}"
fi

# Add all files
echo -e "${YELLOW}Adding files to git...${NC}"
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${YELLOW}No changes to commit.${NC}"
    exit 0
fi

# Show what will be committed
echo -e "${YELLOW}Files to be committed:${NC}"
git diff --cached --name-only

# Commit
echo -e "${YELLOW}Creating commit...${NC}"
git commit -m "feat: complete invoice generator application

- Full-stack MERN invoice generation application
- React frontend with modern UI/UX and dark mode
- Node.js backend with Express and MongoDB
- User authentication and authorization system
- Customer and invoice management
- PDF generation and download functionality
- Business profile and logo management
- Responsive design for all devices
- Comprehensive documentation and deployment guides
- GitHub Actions CI/CD pipeline
- Security best practices implementation"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Successfully pushed to GitHub!${NC}"
    echo ""
    echo "Your project is now available at:"
    echo "https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App"
    echo ""
    echo "Next steps:"
    echo "1. Set up environment variables in your deployment platform"
    echo "2. Configure your MongoDB database"
    echo "3. Deploy your application"
    echo ""
    echo "See DEPLOYMENT.md for detailed deployment instructions."
    echo ""
    echo "Repository features:"
    echo "✅ Professional README with documentation"
    echo "✅ Issue templates for bugs and features"
    echo "✅ CI/CD pipeline with GitHub Actions"
    echo "✅ Contributing guidelines"
    echo "✅ Security best practices"
    echo "✅ Deployment documentation"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    echo "Please check your repository access and try again."
    echo "Make sure you have write access to the repository."
fi 