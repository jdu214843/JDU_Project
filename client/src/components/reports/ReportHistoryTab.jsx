import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Alert } from '@mui/material'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'
import Loader from '../Loader'
import { getAnalysisHistory } from '../../services/api'

export default function ReportHistoryTab({ analysisId }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (!analysisId) return
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await getAnalysisHistory(analysisId)
        if (!mounted) return
        setHistory(Array.isArray(data) ? data : [])
        setError(null)
      } catch (e) {
        if (!mounted) return
        setError("Tarixiy ma'lumotlarni yuklashda xatolik yuz berdi")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [analysisId])

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Sho'rlanish dinamikasi</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>So'nggi 4 oylik o'zgarishlar</Typography>

        {loading && <Loader />}
        {!loading && error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && history.length === 0 && (
          <Alert severity="info">Tarixiy ma'lumotlar topilmadi</Alert>
        )}
        {!loading && !error && history.length > 0 && (
          <Box sx={{ height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Salinity', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="salinity" stroke="#1976d2" dot />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
