import fs from 'fs/promises'
import path from 'path'
import { config } from '../config.js'
import { uploadsDir } from '../util/uploads.js'

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_GEMINI_MODEL = 'gemini-pro-latest'
const DEFAULT_OLLAMA_MODEL = 'llama3.1:8b'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(min, Math.min(max, n))
}

function computeMockResult(data) {
  const base = (data.location || 'loc') + (data.crop_type || 'crop')
  const seed = [...base].reduce((a, c) => a + c.charCodeAt(0), 0) % 100
  const rand = (min, max) => min + ((seed % 50) / 50) * (max - min)

  const ph = Number((6.0 + (seed % 30) / 10).toFixed(1)) // ~6.0-9.0
  const salinity = Number(rand(0.1, 3.5).toFixed(2))
  const moisture = Math.min(60, Math.max(10, Math.round(rand(15, 45))))

  const sand = Math.min(70, Math.max(20, Math.round(rand(30, 60))))
  const clay = Math.min(60, Math.max(10, Math.round(rand(15, 40))))
  const silt = Math.max(5, 100 - sand - clay)

  const organicMatter = Number(rand(1.5, 4.5).toFixed(1))
  const nitrogenPct = Number(rand(0.08, 0.2).toFixed(2))
  const phosphorusPct = Number(rand(0.05, 0.12).toFixed(2))

  const phStatus = ph >= 6.5 && ph <= 7.5 ? 'Yaxshi' : ph >= 5.8 && ph <= 8.2 ? "O'rtacha" : 'Past'
  const omStatus = organicMatter >= 3.0 ? 'Yaxshi' : organicMatter >= 2.0 ? "O'rtacha" : 'Past'
  const nStatus = nitrogenPct >= 0.12 ? 'Yaxshi' : nitrogenPct >= 0.1 ? "O'rtacha" : 'Past'
  const pStatus = phosphorusPct >= 0.1 ? 'Yaxshi' : phosphorusPct >= 0.07 ? "O'rtacha" : 'Past'

  const chemical = [
    { name: 'pH darajasi', value: ph.toFixed(1), status: phStatus },
    { name: 'Organik modda', value: `${organicMatter}%`, status: omStatus },
    { name: 'Azot (N)', value: `${(nitrogenPct * 100).toFixed(2)}%`, status: nStatus },
    { name: 'Fosfor (P)', value: `${(phosphorusPct * 100).toFixed(2)}%`, status: pStatus },
  ]

  const recs = [
    "Sug'orish rejimini optimallashtiring",
    salinity > 2 ? 'Drenaj tizimini yaxshilang' : 'Drenaj holatini saqlang va kuzating',
    organicMatter < 3 ? "Organik o'g'it qo'shing" : 'Organik modda miqdorini barqaror saqlang',
    ph > 7.5 ? 'pH ni pasaytirish uchun oltingugurt qo‘llang' : 'pH barqaror, kuzatishda davom eting',
  ]

  const ai_confidence = Number(rand(82, 98).toFixed(1))
  let risk_level = 'Past xavf'
  if (salinity >= 2.5) risk_level = 'Yuqori xavf'
  else if (salinity >= 1.5) risk_level = "O'rtacha xavf"
  const affected_area_percentage = Number(rand(25, 75).toFixed(1))

  function clip(n, min, max) { return Math.max(min, Math.min(max, n)) }
  const phScore = 100 - (Math.abs(ph - 7) / 7) * 100
  const salScore = 100 - clip((salinity / 3.5) * 100, 0, 100)
  const moistScore = clip((moisture / 60) * 100, 0, 100)
  const omScore = clip((organicMatter / 4.5) * 100, 0, 100)
  const nScore = clip((nitrogenPct / 0.2) * 100, 0, 100)
  const pScore = clip((phosphorusPct / 0.12) * 100, 0, 100)
  const health_score = Number((
    phScore * 0.22 +
    salScore * 0.24 +
    moistScore * 0.18 +
    omScore * 0.18 +
    ((nScore + pScore) / 2) * 0.18
  ).toFixed(0))

  return {
    ph_level: ph,
    salinity_level: salinity,
    moisture_percentage: moisture,
    soil_composition: { sand, clay, silt },
    chemical_properties: chemical,
    recommendations: recs,
    ai_confidence,
    risk_level,
    affected_area_percentage,
    health_score,
  }
}

async function runMockAnalysis(data, { onProgress, simulateDelay = true } = {}) {
  if (simulateDelay) {
    const totalMs = 45000 + Math.floor(Math.random() * 15000)
    const steps = Math.max(45, Math.floor(totalMs / 1000))
    for (let i = 0; i < steps; i++) {
      const pct = Math.round(((i + 1) / steps) * 100)
      if (typeof onProgress === 'function') onProgress(Math.min(99, pct))
      await sleep(totalMs / steps)
    }
  }
  return computeMockResult(data)
}

function mimeFromFilename(filename) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  return null
}

async function buildImageParts(images) {
  const parts = []
  for (const img of images || []) {
    const url = img?.url
    if (!url) continue
    const filename = path.basename(url)
    const mimeType = mimeFromFilename(filename)
    if (!mimeType) continue
    const filePath = path.join(uploadsDir, filename)
    try {
      const data = await fs.readFile(filePath)
      parts.push({ inlineData: { mimeType, data: data.toString('base64') } })
    } catch {
      // skip unreadable files
    }
    if (parts.length >= 2) break
  }
  return parts
}

function buildPrompt(data, imageCount) {
  const payload = {
    location: data.location || null,
    area: data.area || null,
    soil_type: data.soil_type || null,
    crop_type: data.crop_type || null,
    irrigation_method: data.irrigation_method || null,
    observations: data.observations || null,
    last_harvest_date: data.last_harvest_date || null,
    images_count: imageCount,
  }
  return [
    'You are an agronomy expert. Return ONLY valid JSON (no markdown, no code fences).',
    'Use Uzbek language for strings. Numeric fields must be numbers (not strings).',
    'Schema:',
    '{',
    '  "ph_level": number,',
    '  "salinity_level": number,',
    '  "moisture_percentage": number,',
    '  "soil_composition": {"sand": number, "clay": number, "silt": number},',
    '  "chemical_properties": [{"name": string, "value": string, "status": "Yaxshi|O\'rtacha|Past"}],',
    '  "recommendations": [string],',
    '  "ai_confidence": number,',
    '  "risk_level": "Past xavf|O\'rtacha xavf|Yuqori xavf",',
    '  "affected_area_percentage": number,',
    '  "health_score": number',
    '}',
    'Constraints:',
    '- ph_level in 3..10, salinity_level in 0..5, moisture_percentage in 0..100',
    '- soil_composition should sum to ~100',
    '- ai_confidence and health_score in 0..100',
    '',
    'Input:',
    JSON.stringify(payload, null, 2),
  ].join('\n')
}

function extractJson(text) {
  if (!text) return null
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first === -1 || last === -1 || last <= first) return null
  const slice = text.slice(first, last + 1)
  try {
    return JSON.parse(slice)
  } catch {
    return null
  }
}

function normalizeResult(result, fallback) {
  const base = fallback || computeMockResult({})
  const soil = result?.soil_composition && typeof result.soil_composition === 'object'
    ? result.soil_composition
    : base.soil_composition

  const sand = clampNumber(soil?.sand, 0, 100, base.soil_composition.sand)
  const clay = clampNumber(soil?.clay, 0, 100, base.soil_composition.clay)
  const silt = clampNumber(soil?.silt, 0, 100, base.soil_composition.silt)

  const recommendations = Array.isArray(result?.recommendations) ? result.recommendations : base.recommendations
  const chemical = Array.isArray(result?.chemical_properties) ? result.chemical_properties : base.chemical_properties

  const merged = {
    ph_level: clampNumber(result?.ph_level, 3, 10, base.ph_level),
    salinity_level: clampNumber(result?.salinity_level, 0, 5, base.salinity_level),
    moisture_percentage: clampNumber(result?.moisture_percentage, 0, 100, base.moisture_percentage),
    soil_composition: { sand, clay, silt },
    chemical_properties: chemical,
    recommendations,
    ai_confidence: clampNumber(result?.ai_confidence, 0, 100, base.ai_confidence),
    risk_level: result?.risk_level || base.risk_level,
    affected_area_percentage: clampNumber(result?.affected_area_percentage, 0, 100, base.affected_area_percentage),
    health_score: clampNumber(result?.health_score, 0, 100, base.health_score),
  }
  return merged
}

async function runGeminiAnalysis(data, images, { onProgress } = {}) {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }
  const model = config.geminiModel || DEFAULT_GEMINI_MODEL
  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${config.geminiApiKey}`
  if (typeof onProgress === 'function') onProgress(10)

  const imageParts = await buildImageParts(images)
  const prompt = buildPrompt(data, imageParts.length)
  const parts = [{ text: prompt }, ...imageParts]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25000)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    }),
    signal: controller.signal,
  })
  clearTimeout(timeout)

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${errText}`)
  }
  if (typeof onProgress === 'function') onProgress(70)

  const body = await res.json()
  const text = body?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('') || ''
  const parsed = extractJson(text)
  if (!parsed) {
    throw new Error('Gemini response missing JSON')
  }
  if (typeof onProgress === 'function') onProgress(95)
  return parsed
}

async function runOllamaAnalysis(data, images, { onProgress } = {}) {
  const model = config.ollamaModel || DEFAULT_OLLAMA_MODEL
  const prompt = buildPrompt(data, Array.isArray(images) ? images.length : 0)
  if (typeof onProgress === 'function') onProgress(10)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.ollamaTimeoutMs || 25000)
  const res = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      keep_alive: 0,
      options: {
        temperature: 0.2,
        top_p: 0.9,
        num_predict: 350,
      },
    }),
    signal: controller.signal,
  })
  clearTimeout(timeout)

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Ollama API error ${res.status}: ${errText}`)
  }
  if (typeof onProgress === 'function') onProgress(70)

  const body = await res.json()
  const text = body?.response || ''
  const parsed = extractJson(text)
  if (!parsed) {
    throw new Error('Ollama response missing JSON')
  }
  if (typeof onProgress === 'function') onProgress(95)
  return parsed
}

function resolveProvider() {
  const explicit = (config.aiProvider || '').trim().toLowerCase()
  if (explicit) return explicit
  if (config.geminiApiKey) return 'gemini'
  return 'ollama'
}

export async function runAIAnalysis(data, images, { onProgress } = {}) {
  const provider = resolveProvider()
  try {
    if (provider === 'ollama') {
      const raw = await runOllamaAnalysis(data, images, { onProgress })
      return normalizeResult(raw, computeMockResult(data))
    }
    if (provider === 'gemini') {
      const raw = await runGeminiAnalysis(data, images, { onProgress })
      return normalizeResult(raw, computeMockResult(data))
    }
    throw new Error(`Unknown AI provider: ${provider}`)
  } catch (err) {
    console.error(`${provider} analysis failed, falling back to mock:`, err?.message || err)
    const result = await runMockAnalysis(data, { onProgress, simulateDelay: false })
    return normalizeResult(result, result)
  }
}
