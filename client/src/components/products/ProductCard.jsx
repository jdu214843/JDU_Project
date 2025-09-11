import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Typography, Box, Button } from '@mui/material'
import WifiIcon from '@mui/icons-material/Wifi'
import Battery6BarIcon from '@mui/icons-material/Battery6Bar'
import CableIcon from '@mui/icons-material/Cable'
import SpeedIcon from '@mui/icons-material/Speed'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import { useI18n } from '../../i18n/translate'

const ICONS = {
  Wifi: <WifiIcon fontSize="small" />,
  Battery6Bar: <Battery6BarIcon fontSize="small" />,
  Cable: <CableIcon fontSize="small" />,
  Speed: <SpeedIcon fontSize="small" />,
  Bluetooth: <BluetoothIcon fontSize="small" />,
  BatteryFull: <BatteryFullIcon fontSize="small" />,
  CheckCircleOutline: <CheckCircleOutlineIcon fontSize="small" />,
  PhoneIphone: <PhoneIphoneIcon fontSize="small" />,
}

export default function ProductCard({ product, onDetails, onOrder }) {
  const { t } = useI18n()
  const { name, description, price, imageUrl, features = [] } = product
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {imageUrl ? (
        <CardMedia component="img" height="180" image={imageUrl} alt={name} />
      ) : (
        <Box sx={{ height: 180, bgcolor: 'grey.200' }} />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>{name}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1 }}>{price}</Typography>

        {/* Features */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.0, mt: 2 }}>
          {features.map((f, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <Box sx={{ color: 'text.primary' }}>{ICONS[f.icon] || null}</Box>
              <Typography variant="body2">{f.text}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          sx={{ textTransform: 'none' }}
          onClick={() => onDetails && onDetails(product)}
        >
          {t('products.details')}
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ textTransform: 'none' }}
          onClick={() => onOrder && onOrder(product)}
        >
          {t('products.order')}
        </Button>
      </CardActions>
    </Card>
  )
}
