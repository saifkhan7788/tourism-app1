import db from '../config/database.js';

export const runMigration = async (req, res) => {
  try {
    await db.query(`
      ALTER TABLE tours 
      ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10, 2) AFTER price,
      ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2) AFTER price_usd,
      ADD COLUMN IF NOT EXISTS original_price_usd DECIMAL(10, 2) AFTER original_price,
      ADD COLUMN IF NOT EXISTS discount_percentage INT DEFAULT 0 AFTER original_price_usd
    `);
    
    await db.query(`UPDATE tours SET original_price = price WHERE original_price IS NULL`);
    await db.query(`UPDATE tours SET discount_percentage = 0 WHERE discount_percentage IS NULL`);
    
    res.json({ success: true, message: 'Migration completed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
