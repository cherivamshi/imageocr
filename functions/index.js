const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // Set a file size limit of 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

app.use(cors());

function imageToGenerativePart(imageData, mimeType) {
  return {
    inlineData: {
      data: imageData.toString("base64"),
      mimeType,
    },
  };
}

app.post("/extract-data", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const prompt = "extract data in the image and send it to the Gemini API for organization in json format remove any \\n or \\ in the json, have the products related data in one object and rest of the data in another other object. add the total amount from the products object and send it in amount object";

    const imageParts = [
      imageToGenerativePart(req.file.buffer, req.file.mimetype),
    ];

    const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    res.json({ data: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

exports.api = functions.https.onRequest(app);
