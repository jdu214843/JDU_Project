import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Container } from '@mui/material'
import theme from './theme'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AnalysisForm from './pages/AnalysisForm'
import ProcessingPage from './pages/ProcessingPage'
import ResultsPage from './pages/ResultsPage'
import DetailedReportPage from './pages/DetailedReportPage'
import DashboardPage from './pages/DashboardPage'
import TechnologiesPage from './pages/TechnologiesPage'
import HelpCenterPage from './pages/HelpCenterPage'
import ProtectedRoute from './components/ProtectedRoute'
import NetworkBanner from './components/NetworkBanner'
import GlobalSnackbar from './components/GlobalSnackbar'
import useAppStore from './store/app'
import { useEffect } from 'react'

export default function App() {
  const { setOnline } = useAppStore()
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ pt: 1 }}>
        <NetworkBanner />
      </Container>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/technologies" element={<TechnologiesPage />} />
          <Route path="/help" element={<HelpCenterPage />} />

          <Route
            path="/analysis/new"
            element={
              <ProtectedRoute>
                <AnalysisForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/processing/:id"
            element={
              <ProtectedRoute>
                <ProcessingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:id"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyses/:id"
            element={
              <ProtectedRoute>
                <DetailedReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <GlobalSnackbar />
    </ThemeProvider>
  )
}
