import React, { useMemo, useState } from 'react'
import { Box, Paper, Typography, Stepper, Step, StepLabel, TextField, Button, Grid, MenuItem, Stack, Avatar, Alert } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { submitAnalysis } from '../services/api'
import { useI18n } from '../i18n/translate'

const SOIL_TYPES = ['Sandy', 'Clay', 'Silt', 'Loam']
const CROP_TYPES = ['Wheat', 'Corn', 'Rice', 'Vegetables', 'Fruits']
const IRRIGATION = ['Drip', 'Sprinkler', 'Flood', 'Rainfed']

export default function AnalysisForm() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [general, setGeneral] = useState({
    location: '',
    area: '',
    soilType: '',
    cropType: '',
    lastHarvestDate: null,
  })
  const [additional, setAdditional] = useState({ irrigationMethod: '', observations: '' })
  const [images, setImages] = useState([])

  const previews = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images])

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    const imgOnly = files.filter((f) => f.type.startsWith('image/'))
    const next = [...images, ...imgOnly].slice(0, 5)
    if (next.length < images.length + files.length) {
      setError(t('analysisForm.onlyImages'))
    }
    setImages(next)
  }

  const handleSubmit = async () => {
    setError(null); setLoading(true)
    try {
      const form = new FormData()
      form.append('location', general.location)
      form.append('area', general.area)
      form.append('soilType', general.soilType)
      form.append('cropType', general.cropType)
      form.append('lastHarvestDate', general.lastHarvestDate ? general.lastHarvestDate.toISOString() : '')
      form.append('irrigationMethod', additional.irrigationMethod)
      form.append('observations', additional.observations)
      images.forEach((file) => form.append('images', file))
      const res = await submitAnalysis(form)
      navigate(`/processing/${res.id}`)
    } catch (e) {
      setError(e.response?.data?.error || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>{t('analysisForm.title')}</Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {(Array.isArray(t('analysisForm.steps')) ? t('analysisForm.steps') : ['General Info', 'Additional Info', 'Images']).map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {activeStep === 0 && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField label={t('analysisForm.location')} fullWidth value={general.location} onChange={(e)=>setGeneral({...general, location: e.target.value})} /></Grid>
            <Grid item xs={12} md={6}><TextField label={t('analysisForm.area')} type="number" fullWidth value={general.area} onChange={(e)=>setGeneral({...general, area: e.target.value})} /></Grid>
            <Grid item xs={12} md={6}>
              <TextField label={t('analysisForm.soilType')} select fullWidth value={general.soilType} onChange={(e)=>setGeneral({...general, soilType: e.target.value})}>
                {SOIL_TYPES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label={t('analysisForm.cropType')} select fullWidth value={general.cropType} onChange={(e)=>setGeneral({...general, cropType: e.target.value})}>
                {CROP_TYPES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker label={t('analysisForm.lastHarvestDate')} value={general.lastHarvestDate} onChange={(v)=>setGeneral({...general, lastHarvestDate: v})} slotProps={{ textField: { fullWidth: true } }} />
            </Grid>
          </Grid>
        </LocalizationProvider>
      )}

      {activeStep === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label={t('analysisForm.irrigationMethod')} select fullWidth value={additional.irrigationMethod} onChange={(e)=>setAdditional({...additional, irrigationMethod: e.target.value})}>
              {IRRIGATION.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label={t('analysisForm.observations')} fullWidth multiline minRows={4} value={additional.observations} onChange={(e)=>setAdditional({...additional, observations: e.target.value})} />
          </Grid>
        </Grid>
      )}

      {activeStep === 2 && (
        <Box>
          <Button variant="outlined" component="label">{t('analysisForm.upload')}
            <input type="file" hidden multiple accept="image/*" onChange={handleFiles} />
          </Button>
          <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
            {previews.map((src, idx) => (
              <Avatar key={idx} variant="rounded" src={src} sx={{ width: 100, height: 100 }} />
            ))}
          </Stack>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button disabled={activeStep===0} onClick={()=>setActiveStep((s)=>s-1)}>{t('analysisForm.back')}</Button>
        {activeStep < 2 ? (
          <Button variant="contained" onClick={()=>setActiveStep((s)=>s+1)}>{t('analysisForm.next')}</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>{loading ? t('analysisForm.submitting') : t('analysisForm.submit')}</Button>
        )}
      </Box>
    </Paper>
  )
}
