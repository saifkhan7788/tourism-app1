import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const checkColumns = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [columns] = await connection.query('DESCRIBE tours');
    console.log('📋 Current columns in tours table:');
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
};

checkColumns();
