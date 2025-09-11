import nodemailer from 'nodemailer'
import { config } from '../config.js'

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    return null
  }
  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort || 587,
    secure: (config.smtpPort || 587) === 465, // true for 465, false for other ports
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })
  return transporter
}

export async function sendMail({ to, subject, text, html }) {
  const t = getTransporter()
  if (!t) {
    console.log('[email] SMTP not configured. Skipping send.')
    console.log({ to, subject, text, html: html ? '[html]' : '' })
    return { skipped: true }
  }
  const from = config.smtpFrom
  return t.sendMail({ from, to, subject, text, html })
}

export function buildAnalysisReportEmail({ user, analysis, result }) {
  const pretty = (v, unit = '') => (v == null ? '-' : `${v}${unit}`)
  const webUrl = config.webBaseUrl ? `${config.webBaseUrl}/analysis/${analysis.id}` : ''
  const subject = `EcoSoil: Analiz hisobot tayyor — ${analysis.location || 'maydon'}`
  const text = `Assalomu alaykum, ${user.full_name || user.fullName || ''}!

Siz yuborgan tahlil yakunlandi. Qisqa natijalar:
- pH: ${pretty(result.ph_level)}
- Sho'rlanish: ${pretty(result.salinity_level)}
- Namlik: ${pretty(result.moisture_percentage, '%')}
- Xavf darajasi: ${result.risk_level || '-'}

${webUrl ? 'To‘liq hisobot: ' + webUrl : ''}

EcoSoil jamoasi`

  const html = `
  <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
    <h2 style="margin:0 0 12px">Assalomu alaykum, ${escapeHtml(user.full_name || user.fullName || '')}!</h2>
    <p>Siz yuborgan tahlil yakunlandi. Qisqa natijalar quyidagicha:</p>
    <table cellspacing="0" cellpadding="8" style="border-collapse:collapse">
      <tr>
        <td style="border:1px solid #ddd">pH</td>
        <td style="border:1px solid #ddd">${escapeHtml(pretty(result.ph_level))}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd">Sho'rlanish</td>
        <td style="border:1px solid #ddd">${escapeHtml(pretty(result.salinity_level))}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd">Namlik</td>
        <td style="border:1px solid #ddd">${escapeHtml(pretty(result.moisture_percentage, '%'))}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd">Xavf darajasi</td>
        <td style="border:1px solid #ddd">${escapeHtml(result.risk_level || '-')}</td>
      </tr>
    </table>
    ${webUrl ? `<p style="margin-top:12px"><a href="${escapeAttr(webUrl)}" target="_blank">To‘liq hisobotni ko‘rish</a></p>` : ''}
    <p style="margin-top:16px">Hurmat bilan,<br/>EcoSoil jamoasi</p>
  </div>`

  return { subject, text, html }
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;')
}

