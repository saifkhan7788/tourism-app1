-- Add GetYourGuide URL column to tours table
USE qatar_tourism;

ALTER TABLE tours ADD COLUMN getyourguide_url VARCHAR(500) AFTER image_url;
