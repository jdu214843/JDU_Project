import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth'
import { useI18n } from '../i18n/translate'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { locale, setLocale, t } = useI18n()

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
        <Button component={RouterLink} to="/technologies" color="inherit">{t('nav.technologies')}</Button>
        <Button component={RouterLink} to="/help" color="inherit">{t('nav.help')}</Button>
        <Select size="small" value={locale} onChange={(e)=>setLocale(e.target.value)} sx={{ ml: 1 }}>
          <MenuItem value="uz">UZ</MenuItem>
          <MenuItem value="ru">RU</MenuItem>
          <MenuItem value="en">EN</MenuItem>
        </Select>
        {user ? (
          <>
            <Button component={RouterLink} to="/analysis/new" variant="contained" color="primary">{t('nav.new')}</Button>
            <Button component={RouterLink} to="/dashboard" color="inherit">{t('nav.dashboard')}</Button>
            <Button onClick={handleLogout} color="inherit">{t('nav.logout')}</Button>
          </>
        ) : (
          <>
            <Button component={RouterLink} to="/login" color="inherit">{t('nav.login')}</Button>
            <Button component={RouterLink} to="/register" variant="contained" color="primary">{t('nav.signup')}</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
