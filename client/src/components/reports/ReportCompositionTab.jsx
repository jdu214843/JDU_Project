import React, { useMemo } from 'react'
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip, Divider } from '@mui/material'
import { useI18n } from '../../i18n/translate'

function prettyName(key, t) {
  const map = { sand: t('composition.sand'), clay: t('composition.clay'), silt: t('composition.silt') }
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1)
}

function statusColor(status) {
  switch (status) {
    case 'Yaxshi':
      return 'success'
    case "O'rtacha":
      return 'warning'
    case 'Past':
      return 'error'
    default:
      return 'primary'
  }
}

export default function ReportCompositionTab({ soilComposition, chemicalProperties }) {
  const { t } = useI18n()
  const entries = useMemo(() => {
    if (!soilComposition) return []
    return Object.entries(soilComposition)
  }, [soilComposition])

  const chemicals = Array.isArray(chemicalProperties) ? chemicalProperties : []

  return (
    <Grid container spacing={3}>
      {/* Left column: Soil Composition */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('composition.title')}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {entries.map(([key, value]) => {
                const pct = Number(value) || 0
                return (
                  <Box key={key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>{prettyName(key, t)}</Typography>
                      <Typography variant="body2" color="text.secondary">{pct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, pct))} />
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Right column: Chemical Properties */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('composition.chemicalTitle')}</Typography>
            {/* Header row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">{t('composition.element')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('composition.amount')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('composition.status')}</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            {/* Rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {chemicals.map((c, idx) => (
                <Box key={`${c.name}-${idx}`} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 1, alignItems: 'center' }}>
                  <Typography variant="body2">{c.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{c.value}</Typography>
                  <Chip size="small" label={c.status || '—'} color={statusColor(c.status)} />
                </Box>
              ))}
              {chemicals.length === 0 && (
                <Typography variant="body2" color="text.secondary">{t('composition.none')}</Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

