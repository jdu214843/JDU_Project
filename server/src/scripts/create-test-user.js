import { pool } from '../db/index.js'
import bcrypt from 'bcrypt'

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('user123', 10)
    
    const result = await pool.query(
      `INSERT INTO users (id, full_name, email, password_hash, role) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET 
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role
       RETURNING id, full_name, email, role`,
      ['Test User', 'user@test.com', hashedPassword, 'user']
    )
    
    console.log('Test user created/updated:', result.rows[0])
    process.exit(0)
  } catch (error) {
    console.error('Error creating test user:', error)
    process.exit(1)
  }
}

createTestUser()
