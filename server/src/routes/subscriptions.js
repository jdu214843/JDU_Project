import { Router } from 'express'
import { authRequired } from '../middleware/auth.js'
import { createSubscription } from '../controllers/subscription.controller.js'

const router = Router()

router.post('/', authRequired, createSubscription)

export default router

