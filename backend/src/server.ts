import 'dotenv/config';
import express from 'express';
import { identifyPlantFromImage } from './aiService';
import * as path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.send('Plant Care AI Server is live! (Node/TS Backend)');
});

// API route to identify the plant from a mock image
app.get('/api/identify-plant', async (req, res) => {
  try {    
    // Define the path to a mock image for testing
    const mockImagePath = path.join(__dirname, 'mock-plant.jpg'); 
    const mimeType = 'image/jpeg'; 

    console.log(`[AI] Requesting identification for: ${mockImagePath}`);
    
    // Call the AI service function
    const aiResult = await identifyPlantFromImage(mockImagePath, mimeType);

    // Send the successful response
    res.json({
        success: true,
        query: "Plant Identification by Image",
        result: aiResult
    });

  } catch (error) {
    // Log the error and send a 500 response
    console.error('Error in plant identification:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Error processing the AI request.', 
        error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  if (process.env.GEMINI_API_KEY) {
      console.log('Gemini API Key loaded successfully.');
  } else {
      console.error('ERROR: The Gemini API Key WAS NOT loaded! Check the .env file.');
  }
});