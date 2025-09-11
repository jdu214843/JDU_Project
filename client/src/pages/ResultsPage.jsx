import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Grid, Card, CardContent, Button, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack, TextField } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckIcon from '@mui/icons-material/Check'
import { getAnalysis, getShareInfo, setShareEnabled, downloadAnalysisPdf } from '../services/api'
import { useI18n } from '../i18n/translate'
import Loader from '../components/Loader'

export default function ResultsPage() {
  const { id } = useParams()
  const { t } = useI18n()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareEnabled, setShareEnabledState] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [busyShare, setBusyShare] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const d = await getAnalysis(id)
        setData(d)
        setError(null)
        try {
          const s = await getShareInfo(id)
          setShareEnabledState(!!s.shareEnabled)
          setShareUrl(s.shareUrl || '')
        } catch (e) { /* ignore */ }
      } catch (e) {
        setError('Failed to load results')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const navigate = useNavigate()
  if (loading) return <Loader />
  if (error) return <Alert severity="error">{error}</Alert>

  const toggleShare = async () => {
    setBusyShare(true)
    try {
      const res = await setShareEnabled(id, !shareEnabled)
      setShareEnabledState(!!res.shareEnabled)
      setShareUrl(res.shareUrl || '')
    } catch (e) { } finally {
      setBusyShare(false)
    }
  }

  let shareToken = ''
  try {
    const qs = shareUrl.split('?')[1]
    if (qs) {
      const usp = new URLSearchParams(qs)
      shareToken = usp.get('token') || ''
    }
  } catch (e) {}
  const webShare = shareToken ? `${window.location.origin}/share/${id}?token=${encodeURIComponent(shareToken)}` : (shareUrl ? `${apiBase}${shareUrl}` : '')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webShare)
      alert('Link nusxa olindi')
    } catch (e) {
      window.prompt(`${t('share.link')}:`, webShare)
    }
  }

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      const blob = await downloadAnalysisPdf(id)
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `analysis_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {} finally {
      setDownloadingPdf(false)
    }
  }

  const metrics = [
    {
      label: 'Salinity',
      value: data.salinity_level ?? 0,
      unit: '%',
      pct: Math.max(0, Math.min(100, Math.round(((Number(data.salinity_level) || 0) / 5) * 100))),
      helper: t('results.helpers.salinity'),
    },
    {
      label: 'pH',
      value: data.ph_level ?? 0,
      unit: '',
      pct: Math.max(0, Math.min(100, Math.round(((Number(data.ph_level) || 0) / 14) * 100))),
      helper: t('results.helpers.ph'),
    },
    {
      label: t('detailed.moisture'),
      value: data.moisture_percentage ?? 0,
      unit: '%',
      pct: Math.max(0, Math.min(100, Number(data.moisture_percentage) || 0)),
      helper: t('results.helpers.moisture'),
    },
  ]

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
        <Typography variant="h5" fontWeight={700}>{t('results.done')}</Typography>
        <Typography variant="body2" color="text.secondary">ID: {data.id} • {new Date(data.submitted_at).toLocaleString()}</Typography>
      </Box>

      {/* Content */}
      <Grid container spacing={4}>
        {/* Left card: Umumiy Natija */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('results.summary')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {metrics.map((m) => (
                  <Box key={m.label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>{m.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{m.value}{m.unit}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={m.pct} />
                    <Typography variant="caption" color="text.secondary">{m.helper}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right card: Tavsiyalar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('results.recommendations')}</Typography>
              <List>
                {(data.recommendations || []).map((rec, idx) => (
                  <ListItem key={idx} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" color="success" onClick={() => navigate(`/analyses/${id}`)}>
          {t('results.detail')}
        </Button>
        <Button variant="outlined" onClick={() => navigate('/analysis/new')}>
          {t('results.new')}
        </Button>
        <Button variant="outlined" startIcon={<ShareIcon />} onClick={()=>setShareOpen(true)}>{t('results.share')}</Button>
        <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPdf} disabled={downloadingPdf}>{downloadingPdf ? '...' : t('results.pdf')}</Button>
      </Box>

      <Dialog open={shareOpen} onClose={()=>setShareOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('share.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>{t('share.note')}</DialogContentText>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <Button variant={shareEnabled ? 'contained' : 'outlined'} color={shareEnabled ? 'success' : 'primary'} onClick={toggleShare} disabled={busyShare}>
              {shareEnabled ? t('share.enabled') : t('share.enable')}
            </Button>
            {shareEnabled && <Button variant="outlined" color="error" onClick={toggleShare} disabled={busyShare}>{t('share.disable')}</Button>}
          </Stack>
          {shareEnabled && (
            <>
              <TextField fullWidth label="{t('share.link')}" value={webShare} InputProps={{ readOnly: true }} sx={{ mb: 1 }} />
              <Button onClick={copyToClipboard}>{t('share.copy')}</Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setShareOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
