# 🎯 GETTING STARTED - Your Complete Guide

Welcome to your Qatar Tourism Full-Stack Application! This guide will help you understand and use your new system.

---

## 📖 Table of Contents

1. [What You Have](#what-you-have)
2. [Quick Start](#quick-start)
3. [Understanding the System](#understanding-the-system)
4. [Using the Admin Panel](#using-the-admin-panel)
5. [Customization Guide](#customization-guide)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## 🎁 What You Have

### A Complete Tourism Booking Platform

**Public Website:**
- Beautiful homepage showcasing all tours
- Individual tour detail pages
- Booking forms for each tour
- Contact and About pages
- Fully responsive (works on all devices)

**Admin Dashboard:**
- Secure login system
- Add/Edit/Delete tours
- View all bookings
- Manage booking status
- Customer information management

**Technology:**
- Modern React.js frontend with Material-UI
- Robust Node.js backend with Express
- MySQL database for data storage
- JWT authentication for security

---

## 🚀 Quick Start

### Step 1: Install Prerequisites

**You need:**
- Node.js (Download from: https://nodejs.org)
- MySQL (Download from: https://dev.mysql.com/downloads/)

**Check if installed:**
```bash
node --version
npm --version
mysql --version
```

### Step 2: Setup Database

**Open MySQL:**
```bash
mysql -u root -p
```

**Create database and import schema:**
```sql
CREATE DATABASE qatar_tourism;
USE qatar_tourism;
source E:/personal/tourism-app/database/schema.sql;
```

Or use MySQL Workbench:
1. Open MySQL Workbench
2. Create new connection
3. Run the `schema.sql` file

### Step 3: Configure Backend

**Navigate to backend folder:**
```bash
cd E:\personal\tourism-app\backend
```

**Install dependencies:**
```bash
npm install
```

**Create environment file:**
```bash
copy .env.example .env
```

**Edit `.env` file** (use Notepad or any text editor):
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=qatar_tourism
JWT_SECRET=your_secret_key_min_32_characters
FRONTEND_URL=http://localhost:3000
```

**Start backend:**
```bash
npm run dev
```

✅ You should see: "🚀 Server running on port 3001"

### Step 4: Configure Frontend

**Open NEW terminal, navigate to frontend:**
```bash
cd E:\personal\tourism-app\frontend
```

**Install dependencies:**
```bash
npm install
```

**Start frontend:**
```bash
npm start
```

✅ Browser will open automatically at http://localhost:3000

### Step 5: Login as Admin

1. Go to: http://localhost:3000/login
2. Email: `admin@qataradventures.com`
3. Password: `admin123`
4. Click "Login"

🎉 **You're in!** You should see the Admin Dashboard.

---

## 🧠 Understanding the System

### How It Works

```
User Browser (React)
       ↓
   Frontend (Port 3000)
       ↓
   API Calls (Axios)
       ↓
   Backend (Port 3001)
       ↓
   MySQL Database
```

### File Structure Explained

**Backend (`backend/` folder):**
- `server.js` - Main entry point, starts the server
- `config/database.js` - Connects to MySQL
- `models/` - Database operations (Tour, Booking, User)
- `controllers/` - Business logic
- `routes/` - API endpoints
- `middleware/auth.js` - Protects admin routes

**Frontend (`frontend/src/` folder):**
- `App.js` - Main app component with routing
- `pages/` - All website pages
- `components/` - Reusable UI components
- `services/api.js` - Talks to backend
- `context/AuthContext.js` - Manages login state
- `utils/theme.js` - Qatar colors and styling

**Database (`database/` folder):**
- `schema.sql` - Creates tables and sample data

---

## 🎛️ Using the Admin Panel

### Accessing Admin Panel

**URL:** http://localhost:3000/admin

**Login Required:** Yes (use admin credentials)

### Tour Management

**To Add a New Tour:**
1. Click "Admin" in navigation
2. You're on "Tour Management" tab
3. Click "Add New Tour" button
4. Fill in the form:
   - **Title:** Tour name (e.g., "Banana Boat Ride")
   - **Description:** Detailed description
   - **Price:** Number only (e.g., 150)
   - **Duration:** Text (e.g., "2 hours")
   - **Category:** Type (e.g., "Water Sports")
   - **Image URL:** Path to image
   - **Highlights:** JSON array format:
     ```json
     ["Highlight 1", "Highlight 2", "Highlight 3"]
     ```
   - **Includes:** JSON array format:
     ```json
     ["Service 1", "Service 2", "Service 3"]
     ```
5. Click "Create"

**To Edit a Tour:**
1. Find tour in the table
2. Click pencil (Edit) icon
3. Modify fields
4. Click "Update"

**To Delete a Tour:**
1. Find tour in the table
2. Click trash (Delete) icon
3. Confirm deletion

### Booking Management

**To View Bookings:**
1. Click "Booking Management" tab
2. See all bookings in table

**To Update Booking Status:**
1. Find booking in table
2. Click status dropdown
3. Select new status:
   - **Pending:** Just received
   - **Confirmed:** Approved by you
   - **Completed:** Tour finished
   - **Cancelled:** Cancelled by customer/you

**Booking Information Shown:**
- Customer name, email, phone
- Tour booked
- Date of tour
- Number of people
- Total price
- Current status

---

## 🎨 Customization Guide

### Change Company Name

**File:** `frontend/src/components/Navbar.js`

Find line:
```javascript
Qatar Adventures
```

Replace with your company name.

**Also update in:**
- `frontend/src/components/Footer.js`
- `frontend/public/index.html` (title tag)

### Update Contact Information

**File:** `frontend/src/components/Footer.js`

Find and replace:
```javascript
📞 Phone: +974 1234 5678
📧 Email: info@qataradventures.com
📍 Address: Doha, Qatar
```

### Change Colors

**File:** `frontend/src/utils/theme.js`

Modify:
```javascript
primary: {
  main: '#8B1538', // Change this color
},
secondary: {
  main: '#FFD700', // Change this color
},
```

Use color picker: https://htmlcolorcodes.com/

### Add Tour Images

**Option 1: Use External URLs**
- Upload images to image hosting (Imgur, Cloudinary)
- Copy image URL
- Paste in tour's "Image URL" field

**Option 2: Use Local Images**
- Place images in `frontend/public/images/`
- Use path: `/images/your-image.jpg`

### Modify Tour Prices

**In Admin Panel:**
1. Go to Tour Management
2. Click Edit on tour
3. Change price
4. Click Update

---

## 📋 Common Tasks

### Task 1: Add a New Tour

```
Admin Panel → Tour Management → Add New Tour
Fill form → Create
```

### Task 2: Update Tour Price

```
Admin Panel → Tour Management → Edit (pencil icon)
Change price → Update
```

### Task 3: View Today's Bookings

```
Admin Panel → Booking Management
Look at "Date" column
```

### Task 4: Confirm a Booking

```
Admin Panel → Booking Management
Find booking → Change status to "Confirmed"
```

### Task 5: Change Admin Password

**Currently:** Need to do in database directly

**In MySQL:**
```sql
USE qatar_tourism;
-- First, hash your new password using bcrypt online tool
-- Then update:
UPDATE users SET password = 'hashed_password_here' WHERE email = 'admin@qataradventures.com';
```

**Better way:** Add password change feature (future enhancement)

---

## 🔧 Troubleshooting

### Problem: Backend won't start

**Error:** "Database connection failed"

**Solution:**
1. Check MySQL is running
2. Verify credentials in `backend/.env`
3. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

### Problem: Frontend shows "Network Error"

**Solution:**
1. Check backend is running (port 3001)
2. Check `frontend/.env` has correct API URL
3. Check CORS settings in `backend/server.js`

### Problem: Can't login to admin

**Solution:**
1. Verify email: `admin@qataradventures.com`
2. Verify password: `admin123`
3. Check browser console for errors (F12)
4. Verify JWT_SECRET is set in `backend/.env`

### Problem: Tours not showing

**Solution:**
1. Check backend is running
2. Open browser console (F12)
3. Check for API errors
4. Verify database has tours:
   ```sql
   SELECT * FROM tours;
   ```

### Problem: Booking form not submitting

**Solution:**
1. Check all required fields are filled
2. Check date is in future
3. Check browser console for errors
4. Verify backend is receiving request

### Problem: Port already in use

**Backend (3001):**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Frontend (3000):**
- React will ask to use different port
- Press 'Y' to accept

---

## 🎯 Next Steps

### Immediate (Today)
1. ✅ Get system running
2. ✅ Login to admin panel
3. ✅ Browse the website
4. ✅ Make a test booking
5. ✅ View booking in admin panel

### This Week
1. Change admin password
2. Update contact information
3. Modify tour descriptions
4. Add real images
5. Test on mobile device

### This Month
1. Prepare for deployment
2. Get domain name
3. Setup hosting
4. Go live!

### Future Enhancements
- Payment gateway integration
- Email notifications
- SMS confirmations
- Multi-language support
- Customer reviews
- Advanced analytics

---

## 📚 Additional Resources

### Documentation Files
- `README.md` - Complete technical documentation
- `QUICKSTART.md` - 5-minute setup guide
- `API_DOCUMENTATION.md` - All API endpoints
- `DEPLOYMENT.md` - How to deploy to production
- `PROJECT_SUMMARY.md` - Project overview
- `CLIENT_CHECKLIST.md` - Pre-launch checklist

### Learning Resources
- React: https://react.dev/learn
- Material-UI: https://mui.com/material-ui/getting-started/
- Node.js: https://nodejs.org/en/docs/
- MySQL: https://dev.mysql.com/doc/

### Tools You Might Need
- **VS Code:** Code editor (https://code.visualstudio.com/)
- **Postman:** API testing (https://www.postman.com/)
- **MySQL Workbench:** Database management (included with MySQL)

---

## 💬 Getting Help

### Check These First
1. Error messages in terminal
2. Browser console (F12 → Console tab)
3. Documentation files
4. This guide

### Common Questions

**Q: How do I stop the servers?**
A: Press `Ctrl + C` in the terminal

**Q: How do I restart after stopping?**
A: Run `npm run dev` (backend) or `npm start` (frontend)

**Q: Can I use a different port?**
A: Yes, change PORT in `backend/.env`

**Q: How do I backup my data?**
A: Export MySQL database:
```bash
mysqldump -u root -p qatar_tourism > backup.sql
```

**Q: How do I add more admins?**
A: Use the register endpoint or add directly in database

---

## ✅ Success Checklist

- [ ] Backend running without errors
- [ ] Frontend opens in browser
- [ ] Can see all 5 tours on homepage
- [ ] Can click and view tour details
- [ ] Can submit a booking
- [ ] Can login to admin panel
- [ ] Can view bookings in admin
- [ ] Can add a new tour
- [ ] Can edit a tour
- [ ] Can delete a tour

**All checked?** 🎉 **You're ready to customize and launch!**

---

## 🎊 Congratulations!

You now have a fully functional, professional tourism booking platform!

**What you can do:**
- Accept bookings 24/7
- Manage tours easily
- Track customers
- Scale your business
- Add new features anytime

**Remember:**
- Start small, test everything
- Backup regularly
- Keep admin password secure
- Monitor bookings daily
- Update content regularly

---

**Need more help?** Check the other documentation files!

**Ready to launch?** See `DEPLOYMENT.md`!

**Good luck with your Qatar Tourism business! 🚀**
