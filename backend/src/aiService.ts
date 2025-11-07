import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';

// Initialize the GoogleGenAI instance. 
// It automatically looks for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

/**
 * Converts a local file path to a Gemini Part object for the API.
 */
function fileToGenerativePart(path: string, mimeType: string) {
  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

/**
 * Sends a plant image to Gemini and asks for identification and basic care instructions.
 * @param imagePath Local path to the image file
 * @param mimeType MIME type of the image (e.g., 'image/jpeg')
 * @returns AI response about the plant.
 */
export async function identifyPlantFromImage(imagePath: string, mimeType: string): Promise<string> {
  // Convert the local file to a format the Gemini API understands
  const imagePart = fileToGenerativePart(imagePath, mimeType);

  // The prompt requesting identification and care tips
  const prompt = "From this image, identify the plant, its common and scientific name. Also provide 3 short and essential tips on how to care for it (watering, light, and temperature). Answer in Portuguese.";

  // Call the Gemini API
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Multimodal model (text and image)
    contents: [imagePart, prompt],
  });

  // Return the generated text, or an empty string if null/undefined
  return response.text ?? '';
}