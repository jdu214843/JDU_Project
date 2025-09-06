import React, { useState } from 'react'
import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert } from '@mui/material'
import { downloadMyData, deleteMe } from '../../services/api'
import useAuthStore from '../../store/auth'
import { useNavigate } from 'react-router-dom'

export default function PrivacyTab() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleDownload = async () => {
    setError(null)
    try {
      const blob = await downloadMyData()
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'ecosoil_my_data.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      setError('Failed to download data')
    }
  }

  const confirmDelete = async () => {
    setBusy(true); setError(null)
    try {
      await deleteMe()
      logout()
      navigate('/')
    } catch (e) {
      setError('Failed to delete account')
    } finally {
      setBusy(false)
      setOpen(false)
    }
  }

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="outlined" onClick={handleDownload}>Ma'lumotlarni yuklab olish</Button>
        <Button variant="contained" color="error" onClick={()=>setOpen(true)}>Hisobni o'chirish</Button>
      </Stack>

      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Hisobni o'chirish</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu amal qaytarib bo'lmaydi. Barcha shaxsiy ma'lumotlar va tahlillar o'chiriladi. Davom etishni xohlaysizmi?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Bekor qilish</Button>
          <Button color="error" onClick={confirmDelete} disabled={busy}>{busy ? 'O‘chirilmoqda...' : 'Tasdiqlash'}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

