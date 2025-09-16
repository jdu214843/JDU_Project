import { v4 as uuidv4 } from 'uuid'
import { query } from '../db/index.js'
import { notifyNewOrder, notifyOrderStatusUpdate } from '../services/email.service.js'

export async function createOrder(req, res) {
  try {
    const { productName, name, phone, region, quantity, address, email } = req.body || {}

    if (!productName || !name || !phone || !region || !quantity || !address) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const qty = Number(quantity)
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' })
    }

    const orderId = uuidv4()
    await query(
      `INSERT INTO orders (id, product_name, customer_name, phone_number, region, quantity, address, customer_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [orderId, productName, name, phone, region, qty, address, email || null]
    )

    // Send notification to admins
    const orderData = {
      id: orderId,
      product_name: productName,
      customer_name: name,
      phone_number: phone,
      region,
      quantity: qty,
      address,
      customer_email: email || null
    }
    
    // Send real-time notification to admin dashboard
    if (global.io) {
      global.io.to('admin-room').emit('new-order', {
        ...orderData,
        created_at: new Date().toISOString()
      });
      console.log('🔔 Real-time notification sent to admins');
    }

    // Async email notification (don't wait for it)
    notifyNewOrder(orderData).catch(err => 
      console.error('Failed to send admin notification:', err)
    )

    // Real-time notification to admin panel
    if (global.io) {
      global.io.to('admin-room').emit('new-order', {
        ...orderData,
        message: 'Yangi buyurtma keldi!',
        timestamp: new Date().toISOString()
      })
    }

    res.status(201).json({ success: true, message: 'Order received' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

// Admin functions
export async function getAllOrders(req, res) {
  try {
    const { status, limit = 50, offset = 0 } = req.query
    
    let queryText = `
      SELECT id, product_name, customer_name, phone_number, region, 
             quantity, address, status, created_at
      FROM orders
    `
    const params = []
    
    if (status) {
      queryText += ' WHERE status = $1'
      params.push(status)
      queryText += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`
      params.push(parseInt(limit), parseInt(offset))
    } else {
      queryText += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`
      params.push(parseInt(limit), parseInt(offset))
    }

    const result = await query(queryText, params)
    const countResult = await query('SELECT COUNT(*) FROM orders' + (status ? ' WHERE status = $1' : ''), status ? [status] : [])
    
    res.json({
      orders: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (err) {
    console.error('Get orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const result = await query(
      `UPDATE orders 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Log status change
    await query(
      `INSERT INTO order_logs (id, order_id, admin_id, action, old_status, new_status, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [uuidv4(), id, req.admin.id, 'status_change', result.rows[0].status, status, notes || null]
    )

    // Get updated order with all fields for email notification
    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    )
    
    // Send email notification to customer (if email available)
    const updatedOrder = orderResult.rows[0]
    notifyOrderStatusUpdate(updatedOrder, status).catch(err =>
      console.error('Failed to send status update notification:', err)
    )

    res.json({ success: true, order: result.rows[0] })
  } catch (err) {
    console.error('Update order error:', err)
    res.status(500).json({ error: 'Failed to update order' })
  }
}

export async function getOrderStats(req, res) {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today_orders,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_orders
      FROM orders
    `)

    const recentOrders = await query(`
      SELECT id, product_name, customer_name, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `)

    res.json({
      stats: stats.rows[0],
      recent_orders: recentOrders.rows
    })
  } catch (err) {
    console.error('Get stats error:', err)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
}

