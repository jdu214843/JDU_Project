import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export default function Loader({ minHeight = 200 }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" sx={{ minHeight }}>
      <CircularProgress />
    </Box>
  )
}

