import React from 'react'
import { Card, CardContent, CardActions, Typography, List, ListItem, ListItemIcon, ListItemText, Button, Box } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function PricingCard({ plan }) {
  const {
    name,
    audience,
    price,
    features = [],
    isPopular = false,
    buttonText = 'Tanlash',
    buttonVariant = 'outlined',
  } = plan

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: isPopular ? '2px solid #2e7d32' : '1px solid rgba(0,0,0,0.12)',
      }}
    >
      {isPopular && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#2e7d32',
            color: '#fff',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: 12,
            fontWeight: 700,
            boxShadow: 1,
          }}
        >
          Mashhur
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700}>{name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{audience}</Typography>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>{price}</Typography>

        <List dense>
          {features.map((f, idx) => (
            <ListItem key={idx} disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={f} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant={buttonVariant}
          color={isPopular ? 'primary' : 'inherit'}
          sx={{ textTransform: 'none' }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  )
}

