const { Pool } = require('pg');
module.exports = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'nadeesha',
  password: process.env.DB_PASSWORD || 'secret123',
  database: process.env.DB_NAME || 'ordersdb',
});
