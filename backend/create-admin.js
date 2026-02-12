import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await connection.query('DELETE FROM users WHERE email = ?', ['admin@arabianadventure.com']);
  await connection.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    ['admin', 'admin@arabianadventure.com', hashedPassword, 'admin']
  );

  console.log('✅ Admin user created successfully');
  console.log('Email: admin@arabianadventure.com');
  console.log('Password: admin123');
  
  await connection.end();
}

createAdmin().catch(console.error);
