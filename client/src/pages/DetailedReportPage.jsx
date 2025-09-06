import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Paper, Typography, Tabs, Tab, Grid, Card, CardContent, List, ListItem, ListItemText, Alert } from '@mui/material'
import { getAnalysis } from '../services/api'
import Loader from '../components/Loader'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function DetailedReportPage() {
  const { id } = useParams()
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

  const historyData = useMemo(() => {
    // mock time series for moisture dynamics
    const base = data?.moisture_percentage || 30
    return Array.from({ length: 10 }).map((_, i) => ({ day: `Day ${i+1}`, moisture: Math.max(10, Math.min(60, Math.round(base + (Math.sin(i/2)*5)))) }))
  }, [data])

  if (loading) return <Loader />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>Detailed Report</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>Analysis ID: {data.id}</Typography>
      <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{ mb: 2 }}>
        <Tab label="General" />
        <Tab label="Composition" />
        <Tab label="Recommendations" />
        <Tab label="History" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="h6">Location Info</Typography>
              <List>
                <ListItem><ListItemText primary="Location" secondary={data.location || '—'} /></ListItem>
                <ListItem><ListItemText primary="Area (ha)" secondary={data.area || '—'} /></ListItem>
                <ListItem><ListItemText primary="Soil Type" secondary={data.soil_type || '—'} /></ListItem>
                <ListItem><ListItemText primary="Crop Type" secondary={data.crop_type || '—'} /></ListItem>
                <ListItem><ListItemText primary="Irrigation" secondary={data.irrigation_method || '—'} /></ListItem>
              </List>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="h6">Weather (Mock)</Typography>
              <List>
                <ListItem><ListItemText primary="Temperature" secondary="26°C" /></ListItem>
                <ListItem><ListItemText primary="Humidity" secondary="68%" /></ListItem>
                <ListItem><ListItemText primary="Rainfall" secondary="2.3 mm" /></ListItem>
                <ListItem><ListItemText primary="Wind" secondary="8 km/h" /></ListItem>
              </List>
            </CardContent></Card>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="h6">Soil Composition</Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={compData} dataKey="value" nameKey="name" label>
                      {compData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="h6">Chemical Properties</Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chemData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#28a745" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent></Card>
          </Grid>
        </Grid>
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
          <Typography variant="h6" gutterBottom>Moisture Trend</Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="moisture" stroke="#28a745" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent></Card>
      )}
    </Paper>
  )
}
