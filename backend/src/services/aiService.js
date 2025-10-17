import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.0-flash';
const PROMPT_VERSION = 'v1';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function optimizeListing(original) {
  const { title, bullets, description } = original;
  const model = client.getGenerativeModel({ model: MODEL_NAME });

  const prompt = [
    'You are an Amazon listing optimizer. Improve for readability, compliance, and SEO.',
    'Respond ONLY with JSON keys: optimizedTitle, optimizedBullets, optimizedDescription, keywords.',
    'Constraints: avoid claims/superlatives. Bullets <= 200 chars. US English.',
    `Input JSON: ${JSON.stringify({ title, bullets, description })}`
  ].join('\n');

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    // Attempt to extract JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI response not JSON');
    parsed = JSON.parse(match[0]);
  }

  return {
    optimizedTitle: parsed.optimizedTitle,
    optimizedBullets: parsed.optimizedBullets,
    optimizedDescription: parsed.optimizedDescription,
    keywords: parsed.keywords,
    model: MODEL_NAME,
    promptVersion: PROMPT_VERSION
  };
}



