import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import useAuthStore from '../store/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password })
      const from = location.state?.from?.pathname || '/'
      navigate(from)
    } catch {}
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Welcome back</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>No account? <RouterLink to="/register">Create one</RouterLink></Typography>
      </Paper>
    </Box>
  )
}
