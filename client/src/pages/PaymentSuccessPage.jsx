import React from 'react'
import { Container, Typography, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function PaymentSuccessPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
      <Typography variant="h5" fontWeight={800} gutterBottom>To'lov amalga oshirildi</Typography>
      <Alert severity="success">Obuna faollashtirildi. Rahmat!</Alert>
    </Container>
  )
}

