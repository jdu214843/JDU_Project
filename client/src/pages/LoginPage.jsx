import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import useAuthStore from '../store/auth'
import { useI18n } from '../i18n/translate'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error } = useAuthStore()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Reset loading state on component mount in case it got stuck
  useEffect(() => {
    if (loading) {
      console.log('Resetting stuck loading state')
      useAuthStore.setState({ loading: false, error: null })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
    
    // Timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      console.warn('Login timeout - resetting loading state')
      // Force reset loading state if it takes too long
      const { loading } = useAuthStore.getState()
      if (loading) {
        useAuthStore.setState({ loading: false, error: 'Request timeout. Please try again.' })
      }
    }, 10000)
    
    try {
      const result = await login({ email, password })
      console.log('Login success:', result)
      clearTimeout(timeoutId)
      const from = location.state?.from?.pathname || '/'
      navigate(from)
    } catch (err) {
      console.error('Login error:', err)
      clearTimeout(timeoutId)
    }
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>{t('auth.loginTitle')}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label={t('auth.email')} type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth margin="normal" required />
          <TextField label={t('auth.password')} type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? '...' : t('auth.signIn')}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>{t('auth.noAccount')} <RouterLink to="/register">{t('auth.createOne')}</RouterLink></Typography>
      </Paper>
    </Box>
  )
}
