import { query } from '../db/index.js'

export async function getCurrentUserProfile(req, res) {
  try {
    // Select all columns to avoid referencing non-existent ones if migration hasn't run yet.
    const result = await query('SELECT * FROM users WHERE id = $1', [req.user.id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' })
    const u = result.rows[0]
    res.json({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      phoneNumber: u.phone_number || '',
      region: u.region || '',
      bio: u.bio || '',
      location: u.location || '',
      settings: (u.settings && typeof u.settings === 'object') ? u.settings : { notifications: { email: true, sms: false, marketing: true }, language: 'uz' },
      createdAt: u.created_at,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export async function updateCurrentUserProfile(req, res) {
  try {
    const { fullName, phoneNumber, region, bio, location, email } = req.body
    if (email) return res.status(400).json({ error: 'Email cannot be changed' })
    if (fullName && String(fullName).length < 2) return res.status(400).json({ error: 'Full name is too short' })
    if (phoneNumber && String(phoneNumber).length > 50) return res.status(400).json({ error: 'Phone number too long' })
    const result = await query(
      `UPDATE users SET
         full_name = COALESCE($2, full_name),
         phone_number = COALESCE($3, phone_number),
         region = COALESCE($4, region),
         bio = COALESCE($5, bio),
         location = COALESCE($6, location)
       WHERE id = $1
       RETURNING id, full_name, email,
                 COALESCE(phone_number, '') AS phone_number,
                 COALESCE(region, '') AS region,
                 COALESCE(bio, '') AS bio,
                 COALESCE(location, '') AS location,
                 COALESCE(settings, '{}'::jsonb) AS settings,
                 created_at`,
      [req.user.id, fullName || null, phoneNumber || null, region || null, bio || null, location || null]
    )
    const u = result.rows[0]
    res.json({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      phoneNumber: u.phone_number,
      region: u.region,
      bio: u.bio,
      location: u.location,
      settings: u.settings,
      createdAt: u.created_at,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export async function updateUserSettings(req, res) {
  try {
    const { settings } = req.body
    if (settings == null || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings payload' })
    }
    const result = await query(
      `UPDATE users SET settings = $2::jsonb WHERE id = $1
       RETURNING id, full_name, email, COALESCE(phone_number, '') AS phone_number, COALESCE(region, '') AS region,
                 COALESCE(bio, '') AS bio, COALESCE(location, '') AS location, COALESCE(settings, '{}'::jsonb) AS settings, created_at`,
      [req.user.id, JSON.stringify(settings)]
    )
    const u = result.rows[0]
    res.json({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      phoneNumber: u.phone_number,
      region: u.region,
      bio: u.bio,
      location: u.location,
      settings: u.settings,
      createdAt: u.created_at,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update settings' })
  }
}

export async function downloadMyData(req, res) {
  try {
    const userRes = await query(
      `SELECT id, full_name, email, COALESCE(phone_number,'') AS phone_number, COALESCE(region,'') AS region,
              COALESCE(bio,'') AS bio, COALESCE(location,'') AS location, COALESCE(settings,'{}'::jsonb) AS settings, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    )
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' })
    const user = userRes.rows[0]

    const analysesRes = await query(
      `SELECT a.* FROM analyses a WHERE a.user_id = $1 ORDER BY a.submitted_at DESC`,
      [req.user.id]
    )
    const analysisIds = analysesRes.rows.map((r) => r.id)
    let resultsByAnalysis = {}
    let imagesByAnalysis = {}
    if (analysisIds.length) {
      const resultsRes = await query(
        `SELECT * FROM analysis_results WHERE analysis_id = ANY($1::uuid[])`,
        [analysisIds]
      )
      const imagesRes = await query(
        `SELECT * FROM analysis_images WHERE analysis_id = ANY($1::uuid[]) ORDER BY uploaded_at ASC`,
        [analysisIds]
      )
      for (const r of resultsRes.rows) resultsByAnalysis[r.analysis_id] = r
      for (const img of imagesRes.rows) {
        if (!imagesByAnalysis[img.analysis_id]) imagesByAnalysis[img.analysis_id] = []
        imagesByAnalysis[img.analysis_id].push(img)
      }
    }

    const data = {
      user,
      analyses: analysesRes.rows.map((a) => ({
        ...a,
        result: resultsByAnalysis[a.id] || null,
        images: imagesByAnalysis[a.id] || [],
      })),
      exportedAt: new Date().toISOString(),
    }
    const filename = `ecosoil_user_${user.id}.json`
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to prepare data export' })
  }
}

export async function deleteMe(req, res) {
  try {
    await query('DELETE FROM users WHERE id = $1', [req.user.id])
    res.json({ success: true, message: 'Account deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete account' })
  }
}
