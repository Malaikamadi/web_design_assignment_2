// ============================================
// Salone FarmHub — Database Connection Pool
// ============================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'))
        ? false
        : { rejectUnauthorized: false }
});

// Log successful connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

// Log errors
pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
    process.exit(-1);
});

// Helper: run a query with params
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
