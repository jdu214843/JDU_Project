import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import useAuthStore from '../store/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuthStore()
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
        <Typography variant="h5" fontWeight={600} gutterBottom>Create your account</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Full Name" autoComplete="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Password" type="password" autoComplete="new-password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>Already have an account? <RouterLink to="/login">Sign in</RouterLink></Typography>
      </Paper>
    </Box>
  )
}
