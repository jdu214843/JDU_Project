import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    const email = 'admin@ecosoil.uz';
    const password = 'admin123';
    const fullName = 'System Administrator';
    
    // Check if admin already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existing.rowCount > 0) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Create admin user
    const passwordHash = await bcrypt.hash(password, 10);
    await query(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at) 
      VALUES (gen_random_uuid(), $1, $2, $3, 'admin', NOW())
    `, [fullName, email, passwordHash]);
    
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
