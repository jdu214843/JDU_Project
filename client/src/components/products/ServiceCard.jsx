import React from 'react'
import { Card, CardContent, Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import ModelTrainingIcon from '@mui/icons-material/ModelTraining'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useI18n } from '../../i18n/translate'

const ICONS = {
  SyncAlt: <SyncAltIcon color="primary" />,
  ModelTraining: <ModelTrainingIcon color="primary" />,
}

export default function ServiceCard({ service }) {
  const { t } = useI18n()
  const { icon, title, description, features = [] } = service
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {ICONS[icon] || null}
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>
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
      <Box sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained" color="success" sx={{ textTransform: 'none' }}>
          {t('products.more')}
        </Button>
      </Box>
    </Card>
  )
}
