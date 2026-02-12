# 📡 API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🎫 Tours API

### Get All Tours
```http
GET /tours
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Desert Safari Adventure",
      "description": "Experience the thrill...",
      "price": 250.00,
      "duration": "6 hours",
      "category": "Adventure",
      "image_url": "/uploads/desert-safari.jpg",
      "highlights": ["Dune bashing", "Camel riding"],
      "includes": ["Hotel pickup", "BBQ dinner"],
      "is_active": 1,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Tour by ID
```http
GET /tours/:id
```

### Search Tours
```http
GET /tours/search?keyword=desert
```

### Create Tour (Protected)
```http
POST /tours
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Tour",
  "description": "Tour description",
  "price": 200,
  "duration": "4 hours",
  "category": "Adventure",
  "image_url": "/uploads/image.jpg",
  "highlights": ["Item 1", "Item 2"],
  "includes": ["Service 1", "Service 2"]
}
```

### Update Tour (Protected)
```http
PUT /tours/:id
Authorization: Bearer <token>
```

### Delete Tour (Protected)
```http
DELETE /tours/:id
Authorization: Bearer <token>
```

---

## 📅 Bookings API

### Create Booking
```http
POST /bookings
```

**Request Body:**
```json
{
  "tour_id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+974 1234 5678",
  "booking_date": "2024-12-25",
  "number_of_people": 2,
  "total_price": 500,
  "special_requests": "Vegetarian meal"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "bookingId": 1
}
```

### Get All Bookings (Protected)
```http
GET /bookings
Authorization: Bearer <token>
```

### Get Booking by ID (Protected)
```http
GET /bookings/:id
Authorization: Bearer <token>
```

### Update Booking Status (Protected)
```http
PATCH /bookings/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Status Options:** `pending`, `confirmed`, `cancelled`, `completed`

### Get Bookings by Email
```http
GET /bookings/email/:email
```

---

## 🔐 Authentication API

### Register Admin
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepassword"
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@qataradventures.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@qataradventures.com",
    "role": "super_admin"
  }
}
```

### Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <token>
```

---

## 🏥 Health Check

### Server Health
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details"
}
```

---

## 🧪 Testing with cURL

### Get All Tours
```bash
curl http://localhost:3001/api/tours
```

### Create Booking
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tour_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+974 1234 5678",
    "booking_date": "2024-12-25",
    "number_of_people": 2,
    "total_price": 500
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@qataradventures.com",
    "password": "admin123"
  }'
```

### Create Tour (with token)
```bash
curl -X POST http://localhost:3001/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New Tour",
    "description": "Description",
    "price": 200,
    "duration": "4 hours",
    "category": "Adventure",
    "highlights": ["Item 1"],
    "includes": ["Service 1"]
  }'
```

---

## 📊 Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- Public endpoints: 100 requests/15 minutes
- Auth endpoints: 5 requests/15 minutes
- Protected endpoints: 200 requests/15 minutes

---

## 🔒 Security Notes

1. Always use HTTPS in production
2. Store JWT_SECRET securely
3. Implement request validation
4. Add rate limiting
5. Enable CORS only for trusted domains
6. Sanitize all user inputs
7. Use prepared statements (already implemented)

---

**For more details, check the main README.md**
