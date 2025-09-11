import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import { config } from '../config.js'

function toPct(n) { return n == null ? '-' : `${Number(n).toFixed(1)}%` }
function toNum(n, d=1) { return n == null ? '-' : Number(n).toFixed(d) }

export async function buildAnalysisPdf({ user, analysis, result }) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 })
  const chunks = []
  doc.on('data', (c) => chunks.push(c))
  const done = new Promise((res) => doc.on('end', () => res()))

  // Header
  doc.fontSize(20).text('EcoSoil — Analiz Hisoboti', { align: 'left' })
  doc.moveDown(0.5)
  doc.fontSize(10).fillColor('#555').text(new Date().toLocaleString())
  doc.moveDown(0.5)
  if (user?.full_name || user?.fullName) {
    doc.fontSize(11).fillColor('#111').text(`Foydalanuvchi: ${user.full_name || user.fullName}`)
  }
  doc.fontSize(11).text(`Joy: ${analysis.location || '-'}`)
  doc.moveDown(0.5)

  // Summary cards
  const y0 = doc.y
  const x0 = doc.x
  const w = (doc.page.width - doc.page.margins.left - doc.page.margins.right - 20) / 3
  const h = 60
  const cards = [
    { label: 'pH', value: toNum(result?.ph_level, 1) },
    { label: "Sho'rlanish", value: toNum(result?.salinity_level, 2) },
    { label: 'Namlik', value: toNum(result?.moisture_percentage, 0) + '%' },
  ]
  cards.forEach((c, i) => {
    const x = x0 + i * (w + 10)
    doc.roundedRect(x, y0, w, h, 6).stroke('#ddd')
    doc.fontSize(10).fillColor('#777').text(c.label, x + 10, y0 + 10)
    doc.fontSize(18).fillColor('#111').text(c.value, x + 10, y0 + 28)
  })
  doc.moveDown(5)

  // Risk + Confidence
  doc.fontSize(12).fillColor('#111').text(`Xavf darajasi: ${result?.risk_level || '-'}`)
  if (result?.ai_confidence != null) doc.text(`AI ishonchliligi: ${toNum(result.ai_confidence, 1)}%`)
  if (result?.affected_area_percentage != null) doc.text(`Ta'sirlangan maydon: ${toNum(result.affected_area_percentage, 1)}%`)
  doc.moveDown(0.5)

  // Composition table
  doc.fontSize(12).text('Tarkib (taxminiy):')
  const comp = result?.soil_composition || {}
  const table = [
    ['Qum', toPct(comp.sand)],
    ['Loy', toPct(comp.clay)],
    ['Chang', toPct(comp.silt)],
  ]
  const tx = doc.x, ty = doc.y
  const tw = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const th = 22
  table.forEach((row, idx) => {
    const y = ty + idx * th
    doc.rect(tx, y, tw, th).stroke('#eee')
    doc.fontSize(11).fillColor('#111').text(row[0], tx + 8, y + 6)
    doc.text(row[1], tx + tw - 80, y + 6, { width: 72, align: 'right' })
  })
  doc.moveDown(3)

  // Chemical properties
  if (Array.isArray(result?.chemical_properties)) {
    doc.fontSize(12).fillColor('#111').text('Kimyoviy ko‘rsatkichlar:')
    result.chemical_properties.forEach((c) => {
      doc.fontSize(11).text(`- ${c.name}: ${c.value} (${c.status})`)
    })
    doc.moveDown(0.5)
  }

  // Recommendations
  if (Array.isArray(result?.recommendations)) {
    doc.fontSize(12).text('Tavsiyalar:')
    result.recommendations.forEach((r) => doc.fontSize(11).text(`• ${r}`))
    doc.moveDown(0.5)
  }

  // QR code to web report (if available)
  if (config.webBaseUrl) {
    const url = `${config.webBaseUrl}/analyses/${analysis.id}`
    const qrPng = await QRCode.toBuffer(url, { margin: 1, width: 96 })
    doc.moveDown(1)
    doc.fontSize(10).fillColor('#555').text('To‘liq hisobot:')
    const x = doc.x
    const y = doc.y
    doc.image(qrPng, x, y, { width: 96, height: 96 })
    doc.link(x + 110, y + 40, 300, 12, url)
    doc.fillColor('#2a6').text(url, x + 110, y + 40, { underline: true })
  }

  // Footer
  doc.moveDown(2)
  doc.fillColor('#888').fontSize(9).text('© EcoSoil — Avtomatik tahlil hisobot', { align: 'center' })

  doc.end()
  await done
  return Buffer.concat(chunks)
}
