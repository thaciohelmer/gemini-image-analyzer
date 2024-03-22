import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { Buffer } from "buffer";
import process from "process";

const MODEL_NAME = "gemini-pro-vision";
const API_KEY = process.env.GEMINI_API_KEY;

const genAi = new GoogleGenerativeAI(API_KEY);
const model = genAi.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

export default class GeminiAiService {
  static async generateContent(url) {
    if (API_KEY === undefined) {
      throw new Error("API_KEY is not defined");
    }

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];

    const imageData = Buffer.from(response.data).toString("base64");

    const parts = [
      { text: "Describe this imagem. Answer in portuguese." },
      {
        inlineData: {
          mimeType: contentType,
          data: imageData,
        },
      },
    ];

    const generatedContent = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    const result = generatedContent.response;
    return result.text();
  }
}
