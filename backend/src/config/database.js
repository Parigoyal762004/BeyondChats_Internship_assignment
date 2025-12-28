const { Pool } = require('pg');
require('dotenv').config();

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('[DATABASE] Unexpected pool error:', err);
});

/**
 * Execute a database query
 * @param {string} query - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise<object>} Query result
 */
const query = async (queryText, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(queryText, params);
    const duration = Date.now() - start;
    if (duration > 100) {
      console.log(`[DATABASE] Slow query (${duration}ms): ${queryText.substring(0, 50)}...`);
    }
    return result;
  } catch (err) {
    console.error('[DATABASE] Query error:', err.message);
    throw err;
  }
};

/**
 * Close the database connection pool
 */
const close = async () => {
  await pool.end();
};

module.exports = {
  query,
  close,
  pool,
};
