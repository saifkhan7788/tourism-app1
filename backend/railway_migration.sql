-- Complete Migration Script for Railway
-- Run this in Railway MySQL Query Console

-- Step 1: Add pricing columns to tours table
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10, 2) AFTER price,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2) AFTER price_usd,
ADD COLUMN IF NOT EXISTS original_price_usd DECIMAL(10, 2) AFTER original_price,
ADD COLUMN IF NOT EXISTS discount_percentage INT DEFAULT 0 AFTER original_price_usd;

-- Step 2: Update existing tours with default values
UPDATE tours SET original_price = price WHERE original_price IS NULL;
UPDATE tours SET discount_percentage = 0 WHERE discount_percentage IS NULL;

-- Step 3: Add auto-approval settings
INSERT INTO settings (setting_key, setting_value) VALUES
('auto_approve_enabled', 'true'),
('auto_approve_minutes', '2')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Verify the changes
SELECT 'Tours columns added' AS status;
SELECT 'Settings updated' AS status;
