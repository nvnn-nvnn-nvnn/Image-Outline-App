// api/test.js - Simple test endpoint
export default async function handler(req, res) {
  console.log('=== TEST ENDPOINT HIT ===');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple response to test if backend works
  res.status(200).json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
}