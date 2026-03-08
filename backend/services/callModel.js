const { GoogleGenerativeAI } = require('@google/generative-ai');
const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { bedrock } = require('./bedrockClient');
const logger = require('../utils/logger');

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * Extract JSON from text response
 */
function extractJSON(text) {
  if (!text) return null;

  // Strip markdown code fences first
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  // Try direct parse first
  try {
    return JSON.parse(stripped);
  } catch {}

  // Fall back to regex extraction
  try {
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return null;
}

/**
 * Universal model caller
 * Supports Gemini, Claude (Bedrock), and Llama (Bedrock)
 */
async function callModel(prompt, systemPrompt = '') {
  try {
    const modelId = process.env.BEDROCK_MODEL_ID || 'gemini-2.5-flash';

    // ---------------- GEMINI ----------------
    if (modelId.startsWith('gemini')) {
      if (!genAI) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const model = genAI.getGenerativeModel({ model: modelId });

      const finalPrompt = systemPrompt
        ? `${systemPrompt}\n\n${prompt}`
        : prompt;

      const result = await model.generateContent(finalPrompt);
      let responseText = result.response.text();

      // Gemini 2.5 thinking models can return non-string iterables
      if (typeof responseText !== 'string') {
        responseText = JSON.stringify(responseText);
      }

      // Strip any ```json fences Gemini sometimes adds
      responseText = responseText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from Gemini');
      }

      return responseText;
    }

    // ---------------- CLAUDE ----------------
    else if (modelId.includes('claude') || modelId.includes('anthropic')) {

      const body = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      };

      const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: Buffer.from(JSON.stringify(body))
      });

      const response = await bedrock.send(command);

      const parsed = JSON.parse(
        Buffer.from(response.body).toString()
      );

      return parsed?.content?.[0]?.text?.trim() || "";
    }

    // ---------------- LLAMA ----------------
    else if (modelId.includes('llama')) {

      const body = {
        prompt: systemPrompt
          ? `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`
          : `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
        max_gen_len: 2048,
        temperature: 0.1  // Low temp for reliable JSON output
      };

      const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: Buffer.from(JSON.stringify(body))
      });

      const response = await bedrock.send(command);

      const parsed = JSON.parse(
        Buffer.from(response.body).toString()
      );

      const text = parsed.generation || parsed.output || parsed.text || "";

      // Strip any markdown fences Llama sometimes adds
      return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }

    else {
      throw new Error(`Unsupported model: ${modelId}`);
    }

  } catch (error) {
    logger.error('Model Router Error:', error);
    throw error;
  }
}

module.exports = callModel;
module.exports.extractJSON = extractJSON;