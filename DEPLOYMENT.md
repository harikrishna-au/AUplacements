# 🚀 Deployment Guide - AU Placements Portal

Complete guide to deploy your full-stack application.

---

## 📋 Deployment Overview

**Order:** Backend First → Frontend Second

1. **Backend** → Railway/Render/Heroku
2. **Database** → MongoDB Atlas
3. **Frontend** → Vercel

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (Free M0 tier)

### 1.2 Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/auplacements
   ```
4. Replace `<password>` with your actual password
5. Save this - you'll need it for backend deployment

### 1.3 Configure Network Access
1. Go to **"Network Access"** tab
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

---

## 🔧 Step 2: Deploy Backend

### Option A: Railway (Recommended - Easiest)

#### 2.1 Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your **`AUplacements`** repository
5. Click **"Add variables"** or go to **"Variables"** tab

#### 2.2 Set Environment Variables
Add these in Railway:
```bash
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/auplacements
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### 2.3 Configure Root Directory
1. In Railway dashboard, go to **"Settings"**
2. Find **"Root Directory"**
3. Set it to: **`backend`**
4. Click **"Save"**

#### 2.4 Deploy
1. Railway will auto-deploy
2. Once deployed, click **"Generate Domain"**
3. Copy your backend URL: `https://auplacements-backend.up.railway.app`
4. **Save this URL** - you'll need it for frontend!

#### 2.5 Seed Data (Optional)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed scripts
railway run node scripts/seedCompanies.js
railway run node scripts/seedEvents.js
```

---

### Option B: Render

#### 2.1 Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +" → "Web Service"**
4. Connect your **`AUplacements`** repository
5. Configure:
   - **Name:** auplacements-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

#### 2.2 Add Environment Variables
In Render dashboard, go to **"Environment"** tab:
```bash
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/auplacements
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### 2.3 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Copy your backend URL: `https://auplacements-backend.onrender.com`
4. **Save this URL** - you'll need it for frontend!

---

### Option C: Heroku

#### 2.1 Deploy to Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
cd backend
heroku create auplacements-backend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Add environment variables
heroku config:set PORT=3001
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/auplacements"
heroku config:set JWT_SECRET="your-super-secret-jwt-key"
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASSWORD="your-gmail-app-password"
heroku config:set FRONTEND_URL="https://your-frontend-url.vercel.app"

# Deploy
git subtree push --prefix backend heroku main

# Or if already pushed to GitHub
heroku git:remote -a auplacements-backend
git subtree push --prefix backend heroku main
```

#### 2.2 Get URL
```bash
heroku open
# Copy URL: https://auplacements-backend.herokuapp.com
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Update Environment Variable
Before deploying, you need your backend URL from Step 2.

**Local testing with production backend:**
```bash
cd frontend
echo "VITE_API_URL=https://your-backend-url.railway.app/api" > .env
npm run build
npm run preview
```

### 3.2 Deploy to Vercel

#### Method 1: Vercel Dashboard (Easiest)
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..." → "Project"**
4. Select your **`AUplacements`** repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api`

7. Click **"Deploy"**

8. Once deployed, copy your frontend URL: `https://auplacements.vercel.app`

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? auplacements-frontend
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend-url.railway.app/api

# Deploy to production
vercel --prod
```

---

## 🔄 Step 4: Update Backend CORS & FRONTEND_URL

After deploying frontend, update backend's `FRONTEND_URL`:

### Railway:
1. Go to Railway dashboard
2. Variables tab
3. Edit `FRONTEND_URL` to: `https://auplacements.vercel.app`
4. Redeploy

### Render:
1. Go to Render dashboard
2. Environment tab
3. Edit `FRONTEND_URL` to: `https://auplacements.vercel.app`
4. Save (auto-redeploys)

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend
```bash
# Check health
curl https://your-backend-url.railway.app

# Test auth endpoint
curl https://your-backend-url.railway.app/api/auth/send-magic-link \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu.in"}'
```

### 5.2 Test Frontend
1. Open: `https://auplacements.vercel.app`
2. Try logging in
3. Check browser console for errors
4. Verify API calls work

---

## 🎯 Quick Deployment Summary

```bash
# 1. MongoDB Atlas
✅ Create cluster
✅ Get connection string
✅ Allow all IPs

# 2. Backend (Railway)
✅ Deploy from GitHub
✅ Set root directory: backend
✅ Add environment variables
✅ Get backend URL

# 3. Frontend (Vercel)
✅ Deploy from GitHub
✅ Set root directory: frontend
✅ Add VITE_API_URL environment variable
✅ Get frontend URL

# 4. Update Backend
✅ Set FRONTEND_URL to Vercel URL
✅ Redeploy backend
```

---

## 🔐 Environment Variables Checklist

### Backend (.env)
```bash
✅ PORT=3001
✅ NODE_ENV=production
✅ MONGODB_URI=mongodb+srv://...
✅ JWT_SECRET=random-secret-key
✅ EMAIL_USER=your-email@gmail.com
✅ EMAIL_PASSWORD=gmail-app-password
✅ FRONTEND_URL=https://auplacements.vercel.app
```

### Frontend (.env)
```bash
✅ VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails:**
```bash
# Check Node version in package.json
"engines": {
  "node": ">=18.0.0"
}
```

**MongoDB connection fails:**
- Verify connection string
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Ensure password doesn't have special characters (URL encode if needed)

**Email not working:**
- Use Gmail App Password, not regular password
- Enable 2FA on Gmail first

### Frontend Issues

**API calls fail (CORS):**
- Verify `FRONTEND_URL` in backend matches Vercel URL
- Check backend CORS configuration
- Rebuild and redeploy both if needed

**Environment variable not working:**
- Must start with `VITE_`
- Redeploy after adding new env vars
- Check Vercel dashboard → Settings → Environment Variables

**404 on page refresh:**
- Vercel should handle this automatically with `vercel.json`
- Check rewrites configuration

---

## 🔄 Continuous Deployment

Both Vercel and Railway support **auto-deployment**:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. Auto-deploys:
   - Railway deploys backend automatically
   - Vercel deploys frontend automatically

3. Monitor:
   - Railway: View logs in dashboard
   - Vercel: View deployment logs

---

## 📊 Cost Summary

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| MongoDB Atlas | 512MB storage | From $9/month |
| Railway | $5 credit/month | $20/month |
| Render | 750 hours/month | From $7/month |
| Vercel | Unlimited (hobby) | From $20/month |

**Total Free:** All services have generous free tiers! 🎉

---

## 🎉 You're Done!

Your AU Placements Portal is now live:
- **Frontend:** https://auplacements.vercel.app
- **Backend:** https://auplacements-backend.railway.app
- **Database:** MongoDB Atlas

Share your deployment URLs! 🚀
