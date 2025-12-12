// api/analyze.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { analyzeSymptoms } from '../services/geminiService'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  try {
    const text = (req.body?.text || '').toString().trim()
    if (!text) return res.status(400).json({ error: 'Empty text' })

    const data = await analyzeSymptoms(text) // 调用你已有的服务，内部用 process.env.API_KEY
    return res.status(200).json(data)
  } catch (e) {
    console.error('analyze error:', e)
    return res.status(502).json({ error: 'AI upstream error' })
  }
}