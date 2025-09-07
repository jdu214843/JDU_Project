import React, { useState } from 'react'
import { Container, Typography, Tabs, Tab, Grid, Box } from '@mui/material'
import ProductCard from '../components/products/ProductCard'
import PricingCard from '../components/products/PricingCard'
import ServiceCard from '../components/products/ServiceCard'
import FaqTab from '../components/products/FaqTab'
import SensorDetailsModal from '../components/products/SensorDetailsModal'
import OrderModal from '../components/products/OrderModal'

export default function TechnologiesPage() {
  const [activeTab, setActiveTab] = useState('sensorlar')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [productToOrder, setProductToOrder] = useState(null)

  const sensors = [
    {
      id: 1,
      name: 'Tuproq Namligi Sensori',
      description: 'Tuproq namligini real vaqtda kuzatish uchun',
      price: "150,000 so'm",
      imageUrl: '',
      features: [
        { icon: 'Wifi', text: 'Wi-Fi ulanish' },
        { icon: 'Battery6Bar', text: '6 oy batareya' },
        { icon: 'Cable', text: "Suv o'tkazmaydigan" },
        { icon: 'Speed', text: "Real-time ma'lumot" },
      ],
      details: {
        description:
          "Yuqori aniqlikdagi tuproq namligi sensori fermeringizning sug'orish ehtiyojlarini aniq belgilaydi. Chuqur o'rnatiladi va uzoq muddat ishlay oladi.",
        specs: [
          { label: 'Batareya:', value: '6 oy' },
          { label: 'Masofa:', value: '100m' },
          { label: 'Ulanish:', value: 'Wi-Fi, LoRa' },
          { label: 'Aniqlik:', value: '±2%' },
        ],
      },
    },
    {
      id: 2,
      name: 'Harorat va Namlik Sensori',
      description: "Havo harorati va namligini o'lchash",
      price: "120,000 so'm",
      imageUrl: '',
      features: [
        { icon: 'Bluetooth', text: 'Bluetooth ulanish' },
        { icon: 'BatteryFull', text: '1 yil batareya' },
        { icon: 'CheckCircleOutline', text: 'Yuqori aniqlik' },
        { icon: 'PhoneIphone', text: 'Mobil ilova' },
      ],
      details: {
        description:
          "Issiqxona va dalalarda foydalanish uchun mos sensor. Harorat va nisbiy namlikni nazorat qiladi va xabarnomalar yuboradi.",
        specs: [
          { label: 'Batareya:', value: '12 oy' },
          { label: 'Masofa:', value: '80m' },
          { label: 'Ulanish:', value: 'Bluetooth, Wi-Fi' },
          { label: 'Aniqlik:', value: '±0.3°C / ±2% RH' },
        ],
      },
    },
    {
      id: 3,
      name: "Tuproq pH va Sho'rlanish Sensori",
      description: "Tuproq pH darajasi va sho'rlanishni (EC) kuzatish",
      price: "220,000 so'm",
      imageUrl: '',
      features: [
        { icon: 'Wifi', text: 'Wi-Fi / Bluetooth' },
        { icon: 'Speed', text: "Tezkor o'qish" },
        { icon: 'Cable', text: 'IP67 daraja' },
        { icon: 'CheckCircleOutline', text: 'Kalibrlangan' },
      ],
      details: {
        description:
          "pH va elektr o'tkazuvchanlikni aniq o'lchaydi. Sho'rlanish darajasi va kislotali muhitni nazorat qilishga yordam beradi.",
        specs: [
          { label: 'Batareya:', value: '9 oy' },
          { label: 'Masofa:', value: '120m' },
          { label: 'Ulanish:', value: 'Wi-Fi, Bluetooth' },
          { label: 'Aniqlik:', value: '±0.1 pH / ±0.05 mS/cm' },
        ],
      },
    },
  ]

  const services = [
    {
      id: 'smart-irrigation',
      icon: 'SyncAlt',
      title: "Smart Sug'orish Tavsiyasi",
      description: "AI asosida optimal sug'orish vaqti va miqdorini aniqlash",
      features: [
        "Ob-havo prognozi",
        'Tuproq tahlili',
        'Avtomatik tavsiyalar',
        'Suv tejash',
      ],
    },
    {
      id: 'ai-forecast',
      icon: 'ModelTraining',
      title: 'AI Tahlil va Prognoz',
      description: "Sun'iy intellekt yordamida hosildorlik prognozi",
      features: [
        'Hosil prognozi',
        'Kasallik bashorati',
        'Optimal vaqt',
        'Tavsiyalar',
      ],
    },
  ]

  

  const tariffs = [
    {
      id: 'starter',
      name: 'Starter',
      audience: 'Kichik fermerlar uchun',
      price: "500,000 so'm/oy",
      features: [
        '1 ta sensor',
        '3 oy monitoring',
        'Asosiy tavsiyalar',
        "Email-qo'llab-quvvatlash",
      ],
      isPopular: false,
      buttonText: 'Tanlash',
      buttonVariant: 'outlined',
    },
    {
      id: 'pro',
      name: 'Pro',
      audience: 'Professional fermerlar uchun',
      price: "1,200,000 so'm/oy",
      features: [
        '3 ta sensor',
        'AI tahlil',
        'Dizayn xizmati (oyiga 1 marta)',
        "24/7 qo'llab-quvvatlash",
        'Batafsil hisobotlar',
      ],
      isPopular: true,
      buttonText: 'Tanlash',
      buttonVariant: 'contained',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      audience: 'Yirik agro kompaniyalar uchun',
      price: 'Aloqa qiling',
      features: [
        '10+ sensor',
        'API kirish',
        "Premium qo'llab-quvvatlash",
        'Maxsus tavsiyalar',
        'Onsite xizmat',
      ],
      isPopular: false,
      buttonText: 'Aloqa qiling',
      buttonVariant: 'outlined',
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Zamonaviy Qishloq Xo'jaligi Texnikalari</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        IoT sensorlarimiz yordamida dala va issiqxonangizni aniq kuzating
      </Typography>

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Sensorlar" value="sensorlar" />
        <Tab label="Xizmatlar" value="xizmatlar" />
        <Tab label="Tariflar" value="tariflar" />
        <Tab label="Savol-Javob" value="savol-javob" />
      </Tabs>

      {activeTab === 'sensorlar' && (
        <Grid container spacing={4}>
          {sensors.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <ProductCard
                product={p}
                onDetails={(sensor) => { setSelectedSensor(sensor); setModalOpen(true) }}
                onOrder={(product) => { setProductToOrder(product); setIsOrderModalOpen(true) }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 'xizmatlar' && (
        <Grid container spacing={4} justifyContent="center">
          {services.map((s) => (
            <Grid item xs={12} md={6} key={s.id}>
              <ServiceCard service={s} />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 'tariflar' && (
        <Grid container spacing={4} justifyContent="center">
          {tariffs.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <PricingCard plan={p} />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 'savol-javob' && <FaqTab />}
      {/* Sensor Details Modal */}
      <SensorDetailsModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedSensor(null) }}
        sensor={selectedSensor}
      />

      <OrderModal
        open={isOrderModalOpen}
        onClose={() => { setIsOrderModalOpen(false); setProductToOrder(null) }}
        product={productToOrder}
      />
    </Container>
  )
}
