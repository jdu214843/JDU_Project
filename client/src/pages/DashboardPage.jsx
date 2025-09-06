import React, { useEffect, useState } from 'react'
import { Paper, Typography, Tabs, Tab, Alert } from '@mui/material'
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
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Profile" />
        <Tab label="Tarix" />
        <Tab label="Sozlamalar" />
        <Tab label="Maxfiylik" />
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
    </Paper>
  )
}
