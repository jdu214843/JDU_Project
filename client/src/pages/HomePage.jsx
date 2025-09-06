import React, { useEffect } from 'react'
import { Box, Typography, Button, Grid, Paper } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useAuthStore from '../store/auth'

export default function HomePage() {
  const { user, loadMe } = useAuthStore()
  useEffect(() => { loadMe() }, [])

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, background: 'rgba(255,255,255,0.8)' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom color="primary">EcoSoil</Typography>
        <Typography variant="h6" gutterBottom>AI-powered soil analysis for smarter, sustainable farming.</Typography>
        <Typography variant="body1" gutterBottom>
          Upload soil data and photos to get detailed metrics like pH, salinity, and moisture, plus actionable recommendations.
        </Typography>
        <Box mt={2} display="flex" gap={2}>
          <Button component={RouterLink} to={user ? '/analysis/new' : '/register'} variant="contained" color="primary">
            {user ? 'Start New Analysis' : 'Get Started'}
          </Button>
          <Button component={RouterLink} to="/technologies" variant="outlined">Explore IoT Sensors</Button>
        </Box>
      </Paper>

      <Grid container spacing={2} mt={2}>
        {[{ title: 'Accurate Insights', desc: 'AI-generated soil metrics and advice.' }, { title: 'IoT Ready', desc: 'Integrate with modern agri sensors.' }, { title: 'Farmer Friendly', desc: 'Simple workflow and clear reports.' }].map((c) => (
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

