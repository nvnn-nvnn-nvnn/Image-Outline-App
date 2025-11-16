// api/ping.js - Keep the server warm
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple ping response
  res.status(200).json({
    success: true,
    message: 'Server is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
