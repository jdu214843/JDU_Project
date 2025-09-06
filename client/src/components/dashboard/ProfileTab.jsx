import React, { useState, useMemo } from 'react'
import { Grid, TextField, Button, MenuItem, Alert } from '@mui/material'
import { updateMe } from '../../services/api'

const REGIONS = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Farg‘ona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Jizzax', 'Sirdaryo', 'Xorazm', 'Navoiy', 'Qoraqalpog‘iston'
]

export default function ProfileTab({ user, onUpdated }) {
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
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField label="Ism Familiya" value={form.fullName} onChange={(e)=>setForm({...form, fullName: e.target.value})} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Email" value={form.email} fullWidth disabled />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Telefon" value={form.phoneNumber} onChange={(e)=>setForm({...form, phoneNumber: e.target.value})} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Hudud" select value={form.region} onChange={(e)=>setForm({...form, region: e.target.value})} fullWidth>
            {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Bio" value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} fullWidth multiline minRows={3} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</Button>
        </Grid>
      </Grid>
    </>
  )
}

