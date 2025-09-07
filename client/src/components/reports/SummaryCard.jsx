import React from 'react'
import { Card, CardContent, Box, Typography } from '@mui/material'

export default function SummaryCard({ title, value, subtitle, icon, color = '#1976d2' }) {
  return (
    <Card sx={{ borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ color }}>{icon}</Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1 }}>{value}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
        )}
      </CardContent>
    </Card>
  )
}

