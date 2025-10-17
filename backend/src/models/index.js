import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL not found in .env');
}

// Function to create database if missing
async function createDatabase() {
  const url = new URL(databaseUrl);
  const connection = await mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    port: url.port || 3306,
  });

  const dbName = url.pathname.slice(1);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log('✅ Database is ready');
  await connection.end();
}

// Sequelize instance
export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
  logging: false,
});

// Connect function
export const connectDb = async () => {
  await createDatabase();        // Ensure database exists
  await sequelize.authenticate(); // Connect
  await sequelize.sync();         // Sync models
  console.log('✅ Connected to MySQL via Sequelize');
};

