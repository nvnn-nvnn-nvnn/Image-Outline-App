// Netlify function for health check
exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      status: 'ok',
      message: 'Netlify Functions are running!',
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.REMOVE_BG_API_KEY,
      apiKeyLength: process.env.REMOVE_BG_API_KEY?.length || 0
    })
  };
};
