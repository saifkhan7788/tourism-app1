-- Migration: Add pricing columns to tours table
-- Run this if you get "Unknown column 'original_price'" error

ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10, 2) AFTER price,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2) AFTER price_usd,
ADD COLUMN IF NOT EXISTS original_price_usd DECIMAL(10, 2) AFTER original_price,
ADD COLUMN IF NOT EXISTS discount_percentage INT DEFAULT 0 AFTER original_price_usd;

-- Update existing tours with original_price if NULL
UPDATE tours SET original_price = price WHERE original_price IS NULL;
UPDATE tours SET discount_percentage = 0 WHERE discount_percentage IS NULL;
