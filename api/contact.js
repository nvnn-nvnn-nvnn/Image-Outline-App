// api/contact.js - Vercel serverless function for contact form
export default async function handler(req, res) {
  // Set CORS headers
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
    const web3formsApiKey = process.env.WEB3FORMS_API_KEY;
    
    if (!web3formsApiKey) {
      console.error('WEB3FORMS_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        success: false, 
        error: 'Contact form service is not configured. Please contact the administrator.' 
      });
    }

    const formData = {
      access_key: web3formsApiKey,
      ...req.body
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit contact form. Please try again later.' 
    });
  }
}

