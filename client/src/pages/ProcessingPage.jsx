import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Paper, Typography, LinearProgress } from '@mui/material'
import { useI18n } from '../i18n'
import { getAnalysis, openProgressSSE } from '../services/api'

export default function ProcessingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const { t } = useI18n()

  useEffect(() => {
    let sse
    let fallbackInterval
    let poll
    try {
      sse = openProgressSSE(id)
      sse.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data)
          if (typeof data.progress === 'number') setProgress(data.progress)
        } catch {}
      }
      sse.addEventListener('done', () => {
        setProgress(100)
        navigate(`/results/${id}`)
      })
      sse.onerror = () => {
        // Fallback to timer + polling if SSE fails
        sse.close()
        fallbackInterval = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 1000)
      }
    } catch {
      fallbackInterval = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 1000)
    }
    poll = setInterval(async () => {
      try {
        const a = await getAnalysis(id)
        if (a.status === 'completed') {
          if (sse) sse.close()
          if (fallbackInterval) clearInterval(fallbackInterval)
          clearInterval(poll)
          navigate(`/results/${id}`)
        }
      } catch {}
    }, 3000)
    return () => {
      try { sse && sse.close() } catch {}
      if (fallbackInterval) clearInterval(fallbackInterval)
      if (poll) clearInterval(poll)
    }
  }, [id])

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>{t('processing.title')}</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t('processing.subtitle')}
      </Typography>
      <Box mt={2}>
        <LinearProgress variant="determinate" value={progress} />
        <Typography mt={1} variant="body2">{Math.round(progress)}%</Typography>
      </Box>
    </Paper>
  )
}
