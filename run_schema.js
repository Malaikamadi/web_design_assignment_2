const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function runSchema() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const schema = fs.readFileSync('db/schema.sql', 'utf8');
        console.log('Running schema...');
        await pool.query(schema);
        console.log('Schema executed successfully!');
    } catch (err) {
        console.error('Error executing schema:', err);
    } finally {
        await pool.end();
    }
}
runSchema();
