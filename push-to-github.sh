#!/bin/bash

echo "🚀 Preparing to push Invoice Generator Pro to GitHub"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}No remote repository found.${NC}"
    echo "Please create a new repository on GitHub and run:"
    echo "git remote add origin https://github.com/your-username/your-repo-name.git"
    echo ""
    read -p "Enter your GitHub repository URL: " REPO_URL
    git remote add origin "$REPO_URL"
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
git commit -m "feat: initial commit - Invoice Generator Pro

- Full-stack invoice generation application
- React frontend with modern UI/UX
- Node.js backend with Express and MongoDB
- User authentication and authorization
- Customer and invoice management
- PDF generation functionality
- Dark mode support
- Responsive design
- Comprehensive documentation"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Successfully pushed to GitHub!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set up environment variables in your deployment platform"
    echo "2. Configure your database connection"
    echo "3. Deploy your application"
    echo ""
    echo "See DEPLOYMENT.md for detailed deployment instructions."
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    echo "Please check your repository URL and try again."
fi 