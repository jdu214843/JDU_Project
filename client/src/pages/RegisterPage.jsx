import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import useAuthStore from '../store/auth'
import { useI18n } from '../i18n/translate'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuthStore()
  const { t } = useI18n()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ fullName, email, password })
      navigate('/')
    } catch {}
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>{t('auth.registerTitle')}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label={t('auth.fullName')} autoComplete="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} fullWidth margin="normal" required />
          <TextField label={t('auth.email')} type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth margin="normal" required />
          <TextField label={t('auth.password')} type="password" autoComplete="new-password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? '...' : t('auth.signUp')}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>{t('auth.already')} <RouterLink to="/login">{t('auth.signInLink')}</RouterLink></Typography>
      </Paper>
    </Box>
  )
}
