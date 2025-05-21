import pool from './config/db.js';

async function testDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to the database!');

    // Run a simple query to test
    const result = await client.query('SELECT NOW()');
    console.log('Current timestamp from DB:', result.rows[0]);

    client.release();
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    // End the pool to quit the script cleanly
    await pool.end();
  }
}

testDatabase();
