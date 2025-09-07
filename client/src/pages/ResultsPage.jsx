import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Grid, Card, CardContent, Button, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Alert } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckIcon from '@mui/icons-material/Check'
import { getAnalysis } from '../services/api'
import Loader from '../components/Loader'

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

  const navigate = useNavigate()
  if (loading) return <Loader />
  if (error) return <Alert severity="error">{error}</Alert>

  const metrics = [
    {
      label: "Sho'rlanish",
      value: data.salinity_level ?? 0,
      unit: '%',
      pct: Math.max(0, Math.min(100, Math.round(((Number(data.salinity_level) || 0) / 5) * 100))),
      helper: '0–5% diapazonda baholandi',
    },
    {
      label: 'pH',
      value: data.ph_level ?? 0,
      unit: '',
      pct: Math.max(0, Math.min(100, Math.round(((Number(data.ph_level) || 0) / 14) * 100))),
      helper: '0–14 pH shkalasi',
    },
    {
      label: 'Namlik',
      value: data.moisture_percentage ?? 0,
      unit: '%',
      pct: Math.max(0, Math.min(100, Number(data.moisture_percentage) || 0)),
      helper: '0–100% diapazon',
    },
  ]

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
        <Typography variant="h5" fontWeight={700}>Tahlil Yakunlandi!</Typography>
        <Typography variant="body2" color="text.secondary">ID: {data.id} • {new Date(data.submitted_at).toLocaleString()}</Typography>
      </Box>

      {/* Content */}
      <Grid container spacing={4}>
        {/* Left card: Umumiy Natija */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Umumiy Natija</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {metrics.map((m) => (
                  <Box key={m.label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>{m.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{m.value}{m.unit}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={m.pct} />
                    <Typography variant="caption" color="text.secondary">{m.helper}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right card: Tavsiyalar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Tavsiyalar</Typography>
              <List>
                {(data.recommendations || []).map((rec, idx) => (
                  <ListItem key={idx} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" color="success" onClick={() => navigate(`/analyses/${id}`)}>
          Batafsil hisobot
        </Button>
        <Button variant="outlined" onClick={() => navigate('/analysis/new')}>
          Yangi tahlil
        </Button>
      </Box>
    </Paper>
  )
}
