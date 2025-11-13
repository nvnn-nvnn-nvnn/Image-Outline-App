// Express-compatible handler (ESM)

const MAX_FREE_USES = 3;
const usageMap = new Map(); // key -> { date: 'YYYY-MM-DD', count }

const todayUTC = () => new Date().toISOString().split('T')[0];

/**
 * Get current usage status for a user without incrementing
 * @param {string} usageKey - User identifier (token, IP, etc.)
 * @returns {{remaining: number, used: number, limit: number}}
 */
export function getUsageStatus(usageKey) {
  const today = todayUTC();
  const entry = usageMap.get(usageKey) || { date: today, count: 0 };
  
  // Reset if different day
  if (entry.date !== today) {
    entry.date = today;
    entry.count = 0;
  }
  
  const isPro = process.env.FREE_LIMIT_DISABLED === '1';
  const used = entry.count;
  const remaining = isPro ? 999 : Math.max(0, MAX_FREE_USES - used);
  
  return {
    remaining,
    used,
    limit: isPro ? 999 : MAX_FREE_USES
  };
}

export default async function handler(req, res) {
  // ----- CORS -----
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    // ----- 1. AUTH (lightweight) -----
    // Expect a Firebase ID token from client. We do not verify here to avoid server deps.
    // For production, verify with firebase-admin.
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized – please log in' });
    }

    // Use token as usage key; fallback to IP if missing
    const token = authHeader.slice('Bearer '.length).trim();
    const usageKey = token || req.ip || 'anonymous';

    // ----- 2. USAGE CHECK -----
    const today = todayUTC();
    const entry = usageMap.get(usageKey) || { date: today, count: 0 };
    if (entry.date !== today) {
      entry.date = today;
      entry.count = 0;
    }

    // Allow unlimited if explicitly set via env (e.g., PRO mode) else enforce cap
    const isPro = process.env.FREE_LIMIT_DISABLED === '1';
    if (!isPro && entry.count >= MAX_FREE_USES) {
      return res.status(403).json({
        success: false,
        error: `Free limit reached – ${MAX_FREE_USES} daily tries used.`,
        remaining: 0,
      });
    }

    // ----- 3. IMAGE -----
    const { imageData } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'REMOVE_BG_API_KEY not configured' });
    }

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');

    // ----- 4. REMOVE.BG -----
    const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_file_b64: base64Data, size: 'auto' }),
    });

    if (!removeBgRes.ok) {
      let errBody = '';
      try { errBody = await removeBgRes.text(); } catch {}
      const msg =
        removeBgRes.status === 403 ? 'Invalid API key' :
        removeBgRes.status === 402 ? 'No credits' :
        removeBgRes.status === 429 ? 'Rate limited' :
        'Remove.bg error';
      return res.status(removeBgRes.status).json({ success: false, error: msg, details: errBody });
    }

    const resultBuffer = await removeBgRes.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');
    const processedImage = `data:image/png;base64,${resultBase64}`;

    // ----- 5. INCREMENT USAGE -----
    entry.count += 1;
    usageMap.set(usageKey, entry);

    // ----- 6. SUCCESS -----
    const remaining = isPro ? null : Math.max(0, MAX_FREE_USES - entry.count);
    return res.status(200).json({ success: true, processedImage, remaining });
  } catch (err) {
    console.error('remove-background error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}