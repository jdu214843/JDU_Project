import React, { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { Box, Paper, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material'
import { getAnalysis } from '../services/api'
import Loader from '../components/Loader'
import { Alert } from '@mui/material'

export default function ResultsPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const d = await getAnalysis(id)
        setData(d)
        setError(null)
      } catch (e) {
        setError('Failed to load results')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <Loader />
  if (error) return <Alert severity="error">{error}</Alert>

  const formatMetric = (label, value, unit='') => (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">{label}</Typography>
        <Typography variant="h5">{value}{unit}</Typography>
      </CardContent>
    </Card>
  )

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>Analysis Summary</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Location: {data.location || '—'} • Submitted: {new Date(data.submitted_at).toLocaleString()}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>{formatMetric('pH', data.ph_level)}</Grid>
        <Grid item xs={12} md={4}>{formatMetric('Salinity', data.salinity_level, '%')}</Grid>
        <Grid item xs={12} md={4}>{formatMetric('Moisture', data.moisture_percentage, '%')}</Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>Recommendations</Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {(data.recommendations || []).map((r, idx) => (
            <Chip key={idx} label={r} color="primary" variant="outlined" />
          ))}
        </Box>
      </Box>

      <Box mt={3}>
        <Button component={RouterLink} to={`/analyses/${id}`} variant="contained">View Detailed Report</Button>
      </Box>
    </Paper>
  )
}
