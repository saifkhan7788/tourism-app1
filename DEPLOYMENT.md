# 🚀 DEPLOYMENT GUIDE

Complete guide to deploy your Qatar Tourism application to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Change default admin password
- [ ] Update contact information
- [ ] Add real tour images
- [ ] Test all features locally
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Enable HTTPS/SSL
- [ ] Set up domain name
- [ ] Configure email service (optional)

---

## 🗄️ Database Deployment

### Option 1: AWS RDS (Recommended)

1. **Create MySQL Instance:**
   - Go to AWS RDS Console
   - Create MySQL 8.0 database
   - Choose appropriate instance size
   - Enable automated backups
   - Note down endpoint and credentials

2. **Import Schema:**
```bash
mysql -h your-rds-endpoint.amazonaws.com -u admin -p qatar_tourism < database/schema.sql
```

3. **Security:**
   - Configure security groups
   - Allow only backend server IP
   - Enable SSL connections

### Option 2: DigitalOcean Managed Database

1. Create MySQL cluster
2. Import schema via console or CLI
3. Note connection details
4. Configure firewall rules

### Option 3: Heroku ClearDB

1. Add ClearDB addon to Heroku app
2. Get database URL from config vars
3. Import schema

---

## 🖥️ Backend Deployment

### Option 1: Heroku (Easiest)

1. **Install Heroku CLI:**
```bash
npm install -g heroku
```

2. **Login and Create App:**
```bash
cd backend
heroku login
heroku create qatar-tourism-api
```

3. **Set Environment Variables:**
```bash
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_NAME=qatar_tourism
heroku config:set JWT_SECRET=your-secret-key
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
heroku config:set NODE_ENV=production
```

4. **Deploy:**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

5. **Verify:**
```bash
heroku logs --tail
heroku open
```

### Option 2: AWS EC2

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t2.micro or larger
   - Configure security groups (ports 22, 80, 443, 3001)

2. **Connect and Setup:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone/Upload your code
git clone your-repo-url
cd tourism-app/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add your production environment variables

# Start with PM2
pm2 start server.js --name qatar-tourism-api
pm2 startup
pm2 save
```

3. **Setup Nginx Reverse Proxy:**
```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/qatar-tourism
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/qatar-tourism /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository
2. Select backend folder
3. Set environment variables
4. Deploy automatically

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-api-domain.com/api`

4. **Redeploy:**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Build Project:**
```bash
cd frontend
npm run build
```

2. **Deploy via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

3. **Or use Netlify Dashboard:**
   - Drag and drop `build` folder
   - Configure environment variables
   - Set up custom domain

### Option 3: AWS S3 + CloudFront

1. **Build:**
```bash
npm run build
```

2. **Create S3 Bucket:**
   - Enable static website hosting
   - Upload build folder contents
   - Set bucket policy for public read

3. **Create CloudFront Distribution:**
   - Origin: S3 bucket
   - Enable HTTPS
   - Set default root object: index.html

4. **Configure Environment:**
   - Update `REACT_APP_API_URL` before build
   - Rebuild and redeploy

---

## 🌐 Domain Configuration

### Backend API
```
api.qataradventures.com → Backend server
```

### Frontend
```
www.qataradventures.com → Frontend app
qataradventures.com → Redirect to www
```

### DNS Records (Example)
```
A     @              → Frontend IP/CDN
A     www            → Frontend IP/CDN
A     api            → Backend IP
CNAME www            → Frontend domain
```

---

## 🔒 Production Security

### Backend
1. **Environment Variables:**
   - Never commit `.env` file
   - Use strong JWT_SECRET (32+ characters)
   - Use strong database passwords

2. **CORS Configuration:**
```javascript
app.use(cors({
  origin: ['https://qataradventures.com', 'https://www.qataradventures.com'],
  credentials: true
}));
```

3. **Rate Limiting:**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

4. **Helmet.js:**
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Frontend
1. Never expose API keys in code
2. Use environment variables
3. Enable HTTPS only
4. Implement CSP headers

---

## 📊 Monitoring & Logging

### Backend Monitoring

1. **PM2 Monitoring:**
```bash
pm2 monit
pm2 logs
```

2. **Setup Log Rotation:**
```bash
pm2 install pm2-logrotate
```

3. **Error Tracking (Sentry):**
```bash
npm install @sentry/node
```

### Database Monitoring
- Enable slow query log
- Set up automated backups
- Monitor connection pool

### Uptime Monitoring
- UptimeRobot (free)
- Pingdom
- AWS CloudWatch

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "qatar-tourism-api"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./frontend
```

---

## 🧪 Post-Deployment Testing

1. **Test All Endpoints:**
   - Health check: `https://api.yourdomain.com/api/health`
   - Get tours: `https://api.yourdomain.com/api/tours`
   - Login: Test admin login

2. **Test Frontend:**
   - Browse tours
   - View tour details
   - Submit booking
   - Admin login
   - CRUD operations

3. **Performance Testing:**
   - Google PageSpeed Insights
   - GTmetrix
   - Load testing with Apache Bench

4. **Security Testing:**
   - SSL Labs test
   - OWASP ZAP scan
   - Check headers with securityheaders.com

---

## 📱 Mobile Optimization

Already responsive, but verify:
- Test on real devices
- Check touch targets
- Verify form inputs
- Test booking flow

---

## 🎯 SEO Optimization

1. **Add meta tags** (in public/index.html)
2. **Create sitemap.xml**
3. **Add robots.txt**
4. **Submit to Google Search Console**
5. **Enable Google Analytics**

---

## 💾 Backup Strategy

### Database Backups
```bash
# Daily automated backup
mysqldump -h host -u user -p qatar_tourism > backup_$(date +%Y%m%d).sql
```

### Code Backups
- Use Git (already done)
- Tag releases
- Keep production branch

---

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Monitor server logs
- [ ] Check database performance
- [ ] Review error reports
- [ ] Update dependencies
- [ ] Backup database weekly
- [ ] Test booking flow
- [ ] Review customer feedback

### Emergency Contacts
- Hosting provider support
- Database administrator
- Development team

---

## 🎉 Launch Checklist

- [ ] Database deployed and tested
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Domain configured correctly
- [ ] SSL certificates installed
- [ ] Admin password changed
- [ ] Contact info updated
- [ ] All features tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team trained on admin panel

---

**Congratulations! Your Qatar Tourism app is now live! 🚀**
