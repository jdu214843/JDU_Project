import React, { useEffect, useState } from 'react'
import { Container, Box, Card, CardContent, Typography, Tabs, Tab, Alert, Avatar, Chip } from '@mui/material'
import { useI18n } from '../i18n/translate'
import useAuthStore from '../store/auth'
import { getMe } from '../services/api'
import Loader from '../components/Loader'
import ProfileTab from '../components/dashboard/ProfileTab'
import HistoryTab from '../components/dashboard/HistoryTab'
import SettingsTab from '../components/dashboard/SettingsTab'
import PrivacyTab from '../components/dashboard/PrivacyTab'

export default function DashboardPage() {
  const [tab, setTab] = useState(0)
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { t } = useI18n()

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const me = await getMe()
        setUser(me)
        setError(null)
      } catch (e) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <Loader />
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{t('dashboard.loadError')}</Alert>}

      {/* User Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 72, height: 72, mb: 1 }}>
          {(user?.fullName || 'U')[0]}
        </Avatar>
        <Typography variant="h5" fontWeight={600}>{user?.fullName || 'Foydalanuvchi'}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>{user?.email}</Typography>
        <Chip label={t('dashboard.farmer')} color="success" size="small" sx={{ mt: 1 }} />
      </Box>

      {/* Tabs Card */}
      <Card>
        <CardContent sx={{ pt: 2 }}>
          <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{ mb: 2 }}>
            {['dashboard.tabs.0','dashboard.tabs.1','dashboard.tabs.2','dashboard.tabs.3'].map((k)=>(<Tab key={k} label={t(k)} />))}
          </Tabs>

          {tab === 0 && (
            <ProfileTab user={user} onUpdated={setUser} />
          )}
          {tab === 1 && (
            <HistoryTab />
          )}
          {tab === 2 && (
            <SettingsTab user={user} onUpdated={setUser} />
          )}
          {tab === 3 && (
            <PrivacyTab />
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
