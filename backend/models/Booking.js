import db from '../config/database.js';

class Booking {
  static async create(bookingData) {
    const { tour_id, customer_name, customer_email, customer_phone, booking_date, booking_time, number_of_people, total_price, total_price_usd, special_requests } = bookingData;
    const [result] = await db.query(
      `INSERT INTO bookings (tour_id, customer_name, customer_email, customer_phone, booking_date, booking_time, number_of_people, total_price, total_price_usd, special_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tour_id, customer_name, customer_email, customer_phone, booking_date, booking_time || null, number_of_people, total_price, total_price_usd || null, special_requests]
    );
    return result.insertId;
  }

  static async getAll(page = 1, limit = 10, search = '') {
    let query = `SELECT b.*, t.title as tour_title FROM bookings b 
                 LEFT JOIN tours t ON b.tour_id = t.id WHERE 1=1`;
    const params = [];
    
    if (search) {
      query += ` AND (b.customer_name LIKE ? OR b.customer_email LIKE ? OR b.customer_phone LIKE ? OR t.title LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    // Get total count
    const countQuery = query.replace('SELECT b.*, t.title as tour_title', 'SELECT COUNT(*) as total');
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
    const [rows] = await db.query(
      `SELECT b.*, t.title as tour_title, t.description as tour_description 
       FROM bookings b 
       LEFT JOIN tours t ON b.tour_id = t.id 
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async updateStatus(id, status) {
    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows;
  }

  static async getByEmail(email) {
    const [rows] = await db.query(
      `SELECT b.*, t.title as tour_title FROM bookings b 
       LEFT JOIN tours t ON b.tour_id = t.id 
       WHERE b.customer_email = ? 
       ORDER BY b.created_at DESC`,
      [email]
    );
    return rows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async checkAvailability(tourId, bookingDate) {
    const [rows] = await db.query(
      `SELECT SUM(number_of_people) as booked_count 
       FROM bookings 
       WHERE tour_id = ? AND booking_date = ? AND status IN ('pending', 'confirmed')`,
      [tourId, bookingDate]
    );
    return rows[0].booked_count || 0;
  }
}
export default Booking;
