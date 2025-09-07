import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material'

export default function SensorDetailsModal({ open, onClose, sensor }) {
  if (!sensor) return null
  const details = sensor.details || {}
  const specs = Array.isArray(details.specs) ? details.specs : []
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{sensor.name}</DialogTitle>
      <DialogContent>
        {details.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {details.description}
          </Typography>
        )}
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Texnik xususiyatlar:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {specs.map((s, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" fontWeight={600}>{s.label}</Typography>
              <Typography variant="body2" color="text.secondary">{s.value}</Typography>
            </Box>
          ))}
          {specs.length === 0 && (
            <Typography variant="body2" color="text.secondary">Ma'lumotlar topilmadi</Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

