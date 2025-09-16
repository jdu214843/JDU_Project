import express from 'express'
import { authenticateAdmin, requireRole } from '../middleware/admin.js'
import { getAllOrders, updateOrderStatus, getOrderStats } from '../controllers/order.controller.js'

const router = express.Router()

// Admin authentication required for all routes
router.use(authenticateAdmin)

// Orders management
router.get('/orders', getAllOrders)
router.put('/orders/:id/status', updateOrderStatus)
router.get('/orders/stats', getOrderStats)

// Users management (future)
router.get('/users', requireRole(['admin']), (req, res) => {
  res.json({ message: 'Users management - coming soon' })
})

export default router
