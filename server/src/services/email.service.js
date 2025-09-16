import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { query } from '../db/index.js'

// Create email transporter
const createTransporter = () => {
  // Gmail yoki boshqa SMTP server uchun
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password'
    }
  })
}

// Get admin emails from database
const getAdminEmails = async () => {
  try {
    const result = await query(
      'SELECT email FROM users WHERE role IN ($1, $2) AND email IS NOT NULL',
      ['admin', 'staff']
    )
    return result.rows.map(row => row.email)
  } catch (error) {
    console.error('Error getting admin emails:', error)
    return []
  }
}

// Send new order notification to admins
export const notifyNewOrder = async (orderData) => {
  try {
    // Skip email if SMTP not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 SMTP not configured, skipping email notification')
      return
    }

    const transporter = createTransporter()
    const adminEmails = await getAdminEmails()
    
    if (adminEmails.length === 0) {
      console.log('No admin emails found for notification')
      return
    }

    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2e7d32;">🛒 Yangi Buyurtma Keldi!</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Buyurtma Ma'lumotlari:</h3>
        <p><strong>Mahsulot:</strong> ${orderData.product_name}</p>
        <p><strong>Mijoz:</strong> ${orderData.customer_name}</p>
        <p><strong>Telefon:</strong> ${orderData.phone_number}</p>
        <p><strong>Viloyat:</strong> ${orderData.region}</p>
        <p><strong>Miqdor:</strong> ${orderData.quantity} dona</p>
        <p><strong>Manzil:</strong> ${orderData.address}</p>
        <p><strong>Sana:</strong> ${new Date().toLocaleString('uz-UZ')}</p>
      </div>
      
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <p>✅ Bu buyurtma avtomatik tarzda qabul qilindi.</p>
        <p>📋 Admin paneldan buyurtma holatini yangilashingiz mumkin.</p>
        <p>📞 Mijoz bilan bog'lanib, buyurtmani tasdiqlang.</p>
      </div>
      
      <p style="margin-top: 20px;">
        <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:5173/admin'}" 
           style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
          Admin Panelni Ochish
        </a>
      </p>
    </div>
    `

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@ecosoil.uz',
      to: adminEmails.join(', '),
      subject: `🛒 Yangi Buyurtma - ${orderData.product_name}`,
      html: emailTemplate
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Admin notification sent successfully')
    
        // Log notification
    await query(
      'INSERT INTO notifications (id, type, recipient_emails, order_id, sent_at) VALUES ($1, $2, $3, $4, NOW())',
      [
        crypto.randomUUID(),
        'new_order',
        JSON.stringify(adminEmails),
        orderData.id
      ]
    )
    
  } catch (error) {
    console.error('❌ Error sending admin notification:', error)
  }
}

// Send order status update to customer
export const notifyOrderStatusUpdate = async (orderData, newStatus) => {
  try {
    console.log('🔔 Attempting to send status update email...')
    console.log('Order data:', { id: orderData.id, email: orderData.customer_email, status: newStatus })
    
    if (!orderData.customer_email) {
      console.log('❌ Customer email not available')
      return
    }

    // Skip email if SMTP not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('❌ SMTP not configured for status updates')
      return
    }

    console.log('📧 SMTP configured, creating transporter...')
    const transporter = createTransporter()
    
    const statusTexts = {
      confirmed: 'Tasdiqlandi ✅',
      processing: 'Tayyorlanmoqda 📦',
      shipped: 'Jo\'natildi 🚚',
      delivered: 'Yetkazildi ✅',
      cancelled: 'Bekor qilindi ❌'
    }

    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2e7d32;">📋 Buyurtma Holati Yangilandi</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <p><strong>Hurmatli ${orderData.customer_name},</strong></p>
        <p>Sizning buyurtmangiz holati yangilandi:</p>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <h3 style="margin: 0; color: #2e7d32;">
            ${statusTexts[newStatus] || newStatus}
          </h3>
        </div>
        
        <p><strong>Buyurtma:</strong> ${orderData.product_name}</p>
        <p><strong>Miqdor:</strong> ${orderData.quantity} dona</p>
      </div>
      
      <p style="margin-top: 20px;">Savollar bo'lsa, biz bilan bog'laning: +998 90 123 45 67</p>
    </div>
    `

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@ecosoil.uz',
      to: orderData.customer_email,
      subject: `Buyurtma yangilandi - ${orderData.product_name}`,
      html: emailTemplate
    }

    console.log('📤 Sending email with options:', { to: mailOptions.to, subject: mailOptions.subject })
    await transporter.sendMail(mailOptions)
    console.log('✅ Customer notification sent successfully!')
    
  } catch (error) {
    console.error('❌ Error sending customer notification:', error)
  }
}
