import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getClient, query } from '../db/index.js'
import { runAIAnalysis } from '../services/ai.js'
import { buildAnalysisPdf } from '../services/report.js'
import { setProgress as setAnalysisProgress, complete as completeProgress } from '../services/progress.js'
import { query as dbQuery } from '../db/index.js'
import { sendMail, buildAnalysisReportEmail } from '../services/email.js'

export async function createAnalysis(req, res) {
  const client = await getClient()
  try {
    const userId = req.user.id
    const { location, area, soilType, cropType, irrigationMethod, observations, lastHarvestDate } = req.body
    await client.query('BEGIN')
    const analysisId = uuidv4()
    await client.query(
      `INSERT INTO analyses (id, user_id, status, location, area, soil_type, crop_type, irrigation_method, observations, submitted_at)
       VALUES ($1, $2, 'processing', $3, $4, $5, $6, $7, $8, NOW())`,
      [
        analysisId,
        userId,
        location || null,
        area ? Number(area) : null,
        soilType || null,
        cropType || null,
        irrigationMethod || null,
        observations || null,
      ]
    )

    const files = req.files || []
    for (const f of files) {
      const imageId = uuidv4()
      const url = `/uploads/${path.basename(f.path)}`
      await client.query(
        `INSERT INTO analysis_images (id, analysis_id, image_url, uploaded_at) VALUES ($1, $2, $3, NOW())`,
        [imageId, analysisId, url]
      )
    }

    await client.query('COMMIT')

    ;(async () => {
      try {
        const images = files.map((f) => ({ url: `/uploads/${path.basename(f.path)}` }))
        const data = { location, area, soil_type: soilType, crop_type: cropType, irrigation_method: irrigationMethod, observations, last_harvest_date: lastHarvestDate }
        const result = await runAIAnalysis(data, images, { onProgress: (p) => setAnalysisProgress(analysisId, p) })
        await query(
          `INSERT INTO analysis_results (
              id, analysis_id,
              salinity_level, ph_level, moisture_percentage,
              soil_composition, chemical_properties, recommendations,
              ai_confidence, risk_level, affected_area_percentage, health_score,
              completed_at
           )
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9, $10, $11, $12, NOW())
           ON CONFLICT (analysis_id)
           DO UPDATE SET salinity_level = EXCLUDED.salinity_level,
                         ph_level = EXCLUDED.ph_level,
                         moisture_percentage = EXCLUDED.moisture_percentage,
                         soil_composition = EXCLUDED.soil_composition,
                         chemical_properties = EXCLUDED.chemical_properties,
                         recommendations = EXCLUDED.recommendations,
                         ai_confidence = EXCLUDED.ai_confidence,
                         risk_level = EXCLUDED.risk_level,
                         affected_area_percentage = EXCLUDED.affected_area_percentage,
                         health_score = EXCLUDED.health_score,
                         completed_at = EXCLUDED.completed_at`,
          [
            uuidv4(),
            analysisId,
            result.salinity_level,
            result.ph_level,
            result.moisture_percentage,
            JSON.stringify(result.soil_composition),
            JSON.stringify(result.chemical_properties),
            JSON.stringify(result.recommendations),
            result.ai_confidence,
            result.risk_level,
            result.affected_area_percentage,
            result.health_score,
          ]
        )
        await query(`UPDATE analyses SET status = 'completed' WHERE id = $1`, [analysisId])
        completeProgress(analysisId)

        // Send notification email (non-blocking fail)
        try {
          const userRes = await dbQuery(`SELECT id, full_name, email, COALESCE(settings,'{}'::jsonb) AS settings FROM users WHERE id = $1`, [userId])
          if (userRes.rowCount) {
            const user = userRes.rows[0]
            const settings = user.settings && typeof user.settings === 'object' ? user.settings : {}
            const wantsEmail = settings?.notifications?.email !== false
            if (wantsEmail && user.email) {
              const analysisRes = await dbQuery(`SELECT id, location, submitted_at FROM analyses WHERE id = $1`, [analysisId])
              const analysisRow = analysisRes.rowCount ? analysisRes.rows[0] : { id: analysisId, location }
              const { subject, text, html } = buildAnalysisReportEmail({ user, analysis: analysisRow, result })
              await sendMail({ to: user.email, subject, text, html })
            }
          }
        } catch (mailErr) {
          console.error('Failed to send analysis email', mailErr)
        }
      } catch (e) {
        console.error('AI analysis failed', e)
        await query(`UPDATE analyses SET status = 'completed' WHERE id = $1`, [analysisId])
        completeProgress(analysisId)
      }
    })()

    res.status(202).json({ id: analysisId, status: 'processing' })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Failed to submit analysis' })
  } finally {
    client.release()
  }
}

export async function listAnalyses(req, res) {
  try {
    const result = await query(
      `SELECT a.id, a.status, a.location, a.area, a.soil_type, a.crop_type, a.irrigation_method, a.submitted_at,
              ar.salinity_level, ar.ph_level, ar.moisture_percentage, ar.health_score
       FROM analyses a
       LEFT JOIN analysis_results ar ON ar.analysis_id = a.id
       WHERE a.user_id = $1
       ORDER BY a.submitted_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch analyses' })
  }
}

export async function getAnalysisById(req, res) {
  try {
    const { id } = req.params
       const a = await query(
          `SELECT a.*,
              ar.salinity_level, ar.ph_level, ar.moisture_percentage,
              ar.soil_composition, ar.chemical_properties, ar.recommendations,
              ar.ai_confidence, ar.risk_level, ar.affected_area_percentage, ar.health_score,
              ar.completed_at
       FROM analyses a
       LEFT JOIN analysis_results ar ON ar.analysis_id = a.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [id, req.user.id]
    )
    if (a.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    const images = await query('SELECT id, image_url, uploaded_at FROM analysis_images WHERE analysis_id = $1 ORDER BY uploaded_at ASC', [id])
    // Generate mock weather object on the fly
    const weather = (() => {
      const base = (a.rows[0].location || '') + (a.rows[0].crop_type || '')
      const seed = [...base].reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const rng = (min, max) => min + (seed % 100) / 100 * (max - min)
      const temp = Math.round(rng(12, 30))
      const wind = Math.round(rng(4, 18))
      const hum = Math.round(rng(35, 80))
      const conditions = ['Quyoshli', 'Yomg‘irli', 'Bulutli', 'Yarim bulutli']
      const condition = conditions[seed % conditions.length]
      return { temperature: temp, wind_speed: wind, humidity: hum, condition }
    })()

    res.json({ ...a.rows[0], images: images.rows, weather })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch analysis' })
  }
}

export async function getAnalysisHistory(req, res) {
  try {
    const { id } = req.params

    // Ensure the analysis belongs to the authenticated user
    const a = await query(`SELECT id, user_id, location FROM analyses WHERE id = $1 AND user_id = $2`, [id, req.user.id])
    if (a.rowCount === 0) return res.status(404).json({ error: 'Not found' })

    // MOCK: Return realistic-looking salinity dynamics for the same location
    // Real implementation would:
    // 1) Find analyses by same user_id and location
    // 2) Join analysis_results to get salinity_level and submitted_at
    // 3) Order ascending by date
    const mock = [
      { date: '2025-05-10', salinity: 2.1 },
      { date: '2025-06-20', salinity: 2.2 },
      { date: '2025-07-15', salinity: 2.0 },
      { date: '2025-08-28', salinity: 2.4 },
    ]

    res.json(mock)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch analysis history' })
  }
}

export async function getAnalysisReportPdf(req, res) {
  try {
    const { id } = req.params
    console.log('PDF Request for analysis:', id, 'by user:', req.user.id)
    
    const a = await query(
      `SELECT a.*,
              ar.salinity_level, ar.ph_level, ar.moisture_percentage,
              ar.soil_composition, ar.chemical_properties, ar.recommendations,
              ar.ai_confidence, ar.risk_level, ar.affected_area_percentage, ar.health_score
       FROM analyses a
       LEFT JOIN analysis_results ar ON ar.analysis_id = a.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [id, req.user.id]
    )
    
    if (a.rowCount === 0) {
      console.log('Analysis not found:', id)
      return res.status(404).json({ error: 'Not found' })
    }
    
    console.log('Analysis found, building PDF...')
    const userRes = await query('SELECT id, full_name FROM users WHERE id = $1', [req.user.id])
    const user = userRes.rowCount ? userRes.rows[0] : { id: req.user.id }
    
    console.log('Analysis data:', JSON.stringify(a.rows[0], null, 2))
    
    const pdf = await buildAnalysisPdf({ user, analysis: a.rows[0], result: a.rows[0] })
    console.log('PDF generated successfully, size:', pdf.length)
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="analysis_${id}.pdf"`)
    res.send(pdf)
  } catch (err) {
    console.error('PDF Generation Error:', err)
    res.status(500).json({ error: 'Failed to build PDF: ' + err.message })
  }
}

import { randomBytes } from 'crypto'
function newToken() {
  return randomBytes(16).toString('hex')
}

export async function toggleShare(req, res) {
  try {
    const { id } = req.params
    const { enable } = req.body || {}
    const flag = enable === true || enable === 'true' || enable === 1 || enable === '1'
    // Ensure ownership
    const a = await query('SELECT id, share_enabled, share_token FROM analyses WHERE id = $1 AND user_id = $2', [id, req.user.id])
    if (a.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    let share_token = a.rows[0].share_token
    let share_enabled = !!a.rows[0].share_enabled
    if (flag && !share_token) share_token = newToken()
    if (flag) share_enabled = true
    if (!flag) share_enabled = false
    const r = await query('UPDATE analyses SET share_enabled=$3, share_token=$2 WHERE id=$1 AND user_id = $4 RETURNING share_enabled, share_token', [id, share_token, share_enabled, req.user.id])
    const b = r.rows[0]
    const url = b.share_enabled && b.share_token ? `/api/public/analyses/${id}?token=${b.share_token}` : null
    res.json({ shareEnabled: b.share_enabled, shareUrl: url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update sharing' })
  }
}

export async function getShareInfo(req, res) {
  try {
    const { id } = req.params
    const a = await query('SELECT share_enabled, share_token FROM analyses WHERE id = $1 AND user_id = $2', [id, req.user.id])
    if (a.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    const b = a.rows[0]
    const url = b.share_enabled && b.share_token ? `/api/public/analyses/${id}?token=${b.share_token}` : null
    res.json({ shareEnabled: b.share_enabled, shareUrl: url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get share info' })
  }
}

import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { subscribe as progressSubscribe, getProgress as progressGet } from '../services/progress.js'

export async function sseProgress(req, res) {
  try {
    const { id } = req.params
    // Allow auth either via header (Bearer) or via ?token=JWT
    let userId = null
    const authH = req.headers.authorization
    const tokenQ = req.query.token
    const token = authH && authH.startsWith('Bearer ') ? authH.slice(7) : tokenQ
    if (token) {
      try {
        const payload = jwt.verify(token, config.jwtSecret)
        userId = payload.sub
      } catch {}
    }
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    // Ensure user owns the analysis
    const own = await query('SELECT id FROM analyses WHERE id = $1 AND user_id = $2', [id, userId])
    if (own.rowCount === 0) return res.status(404).json({ error: 'Not found' })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders?.()
    res.write(`retry: 2000\n\n`)
    // Send current progress immediately
    try { res.write(`data: ${JSON.stringify({ progress: progressGet(id) })}\n\n`) } catch {}
    progressSubscribe(id, res)
  } catch (err) {
    console.error(err)
    try { res.end() } catch {}
  }
}
