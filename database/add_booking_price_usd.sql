-- Add USD total price column to bookings table
USE qatar_tourism;

ALTER TABLE bookings ADD COLUMN total_price_usd DECIMAL(10, 2) AFTER total_price;
