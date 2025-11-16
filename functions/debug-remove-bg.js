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

  try {
    // Debug info
    const debugInfo = {
      method: event.httpMethod,
      hasBody: !!event.body,
      bodyLength: event.body ? event.body.length : 0,
      headers: event.headers,
      hasApiKey: !!process.env.REMOVE_BG_API_KEY,
      apiKeyLength: process.env.REMOVE_BG_API_KEY ? process.env.REMOVE_BG_API_KEY.length : 0,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };

    // Try to parse body
    let bodyData = {};
    if (event.body) {
      try {
        bodyData = JSON.parse(event.body);
      } catch (e) {
        debugInfo.bodyParseError = e.message;
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        debug: debugInfo,
        bodyData: bodyData,
        message: 'Debug function working'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack
      })
    };
  }
};
