@echo off
echo 🚀 Render Full-Stack Deployment Script
echo =====================================

echo.
echo Step 1: Check if all files are ready
echo - render.yaml exists
echo - All code is pushed to GitHub
echo - No .env files in repository

echo.
echo Step 2: Database Setup
echo Please ensure you have:
echo - MongoDB Atlas account OR Render MongoDB
echo - Database connection string ready
echo - Network access configured

echo.
echo Step 3: Deploy to Render
echo.
echo Option A: Blueprint Deployment (Recommended)
echo 1. Go to https://render.com
echo 2. Click "New +" ^> "Blueprint"
echo 3. Connect your GitHub repository
echo 4. Render will automatically create all services
echo 5. Configure environment variables
echo 6. Deploy
echo.

echo Option B: Manual Deployment
echo 1. Deploy Backend:
echo    - Go to https://render.com
echo    - Click "New +" ^> "Web Service"
echo    - Connect GitHub repository
echo    - Configure as per RENDER_DEPLOYMENT.md
echo.
echo 2. Deploy Frontend:
echo    - Click "New +" ^> "Static Site"
echo    - Connect GitHub repository
echo    - Configure as per RENDER_DEPLOYMENT.md
echo.

echo Step 4: Post-Deployment
echo - Test all features
echo - Configure custom domain (optional)
echo - Set up monitoring
echo.

echo ✅ Ready for Render deployment!
echo See RENDER_DEPLOYMENT.md for detailed instructions
echo See RENDER_CHECKLIST.md for step-by-step checklist
pause 