# 🛒 EcoSoil Admin Panel - Buyurtmalar Boshqaruvi

## ✅ Yaratilgan Imkoniyatlar

### 1. **Admin Authentication System**
- Users jadvalida `role` maydoni qo'shildi (admin/staff/user)
- Admin middleware yaratildi (`server/src/middleware/admin.js`)
- Default admin user: `admin@ecosoil.uz` / `admin123`

### 2. **Admin API Endpoints**
- `GET /api/admin/orders` - Barcha buyurtmalar ro'yxati
- `PUT /api/admin/orders/:id/status` - Buyurtma holatini yangilash  
- `GET /api/admin/orders/stats` - Statistika va hisobotlar

### 3. **Email Notification System**
- Yangi buyurtma kelganda admin/staff larga email yuboriladi
- Nodemailer bilan Gmail/SMTP orqali ishlaydi
- Email templates HTML formatida
- Notifications jadvali email tracking uchun

### 4. **Real-time Notifications**
- Socket.io bilan real-time bildirishnomalar
- Yangi buyurtma kelganda admin dashboardga darhol xabar keladi
- Sound notification (optional)

### 5. **Admin Dashboard Frontend**
- React.js bilan to'liq admin panel
- Orders ro'yxati va boshqaruv
- Statistics dashboard
- Status yangilash
- Responsive design

## 🚀 Ishga Tushirish

### Server
```bash
cd server
npm install
# .env faylini to'ldiring
npm start
```

### Client  
```bash
cd client
npm install
npm run dev
```

## 📋 Admin Panel Foydalanish

### 1. Login
- URL: `http://localhost:5173/admin/login`
- Email: `admin@ecosoil.uz`
- Password: `admin123`

### 2. Dashboard Features
- **📊 Statistics**: Jami, kutilayotgan, tasdiqlangan buyurtmalar
- **📋 Orders Table**: To'liq buyurtmalar ro'yxati
- **⚡ Real-time**: Yangi buyurtma kelganda darhol ko'rsatadi
- **📧 Email**: Admin larga avtomatik email yuboriladi

### 3. Order Status Management
Buyurtma holatlari:
- `pending` - Kutilayotgan
- `confirmed` - Tasdiqlangan
- `processing` - Tayyorlanmoqda  
- `shipped` - Jo'natilgan
- `delivered` - Yetkazilgan
- `cancelled` - Bekor qilingan

## 🔧 Database Changes

```sql
-- Admin role support
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';

-- Order logs tracking  
CREATE TABLE order_logs (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100),
  old_status VARCHAR(50),
  new_status VARCHAR(50), 
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email notifications tracking
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  type VARCHAR(50),
  recipient_emails JSONB,
  order_id UUID REFERENCES orders(id),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Security Features

- JWT token based admin authentication
- Role-based access control (admin/staff)
- Protected API endpoints
- Session management

## 📧 Email Configuration

`.env` faylida sozlang:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com  
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ecosoil.uz
```

## 🌐 API Documentation

### Admin Authentication
```javascript
POST /api/auth/login
{
  "email": "admin@ecosoil.uz",
  "password": "admin123"
}
```

### Get Orders
```javascript 
GET /api/admin/orders?status=pending&limit=50&offset=0
Authorization: Bearer <token>
```

### Update Order Status
```javascript
PUT /api/admin/orders/:id/status
Authorization: Bearer <token>
{
  "status": "confirmed",
  "notes": "Mijoz bilan bog'landik"
}
```

## 🎯 Buyurtma Jarayoni

1. **Mijoz buyurtma beradi** → OrderModal.jsx
2. **Server qabul qiladi** → order.controller.js  
3. **Real-time notification** → Socket.io admin room
4. **Email yuboriladi** → Nodemailer service
5. **Admin ko'radi** → Dashboard real-time update
6. **Admin tasdiqlaydi** → Status update API
7. **Log saqlanadi** → order_logs jadvali

## 🔄 Real-time Flow

```javascript
// Yangi buyurtma kelganda:
1. Order yaratiladi
2. Socket.io → admin-room ga 'new-order' event
3. Email service → admin larga email
4. Dashboard → notification snackbar
5. Orders list → avtomatik yangilanadi
```

## 🎨 UI Components

- **StatCard** - Statistika kartalari
- **OrdersTable** - Buyurtmalar jadvali  
- **StatusChip** - Holat ko'rsatkich
- **NotificationSnackbar** - Real-time xabarlar

## 📱 Mobile Responsive

Admin panel barcha qurilmalarda ishlaydi:
- Desktop: To'liq interfeys
- Tablet: Optimized layout
- Mobile: Responsive tables

---

## ✨ Xususiyatlar

✅ **Real-time notifications** - Socket.io  
✅ **Email alerts** - Nodemailer  
✅ **Role-based access** - JWT + middleware  
✅ **Order tracking** - Status management  
✅ **Responsive design** - Material-UI  
✅ **Statistics dashboard** - Analytics  
✅ **Audit logging** - Order history  

**Admin Panel URL:** `http://localhost:5173/admin`

Bu tizim orqali admin/staff buyurtmalar haqida darhol xabardor bo'ladi va ularni boshqarishi mumkin! 🚀
