-- Add Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Default Settings (ignore if already exists)
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('facebook_url', 'https://facebook.com/arabianadventure'),
('instagram_url', 'https://instagram.com/arabianadventure'),
('twitter_url', 'https://twitter.com/arabianadventure'),
('whatsapp_number', '97477807165'),
('company_phone', '+974 7780 7165'),
('company_email', 'info@arabianadventure.com'),
('company_address', 'Doha, Qatar');
