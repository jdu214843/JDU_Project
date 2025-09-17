import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../db/index.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run migrations endpoint (for development/setup only)
router.post('/run', async (req, res) => {
  try {
    const migrationPath = path.join(__dirname, '../../migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} migration statements...`);
    
    for (const statement of statements) {
      if (statement.startsWith('--') || statement.length === 0) continue;
      console.log(`Executing: ${statement.substring(0, 100)}...`);
      await query(statement);
    }
    
    res.json({ 
      success: true, 
      message: `Migration completed successfully. Executed ${statements.length} statements.` 
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Migration failed', 
      details: error.message 
    });
  }
});

export default router;