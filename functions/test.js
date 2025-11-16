// Simple test function to verify Netlify functions are working
exports.handler = async (event, context) => {
  console.log('Test function called!', event.httpMethod, event.path);
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      message: 'Netlify function is working!',
      method: event.httpMethod,
      path: event.path,
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.REMOVE_BG_API_KEY,
      apiKeyLength: process.env.REMOVE_BG_API_KEY?.length || 0,
      headers: event.headers
    })
  };
}
