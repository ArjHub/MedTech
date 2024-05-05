const { Pool } = require('pg');

const pool = new Pool({
  user: 'Arjun',
  host: 'localhost',
  database: 'User_Database',
  password: 'Arjun9656',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
