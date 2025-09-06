import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/auth'

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore()
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

