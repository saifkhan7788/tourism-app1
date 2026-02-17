import db from '../config/database.js';

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
    const { title, description, price, price_usd, original_price, original_price_usd, discount_percentage, duration, highlights, includes, image_url, gallery_images, category, free_cancellation, cancellation_hours, reserve_now_pay_later, min_participants, max_participants, adult_age_min, adult_age_max, child_age_min, child_age_max, infant_age_max, languages, pickup_included, pickup_details, private_group_available, transport_rating, starting_times } = tourData;
    const [result] = await db.query(
      `INSERT INTO tours (title, description, price, price_usd, original_price, original_price_usd, discount_percentage, duration, highlights, includes, image_url, gallery_images, category, free_cancellation, cancellation_hours, reserve_now_pay_later, min_participants, max_participants, adult_age_min, adult_age_max, child_age_min, child_age_max, infant_age_max, languages, pickup_included, pickup_details, private_group_available, transport_rating, starting_times) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, price_usd || null, original_price || null, original_price_usd || null, discount_percentage || 0, duration, JSON.stringify(highlights), JSON.stringify(includes), image_url, JSON.stringify(gallery_images || []), category, free_cancellation !== false, cancellation_hours || 24, reserve_now_pay_later !== false, min_participants || 1, max_participants || 50, adult_age_min || 12, adult_age_max || 99, child_age_min || 3, child_age_max || 11, infant_age_max || 2, JSON.stringify(languages || ['English']), pickup_included !== false, pickup_details || 'Pickup from any location in Doha City', private_group_available !== false, transport_rating || 92, JSON.stringify(starting_times || ['09:00', '14:00', '18:00'])]
    );
    return result.insertId;
  }

  static async update(id, tourData) {
    const { title, description, price, price_usd, original_price, original_price_usd, discount_percentage, duration, highlights, includes, image_url, gallery_images, category, free_cancellation, cancellation_hours, reserve_now_pay_later, min_participants, max_participants, adult_age_min, adult_age_max, child_age_min, child_age_max, infant_age_max, languages, pickup_included, pickup_details, private_group_available, transport_rating, starting_times } = tourData;
    const [result] = await db.query(
      `UPDATE tours SET title = ?, description = ?, price = ?, price_usd = ?, original_price = ?, original_price_usd = ?, discount_percentage = ?, duration = ?, 
       highlights = ?, includes = ?, image_url = ?, gallery_images = ?, category = ?, free_cancellation = ?, cancellation_hours = ?, reserve_now_pay_later = ?, min_participants = ?, max_participants = ?, adult_age_min = ?, adult_age_max = ?, child_age_min = ?, child_age_max = ?, infant_age_max = ?, languages = ?, pickup_included = ?, pickup_details = ?, private_group_available = ?, transport_rating = ?, starting_times = ? WHERE id = ?`,
      [title, description, price, price_usd || null, original_price || null, original_price_usd || null, discount_percentage || 0, duration, JSON.stringify(highlights), JSON.stringify(includes), image_url, JSON.stringify(gallery_images || []), category, free_cancellation !== false, cancellation_hours || 24, reserve_now_pay_later !== false, min_participants || 1, max_participants || 50, adult_age_min || 12, adult_age_max || 99, child_age_min || 3, child_age_max || 11, infant_age_max || 2, JSON.stringify(languages || ['English']), pickup_included !== false, pickup_details || 'Pickup from any location in Doha City', private_group_available !== false, transport_rating || 92, JSON.stringify(starting_times || ['09:00', '14:00', '18:00']), id]
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

export default Tour;
