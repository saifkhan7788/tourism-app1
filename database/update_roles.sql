-- Update existing users table to use admin/manager roles
USE qatar_tourism;

-- First update existing role values to match new enum
UPDATE users SET role = 'admin' WHERE role NOT IN ('admin', 'manager');

-- Then modify the column
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager') DEFAULT 'manager';

-- Ensure at least one admin exists
UPDATE users SET role = 'admin' WHERE email = 'admin@arabianadventure.com';
