# 🚀 Vercel Deployment Guide

This guide will help you deploy your Invoice Generator frontend to Vercel and set up the backend for production.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [GitHub Account](https://github.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- Backend deployed to a platform (Render, Railway, Heroku, etc.)

## 🎯 Deployment Strategy

Since Vercel is primarily for frontend applications, we'll use a **split deployment** approach:

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to a backend platform (Render, Railway, etc.)

## 🚀 Step 1: Deploy Backend First

### Option A: Deploy to Render (Recommended)

1. **Go to [Render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**

   ```
   Name: invoice-backend
   Build Command: npm install
   Start Command: npm start
   Environment: Node
   ```

5. **Add Environment Variables:**

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   PORT=5000
   ```

6. **Deploy and get your backend URL**
   - Example: `https://invoice-backend.onrender.com`

### Option B: Deploy to Railway

1. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy backend:**

   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Get your backend URL from Railway dashboard**

## 🎨 Step 2: Deploy Frontend to Vercel

### Method 1: Deploy via Vercel Dashboard

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the project:**

   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

6. **Add Environment Variables:**

   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

7. **Click "Deploy"**

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

4. **Deploy:**

   ```bash
   vercel
   ```

5. **Follow the prompts:**

   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `invoice-generator-frontend`
   - Directory: `./` (current directory)
   - Override settings: `N`

6. **Add environment variables:**
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-backend-url.com/api
   ```

## 🔧 Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. **Go to your project settings**
2. **Navigate to "Environment Variables"**
3. **Add the following variables:**

   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.com/api
   Environment: Production, Preview, Development
   ```

### Example Environment Variables:

```env
# Production
VITE_API_URL=https://invoice-backend.onrender.com/api

# Development
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Step 4: Configure Custom Domain (Optional)

1. **Go to your Vercel project dashboard**
2. **Navigate to "Settings" → "Domains"**
3. **Add your custom domain**
4. **Configure DNS settings as instructed**

## 🔒 Step 5: Security Configuration

### Update CORS in Backend:

```javascript
// backend/app.js
app.use(
  cors({
    origin: [
      "https://your-vercel-app.vercel.app",
      "https://your-custom-domain.com",
      "http://localhost:3000", // for development
    ],
    credentials: true,
  })
);
```

### Environment Variables for Backend:

```env
# Add to your backend environment
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## 📱 Step 6: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test the following features:**
   - User registration/login
   - Create invoices
   - Download PDFs
   - Upload logos
   - Dark mode toggle

## 🔄 Step 7: Set Up Continuous Deployment

### Automatic Deployments:

Vercel automatically deploys when you push to your main branch:

1. **Make changes to your code**
2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```
3. **Vercel automatically deploys**

### Preview Deployments:

- Every pull request gets a preview deployment
- Test changes before merging to main

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures:**

   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify build command is correct

2. **API Connection Issues:**

   - Verify VITE_API_URL is correct
   - Check CORS configuration in backend
   - Ensure backend is running

3. **Environment Variables:**
   - Check if variables are set correctly
   - Ensure variable names start with VITE\_
   - Redeploy after changing variables

### Debug Commands:

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy
vercel --prod
```

## 📊 Monitoring & Analytics

### Vercel Analytics:

1. **Enable Vercel Analytics** in project settings
2. **Track performance metrics**
3. **Monitor user behavior**

### Performance Monitoring:

- **Core Web Vitals** tracking
- **Build performance** metrics
- **Deployment speed** monitoring

## 🔄 Updating Your Deployment

### Frontend Updates:

1. **Make changes to your code**
2. **Push to GitHub**
3. **Vercel automatically redeploys**

### Backend Updates:

1. **Update backend code**
2. **Redeploy backend**
3. **Update VITE_API_URL if needed**

## 📈 Performance Optimization

### Vercel Optimizations:

1. **Enable Edge Functions** for API routes
2. **Use Image Optimization** for logos
3. **Enable Compression**
4. **Configure Caching**

### Build Optimizations:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
```

## 🎉 Success!

Your Invoice Generator is now deployed with:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend-url.com
- **Automatic deployments** on every push
- **Preview deployments** for pull requests
- **Custom domain** (optional)
- **Performance monitoring**

## 📞 Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: Use your repository issues

---

**Deployment Status**: ✅ Ready for Vercel
**Last Updated**: 2024
