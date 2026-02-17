-- Auto-Approval Settings Migration
INSERT INTO settings (setting_key, setting_value) VALUES
('auto_approve_enabled', 'true'),
('auto_approve_minutes', '2')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
