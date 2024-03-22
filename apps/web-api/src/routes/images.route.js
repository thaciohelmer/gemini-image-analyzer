import express from "express";
import GeminiAiService from "../services/gemini-ai.service.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  const { url } = req.body;

  try {
    const result = await GeminiAiService.generateContent(url);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
