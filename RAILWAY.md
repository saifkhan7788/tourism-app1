# Railway Deployment Guide

## Step-by-Step Deployment

### 1. Build Frontend
```bash
cd frontend
npm run build
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3. Deploy on Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 4. Add MySQL Database

1. In your project, click "New"
2. Select "Database" → "MySQL"
3. Railway will create a MySQL instance

### 5. Configure Environment Variables

Click on your app service → Variables → Add:

```
NODE_ENV=production
PORT=3001
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@arabianadventure.com
FRONTEND_URL=https://your-app.railway.app
```

### 6. Import Database Schema

1. Click on MySQL service
2. Go to "Data" tab
3. Click "Query"
4. Paste contents of `database/schema.sql`
5. Execute

### 7. Deploy

Railway will automatically deploy. Your app will be live at:
```
https://your-app-name.railway.app
```

## Free Tier Limits

- $5 free credit per month
- Enough for small projects
- Sleeps after inactivity

## Update Deployment

Just push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```

Railway auto-deploys on push!

## View Logs

Click on your service → "Deployments" → Click latest deployment → "View Logs"

## Custom Domain

1. Go to Settings
2. Click "Generate Domain" or add custom domain
3. Update DNS records if using custom domain
