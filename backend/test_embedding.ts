import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function testEmbedding() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key");
    return;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: "Hello world",
      config: { outputDimensionality: 768 }
    });
    
    const embed = response.embeddings?.[0]?.values;
    console.log(`Success text-embedding-004: Length = ${embed?.length}`);
  } catch (err: any) {
    console.log("Failed text-embedding-004:", err.message);
  }

  try {
    const response2 = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: "Hello world",
      config: { outputDimensionality: 768 }
    });
    
    const embed2 = response2.embeddings?.[0]?.values;
    console.log(`Success gemini-embedding-001: Length = ${embed2?.length}`);
  } catch (err: any) {
    console.error("Failed:", err.message);
  }
}
testEmbedding();
