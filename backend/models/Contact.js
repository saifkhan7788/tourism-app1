import db from '../config/database.js';

class Contact {
  static async create(contactData) {
    const { name, email, subject, message } = contactData;
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return rows;
  }

  static async updateStatus(id, status) {
    const [result] = await db.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
  }

  static async reply(id, replyMessage) {
    const [result] = await db.query(
      'UPDATE contact_messages SET status = "replied", reply_message = ?, replied_at = NOW() WHERE id = ?',
      [replyMessage, id]
    );
    return result.affectedRows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

export default Contact;
