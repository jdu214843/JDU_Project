import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, MenuItem, Button, Box, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { createOrder } from '../../services/api'
import { useI18n } from '../../i18n/translate'

const REGIONS = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Farg‘ona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Jizzax', 'Sirdaryo', 'Xorazm', 'Navoiy', 'Qoraqalpog‘iston'
]

export default function OrderModal({ open, onClose, product }) {
  const { t } = useI18n()
  const [view, setView] = useState('form') // 'form' | 'success'
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    region: '',
    quantity: 1,
    address: '',
  })

  useEffect(() => {
    if (!open) return
    // Reset state when modal opens
    setView('form')
    setSubmitting(false)
    setError(null)
    setFormData({ name: '', phone: '', email: '', region: '', quantity: 1, address: '' })
  }, [open])

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await createOrder({
        productName: product?.name,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        region: formData.region,
        quantity: Number(formData.quantity) || 1,
        address: formData.address.trim(),
      })
      setView('success')
    } catch (e) {
      setError(e?.response?.data?.error || 'Buyurtma yuborishda xatolik')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (view !== 'success') return
    const t = setTimeout(() => {
      onClose && onClose()
    }, 2500)
    return () => clearTimeout(t)
  }, [view])

  if (!product) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {view === 'form' ? t('order.title') : t('order.placed')}
      </DialogTitle>
      <DialogContent>
        {view === 'form' && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('order.product')}: <strong>{product.name}</strong>
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label={t('order.fullName')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
              />
              <TextField
                label={t('order.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email manzil (ixtiyoriy)"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                fullWidth
                helperText="Buyurtma holati haqida xabar olish uchun"
              />
              <TextField
                label={t('order.region')}
                select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                fullWidth
              >
                {REGIONS.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('order.quantity')}
                select
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                fullWidth
              >
                {[1,2,3,4,5].map((q) => (
                  <MenuItem key={q} value={q}>{q}</MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('order.address')}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                fullWidth
                multiline
                rows={3}
                sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}
              />
            </Box>
          </>
        )}

        {view === 'success' && (
          <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success">
            {t('order.success')}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {view === 'form' ? (
          <>
            <Button onClick={onClose} disabled={submitting}>{t('order.cancel')}</Button>
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={submitting}>
              {submitting ? t('order.submitting') : t('order.submit')}
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>{t('order.close')}</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
