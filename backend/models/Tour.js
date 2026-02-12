const db = require('../config/database');

class Tour {
  static async getAll(page = 1, limit = 10, search = '') {
    let query = 'SELECT * FROM tours WHERE is_active = 1';
    const params = [];
    
    if (search) {
      query += ' AND (title LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await db.query(query, params);
    
    return {
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM tours WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(tourData) {
    const { title, description, price, price_usd, duration, highlights, includes, image_url, getyourguide_url, category } = tourData;
    const [result] = await db.query(
      `INSERT INTO tours (title, description, price, price_usd, duration, highlights, includes, image_url, getyourguide_url, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, price_usd || null, duration, JSON.stringify(highlights), JSON.stringify(includes), image_url, getyourguide_url || null, category]
    );
    return result.insertId;
  }

  static async update(id, tourData) {
    const { title, description, price, price_usd, duration, highlights, includes, image_url, getyourguide_url, category } = tourData;
    const [result] = await db.query(
      `UPDATE tours SET title = ?, description = ?, price = ?, price_usd = ?, duration = ?, 
       highlights = ?, includes = ?, image_url = ?, getyourguide_url = ?, category = ? WHERE id = ?`,
      [title, description, price, price_usd || null, duration, JSON.stringify(highlights), JSON.stringify(includes), image_url, getyourguide_url || null, category, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('UPDATE tours SET is_active = 0 WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async search(keyword) {
    const [rows] = await db.query(
      'SELECT * FROM tours WHERE is_active = 1 AND (title LIKE ? OR description LIKE ?) ORDER BY created_at DESC',
      [`%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }
}

module.exports = Tour;
