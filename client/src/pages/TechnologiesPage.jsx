import React from 'react'
import { Grid, Card, CardContent, Typography } from '@mui/material'

const sensors = [
  { name: 'Soil Moisture Sensor', spec: 'Capacitance-based, 3.3–5V', price: '$35' },
  { name: 'Soil Temperature Probe', spec: 'Stainless steel, -20–80°C', price: '$28' },
  { name: 'pH/Salinity Sensor', spec: '0–14 pH, EC up to 10mS/cm', price: '$79' },
]

export default function TechnologiesPage() {
  return (
    <Grid container spacing={2}>
      {sensors.map((s) => (
        <Grid item xs={12} md={4} key={s.name}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{s.name}</Typography>
              <Typography variant="body2" color="text.secondary">{s.spec}</Typography>
              <Typography variant="subtitle1" fontWeight={600} mt={1}>{s.price}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

