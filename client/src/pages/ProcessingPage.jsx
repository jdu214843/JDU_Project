import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Paper, Typography, LinearProgress } from '@mui/material'
import { getAnalysis } from '../services/api'

export default function ProcessingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const total = 60
    const interval = setInterval(() => setProgress((p) => Math.min(100, p + 100 / total)), 1000)
    const poll = setInterval(async () => {
      try {
        const a = await getAnalysis(id)
        if (a.status === 'completed') {
          clearInterval(interval)
          clearInterval(poll)
          navigate(`/results/${id}`)
        }
      } catch {}
    }, 5000)
    return () => { clearInterval(interval); clearInterval(poll) }
  }, [id])

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>Processing Analysis...</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        This may take about 1 minute while we run AI analysis.
      </Typography>
      <Box mt={2}>
        <LinearProgress variant="determinate" value={progress} />
        <Typography mt={1} variant="body2">{Math.round(progress)}%</Typography>
      </Box>
    </Paper>
  )
}

