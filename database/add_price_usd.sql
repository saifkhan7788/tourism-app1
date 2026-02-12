-- Add USD price column to tours table
USE qatar_tourism;

ALTER TABLE tours ADD COLUMN price_usd DECIMAL(10, 2) AFTER price;
