# 🚀 QUICK START GUIDE

## Get Your Qatar Tourism App Running in 5 Minutes!

### Step 1: Setup Database (2 minutes)

Open MySQL and run:
```sql
CREATE DATABASE qatar_tourism;
USE qatar_tourism;
```

Then execute the schema file:
```bash
mysql -u root -p qatar_tourism < database/schema.sql
```

### Step 2: Start Backend (1 minute)

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` file with your MySQL password, then:
```bash
npm run dev
```

✅ Backend running on http://localhost:3001

### Step 3: Start Frontend (1 minute)

Open new terminal:
```bash
cd frontend
npm install
npm start
```

✅ Frontend running on http://localhost:3000

### Step 4: Login as Admin (30 seconds)

1. Go to http://localhost:3000/login
2. Email: `admin@qataradventures.com`
3. Password: `admin123`

### Step 5: Test the System (30 seconds)

**Public Side:**
- Browse tours on homepage
- Click "View Details" on any tour
- Fill booking form and submit

**Admin Side:**
- Go to Admin Dashboard
- Add/Edit/Delete tours
- View and manage bookings

## 🎉 That's It!

Your full-stack Qatar Tourism system is now running!

## 📝 What You Have:

✅ 5 pre-loaded tours (Desert Safari, Jet Ski, City Tour, Dhow Cruise, North Qatar)  
✅ Beautiful Material-UI interface  
✅ Fully functional booking system  
✅ Admin panel for managing everything  
✅ Scalable architecture ready for growth  

## 🔥 Next Steps:

1. **Customize Tours:** Go to Admin → Tour Management → Edit tours
2. **Add Images:** Update image URLs in tour management
3. **Test Bookings:** Make test bookings from tour pages
4. **Manage Bookings:** View and update booking status in admin panel

## ⚠️ Important Notes:

- Default admin password is `admin123` - CHANGE IT!
- Update contact information in Footer component
- Add real images for tours
- Configure email notifications (future enhancement)

## 🆘 Having Issues?

**Database Error?**
- Check MySQL is running
- Verify credentials in backend/.env

**Port Conflict?**
- Backend: Change PORT in backend/.env
- Frontend: It will prompt you to use different port

**CORS Error?**
- Check FRONTEND_URL in backend/.env matches your React app URL

---

**Need Help?** Check the main README.md for detailed documentation!
