const db = require('../config/database');

class Gallery {
  static async create(galleryData) {
    const { image_url, title, description, display_order } = galleryData;
    const [result] = await db.query(
      'INSERT INTO gallery_images (image_url, title, description, display_order) VALUES (?, ?, ?, ?)',
      [image_url, title, description, display_order || 0]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM gallery_images WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC');
    return rows;
  }

  static async update(id, galleryData) {
    const { image_url, title, description, display_order, is_active } = galleryData;
    const [result] = await db.query(
      'UPDATE gallery_images SET image_url = ?, title = ?, description = ?, display_order = ?, is_active = ? WHERE id = ?',
      [image_url, title, description, display_order, is_active, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM gallery_images WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Gallery;
