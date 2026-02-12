import bcrypt from 'bcryptjs';
import db from './config/database.js';

const createAdmin = async () => {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Delete existing admin user
    await db.query('DELETE FROM users WHERE email = ?', ['admin@arabianadventure.com']);
    
    // Create new admin user
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@arabianadventure.com', hashedPassword, 'admin']
    );
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@arabianadventure.com');
    console.log('Password: admin123');
    console.log('Hash:', hashedPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();