import { GoogleGenAI } from '@google/genai';
import { logger } from '../../app.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4
].filter(Boolean) as string[];

let currentKeyIndex = 0;
export let aiClient = new GoogleGenAI({ apiKey: apiKeys[0] || '' });

if (apiKeys.length === 0) {
  logger.warn('No GEMINI_API_KEY found. AI routing and generation will fail.');
}

async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  let attempt = 0;
  while (attempt < apiKeys.length) {
    try {
      return await operation();
    } catch (error: any) {
      logger.warn(`API Key ${currentKeyIndex + 1} failed with error ${error?.status || 'unknown'}. Switching key...`);
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      aiClient = new GoogleGenAI({ apiKey: apiKeys[currentKeyIndex] });
      attempt++;
      if (attempt === apiKeys.length) {
          throw new Error('All API keys have been exhausted or failed.');
      }
    }
  }
  throw new Error('All API keys have been exhausted/rate limited.');
}

/**
 * Helper to generate structured JSON using Gemini
 */
export async function generateStructuredContent(
  prompt: string, 
  modelName: string, 
  responseSchema: any, 
  temperature: number = 0.1, 
  maxOutputTokens?: number
) {
  try {
    const response = await withRetry(() => aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature,
        ...(maxOutputTokens && { maxOutputTokens })
      }
    }));
    
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    logger.error({ err: error }, 'Failed to generate structured content from Gemini');
    return null;
  }
}

/**
 * Helper to generate content with tools (Function Calling)
 */
export async function generateWithTools(
  prompt: string, 
  modelName: string, 
  tools: any[],
  temperature: number = 0.2,
  maxOutputTokens?: number
) {
  try {
    const response = await withRetry(() => aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: tools,
        temperature,
        ...(maxOutputTokens && { maxOutputTokens })
      }
    }));
    
    return {
      text: response.text,
      functionCalls: response.functionCalls,
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to generate content with tools from Gemini');
    return null;
  }
}

/**
 * Helper to generate content in an agentic loop (Conversation History + Tools)
 */
export async function generateAgenticResponse(
  contents: any[], 
  modelName: string, 
  tools: any[], 
  systemInstruction: string,
  temperature: number = 0.2,
  maxOutputTokens?: number
) {
  try {
    const config: any = {
      temperature,
      ...(maxOutputTokens && { maxOutputTokens })
    };
    
    if (tools && tools.length > 0) {
      config.tools = tools;
    }
    
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await withRetry(() => aiClient.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    }));
    
    return {
      text: response.text,
      functionCalls: response.functionCalls,
      parts: response.candidates?.[0]?.content?.parts || []
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to generate agentic response from Gemini');
    return null;
  }
}

/**
 * Generates an embedding for a given text.
 */
export async function generateEmbedding(text: string, model: string = 'gemini-embedding-001'): Promise<number[] | null> {
  return await withRetry(async () => {
    try {
      const response = await aiClient.models.embedContent({
        model,
        contents: text,
        config: { outputDimensionality: 768 }
      });
      return response.embeddings?.[0]?.values || null;
    } catch (error) {
      logger.error({ err: error }, 'Failed to generate embedding');
      return null;
    }
  });
}
