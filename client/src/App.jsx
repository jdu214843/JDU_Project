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
import PublicSharePage from './pages/PublicSharePage'
import DashboardPage from './pages/DashboardPage'
import TechnologiesPage from './pages/TechnologiesPage'
import PremiumPage from './pages/PremiumPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import HelpCenterPage from './pages/HelpCenterPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import NetworkBanner from './components/NetworkBanner'
import GlobalSnackbar from './components/GlobalSnackbar'
import useAppStore from './store/app'
import useAuthStore from './store/auth'
import { useEffect } from 'react'

export default function App() {
  const { setOnline } = useAppStore()
  const { token } = useAuthStore()
  
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
          <Route index element={token ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/home" element={token ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/share/:id" element={<PublicSharePage />} />
          <Route path="/technologies" element={<TechnologiesPage />} />
          <Route path="/premium" element={<PremiumPage />} />
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
            path="/checkout/:planId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
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
        
        {/* Admin Routes - Outside MainLayout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
      <GlobalSnackbar />
    </ThemeProvider>
  )
}
