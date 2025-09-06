import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import useAppStore from '../store/app'

export default function GlobalSnackbar() {
  const { errors, popError } = useAppStore()
  const open = errors.length > 0
  const message = open ? errors[0] : ''
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={popError} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="error" onClose={popError} variant="filled">{message}</Alert>
    </Snackbar>
  )
}

