// api/extract-data.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from 'formidable';
import fs from 'fs';

// Initialize the GoogleGenerativeAI instance with your API key
const genAI = new GoogleGenerativeAI('AIzaSyALrRXzms00PQ_FGsXacDKFIvtfa68yeNg');

// Ensure Vercel will parse the request body
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Parse the incoming form data
    const form = new formidable.IncomingForm();
    form.uploadDir = "./";
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing form data" });
      }

      try {
        if (!files.image) {
          return res.status(400).json({ error: "No image uploaded" });
        }

        const prompt = "Extract data from the image...";
        const imageData = fs.readFileSync(files.image[0].filepath, 'base64'); // Read image file as base64
        const mimeType = files.image[0].mimetype;

        const imageParts = [{
          inlineData: {
            data: imageData,
            mimeType,
          },
        }];

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ data: text });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
