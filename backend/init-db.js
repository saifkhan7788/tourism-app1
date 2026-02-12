import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function init() {
  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false },
      connectTimeout: 30000
    });

  const schema = fs.readFileSync("./schema.sql", "utf8");
  const statements = schema.split(';').filter(s => s.trim());

  console.log(`Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.trim()) {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      await connection.query(statement);
    }
  }

    console.log("✅ Schema executed successfully");
    await connection.end();
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  }
}

init().catch(console.error);