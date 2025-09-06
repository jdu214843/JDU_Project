import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar position="static" color="transparent" sx={{ borderBottom: '1px solid #e5e7eb' }}>
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Typography component={RouterLink} to="/" variant="h6" color="primary" sx={{ textDecoration: 'none', fontWeight: 700 }}>
          EcoSoil
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button component={RouterLink} to="/technologies" color="inherit">Technologies</Button>
        <Button component={RouterLink} to="/help" color="inherit">Help</Button>
        {user ? (
          <>
            <Button component={RouterLink} to="/analysis/new" variant="contained" color="primary">New Analysis</Button>
            <Button component={RouterLink} to="/dashboard" color="inherit">Dashboard</Button>
            <Button onClick={handleLogout} color="inherit">Logout</Button>
          </>
        ) : (
          <>
            <Button component={RouterLink} to="/login" color="inherit">Login</Button>
            <Button component={RouterLink} to="/register" variant="contained" color="primary">Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

