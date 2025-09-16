import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';

async function updateAdminPassword() {
  try {
    const email = 'admin@ecosoil.uz';
    const newPassword = 'admin123';
    
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update admin password
    const result = await query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE email = $2 AND role = 'admin'
    `, [passwordHash, email]);
    
    if (result.rowCount > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 New Password: ${newPassword}`);
    } else {
      console.log('❌ Admin user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    process.exit(1);
  }
}

updateAdminPassword();
