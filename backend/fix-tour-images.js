import db from './config/database.js';

const updateTourImages = async () => {
  try {
    // Update all tours to have null image_url since sample images don't exist
    const [result] = await db.query('UPDATE tours SET image_url = NULL');
    
    console.log(`✅ Updated ${result.affectedRows} tours - removed non-existent image paths`);
    console.log('Tours now have null image_url - you can upload real images via admin panel');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating tour images:', error);
    process.exit(1);
  }
};

updateTourImages();