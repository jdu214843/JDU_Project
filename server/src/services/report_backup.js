import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import { config } from '../config.js'

f  // Chemical properties
  let chemProps = []
  try {
    if (typeof result?.chemical_properties === 'string') {
      chemProps = JSON.parse(result.chemical_properties)
    } else if (Array.isArray(result?.chemical_properties)) {
      chemProps = result.chemical_properties
    }
  } catch (error) {
    console.log('Error parsing chemical properties:', error)
    chemProps = []
  }
  
  if (Array.isArray(chemProps) && chemProps.length > 0) {
    doc.fontSize(12).fillColor('#111').text('Kimyoviy ko'rsatkichlar:')
    chemProps.forEach((c) => {
      if (c && c.name && c.value && c.status) {
        doc.fontSize(11).text(`- ${c.name}: ${c.value} (${c.status})`)
      }
    })
    doc.moveDown(0.5)
  }toPct(n) { 
  if (n == null || isNaN(Number(n))) return '-'
  return `${Number(n).toFixed(1)}%` 
}
function toNum(n, d=1) { 
  if (n == null || isNaN(Number(n))) return '-'
  return Number(n).toFixed(d) 
}

export async function buildAnalysisPdf({ user, analysis, result }) {
  try {
    console.log('Building PDF for analysis:', analysis?.id)
    console.log('User:', user?.full_name || user?.fullName || 'Anonymous')
    
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
  
  // Safe value extraction with NaN handling
  const phValue = result?.ph_level != null && !isNaN(Number(result.ph_level)) ? toNum(result.ph_level, 1) : '-'
  const salinityValue = result?.salinity_level != null && !isNaN(Number(result.salinity_level)) ? toNum(result.salinity_level, 2) : '-'
  const moistureValue = result?.moisture_percentage != null && !isNaN(Number(result.moisture_percentage)) ? toNum(result.moisture_percentage, 0) + '%' : '-'
  
  const cards = [
    { label: 'pH', value: phValue },
    { label: "Sho'rlanish", value: salinityValue },
    { label: 'Namlik', value: moistureValue },
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
  if (result?.ai_confidence != null && !isNaN(Number(result.ai_confidence))) {
    doc.text(`AI ishonchliligi: ${toNum(result.ai_confidence, 1)}%`)
  }
  if (result?.affected_area_percentage != null && !isNaN(Number(result.affected_area_percentage))) {
    doc.text(`Ta'sirlangan maydon: ${toNum(result.affected_area_percentage, 1)}%`)
  }
  doc.moveDown(0.5)

  // Composition table
  doc.fontSize(12).text('Tarkib (taxminiy):')
  let comp = {}
  
  // Safe parsing of soil_composition
  try {
    if (typeof result?.soil_composition === 'string') {
      comp = JSON.parse(result.soil_composition)
    } else if (typeof result?.soil_composition === 'object' && result.soil_composition !== null) {
      comp = result.soil_composition
    }
    console.log('Parsed soil composition:', comp)
  } catch (error) {
    console.log('Error parsing soil composition:', error)
    comp = {}
  }
  
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
  console.log('PDF chunks generated:', chunks.length, 'total size:', chunks.reduce((sum, c) => sum + c.length, 0))
  return Buffer.concat(chunks)
  } catch (error) {
    console.error('Error building PDF:', error)
    throw error
  }
}
