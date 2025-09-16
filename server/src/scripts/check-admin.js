import { query } from '../db/index.js';

async function checkAdminUser() {
  try {
    const result = await query('SELECT id, email, role FROM users WHERE email = $1', ['admin@ecosoil.uz']);
    console.log('Admin user data:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdminUser();
