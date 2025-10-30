// api/remove-background.js
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received image processing request');
    
    // Get the image data from the request
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Remove the data:image/... prefix to get pure base64
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Create FormData for Remove.bg API
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image_file', blob);
    formData.append('size', 'auto');

    console.log('Sending request to Remove.bg API...');

    // Call Remove.bg API
   // In your serverless function
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY, // This comes from environment
    },
    body: formData,
    });

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text();
      console.error('Remove.bg API error:', errorText);
      throw new Error(`Remove.bg API error: ${removeBgResponse.status}`);
    }

    // Get the processed image as ArrayBuffer
    const resultBuffer = await removeBgResponse.arrayBuffer();
    
    // Convert to base64 for easy frontend consumption
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');
    const resultDataUrl = `data:image/png;base64,${resultBase64}`;

    console.log('Image processed successfully');

    // Send back the processed image
    res.status(200).json({
      success: true,
      processedImage: resultDataUrl,
      message: 'Background removed successfully'
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}