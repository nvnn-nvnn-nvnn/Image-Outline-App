require('dotenv').config();

const MAX_FREE_USES = 3;
const usageMap = new Map(); // key -> { date: 'YYYY-MM-DD', count }

const todayUTC = () => new Date().toISOString().split('T')[0];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

exports.handler = async (event) => {
  // Handle OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    
    // Use token as usage key; fallback to IP if missing
    const token = authHeader.slice('Bearer '.length).trim();
    const ip = event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] || '';
    const usageKey = token || ip || 'anonymous';

    // Validate content-type
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    if (contentType !== 'application/json') {
      return {
        statusCode: 415,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'Unsupported media type. Use application/json' })
      };
    }

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
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: `Free limit reached – ${MAX_FREE_USES} daily tries used.`,
          remaining: 0,
        })
      };
    }

    // ----- 3. IMAGE -----
    let imageData;
    try {
      const bodyJson = event.body ? JSON.parse(event.body) : {};
      imageData = bodyJson.imageData;
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'Invalid request body format' })
      };
    }

    if (!imageData) {
      console.log('No imageData provided. Request body:', event.body);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'No image data provided. Please send a JSON object with "imageData" field containing base64 image.'
        })
      };
    }

    // Also support plain base64 without content type
    if (!imageData.startsWith('data:image')) {
      // Assume it's raw base64 and prepend the content type
      imageData = `data:image/png;base64,${imageData}`;
    }

    // TEMPORARILY REMOVE VALIDATION FOR DEBUGGING
    // const base64Regex = /^data:image\/\w+;base64,[a-zA-Z0-9+/]+={0,2}$/;
    // if (!base64Regex.test(imageData)) {
    //   console.log('Invalid base64 format. imageData:', imageData.substring(0, 100) + '...');
    //   return {
    //     statusCode: 400,
    //     headers: corsHeaders,
    //     body: JSON.stringify({ 
    //       success: false, 
    //       error: `Invalid image format. Use base64-encoded images. Received: ${imageData.substring(0, 50)}...`
    //     })
    //   };
    // }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'REMOVE_BG_API_KEY not configured' })
      };
    }

    // Handle different base64 formats
    let base64Data;
    if (imageData.startsWith('data:image')) {
      base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    } else {
      // Assume it's raw base64
      base64Data = imageData;
    }

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
      try { 
        errBody = await removeBgRes.text(); 
      } catch (e) {}
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

    const resultBuffer = await removeBgRes.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');
    const processedImage = `data:image/png;base64,${resultBase64}`;

    // ----- 5. INCREMENT USAGE -----
    entry.count += 1;
    usageMap.set(usageKey, entry);

    // ----- 6. SUCCESS -----
    const remaining = isPro ? null : Math.max(0, MAX_FREE_USES - entry.count);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, processedImage, remaining })
    };
  } catch (err) {
    console.error('remove-background error:', err);
    console.error('Request body:', event.body);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: err?.message || 'Server error' })
    };
  }
};