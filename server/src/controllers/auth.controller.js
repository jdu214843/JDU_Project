import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { query } from '../db/index.js'
import { signToken } from '../middleware/auth.js'

export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) return res.status(400).json({ error: 'fullName, email, and password are required' })
    const emailOk = /.+@.+\..+/.test(String(email).toLowerCase())
    if (!emailOk) return res.status(400).json({ error: 'Invalid email format' })
    if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rowCount > 0) return res.status(409).json({ error: 'Email already registered' })
    const userId = uuidv4()
    const passwordHash = await bcrypt.hash(password, 10)
    await query(`INSERT INTO users (id, full_name, email, password_hash, created_at) VALUES ($1,$2,$3,$4,NOW())`, [
      userId,
      fullName,
      email.toLowerCase(),
      passwordHash,
    ])
    const token = signToken(userId)
    res.status(201).json({ token, user: { id: userId, fullName, email: email.toLowerCase() } })
  } catch (err) {
    console.error('Registration error:', err)
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.error('NODE_ENV:', process.env.NODE_ENV)
    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    const result = await query('SELECT id, full_name, email, password_hash FROM users WHERE email = $1', [email.toLowerCase()])
    if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' })
    const user = result.rows[0]
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = signToken(user.id)
    res.json({ token, user: { id: user.id, fullName: user.full_name, email: user.email } })
  } catch (err) {
    console.error('Login error:', err)
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    res.status(500).json({ 
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}
