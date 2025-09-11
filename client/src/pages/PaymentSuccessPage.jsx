import React from 'react'
import { Container, Typography, Alert } from '@mui/material'
import { useI18n } from '../i18n/translate'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function PaymentSuccessPage() {
  const { t } = useI18n()
  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
      <Typography variant="h5" fontWeight={800} gutterBottom>{t('payment.successTitle')}</Typography>
      <Alert severity="success">{t('payment.successMsg')}</Alert>
    </Container>
  )
}

