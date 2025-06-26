# 🚀 Invoice Generator - Deployment Guide

This guide will help you deploy your Invoice Generator application to production.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/) installed
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- GitHub repository with your code

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account:**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create Database Cluster:**

   - Choose "Shared" (free tier)
   - Select your preferred cloud provider and region
   - Create cluster

3. **Configure Database Access:**

   - Go to "Database Access"
   - Create a new database user
   - Set username and password (save these!)

4. **Configure Network Access:**

   - Go to "Network Access"
   - Add IP address: `0.0.0.0/0` (allows all IPs)
   - Or add your specific IP addresses

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## 🔧 Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=production
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🚀 Deployment Options

### Option 1: Render (Recommended for Beginners)

#### Backend Deployment on Render:

1. **Prepare Repository:**

   ```bash
   # Make sure your code is pushed to GitHub
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Render:**

   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `invoice-backend`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Environment:** `Node`
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `NODE_ENV`: `production`
   - Click "Create Web Service"

3. **Update Frontend API URL:**
   ```javascript
   // frontend/src/services/api.js
   const API_BASE_URL = "https://your-backend-name.onrender.com/api";
   ```

#### Frontend Deployment on Netlify:

1. **Build Frontend:**

   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Connect your repository
   - Configure:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click "Deploy site"

### Option 2: Railway

#### Deploy Both Backend and Frontend:

1. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend:**

   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Deploy Frontend:**
   ```bash
   cd frontend
   railway init
   railway up
   ```

### Option 3: Heroku

#### Backend Deployment:

1. **Install Heroku CLI:**

   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Prepare Backend:**

   ```bash
   cd backend
   echo "web: node app.js" > Procfile
   ```

3. **Deploy:**
   ```bash
   heroku create your-invoice-backend
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

#### Frontend Deployment:

- Use Netlify or Vercel for frontend
- Update API URL to your Heroku backend URL

## 🔒 Security Considerations

### 1. Environment Variables

- Never commit `.env` files to Git
- Use strong, unique JWT secrets
- Rotate secrets regularly

### 2. CORS Configuration

```javascript
// backend/app.js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://your-frontend-domain.com",
    credentials: true,
  })
);
```

### 3. Rate Limiting

```javascript
// Add to backend/app.js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

## 📊 Monitoring & Maintenance

### 1. Health Checks

Your app already has a health check endpoint:

```
GET /api/health
```

### 2. Logging

```javascript
// Add to backend/app.js
const morgan = require("morgan");
app.use(morgan("combined"));
```

### 3. Error Handling

```javascript
// Add to backend/app.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
```

## 🧪 Testing Deployment

### 1. Test Backend:

```bash
curl https://your-backend-url.com/api/health
```

### 2. Test Frontend:

- Visit your frontend URL
- Try to register/login
- Create an invoice
- Download PDF

### 3. Test Database:

- Check if data is being saved
- Verify connections are working

## 🔄 Continuous Deployment

### GitHub Actions (Optional):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Add your deployment commands here
```

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors:**

   - Check CORS configuration
   - Verify frontend URL in backend settings

2. **Database Connection Issues:**

   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Check network connectivity

3. **Build Failures:**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify values are correct

## 📞 Support

If you encounter issues:

1. Check the platform's documentation
2. Review error logs
3. Test locally first
4. Check environment variables

## 🎉 Success!

Once deployed, your Invoice Generator will be available at:

- **Frontend:** `https://your-frontend-domain.com`
- **Backend:** `https://your-backend-domain.com`

Users can now register, create invoices, and manage their business from anywhere!
