const db = require('../config/database');

class Announcement {
  static async create(data) {
    const { message, type, background_color, text_color, start_date, end_date } = data;
    const [result] = await db.query(
      'INSERT INTO announcements (message, type, background_color, text_color, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [message, type, background_color, text_color, start_date, end_date]
    );
    return result.insertId;
  }

  static async getActive() {
    const [rows] = await db.query(
      'SELECT * FROM announcements WHERE is_active = 1 AND (start_date IS NULL OR start_date <= CURDATE()) AND (end_date IS NULL OR end_date >= CURDATE()) ORDER BY created_at DESC'
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
    return rows;
  }

  static async update(id, data) {
    const { message, type, background_color, text_color, is_active, start_date, end_date } = data;
    const [result] = await db.query(
      'UPDATE announcements SET message = ?, type = ?, background_color = ?, text_color = ?, is_active = ?, start_date = ?, end_date = ? WHERE id = ?',
      [message, type, background_color, text_color, is_active, start_date, end_date, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM announcements WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Announcement;
