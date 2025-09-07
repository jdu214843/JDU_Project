import { Router } from 'express'
import { createOrder } from '../controllers/order.controller.js'

const router = Router()

// Public endpoint to create orders
router.post('/', createOrder)

export default router

