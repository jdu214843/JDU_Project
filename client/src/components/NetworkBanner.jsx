import React from 'react'
import { Alert, Collapse } from '@mui/material'
import useAppStore from '../store/app'

export default function NetworkBanner() {
  const { isOnline } = useAppStore()
  return (
    <Collapse in={!isOnline}>
      <Alert severity="warning">You are offline. Some actions may not work.</Alert>
    </Collapse>
  )
}

