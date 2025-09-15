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
    console.log('Register attempt:', { fullName, email, password })
    
    // Timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      console.warn('Register timeout - resetting loading state')
      // Force reset loading state if it takes too long
      const { loading } = useAuthStore.getState()
      if (loading) {
        useAuthStore.setState({ loading: false, error: 'Request timeout. Please try again.' })
      }
    }, 10000)
    
    try {
      const result = await register({ fullName, email, password })
      console.log('Register success:', result)
      clearTimeout(timeoutId)
      navigate('/')
    } catch (err) {
      console.error('Register error:', err)
      clearTimeout(timeoutId)
    }
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
