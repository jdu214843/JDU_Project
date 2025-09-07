import { v4 as uuidv4 } from 'uuid'
import { query } from '../db/index.js'
import { config } from '../config.js'

const PLANS = {
  // Amounts in the smallest currency unit; using USD test values for Stripe demo
  starter: { id: 'starter', name: 'Starter', amount: 1000, currency: 'usd' },
  pro: { id: 'pro', name: 'Pro', amount: 2000, currency: 'usd' },
  professional: { id: 'professional', name: 'Professional', amount: 2000, currency: 'usd' },
  enterprise: { id: 'enterprise', name: 'Enterprise', amount: 0, currency: 'usd' },
}

export async function createSubscription(req, res) {
  try {
    const userId = req.user?.id
    const { planId, paymentMethodId } = req.body || {}
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })
    if (!planId || !PLANS[planId]) return res.status(400).json({ error: 'Invalid plan' })
    const plan = PLANS[planId]

    // Enterprise or zero-amount plans: directly record without Stripe
    if (!plan.amount || plan.amount <= 0) {
      await query(
        `INSERT INTO subscriptions (id, user_id, plan_id, status) VALUES ($1, $2, $3, 'active')`,
        [uuidv4(), userId, planId]
      )
      return res.status(201).json({ success: true, status: 'active' })
    }

    // Load Stripe dynamically to avoid startup failure if not installed
    if (!config.stripeSecretKey) {
      return res.status(500).json({ error: 'Stripe is not configured' })
    }
    let stripe
    try {
      const Stripe = (await import('stripe')).default
      stripe = new Stripe(config.stripeSecretKey)
    } catch (e) {
      console.error('Stripe import failed', e)
      return res.status(500).json({ error: 'Stripe SDK not available' })
    }

    if (!paymentMethodId) return res.status(400).json({ error: 'Missing paymentMethodId' })

    // Create and confirm a PaymentIntent
    const intent = await stripe.paymentIntents.create({
      amount: plan.amount,
      currency: plan.currency || 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `EcoSoil ${plan.name} subscription`,
      metadata: { userId, planId },
    })

    if (intent.status !== 'succeeded') {
      return res.status(402).json({ error: 'Payment not successful', status: intent.status })
    }

    await query(
      `INSERT INTO subscriptions (id, user_id, plan_id, status) VALUES ($1, $2, $3, 'active')`,
      [uuidv4(), userId, planId]
    )

    res.status(201).json({ success: true, status: 'active' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create subscription' })
  }
}
