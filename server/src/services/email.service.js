import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { query } from '../db/index.js'
import { config } from '../config.js'

// Cache transporter to avoid reconnecting on every email
let transporter = null

const getTransporter = () => {
  if (transporter) return transporter
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) return null

  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort || 587,
    secure: (config.smtpPort || 587) === 465, // SSL for 465
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  })

  return transporter
}

// Get admin emails from database
const getAdminEmails = async () => {
  // Start with .env fallbacks in case the DB has no admin/staff rows yet
  const fromEnv = []
  if (process.env.ADMIN_EMAIL) fromEnv.push(process.env.ADMIN_EMAIL)
  if (process.env.STAFF_EMAILS) {
    process.env.STAFF_EMAILS.split(',').map((e) => e.trim()).filter(Boolean).forEach((e) => fromEnv.push(e))
  }

  try {
    const result = await query(
      'SELECT email FROM users WHERE role IN ($1, $2) AND email IS NOT NULL',
      ['admin', 'staff']
    )
    const dbEmails = result.rows.map(row => row.email)
    // Merge and de-duplicate env + DB emails
    return Array.from(new Set([...fromEnv, ...dbEmails])).filter(Boolean)
  } catch (error) {
    console.error('Error getting admin emails:', error)
    return Array.from(new Set(fromEnv)).filter(Boolean)
  }
}

// Send new order notification to admins
export const notifyNewOrder = async (orderData) => {
  try {
    // Skip email if SMTP not configured
    const transporter = getTransporter()
    if (!transporter) {
      console.log('📧 SMTP not configured, skipping email notification')
      return
    }
    const adminEmails = await getAdminEmails()
    
    if (adminEmails.length === 0) {
      console.log('No admin emails found for notification (checked DB + env)')
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
      from: config.smtpFrom || 'noreply@ecosoil.uz',
      to: adminEmails.join(', '),
      subject: `🛒 Yangi Buyurtma - ${orderData.product_name}`,
      html: emailTemplate
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Admin notification sent successfully', { to: mailOptions.to, messageId: info?.messageId })

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
    console.error('❌ Error sending admin notification:', error?.message || error)
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

    const transporter = getTransporter()
    // Skip email if SMTP not configured
    if (!transporter) {
      console.log('❌ SMTP not configured for status updates')
      return
    }
    console.log('📧 SMTP configured, ready to send')
    
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
      
      <p style="margin-top: 20px;">Savollar bo'lsa, biz bilan bog'laning: +998 91 582 71 71</p>
    </div>
    `

    const mailOptions = {
      from: config.smtpFrom || 'noreply@ecosoil.uz',
      to: orderData.customer_email,
      subject: `Buyurtma yangilandi - ${orderData.product_name}`,
      html: emailTemplate
    }

    console.log('📤 Sending email with options:', { to: mailOptions.to, subject: mailOptions.subject })
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Customer notification sent successfully!', { messageId: info?.messageId })
    
  } catch (error) {
    console.error('❌ Error sending customer notification:', error?.message || error)
  }
}
