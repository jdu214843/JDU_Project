import { Router } from 'express'
import { query } from '../db/index.js'
import { buildAnalysisPdf } from '../services/report.js'

const router = Router()

router.get('/analyses/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { token } = req.query
    if (!token) return res.status(400).json({ error: 'Missing token' })
    const a = await query(
      `SELECT a.id, a.location, a.area, a.soil_type, a.crop_type, a.irrigation_method, a.submitted_at,
              a.share_enabled, a.share_token,
              ar.salinity_level, ar.ph_level, ar.moisture_percentage,
              ar.soil_composition, ar.chemical_properties, ar.recommendations,
              ar.ai_confidence, ar.risk_level, ar.affected_area_percentage,
              ar.completed_at
       FROM analyses a
       LEFT JOIN analysis_results ar ON ar.analysis_id = a.id
       WHERE a.id = $1`,
      [id]
    )
    if (a.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    const row = a.rows[0]
    if (!row.share_enabled || row.share_token !== token) return res.status(403).json({ error: 'Forbidden' })
    res.json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch shared analysis' })
  }
})

router.get('/analyses/:id/report.pdf', async (req, res) => {
  try {
    const { id } = req.params
    const { token } = req.query
    if (!token) return res.status(400).json({ error: 'Missing token' })
    const a = await query(
      `SELECT a.id, a.location, a.submitted_at, a.share_enabled, a.share_token,
              ar.salinity_level, ar.ph_level, ar.moisture_percentage,
              ar.soil_composition, ar.chemical_properties, ar.recommendations,
              ar.ai_confidence, ar.risk_level, ar.affected_area_percentage
       FROM analyses a
       LEFT JOIN analysis_results ar ON ar.analysis_id = a.id
       WHERE a.id = $1`,
      [id]
    )
    if (a.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    const row = a.rows[0]
    if (!row.share_enabled || row.share_token !== token) return res.status(403).json({ error: 'Forbidden' })
    const pdf = await buildAnalysisPdf({ user: null, analysis: row, result: row })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="analysis_${id}.pdf"`)
    res.send(pdf)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to build PDF' })
  }
})

export default router

