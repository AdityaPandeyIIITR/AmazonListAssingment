import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export async function createDatabase() {
  try {
    const url = new URL(process.env.DATABASE_URL);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      port: url.port || 3306,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${url.pathname.slice(1)}\``);
    console.log('✅ Database is ready');
    await connection.end();
  } catch (err) {
    console.error('❌ Database creation failed:', err.message);
    process.exit(1);
  }
}
