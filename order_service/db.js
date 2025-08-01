const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'nadeesha',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'ordersdb',
  password: process.env.DB_PASSWORD || 'secret123',
  port: 5432,
  // Explicitly set search path to public schema
  // This makes sure queries run in the 'public' schema
  options: '-c search_path=public'
});

module.exports = pool;
