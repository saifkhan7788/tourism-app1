# Arabian Adventure - Full Stack Application

A modern, scalable tourism booking platform built with React.js, Node.js, Express, and MySQL.

## 🚀 Features

### Public Features
- ✅ Browse all tours with beautiful Material-UI design
- ✅ View detailed tour information
- ✅ Book tours with instant confirmation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Qatar-themed colors (Maroon & Gold)
- ✅ Contact form

### Admin Features
- ✅ Secure authentication (JWT)
- ✅ Add/Edit/Delete tours dynamically
- ✅ Manage bookings
- ✅ Update booking status
- ✅ View all customer information

### Current Tours (5 Main Services)
1. **Desert Safari** - Dune bashing, camel rides, BBQ dinner
2. **Jet Ski** - Water sports adventure
3. **Doha City Tour** - Cultural landmarks exploration
4. **Dhow Cruise** - Traditional boat cruise with dinner
5. **North of Qatar** - Al Zubarah Fort and northern attractions

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
tourism-app/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection
│   ├── controllers/
│   │   ├── tourController.js    # Tour business logic
│   │   ├── bookingController.js # Booking logic
│   │   └── authController.js    # Authentication
│   ├── models/
│   │   ├── Tour.js              # Tour model
│   │   ├── Booking.js           # Booking model
│   │   └── User.js              # User model
│   ├── routes/
│   │   ├── tourRoutes.js        # Tour endpoints
│   │   ├── bookingRoutes.js     # Booking endpoints
│   │   └── authRoutes.js        # Auth endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── .env.example             # Environment template
│   ├── package.json
│   └── server.js                # Entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── TourCard.js
│   │   │   ├── TourManagement.js
│   │   │   └── BookingManagement.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Tours.js
│   │   │   ├── TourDetail.js
│   │   │   ├── About.js
│   │   │   ├── Contact.js
│   │   │   ├── Login.js
│   │   │   └── Admin.js
│   │   ├── services/
│   │   │   └── api.js           # API calls
│   │   ├── context/
│   │   │   └── AuthContext.js   # Auth state
│   │   ├── utils/
│   │   │   └── theme.js         # MUI theme
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── database/
    └── schema.sql               # Database schema
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Step 1: Clone/Navigate to Project
```bash
cd e:\personal\tourism-app
```

### Step 2: Database Setup

1. **Create MySQL Database:**
```bash
mysql -u root -p
```

2. **Run the schema:**
```sql
source database/schema.sql
```

Or manually execute the SQL file in MySQL Workbench.

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=qatar_tourism
# JWT_SECRET=your_secret_key

# Start server
npm run dev
```

Backend will run on: **http://localhost:3001**

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend will run on: **http://localhost:3000**

## 🔐 Default Admin Credentials

**Email:** admin@arabianadventure.com  
**Password:** admin123

⚠️ **IMPORTANT:** Change this password immediately in production!

## 📡 API Endpoints

### Public Endpoints

#### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour by ID
- `GET /api/tours/search?keyword=` - Search tours

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/email/:email` - Get bookings by email

### Protected Endpoints (Admin Only)

#### Tours
- `POST /api/tours` - Create tour
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour

#### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update booking status

#### Auth
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (requires token)

## 🎨 Design System

### Colors
- **Primary (Maroon):** #8B1538 - Qatar flag color
- **Secondary (Gold):** #FFD700
- **Background:** #f8f9fa
- **Text:** #333333

### Typography
- **Font Family:** Roboto, Helvetica, Arial

## 🚀 Deployment

### Backend Deployment (Heroku/AWS/DigitalOcean)
1. Set environment variables
2. Update CORS settings
3. Deploy with `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Set `REACT_APP_API_URL` to production API
3. Deploy build folder

### Database (Production)
- Use managed MySQL (AWS RDS, DigitalOcean, etc.)
- Update connection credentials
- Enable SSL connections

## 📈 Future Enhancements

### Planned Features
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Multi-language support (Arabic)
- [ ] Email notifications
- [ ] SMS confirmations
- [ ] Customer reviews & ratings
- [ ] Image upload for tours
- [ ] Advanced search & filters
- [ ] Booking calendar
- [ ] Discount codes
- [ ] Analytics dashboard
- [ ] GetYourGuide integration
- [ ] WhatsApp API integration

### Scalability Features
- [ ] Redis caching
- [ ] CDN for images
- [ ] Load balancing
- [ ] Database replication
- [ ] Microservices architecture

## 🔒 Security Best Practices

✅ JWT authentication  
✅ Password hashing (bcrypt)  
✅ SQL injection prevention (parameterized queries)  
✅ CORS configuration  
✅ Environment variables  
✅ Input validation  

### Additional Recommendations
- Enable HTTPS in production
- Implement rate limiting
- Add request validation middleware
- Set up monitoring & logging
- Regular security audits

## 🐛 Troubleshooting

### Backend Issues
- **Database connection error:** Check MySQL credentials in `.env`
- **Port already in use:** Change PORT in `.env`
- **JWT error:** Verify JWT_SECRET is set

### Frontend Issues
- **API connection error:** Check `REACT_APP_API_URL` in `.env`
- **CORS error:** Verify backend CORS settings
- **Build error:** Delete `node_modules` and reinstall

## 📞 Support

For questions or issues:
- Email: dev@arabianadventure.com
- Documentation: Check this README

## 📄 License

This project is proprietary software for Arabian Adventure.

---

**Built with ❤️ for Qatar Tourism Industry**
