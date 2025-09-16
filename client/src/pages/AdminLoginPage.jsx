import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container
} from '@mui/material'
import { adminApiService } from '../services/admin.api'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await adminApiService.login({ email, password })
      localStorage.setItem('adminToken', response.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            🔐 Admin Panel
          </Typography>
          
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            EcoSoil Administrator Login
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 3 }} color="text.secondary">
            Default: admin@ecosoil.uz / admin123
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}
