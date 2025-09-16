import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Container,
  Tab,
  Tabs,
  Snackbar
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { adminApiService } from '../services/admin.api'
import { io } from 'socket.io-client'

function StatCard({ title, value, color = 'primary' }) {
  return (
    <Card>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

function OrdersTable({ orders, onStatusUpdate, loading }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'default'
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApiService.updateOrderStatus(orderId, { status: newStatus })
      onStatusUpdate()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mijoz</TableCell>
            <TableCell>Mahsulot</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell>Viloyat</TableCell>
            <TableCell>Miqdor</TableCell>
            <TableCell>Holat</TableCell>
            <TableCell>Sana</TableCell>
            <TableCell>Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.product_name}</TableCell>
              <TableCell>{order.phone_number}</TableCell>
              <TableCell>{order.region}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString('uz-UZ')}
              </TableCell>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function DashboardTab({ stats, recentOrders, onRefresh }) {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Jami Buyurtmalar" value={stats?.total_orders || 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Kutilayotgan" value={stats?.pending_orders || 0} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tasdiqlangan" value={stats?.confirmed_orders || 0} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Bugun" value={stats?.today_orders || 0} color="primary" />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        So'nggi Buyurtmalar
      </Typography>
      <OrdersTable 
        orders={recentOrders || []} 
        onStatusUpdate={onRefresh}
        loading={false}
      />
    </Box>
  )
}

function OrdersTab({ orders, loading, onRefresh, onStatusFilter }) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Barcha Buyurtmalar</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Holat bo'yicha filter</InputLabel>
            <Select
              label="Holat bo'yicha filter"
              onChange={(e) => onStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">Hammasi</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={onRefresh}>
            Yangilash
          </Button>
        </Box>
      </Box>
      
      <OrdersTable 
        orders={orders} 
        loading={loading}
        onStatusUpdate={onRefresh}
      />
    </Box>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState(null)

  const fetchData = async (statusFilter = '') => {
    try {
      setLoading(true)
      const [statsData, ordersData] = await Promise.all([
        adminApiService.getOrderStats(),
        adminApiService.getOrders({ status: statusFilter, limit: 100 })
      ])
      
      setStats(statsData.stats)
      setOrders(ordersData.orders)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()

    // Setup socket connection for real-time notifications
    const socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:4000')
    
    socket.on('connect', () => {
      console.log('🔗 Connected to admin notifications')
      socket.emit('join-admin', token)
    })

    socket.on('new-order', (orderData) => {
      console.log('🔔 New order received:', orderData)
      setNotification(`Yangi buyurtma: ${orderData.product_name} - ${orderData.customer_name}`)
      
      // Refresh data to show new order
      fetchData()
      
      // Play notification sound (optional)
      try {
        new Audio('/notification.mp3').play().catch(() => {})
      } catch (e) {}
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const handleStatusFilter = (status) => {
    fetchData(status)
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
          <Button onClick={() => fetchData()} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🛒 Admin Panel - EcoSoil
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Saytga qaytish
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Chiqish
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
          <Tab label="Dashboard" />
          <Tab label="Buyurtmalar" />
          <Tab label="Foydalanuvchilar" disabled />
        </Tabs>

        {tabValue === 0 && (
          <DashboardTab 
            stats={stats}
            recentOrders={stats?.recent_orders}
            onRefresh={() => fetchData()}
          />
        )}

        {tabValue === 1 && (
          <OrdersTab
            orders={orders}
            loading={loading}
            onRefresh={() => fetchData()}
            onStatusFilter={handleStatusFilter}
          />
        )}

        {tabValue === 2 && (
          <Alert severity="info">
            Foydalanuvchilar boshqaruvi tez orada qo'shiladi
          </Alert>
        )}
      </Container>

      {/* Real-time Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        message={`🔔 ${notification}`}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Box>
  )
}
