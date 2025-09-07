import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Paper, Typography, Tabs, Tab, Grid, Card, CardContent, List, ListItem, ListItemText, Alert, Button, Chip, LinearProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShareIcon from '@mui/icons-material/Share'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import OpacityIcon from '@mui/icons-material/Opacity'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import BoltIcon from '@mui/icons-material/Bolt'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import CloudIcon from '@mui/icons-material/Cloud'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import { getAnalysis } from '../services/api'
import Loader from '../components/Loader'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import ReportHistoryTab from '../components/reports/ReportHistoryTab'
import ReportCompositionTab from '../components/reports/ReportCompositionTab'
import SummaryCard from '../components/reports/SummaryCard'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function DetailedReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [tab, setTab] = useState(0)
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
        setError('Failed to load report')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const compData = useMemo(() => {
    if (!data?.soil_composition) return []
    const sc = data.soil_composition
    return [
      { name: 'Sand', value: sc.sand ?? 0 },
      { name: 'Clay', value: sc.clay ?? 0 },
      { name: 'Silt', value: sc.silt ?? 0 },
    ]
  }, [data])

  const chemData = useMemo(() => {
    if (!data?.chemical_properties) return []
    const c = data.chemical_properties
    return [
      { name: 'N', value: c.nitrogen ?? 0 },
      { name: 'P', value: c.phosphorus ?? 0 },
      { name: 'Org.Matter', value: c.organic_matter ?? 0 },
    ]
  }, [data])

  // Helpers
  const salinitySeverity = useMemo(() => {
    const s = Number(data?.salinity_level || 0)
    if (s >= 2.5) return { label: "Yuqori sho'rlangan", color: 'error' }
    if (s >= 1.5) return { label: "O'rtacha sho'rlangan", color: 'warning' }
    return { label: 'Past sho\'rlanish', color: 'success' }
  }, [data])

  const weatherIcon = (cond) => {
    if (cond === 'Quyoshli') return <WbSunnyIcon color="warning" />
    if (cond === 'Yomg‘irli') return <OpacityIcon color="primary" />
    if (cond === 'Bulutli') return <CloudIcon color="action" />
    return <CloudQueueIcon color="action" />
  }

  if (loading) return <Loader />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ textTransform: 'none' }}>Orqaga</Button>
          <Typography variant="h5" fontWeight={700}>Batafsil hisobot</Typography>
          <Typography variant="body2" color="text.secondary">ID: {data.id}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<ShareIcon />} sx={{ textTransform: 'none' }}>Ulashish</Button>
          <Button variant="outlined" startIcon={<PictureAsPdfIcon />} sx={{ textTransform: 'none' }}>PDF yuklab olish</Button>
        </Box>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Sho'rlanish darajasi" value={`${data.salinity_level ?? '—'}%`} subtitle={salinitySeverity.label} icon={<WaterDropIcon />} color="#1976d2" />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="AI ishonch" value={`${data.ai_confidence ?? '—'}%`} subtitle="Model ishonch darajasi" icon={<SmartToyIcon />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="pH darajasi" value={data.ph_level ?? '—'} subtitle="Kimyoviy ko'rsatkich" icon={<BoltIcon />} color="#6a1b9a" />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Namlik" value={`${data.moisture_percentage ?? '—'}%`} subtitle="Tuproq namligi" icon={<OpacityIcon />} color="#f9a825" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Umumiy" />
        <Tab label="Tarkib" />
        <Tab label="Tavsiyalar" />
        <Tab label="AI tahlili" />
        <Tab label="Tarix" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          {/* Left: Location & Weather */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Lokatsiya ma'lumotlari</Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <List dense>
                      <ListItem><ListItemText primary="Manzil" secondary={data.location || '—'} /></ListItem>
                      <ListItem><ListItemText primary="Maydon" secondary={data.area ? `${data.area} ha` : '—'} /></ListItem>
                      <ListItem><ListItemText primary="Balandlik" secondary={'—'} /></ListItem>
                      <ListItem><ListItemText primary="Koordinatalar" secondary={'—'} /></ListItem>
                    </List>
                  </Grid>
                </Grid>
                <Typography variant="subtitle1" gutterBottom>Ob-havo sharoiti</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {weatherIcon(data?.weather?.condition)}
                  <Typography variant="body2" color="text.secondary">
                    {data?.weather?.condition || '—'} | Harorat: {data?.weather?.temperature ?? '—'}°C, Shamol: {data?.weather?.wind_speed ?? '—'} km/soat, Namlik: {data?.weather?.humidity ?? '—'}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Salinity Analysis */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Sho'rlanish tahlili</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={`${data.salinity_level ?? '—'}% - ${salinitySeverity.label}`} color={salinitySeverity.color} />
                  {data?.risk_level && <Chip label={`Xavf darajasi: ${data.risk_level}`} color={salinitySeverity.color} variant="outlined" />}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Ta'sirlangan hudud: {data?.affected_area_percentage ?? '—'}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Sho'rlanish darajasi: {data?.salinity_level ?? '—'}%
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, Math.round(((Number(data?.salinity_level) || 0) / 5) * 100)))} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <ReportCompositionTab
          soilComposition={data?.soil_composition}
          chemicalProperties={data?.chemical_properties}
        />
      )}

      {tab === 2 && (
        <Grid container spacing={2}>
          {(data.recommendations || []).map((rec, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card><CardContent>
                <Typography variant="h6">Recommendation {idx + 1}</Typography>
                <Typography variant="body2" color="text.secondary">{rec}</Typography>
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tab === 3 && (
        <Card><CardContent>
          <Typography variant="h6" gutterBottom>AI tahlili</Typography>
          <Typography variant="body2" color="text.secondary">AI ishonch: {data?.ai_confidence ?? '—'}%</Typography>
          <Typography variant="body2" color="text.secondary">Xavf darajasi: {data?.risk_level ?? '—'}</Typography>
        </CardContent></Card>
      )}

      {tab === 4 && <ReportHistoryTab analysisId={id} />}
    </Paper>
  )
}
