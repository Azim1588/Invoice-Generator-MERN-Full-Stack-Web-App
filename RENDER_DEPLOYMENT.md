# 🚀 Render Full-Stack Deployment Guide

This guide will help you deploy your complete Invoice Generator application (both backend and frontend) to Render.

## 📋 Prerequisites

- [Render Account](https://render.com/signup) (Free tier available)
- [GitHub Account](https://github.com)
- Your project pushed to GitHub: `https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git`

## 🎯 Deployment Strategy

We'll deploy both services on Render:

- **Backend**: Node.js Web Service
- **Frontend**: Static Site
- **Database**: MongoDB (via Render or MongoDB Atlas)

## 🚀 Step 1: Deploy Backend to Render

### Method 1: Using Render Dashboard

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**: `https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git`
5. **Configure the service:**
   ```
   Name: invoice-backend
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   Root Directory: backend
   ```
6. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secure_jwt_secret
   FRONTEND_URL=https://invoice-frontend.onrender.com
   ```
7. **Click "Create Web Service"**
8. **Wait for deployment and copy your backend URL** (e.g., `https://invoice-backend.onrender.com`)

### Method 2: Using render.yaml (Recommended)

1. **Your `render.yaml` file is already configured**
2. **Go to [Render.com](https://render.com)**
3. **Click "New +" → "Blueprint"**
4. **Connect your GitHub repository**
5. **Render will automatically create all services from the YAML file**

## 🎨 Step 2: Deploy Frontend to Render

### Method 1: Using Render Dashboard

1. **Go to [Render.com](https://render.com)**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository**: `https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git`
4. **Configure the service:**
   ```
   Name: invoice-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```
5. **Add Environment Variables:**
   ```
   VITE_API_URL=https://invoice-backend.onrender.com/api
   ```
6. **Click "Create Static Site"**

### Method 2: Using render.yaml (Automatic)

If you used the Blueprint method, the frontend will be automatically deployed.

## 🗄️ Step 3: Database Setup

### Option A: Use Render's MongoDB (Recommended)

1. **Go to [Render.com](https://render.com)**
2. **Click "New +" → "PostgreSQL" or "MongoDB"**
3. **Create a new database**
4. **Copy the connection string**
5. **Add it to your backend environment variables**

### Option B: Use MongoDB Atlas

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a free cluster**
3. **Get your connection string**
4. **Add it to your backend environment variables**

## 🔧 Step 4: Environment Variables Configuration

### Backend Environment Variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice-app
JWT_SECRET=your_super_secure_jwt_secret_key_here
FRONTEND_URL=https://invoice-frontend.onrender.com
```

### Frontend Environment Variables:

```env
VITE_API_URL=https://invoice-backend.onrender.com/api
```

## 🔒 Step 5: CORS Configuration

Update your backend CORS configuration to allow your Render frontend domain:

```javascript
// backend/app.js
app.use(
  cors({
    origin: [
      "https://invoice-frontend.onrender.com",
      "https://your-custom-domain.com",
      "http://localhost:3000", // for development
    ],
    credentials: true,
  })
);
```

## 📱 Step 6: Test Your Deployment

1. **Visit your frontend URL**: `https://invoice-frontend.onrender.com`
2. **Test the following features:**
   - ✅ User registration
   - ✅ User login
   - ✅ Create invoices
   - ✅ Download PDFs
   - ✅ Upload logos
   - ✅ Dark mode toggle
   - ✅ Responsive design

## 🔄 Step 7: Continuous Deployment

### Automatic Deployments:

Render automatically deploys when you push to your main branch:

1. **Make changes to your code**
2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```
3. **Render automatically redeploys both services**

### Manual Deployments:

- Go to your service dashboard
- Click "Manual Deploy"
- Select the branch to deploy

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures:**

   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **API Connection Issues:**

   - Verify VITE_API_URL is correct
   - Check if backend is running
   - Ensure CORS is configured

3. **Database Connection Issues:**

   - Check MongoDB connection string
   - Verify network access
   - Check database credentials

4. **Root Directory Issues:**
   - **Error**: "Service Root Directory is missing"
   - **Solution**: Use manual deployment instead of Blueprint
   - **Alternative**: Try the `render-simple.yaml` configuration

### Debug Commands:

```bash
# Check service logs
# Go to Render dashboard → Your service → Logs

# Check environment variables
# Go to Render dashboard → Your service → Environment
```

### Root Directory Issue Fix:

If you encounter the "Service Root Directory is missing" error:

1. **Use Manual Deployment Instead:**

   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set Root Directory to `backend`
   - Set Build Command to `npm install`
   - Set Start Command to `npm start`

2. **Alternative Configuration:**

   - Use `render-simple.yaml` instead of `render.yaml`
   - This configuration uses `cd` commands instead of `rootDir`

3. **Verify Repository Structure:**
   ```
   your-repo/
   ├── backend/
   │   ├── package.json
   │   ├── app.js
   │   └── ...
   ├── frontend/
   │   ├── package.json
   │   ├── src/
   │   └── ...
   └── render.yaml
   ```

## 📊 Monitoring & Analytics

### Render Features:

1. **Service Health**: Monitor service status
2. **Logs**: View real-time logs
3. **Metrics**: Track performance
4. **Alerts**: Set up notifications

### Performance Monitoring:

- **Response times** tracking
- **Error rates** monitoring
- **Resource usage** metrics
- **Uptime** monitoring

## 🔄 Updating Your Deployment

### Code Updates:

1. **Make changes to your code**
2. **Push to GitHub**
3. **Render automatically redeploys**

### Environment Variable Updates:

1. **Go to Render dashboard**
2. **Navigate to your service**
3. **Go to Environment tab**
4. **Update variables**
5. **Redeploy**

## 📈 Performance Optimization

### Render Optimizations:

1. **Enable Auto-Scaling** (if needed)
2. **Configure Health Checks**
3. **Set up Monitoring**
4. **Optimize Build Process**

### Build Optimizations:

```javascript
// frontend/vite.config.js (already optimized)
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: ["lucide-react"],
          http: ["axios"],
        },
      },
    },
  },
});
```

## 🌐 Custom Domains

### Adding Custom Domain:

1. **Go to your service dashboard**
2. **Navigate to "Settings" → "Domains"**
3. **Add your custom domain**
4. **Configure DNS settings**

### SSL Certificates:

- Render automatically provides SSL certificates
- Custom domains get free SSL
- HTTPS is enabled by default

## 🎉 Success!

Your Invoice Generator is now deployed with:

- **Frontend**: `https://invoice-frontend.onrender.com`
- **Backend**: `https://invoice-backend.onrender.com`
- **Database**: MongoDB (Render or Atlas)
- **Automatic deployments** on every push
- **SSL certificates** enabled
- **Custom domain** support
- **Performance monitoring**

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **Render Support**: https://render.com/support
- **GitHub Issues**: Use your repository issues

---

**Deployment Status**: ✅ Ready for Render Full-Stack
**Last Updated**: 2024
