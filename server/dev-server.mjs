// server/dev-server.js - Local development server
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the project root (one level up from server/)
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import handler from api folder (one level up, then into api/)
import handler from '../api/remove-background.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Large limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API server is running',
    apiKeyLoaded: !!process.env.REMOVE_BG_API_KEY,
    apiKeyLength: process.env.REMOVE_BG_API_KEY?.length || 0,
    timestamp: new Date().toISOString()
  });
});

// Background removal endpoint
app.post('/api/remove-background', async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.options('/api/remove-background', async (req, res) => {
  await handler(req, res);
});

// Usage status endpoint - returns remaining tries
app.get('/api/usage-status', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const usageKey = token || req.ip || 'anonymous';
    
    // Import the usage map from the handler
    const { getUsageStatus } = await import('../api/remove-background.js');
    const status = getUsageStatus(usageKey);
    
    res.json({ 
      success: true, 
      remaining: status.remaining,
      used: status.used,
      limit: status.limit
    });
  } catch (error) {
    console.error('Usage status error:', error);
    res.status(500).json({ success: false, error: 'Failed to get usage status' });
  }
});

// Contact form proxy endpoint
app.post('/api/contact', async (req, res) => {
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
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'POST /api/remove-background',
      'GET /api/usage-status',
      'POST /api/contact',
      'GET /api/health'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📍 Remove Background: POST http://localhost:${PORT}/api/remove-background`);
  console.log(`📊 Usage Status: GET http://localhost:${PORT}/api/usage-status`);
  console.log(`📧 Contact Form: POST http://localhost:${PORT}/api/contact`);
  console.log(`❤️  Health Check: GET http://localhost:${PORT}/api/health`);
  console.log(`\n⚙️  Environment:`);
  console.log(`   Working Directory: ${process.cwd()}`);
  console.log(`   .env Path: ${join(__dirname, '..', '.env')}`);
  console.log(`   Remove BG API Key: ${process.env.REMOVE_BG_API_KEY ? '✅ Loaded' : '❌ Missing - Check .env file'}`);
  console.log(`   Web3Forms API Key: ${process.env.WEB3FORMS_API_KEY ? '✅ Loaded' : '❌ Missing - Check .env file'}`);
  if (process.env.REMOVE_BG_API_KEY) {
    console.log(`   Remove BG Key Length: ${process.env.REMOVE_BG_API_KEY.length} chars`);
    console.log(`   Remove BG Key Preview: ${process.env.REMOVE_BG_API_KEY.substring(0, 8)}...`);
  }
  if (process.env.WEB3FORMS_API_KEY) {
    console.log(`   Web3Forms Key Preview: ${process.env.WEB3FORMS_API_KEY.substring(0, 8)}...`);
  }
  console.log(`   Port: ${PORT}`);
  console.log(`\n💡 Keep this terminal open while developing!\n`);
});