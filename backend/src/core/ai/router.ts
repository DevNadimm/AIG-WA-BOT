import { generateStructuredContent } from './gemini.js';
import { logger } from '../../app.js';
import { Type, Schema } from '@google/genai';
import { promptResolver, modelResolver } from './resolvers.js';

interface IntentDetectionResult {
  intent: string;
  confidence: number;
}

export async function detectIntent(userMessage: string, organizationId: string): Promise<IntentDetectionResult | null> {
  logger.info(`Detecting intent for message: "${userMessage}"`);

  try {
    // 1. Get Router Model Config
    const modelConfig = await modelResolver.resolve('ROUTER');

    // 2. Build the router prompt
    const prompt = await promptResolver.resolve('ROUTER');
    const finalPrompt = `${prompt}\n\nUser Message: "${userMessage}"`;

    // 3. Define the expected JSON Schema
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          description: 'The slug of the identified intent',
        },
        confidence: {
          type: Type.NUMBER,
          description: 'Confidence score between 0.0 and 1.0',
        }
      },
      required: ['intent', 'confidence'],
    };

    // 4. Call Gemini
    const result = await generateStructuredContent(
      finalPrompt,
      modelConfig.name,
      schema,
      modelConfig.temperature
    );
    
    if (result === null) {
      // If generateStructuredContent returns null, it means the API failed (e.g., 429 Rate Limit)
      logger.error('Gemini API returned null (likely an API error). Routing to api_error.');
      return { intent: 'api_error', confidence: 0.0 };
    }
    
    if (result && result.intent) {
      logger.info(`Detected intent: ${result.intent} (Confidence: ${result.confidence})`);
      return result as IntentDetectionResult;
    }
    
    return { intent: 'fallback', confidence: 1.0 };

  } catch (error) {
    logger.error({ err: error }, 'Error during intent detection');
    return { intent: 'api_error', confidence: 0.0 };
  }
}
