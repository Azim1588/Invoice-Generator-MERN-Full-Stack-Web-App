# 🚀 Render Manual Deployment Guide

This guide provides step-by-step instructions for manually deploying your Invoice Generator to Render, specifically addressing the "Service Root Directory is missing" error.

## 🎯 Why Manual Deployment?

The Blueprint deployment with `render.yaml` sometimes has issues with root directory detection. Manual deployment gives you full control and is more reliable.

## 📋 Prerequisites

- [Render Account](https://render.com/signup)
- [GitHub Repository](https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (for database)

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a free account**
3. **Create a new cluster** (M0 Free tier)
4. **Set up database access:**
   - Create a database user
   - Username: `invoice-user`
   - Password: `your_secure_password`
5. **Set up network access:**
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get your connection string:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository:**
   - Repository: `https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git`
   - Branch: `master`

### 2.2 Configure Backend Service

**Basic Settings:**

```
Name: invoice-backend
Environment: Node
Region: Choose closest to you
Branch: master
Root Directory: (leave empty)
```

**Build & Deploy Settings:**

```
Build Command: cd backend && npm install --production
Start Command: cd backend && npm start
```

**Important:** Use `npm install --production` to avoid yarn conflicts and only install production dependencies.

### 2.3 Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add:

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = mongodb+srv://invoice-user:your_password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority
JWT_SECRET = your_super_secure_jwt_secret_key_here_make_it_long_and_random
FRONTEND_URL = https://invoice-frontend.onrender.com
```

**Important Notes:**

- Replace `your_password` with your actual MongoDB password
- Replace `cluster.mongodb.net` with your actual cluster URL
- Generate a strong JWT_SECRET (you can use a password generator)

### 2.4 Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-5 minutes)
3. **Copy your backend URL** (e.g., `https://invoice-backend.onrender.com`)

## 🎨 Step 3: Deploy Frontend to Render

### 3.1 Create Static Site

1. **Go to [Render.com](https://render.com)**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository:**
   - Repository: `https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git`
   - Branch: `master`

### 3.2 Configure Frontend Service

**Basic Settings:**

```
Name: invoice-frontend
Environment: Static Site
Region: Choose closest to you
Branch: master
```

**Build & Deploy Settings:**

```
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
```

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL = https://invoice-backend.onrender.com/api
```

**Important:** Replace `invoice-backend.onrender.com` with your actual backend URL.

### 3.4 Deploy Frontend

1. **Click "Create Static Site"**
2. **Wait for deployment** (usually 1-3 minutes)
3. **Copy your frontend URL** (e.g., `https://invoice-frontend.onrender.com`)

## 🔧 Step 4: Update Backend CORS

After both services are deployed, you need to update the backend CORS configuration:

1. **Go to your backend service in Render**
2. **Click "Environment"**
3. **Update FRONTEND_URL** with your actual frontend URL
4. **Redeploy the backend**

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend API

Visit your backend URL + `/api` to test:

- `https://invoice-backend.onrender.com/api`

You should see a JSON response or API documentation.

### 5.2 Test Frontend

Visit your frontend URL to test:

- `https://invoice-frontend.onrender.com`

### 5.3 Test Complete Flow

1. **Register a new user**
2. **Login with the user**
3. **Create a business profile**
4. **Add a customer**
5. **Create an invoice**
6. **Download PDF**

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. "Service Root Directory is missing"

**Solution:** Use manual deployment (this guide) instead of Blueprint

#### 2. "Couldn't find a package.json file" / Yarn vs Npm Issues

**Error:** `yarn run v1.22.22 error Couldn't find a package.json file in "/opt/render/project/src"`

**Solutions:**

- **Use explicit npm commands:** `cd backend && npm install --production`
- **Force npm usage:** Add `--production` flag to avoid yarn conflicts
- **Check package.json location:** Ensure it's in the backend directory
- **Use manual deployment:** This gives you full control over package manager

#### 3. Build Failures

**Check:**

- All dependencies are in `package.json`
- Build commands are correct
- Environment variables are set
- Using `npm` instead of `yarn`

#### 4. API Connection Issues

**Check:**

- `VITE_API_URL` is correct
- Backend is running
- CORS is configured

#### 5. Database Connection Issues

**Check:**

- MongoDB connection string is correct
- Network access is configured (0.0.0.0/0)
- Database user credentials are correct

#### 6. Environment Variables Not Working

**Check:**

- Variable names are correct (case-sensitive)
- Values don't have extra spaces
- Redeploy after changing variables

### Debug Steps

1. **Check Render Logs:**

   - Go to your service dashboard
   - Click "Logs" tab
   - Look for error messages

2. **Test API Endpoints:**

   ```bash
   curl https://invoice-backend.onrender.com/api
   ```

3. **Check Environment Variables:**

   - Go to service dashboard
   - Click "Environment" tab
   - Verify all variables are set

4. **Verify Package Manager:**
   - Check if Render is using yarn or npm
   - Use explicit npm commands to avoid conflicts

## 🔄 Continuous Deployment

### Automatic Deployments

Render automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "feat: new feature"
git push origin master
```

### Manual Deployments

1. **Go to your service dashboard**
2. **Click "Manual Deploy"**
3. **Select branch to deploy**

## 📊 Monitoring

### Service Health

- **Uptime monitoring** - Check service status
- **Performance metrics** - Monitor response times
- **Error tracking** - View error logs

### Logs

- **Real-time logs** - View live application logs
- **Build logs** - Check deployment process
- **Error logs** - Debug issues

## 🎉 Success!

Your Invoice Generator is now deployed with:

- **Frontend**: `https://invoice-frontend.onrender.com`
- **Backend**: `https://invoice-backend.onrender.com`
- **Database**: MongoDB Atlas
- **Automatic deployments** on every push
- **SSL certificates** enabled
- **Performance monitoring**

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **Render Support**: https://render.com/support
- **MongoDB Atlas Help**: https://docs.atlas.mongodb.com

---

**Deployment Method**: ✅ Manual Deployment
**Status**: ✅ Ready for Production
**Last Updated**: 2024
