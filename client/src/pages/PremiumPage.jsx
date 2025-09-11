import React from 'react'
import { Container, Typography, Grid, Card, CardContent, Box, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/translate'

const FEATURES = [
  'Real-time monitoring',
  'AI-based insights',
  'Advanced reports',
  'Priority support',
]

const TARIFFS = [
  { id: 'starter', name: 'Starter', price: "500,000 so'm/oy", features: ['1 ta sensor', 'Asosiy tavsiyalar'] },
  { id: 'professional', name: 'Pro', price: "1,200,000 so'm/oy", features: ['3 ta sensor', 'AI tahlil', '24/7 qo\'llab-quvvatlash'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Aloqa qiling', features: ['10+ sensor', 'API kirish', 'Maxsus tavsiyalar'] },
]

export default function PremiumPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <WorkspacePremiumIcon color="primary" />
        <Typography variant="h5" fontWeight={800}>{t('premium.header')}</Typography>
      </Box>

      {/* Premium Features */}
      <Typography variant="h6" gutterBottom>{t('premium.features')}</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {FEATURES.map((f, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body1">{f}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Benefits */}
      <Typography variant="h6" gutterBottom>{t('premium.benefits')}</Typography>
      <List dense>
        {[
          "Hosilni oshirish uchun AI tavsiyalar",
          "Ko'proq sensorlar va integratsiyalar",
          'Tezroq qo\'llab-quvvatlash',
        ].map((b, i) => (
          <ListItem key={i}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary={b} />
          </ListItem>
        ))}
      </List>

      {/* Plans */}
      <Typography variant="h6" gutterBottom>{t('premium.plans')}</Typography>
      <Grid container spacing={3}>
        {TARIFFS.map((p) => (
          <Grid item xs={12} md={4} key={p.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{p.name}</Typography>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>{p.price}</Typography>
                <List dense>
                  {p.features.map((f, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={f} />
                    </ListItem>
                  ))}
                </List>
                <Button variant="contained" color="primary" onClick={() => navigate(`/checkout/${p.id}`)}>
                  {t('premium.choose')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

