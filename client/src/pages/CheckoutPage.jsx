import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Grid, Card, CardContent, Box, Button, Alert } from '@mui/material'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { api } from '../services/api'
import { useI18n } from '../i18n/translate'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

const PLANS = {
  starter: { id: 'starter', name: 'Starter', price: "500,000 so'm/oy", amount: 500000 },
  professional: { id: 'professional', name: 'Pro', price: "1,200,000 so'm/oy", amount: 1200000 },
  enterprise: { id: 'enterprise', name: 'Enterprise', price: 'Aloqa qiling', amount: 0 },
}

function CheckoutForm({ planId }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const plan = PLANS[planId]
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!plan) return setError('Noto\'g\'ri reja tanlandi')
    try {
      setLoading(true)
      let paymentMethodId = null
      if (plan.amount > 0) {
        if (!stripe || !elements) return
        const card = elements.getElement(CardElement)
        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card })
        if (pmError) {
          setError(pmError.message)
          setLoading(false)
          return
        }
        paymentMethodId = paymentMethod.id
      }
      const { data } = await api.post('/subscriptions', { planId, paymentMethodId })
      if (data?.success) {
        navigate('/payment-success')
      } else {
        setError('To\'lov amalga oshmadi')
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('checkout.details')}</Typography>
            {plan?.amount > 0 ? (
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <CardElement options={{ hidePostalCode: true }} />
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
                <Box>
                  <Button type="submit" variant="contained" disabled={!stripe || loading}>
                    {loading ? '...' : t('checkout.pay')}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Alert severity="info">-</Alert>
                <Box mt={2}>
                  <Button onClick={handleSubmit} variant="contained">{t('checkout.activate')}</Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('checkout.planDetails')}</Typography>
            <Typography variant="h5" fontWeight={800}>{plan?.name}</Typography>
            <Typography variant="body2" color="text.secondary">Narx: {plan?.price}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default function CheckoutPage() {
  const { t } = useI18n()
  const { planId } = useParams()
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>{t('checkout.header')}</Typography>
      <Elements stripe={stripePromise}>
        <CheckoutForm planId={planId} />
      </Elements>
    </Container>
  )
}
