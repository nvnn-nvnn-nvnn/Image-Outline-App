// Netlify function - same logic as remove-background.js but regular (non-background) function
const MAX_FREE_USES = 3;
const usageMap = new Map(); // key -> { date: 'YYYY-MM-DD', count }

const todayUTC = () => new Date().toISOString().split('T')[0];

/**
 * Get current usage status for a user without incrementing
 * @param {string} usageKey - User identifier (token, IP, etc.)
 * @returns {{remaining: number, used: number, limit: number}}
 */
function getUsageStatus(usageKey) {
  const today = todayUTC();
  const entry = usageMap.get(usageKey) || { date: today, count: 0 };
  
  // Reset if different day
  if (entry.date !== today) {
    entry.date = today;
    entry.count = 0;
    usageMap.set(usageKey, entry);
  }
  
  const remaining = Math.max(0, MAX_FREE_USES - entry.count);
  return {
    remaining,
    used: entry.count,
    limit: MAX_FREE_USES
  };
}

/**
 * Increment usage for a user
 * @param {string} usageKey - User identifier (token, IP, etc.)
 * @param {boolean} isPro - Whether user is pro (unlimited)
 * @returns {{remaining: number, used: number, limit: number}}
 */
function incrementUsage(usageKey, isPro = false) {
  if (isPro) {
    return {
      remaining: 999,
      used: 0,
      limit: 999
    };
  }
  
  const today = todayUTC();
  const entry = usageMap.get(usageKey) || { date: today, count: 0 };
  
  // Reset if different day
  if (entry.date !== today) {
    entry.date = today;
    entry.count = 0;
  }
  
  entry.count++;
  usageMap.set(usageKey, entry);
  
  const remaining = Math.max(0, MAX_FREE_USES - entry.count);
  return {
    remaining,
    used: entry.count,
    limit: isPro ? 999 : MAX_FREE_USES
  };
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    // ----- 1. AUTH / usage key (optional token) -----
    const authHeader = event.headers.authorization || '';
    let usageKey = event.headers['x-forwarded-for'] || 'anonymous';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length).trim();
      if (token) {
        usageKey = token;
      }
    }

    // ----- 2. USAGE CHECK -----
    const currentUsage = getUsageStatus(usageKey);
    if (currentUsage.remaining <= 0) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Daily limit reached',
          remaining: 0,
          used: currentUsage.used,
          limit: currentUsage.limit
        })
      };
    }

    // ----- 3. PARSE REQUEST -----
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'Invalid JSON' })
      };
    }

    const { imageData } = body;
    if (!imageData || typeof imageData !== 'string') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'Missing or invalid imageData' })
      };
    }

    // ----- 4. API KEY CHECK -----
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'REMOVE_BG_API_KEY not configured' })
      };
    }

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');

    // ----- 5. REMOVE.BG API CALL -----
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
      return {
        statusCode: removeBgRes.status,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: msg, details: errBody })
      };
    }

    const processedBuffer = await removeBgRes.arrayBuffer();
    const processedBase64 = `data:image/png;base64,${Buffer.from(processedBuffer).toString('base64')}`;

    // ----- 6. INCREMENT USAGE -----
    const newUsage = incrementUsage(usageKey, false);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        processedImage: processedBase64,
        remaining: newUsage.remaining,
        used: newUsage.used,
        limit: newUsage.limit
      })
    };

  } catch (err) {
    console.error('Background removal error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err.message || 'Internal server error',
        stack: err.stack
      })
    };
  }
};
