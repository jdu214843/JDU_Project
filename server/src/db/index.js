import pg from 'pg'
import { config } from '../config.js'

const { Pool } = pg

// Add SSL configuration for production databases
const poolConfig = {
  connectionString: config.dbUrl,
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false
}

export const pool = new Pool(poolConfig)

export async function query(text, params) {
  return pool.query(text, params)
}

export async function getClient() {
  return pool.connect()
}

