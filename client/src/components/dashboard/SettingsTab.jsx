import React, { useEffect, useState } from 'react'
import { Grid, FormControlLabel, Switch, TextField, MenuItem, Button, Alert } from '@mui/material'
import { updateSettings } from '../../services/api'

const LANGS = [
  { value: 'uz', label: 'O‘zbekcha' },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
]

export default function SettingsTab({ user, onUpdated }) {
  const defaults = user?.settings || { notifications: { email: true, sms: false, marketing: true }, language: 'uz' }
  const [settings, setSettings] = useState(defaults)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => { setSettings(defaults) }, [user])

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const updated = await updateSettings(settings)
      onUpdated && onUpdated(updated)
      setSuccess(true)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Sozlamalar saqlandi</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel control={<Switch checked={!!settings.notifications?.email} onChange={(e)=>setSettings({...settings, notifications: { ...settings.notifications, email: e.target.checked }})} />} label="Email bildirishnomalar" />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Switch checked={!!settings.notifications?.sms} onChange={(e)=>setSettings({...settings, notifications: { ...settings.notifications, sms: e.target.checked }})} />} label="SMS bildirishnomalar" />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Switch checked={!!settings.notifications?.marketing} onChange={(e)=>setSettings({...settings, notifications: { ...settings.notifications, marketing: e.target.checked }})} />} label="Marketing xabarlari" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Til" select fullWidth value={settings.language || 'uz'} onChange={(e)=>setSettings({...settings, language: e.target.value})}>
            {LANGS.map(l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</Button>
        </Grid>
      </Grid>
    </>
  )
}

