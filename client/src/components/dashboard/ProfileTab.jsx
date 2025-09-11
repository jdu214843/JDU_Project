import React, { useState } from 'react'
import { Card, CardContent, Box, Grid, TextField, Button, MenuItem, Alert, Typography, InputAdornment } from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SaveIcon from '@mui/icons-material/Save'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { updateMe } from '../../services/api'
import { useI18n } from '../../i18n/translate'

const REGIONS = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Farg‘ona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Jizzax', 'Sirdaryo', 'Xorazm', 'Navoiy', 'Qoraqalpog‘iston'
]

export default function ProfileTab({ user, onUpdated }) {
  const { t } = useI18n()
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    region: user?.region || '',
    bio: user?.bio || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const updated = await updateMe({
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        region: form.region,
        bio: form.bio,
      })
      onUpdated && onUpdated(updated)
      setSuccess(true)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card elevation={1} sx={{ bgcolor: '#fff' }}>
      <CardContent>
        {/* Title with icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PersonOutlineIcon color="action" />
          <Typography variant="h6" fontWeight={600}>{t('profile.title')}</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{t('profile.saved')}</Alert>}

        {/* Two-column form layout */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('profile.fullName')}
              value={form.fullName}
              onChange={(e)=>setForm({...form, fullName: e.target.value})}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('profile.email')}
              value={form.email}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('profile.phone')}
              value={form.phoneNumber}
              onChange={(e)=>setForm({...form, phoneNumber: e.target.value})}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('profile.region')}
              select
              value={form.region}
              onChange={(e)=>setForm({...form, region: e.target.value})}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t('profile.bio')}
              value={form.bio}
              onChange={(e)=>setForm({...form, bio: e.target.value})}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ backgroundColor: '#212529', '&:hover': { backgroundColor: '#1b1f22' } }}
              >
                {saving ? t('profile.saving') : t('profile.save')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
