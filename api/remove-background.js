// api/remove-background.js
import FormData from 'form-data';
// Node.js 18+ has built-in fetch, no need to import node-fetch

export default async function handler(req, res) {
  // Set CORS headers - crucial for frontend communication
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    console.log('📥 Received image processing request');
    
    // Get the image data from the request
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ 
        success: false,
        error: 'No image data provided' 
      });
    }

    // Get API key from environment
    const apiKey = process.env.REMOVE_BG_API_KEY;
    
    if (!apiKey) {
      console.error('❌ API key not configured');
      return res.status(500).json({ 
        success: false,
        error: 'API key not configured. Please set REMOVE_BG_API_KEY in .env file' 
      });
    }

    // Remove the data:image/... prefix to get pure base64
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to buffer (Node.js way)
    const imageBuffer = Buffer.from(base64Data, 'base64');

    console.log('🔄 Sending request to Remove.bg API...');
    console.log('📊 Image data size:', Math.round(base64Data.length / 1024), 'KB');
    console.log('🔑 API Key present:', apiKey ? 'Yes' : 'No');
    console.log('🔑 API Key length:', apiKey?.length);

    // Try using JSON with base64 (more reliable than FormData)
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: base64Data,
        size: 'auto'
      })
    });
    
    console.log('📡 Remove.bg response status:', removeBgResponse.status);

    if (!removeBgResponse.ok) {
      let errorText;
      try {
        errorText = await removeBgResponse.text();
      } catch (e) {
        errorText = 'Could not read error response';
      }
      
      console.error('❌ Remove.bg API error!');
      console.error('   Status:', removeBgResponse.status);
      console.error('   Status Text:', removeBgResponse.statusText);
      console.error('   Response:', errorText);
      console.error('   Headers:', Object.fromEntries(removeBgResponse.headers.entries()));
      
      let errorMessage = 'Failed to remove background';
      
      if (removeBgResponse.status === 403) {
        errorMessage = 'Invalid API key or insufficient credits. Check your API key at https://www.remove.bg/api';
      } else if (removeBgResponse.status === 400) {
        errorMessage = 'Invalid image format or corrupt image data';
      } else if (removeBgResponse.status === 402) {
        errorMessage = 'Insufficient API credits. Check your balance at https://www.remove.bg/users/balance';
      } else if (removeBgResponse.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait before trying again.';
      }
      
      return res.status(removeBgResponse.status).json({
        success: false,
        error: errorMessage,
        details: errorText
      });
    }

    // Get the processed image as ArrayBuffer
    const resultBuffer = await removeBgResponse.arrayBuffer();
    
    // Convert to base64 for easy frontend consumption
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');
    const resultDataUrl = `data:image/png;base64,${resultBase64}`;

    console.log('✅ Image processed successfully!');

    // Send back the processed image
    res.status(200).json({
      success: true,
      processedImage: resultDataUrl,
      message: 'Background removed successfully'
    });

  } catch (error) {
    console.error('💥 Error processing image:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}