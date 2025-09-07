#!/usr/bin/env node
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const root = path.resolve(process.cwd())
const migrationMain = path.join(root, 'migration.sql')
const migrationsDir = path.join(root, 'migrations')

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error('DATABASE_URL is not set in .env')
  process.exit(1)
}

function runPsql(file) {
  return new Promise((resolve, reject) => {
    console.log(`\nApplying migration: ${path.basename(file)}`)
    const child = spawn('psql', [dbUrl, '-v', 'ON_ERROR_STOP=1', '-f', file], {
      stdio: 'inherit',
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`psql exited with code ${code}`))
    })
  })
}

;(async () => {
  try {
    const files = []
    if (fs.existsSync(migrationMain)) files.push(migrationMain)
    if (fs.existsSync(migrationsDir)) {
      const extra = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort()
        .map((f) => path.join(migrationsDir, f))
      files.push(...extra)
    }
    if (!files.length) {
      console.log('No migration files found.')
      process.exit(0)
    }
    for (const f of files) {
      await runPsql(f)
    }
    console.log('\nMigrations applied successfully.')
  } catch (e) {
    console.error('\nMigration failed:', e.message)
    process.exit(1)
  }
})()

