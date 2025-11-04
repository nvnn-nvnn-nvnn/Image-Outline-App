 import dotenv from 'dotenv';
   dotenv.config();
   
   console.log('API Key loaded:', process.env.REMOVE_BG_API_KEY ? 'Yes' : 'No');
   console.log('Port from env:', process.env.PORT || 'Not set');