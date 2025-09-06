import React from 'react'
import { Box, Container, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#212529', color: '#fff', py: 3, mt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="body2">© {new Date().getFullYear()} EcoSoil. All rights reserved.</Typography>
      </Container>
    </Box>
  )
}

