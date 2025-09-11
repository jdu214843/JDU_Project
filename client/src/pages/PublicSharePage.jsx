import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Box, Paper, Typography, Grid, Card, CardContent, Alert, Button, Chip, LinearProgress } from '@mui/material'
import GetAppIcon from '@mui/icons-material/GetApp'
import { getPublicAnalysis } from '../services/api'

export default function PublicSharePage() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const token = sp.get('token') || ''
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

  useEffect(() => {
    if (!token) {
      setError('Token talab qilinadi')
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        setLoading(true)
        const d = await getPublicAnalysis(id, token)
        setData(d)
        setError(null)
      } catch (e) {
        setError('Hisobotni yuklashda xatolik yoki ruxsat yo‘q')
      } finally {
        setLoading(false)
      }
    })()
  }, [id, token])

  if (loading) return <Paper sx={{ p: 3 }}><Typography>Yuklanmoqda...</Typography></Paper>
  if (error) return <Paper sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Paper>

  const sal = Number(data?.salinity_level || 0)
  const severity = sal >= 2.5 ? { label: "Yuqori sho'rlangan", color: 'error' } : sal >= 1.5 ? { label: "O'rtacha sho'rlangan", color: 'warning' } : { label: "Past sho'rlanish", color: 'success' }
  const pdfUrl = `${apiBase}/api/public/analyses/${id}/report.pdf?token=${encodeURIComponent(token)}`

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>EcoSoil umumiy hisobot</Typography>
          <Typography variant="body2" color="text.secondary">ID: {data.id} • {new Date(data.submitted_at).toLocaleString()}</Typography>
        </Box>
        <Button variant="outlined" startIcon={<GetAppIcon />} href={pdfUrl} target="_blank" rel="noopener noreferrer">
          PDF yuklab olish
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Lokatsiya</Typography>
            <Typography variant="body2">Manzil: {data.location || '—'}</Typography>
            <Typography variant="body2">Maydon: {data.area ? `${data.area} ha` : '—'}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Sho'rlanish</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip label={`${data.salinity_level ?? '—'}% - ${severity.label}`} color={severity.color} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Ta'sirlangan hudud: {data?.affected_area_percentage ?? '—'}%</Typography>
            <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, Math.round(((Number(data?.salinity_level) || 0) / 5) * 100)))} />
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Tavsiyalar</Typography>
            {(data.recommendations || []).map((rec, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>• {rec}</Typography>
            ))}
          </CardContent></Card>
        </Grid>
      </Grid>
    </Paper>
  )
}

