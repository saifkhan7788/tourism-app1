-- Create Database
CREATE DATABASE IF NOT EXISTS qatar_tourism;
USE qatar_tourism;

-- Tours Table
CREATE TABLE tours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  highlights JSON,
  includes JSON,
  image_url VARCHAR(500),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);

-- Bookings Table
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tour_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  booking_date DATE NOT NULL,
  number_of_people INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  special_requests TEXT,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  INDEX idx_tour (tour_id),
  INDEX idx_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_date (booking_date)
);

-- Users Table (Admin)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager') DEFAULT 'manager',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Insert Sample Tours (5 Main Tours)
INSERT INTO tours (title, description, price, duration, highlights, includes, image_url, category) VALUES
(
  'Desert Safari Adventure',
  'Experience the thrill of dune bashing in the golden sands of Qatar. Enjoy camel rides, sandboarding, and a traditional BBQ dinner under the stars with cultural entertainment.',
  250.00,
  '6 hours',
  '["Dune bashing in 4x4 vehicles", "Camel riding experience", "Sandboarding", "Traditional BBQ dinner", "Henna painting", "Falcon photography", "Sunset views"]',
  '["Hotel pickup and drop-off", "Professional driver/guide", "BBQ dinner and refreshments", "All activities", "Safety equipment"]',
  '/uploads/desert-safari.jpg',
  'Adventure'
),
(
  'Jet Ski Water Sports',
  'Feel the adrenaline rush as you ride the waves on a powerful jet ski. Perfect for adventure seekers looking for an exciting water sports experience along Qatar beautiful coastline.',
  180.00,
  '1 hour',
  '["High-speed jet ski riding", "Professional instruction", "Safety briefing", "Scenic coastal views", "Photo opportunities"]',
  '["Jet ski rental", "Life jacket", "Safety equipment", "Professional instructor", "Insurance"]',
  '/uploads/jet-ski.jpg',
  'Water Sports'
),
(
  'Doha City Tour',
  'Discover the rich culture and modern marvels of Doha. Visit iconic landmarks including the Museum of Islamic Art, Souq Waqif, The Pearl, and Katara Cultural Village.',
  150.00,
  '4 hours',
  '["Museum of Islamic Art", "Souq Waqif traditional market", "The Pearl-Qatar", "Katara Cultural Village", "Corniche waterfront", "Photo stops at landmarks"]',
  '["Air-conditioned vehicle", "Professional tour guide", "Hotel pickup and drop-off", "Bottled water", "Entry fees"]',
  '/uploads/city-tour.jpg',
  'Cultural'
),
(
  'Dhow Cruise Dinner',
  'Sail along Doha Bay on a traditional wooden dhow boat. Enjoy a delicious international buffet dinner while taking in the stunning views of Doha illuminated skyline.',
  200.00,
  '3 hours',
  '["Traditional dhow boat cruise", "International buffet dinner", "Live entertainment", "Stunning skyline views", "Welcome drinks", "Relaxing atmosphere"]',
  '["Dhow cruise", "International buffet dinner", "Welcome drinks", "Live entertainment", "Hotel pickup and drop-off"]',
  '/uploads/dhow-cruise.jpg',
  'Cruise'
),
(
  'North of Qatar Tour',
  'Explore Qatar historical treasures in the north. Visit the UNESCO World Heritage Site of Al Zubarah Fort, ancient ruins, and enjoy the serene beaches and mangroves.',
  220.00,
  '5 hours',
  '["Al Zubarah Fort (UNESCO site)", "Archaeological ruins", "Purple Island mangroves", "Northern beaches", "Traditional villages", "Historical insights"]',
  '["Air-conditioned 4x4 vehicle", "Professional guide", "Hotel pickup and drop-off", "Bottled water and snacks", "Entry fees"]',
  '/uploads/north-qatar.jpg',
  'Historical'
);

-- Insert Default Admin User (password: admin123)
-- Note: In production, change this password immediately
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@arabianadventure.com', '$2a$10$8ZqrZ5Z5Z5Z5Z5Z5Z5Z5ZeK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'admin');

-- Contact Messages Table
CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  reply_message TEXT,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email)
);

-- Gallery/Carousel Images Table
CREATE TABLE gallery_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_order (display_order)
);

-- Announcements/Offers Banner Table
CREATE TABLE announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message TEXT NOT NULL,
  type ENUM('offer', 'news', 'alert') DEFAULT 'offer',
  background_color VARCHAR(20) DEFAULT '#FFD700',
  text_color VARCHAR(20) DEFAULT '#8B1538',
  is_active BOOLEAN DEFAULT 1,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_active (is_active)
);

-- Settings Table
CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Default Settings
INSERT INTO settings (setting_key, setting_value) VALUES
('facebook_url', 'https://facebook.com/arabianadventure'),
('instagram_url', 'https://instagram.com/arabianadventure'),
('twitter_url', 'https://twitter.com/arabianadventure'),
('whatsapp_number', '97477807165'),
('company_phone', '+974 7780 7165'),
('company_email', 'info@arabianadventure.com'),
('company_address', 'Doha, Qatar');
