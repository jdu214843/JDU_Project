import React, { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Chip } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { listAnalyses } from '../../services/api'
import Loader from '../Loader'
import { Alert } from '@mui/material'

export default function HistoryTab() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const list = await listAnalyses()
        setAnalyses(list)
        setError(null)
      } catch (e) {
        setError('Failed to load analysis history')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const salinityLabel = (s) => {
    if (s == null) return '—'
    if (s < 1) return 'Low Salinity'
    if (s < 2.5) return 'Medium Salinity'
    return 'High Salinity'
  }

  if (loading) return <Loader />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <List>
      {analyses.map(a => (
        <ListItem key={a.id} button component={RouterLink} to={`/analyses/${a.id}`}>
          <ListItemText primary={`${new Date(a.submitted_at).toLocaleString()} — ${a.location || '—'}`} secondary={a.status} />
          <Chip label={salinityLabel(a.salinity_level)} />
        </ListItem>
      ))}
    </List>
  )
}

