import React, { useEffect } from 'react'
import { Box, Typography, Button, Grid, Paper } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useAuthStore from '../store/auth'
import { useI18n } from '../i18n/translate'

export default function HomePage() {
  const { user, loadMe } = useAuthStore()
  const { t } = useI18n()
  useEffect(() => { loadMe() }, [])

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, background: 'rgba(255,255,255,0.8)' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom color="primary">{t('home.title')}</Typography>
        <Typography variant="h6" gutterBottom>{t('home.subtitle')}</Typography>
        <Typography variant="body1" gutterBottom>
          {t('home.desc')}
        </Typography>
        <Box mt={2} display="flex" gap={2}>
          <Button component={RouterLink} to={user ? '/analysis/new' : '/register'} variant="contained" color="primary">
            {user ? t('home.ctaPrimaryAuth') : t('home.ctaPrimaryGuest')}
          </Button>
          <Button component={RouterLink} to="/technologies" variant="outlined">{t('home.ctaSecondary')}</Button>
        </Box>
      </Paper>

      <Grid container spacing={2} mt={2}>
        {[{ title: t('home.cards.accurate.title'), desc: t('home.cards.accurate.desc') }, { title: t('home.cards.iot.title'), desc: t('home.cards.iot.desc') }, { title: t('home.cards.friendly.title'), desc: t('home.cards.friendly.desc') }].map((c) => (
          <Grid item xs={12} md={4} key={c.title}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', background: '#fff', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600}>{c.title}</Typography>
              <Typography variant="body2" color="text.secondary">{c.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
