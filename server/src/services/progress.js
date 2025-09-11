const listeners = new Map() // analysisId -> Set(res)
const values = new Map() // analysisId -> number

export function setProgress(analysisId, value) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  values.set(analysisId, v)
  const set = listeners.get(analysisId)
  if (set) {
    for (const res of set) {
      try { res.write(`data: ${JSON.stringify({ progress: v })}\n\n`) } catch {}
    }
  }
}

export function complete(analysisId) {
  setProgress(analysisId, 100)
  const set = listeners.get(analysisId)
  if (set) {
    for (const res of set) {
      try { res.write(`event: done\ndata: {"ok":true}\n\n`); res.end() } catch {}
    }
    listeners.delete(analysisId)
  }
  setTimeout(() => { values.delete(analysisId) }, 60 * 1000)
}

export function subscribe(analysisId, res) {
  if (!listeners.has(analysisId)) listeners.set(analysisId, new Set())
  listeners.get(analysisId).add(res)
  const v = values.get(analysisId) ?? 0
  try { res.write(`data: ${JSON.stringify({ progress: v })}\n\n`) } catch {}
  res.on('close', () => {
    const set = listeners.get(analysisId)
    if (set) set.delete(res)
  })
}

export function getProgress(analysisId) {
  return values.get(analysisId) ?? 0
}

