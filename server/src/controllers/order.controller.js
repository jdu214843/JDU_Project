import { v4 as uuidv4 } from 'uuid'
import { query } from '../db/index.js'

export async function createOrder(req, res) {
  try {
    const { productName, name, phone, region, quantity, address } = req.body || {}

    if (!productName || !name || !phone || !region || !quantity || !address) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const qty = Number(quantity)
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' })
    }

    await query(
      `INSERT INTO orders (id, product_name, customer_name, phone_number, region, quantity, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [uuidv4(), productName, name, phone, region, qty, address]
    )

    res.status(201).json({ success: true, message: 'Order received' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

