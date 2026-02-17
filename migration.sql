-- Migration: Update existing Railway database with new columns
-- Run this SQL on Railway MySQL database

-- Add new columns to tours table (one by one to avoid errors if column exists)
ALTER TABLE tours ADD COLUMN price_usd DECIMAL(10, 2) AFTER price;
ALTER TABLE tours ADD COLUMN original_price DECIMAL(10, 2) AFTER price_usd;
ALTER TABLE tours ADD COLUMN original_price_usd DECIMAL(10, 2) AFTER original_price;
ALTER TABLE tours ADD COLUMN discount_percentage INT DEFAULT 0 AFTER original_price_usd;
ALTER TABLE tours ADD COLUMN gallery_images JSON AFTER image_url;
ALTER TABLE tours ADD COLUMN free_cancellation BOOLEAN DEFAULT 1 AFTER category;
ALTER TABLE tours ADD COLUMN cancellation_hours INT DEFAULT 24 AFTER free_cancellation;
ALTER TABLE tours ADD COLUMN reserve_now_pay_later BOOLEAN DEFAULT 1 AFTER cancellation_hours;
ALTER TABLE tours ADD COLUMN min_participants INT DEFAULT 1 AFTER reserve_now_pay_later;
ALTER TABLE tours ADD COLUMN max_participants INT DEFAULT 50 AFTER min_participants;
ALTER TABLE tours ADD COLUMN adult_age_min INT DEFAULT 12 AFTER max_participants;
ALTER TABLE tours ADD COLUMN adult_age_max INT DEFAULT 99 AFTER adult_age_min;
ALTER TABLE tours ADD COLUMN child_age_min INT DEFAULT 3 AFTER adult_age_max;
ALTER TABLE tours ADD COLUMN child_age_max INT DEFAULT 11 AFTER child_age_min;
ALTER TABLE tours ADD COLUMN infant_age_max INT DEFAULT 2 AFTER child_age_max;
ALTER TABLE tours ADD COLUMN languages JSON AFTER infant_age_max;
ALTER TABLE tours ADD COLUMN pickup_included BOOLEAN DEFAULT 1 AFTER languages;
ALTER TABLE tours ADD COLUMN pickup_details VARCHAR(500) DEFAULT 'Pickup from any location in Doha City' AFTER pickup_included;
ALTER TABLE tours ADD COLUMN private_group_available BOOLEAN DEFAULT 1 AFTER pickup_details;
ALTER TABLE tours ADD COLUMN transport_rating INT DEFAULT 92 AFTER private_group_available;
ALTER TABLE tours ADD COLUMN starting_times JSON AFTER transport_rating;

-- Add new columns to bookings table
ALTER TABLE bookings ADD COLUMN booking_time VARCHAR(10) AFTER booking_date;
ALTER TABLE bookings ADD COLUMN total_price_usd DECIMAL(10, 2) AFTER total_price;

-- Update existing tours with default values for new fields
UPDATE tours SET 
  languages = JSON_ARRAY('English'),
  starting_times = JSON_ARRAY('09:00', '14:00', '18:00'),
  gallery_images = JSON_ARRAY()
WHERE languages IS NULL OR starting_times IS NULL OR gallery_images IS NULL;
