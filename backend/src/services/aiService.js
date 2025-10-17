import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

function buildPrompt({ title, bullets, description }) {
  return `You are an expert Amazon listing optimizer.\n\nGiven the following product data:\nTitle: ${title}\nBullet Points: ${Array.isArray(bullets) ? bullets.join(' | ') : bullets}\nDescription: ${description}\n\nGenerate:\n1. A keyword-rich, Amazon-compliant improved title.\n2. 5 rewritten bullet points that are concise and persuasive.\n3. A rewritten description that improves readability and conversion.\n4. 3–5 SEO-relevant keywords for this product.\n\nOutput the result in JSON format with keys: { title, bullets, description, keywords }`;
}

export async function optimizeWithGemini(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('GEMINI_API_KEY not set'), { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(input);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const json = JSON.parse(text);
    const bullets = Array.isArray(json.bullets) ? json.bullets : String(json.bullets || '').split(/\n|\||\-/).map(s => s.trim()).filter(Boolean);
    const keywords = Array.isArray(json.keywords) ? json.keywords : String(json.keywords || '').split(/,|\n|\|/).map(s => s.trim()).filter(Boolean);
    return {
      title: json.title || input.title,
      bullets,
      description: json.description || input.description,
      keywords
    };
  } catch (_e) {
    // Fallback: attempt to extract JSON block via regex
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const j = JSON.parse(match[0]);
        return {
          title: j.title || input.title,
          bullets: Array.isArray(j.bullets) ? j.bullets : [],
          description: j.description || input.description,
          keywords: Array.isArray(j.keywords) ? j.keywords : []
        };
      } catch { /* ignore */ }
    }
    throw Object.assign(new Error('Gemini response parsing failed'), { status: 502 });
  }
}



