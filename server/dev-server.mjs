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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'POST /api/remove-background',
      'GET /api/health'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📍 Remove Background: POST http://localhost:${PORT}/api/remove-background`);
  console.log(`❤️  Health Check: GET http://localhost:${PORT}/api/health`);
  console.log(`\n⚙️  Environment:`);
  console.log(`   Working Directory: ${process.cwd()}`);
  console.log(`   .env Path: ${join(__dirname, '..', '.env')}`);
  console.log(`   API Key: ${process.env.REMOVE_BG_API_KEY ? '✅ Loaded' : '❌ Missing - Check .env file'}`);
  if (process.env.REMOVE_BG_API_KEY) {
    console.log(`   API Key Length: ${process.env.REMOVE_BG_API_KEY.length} chars`);
    console.log(`   API Key Preview: ${process.env.REMOVE_BG_API_KEY.substring(0, 8)}...`);
  }
  console.log(`   Port: ${PORT}`);
  console.log(`\n💡 Keep this terminal open while developing!\n`);
});