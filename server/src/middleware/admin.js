import jwt from 'jsonwebtoken'
import { query } from '../db/index.js'

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Admin access token required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const userId = decoded.userId || decoded.sub
    const result = await query(
      'SELECT id, full_name, email, role FROM users WHERE id = $1 AND role IN ($2, $3)',
      [userId, 'admin', 'staff']
    )

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Admin access denied' })
    }

    req.admin = result.rows[0]
    next()
  } catch (error) {
    console.error('Admin auth error:', error)
    res.status(401).json({ error: 'Invalid admin token' })
  }
}

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}
