const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const logger = require('../utils/logger');

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

// Uses the default AWS credential provider chain (env vars, shared config, IAM role, etc.)
const bedrock = new BedrockRuntimeClient({ region });

//production changes 
// const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");

// const bedrock = new BedrockRuntimeClient({
//   region,
//   requestHandler: new NodeHttpHandler({
//     connectionTimeout: 5000,
//     socketTimeout: 30000,
//   }),
// });

const getTextFromClaudeResponse = (json) => {
  // Claude on Bedrock returns: { content: [{ type: 'text', text: '...' }], ... }
  if (!json || !Array.isArray(json.content)) return '';
  return json.content
    .filter((c) => c && c.type === 'text' && typeof c.text === 'string')
    .map((c) => c.text)
    .join('')
    .trim();
};

const decodeBody = (body) => {
  if (!body) return '';
  // In Node.js SDK v3, body is typically a Uint8Array.
  try {
    // eslint-disable-next-line no-undef
    return new TextDecoder('utf-8').decode(body);
  } catch {
    return Buffer.from(body).toString('utf8');
  }
};

/**
 * Invoke an Anthropic Claude model via Bedrock.
 *
 * Required env:
 * - AWS_REGION (or AWS_DEFAULT_REGION)
 * - BEDROCK_MODEL_ID (example: anthropic.claude-3-haiku-20240307-v1:0)
 */
async function invokeModel({
  modelId,
  system = '',
  prompt,
  temperature = 0.7,
  maxTokens = 1024,
}) {

  let body;

  // ---------- Anthropic Claude ----------
  if (modelId.includes("anthropic")) {
    body = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }]
        }
      ]
    };
  }

  // ---------- Meta Llama ----------
  else if (modelId.includes("llama")) {
    body = {
      prompt: `<s>[INST] ${system ? system + "\n" : ""}${prompt} [/INST]`,
      max_gen_len: maxTokens,
      temperature
    };
  }

  else {
    throw new Error(`Unsupported model provider: ${modelId}`);
  }

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: Buffer.from(JSON.stringify(body))
  });

  const response = await bedrock.send(command);
  const jsonText = decodeBody(response.body);
  const json = JSON.parse(jsonText);

  let text = "";

  // ---------- Parse Claude response ----------
  if (modelId.includes("anthropic")) {
    text = getTextFromClaudeResponse(json);
  }

  // ---------- Parse Llama response ----------
  else if (modelId.includes("llama")) {
    text = json.generation || "";
  }

  return {
    json,
    text: text.trim()
  };
}

/**
 * Generic Bedrock text generation helper.
 * Currently supports Anthropic Claude model IDs.
 */
async function generateTextWithBedrock({
  prompt,
  system,
  temperature,
  maxTokens,
  modelId = process.env.BEDROCK_MODEL_ID,
}) {
  if (!modelId) {
    throw new Error("BEDROCK_MODEL_ID is not set");
  }

  // Support Anthropic Claude models
  if (modelId.includes("anthropic")) {
    console.log(`Invoking Claude model ${modelId}`);
    return invokeModel({ modelId, system, prompt, temperature, maxTokens });
  }

  // Support Meta Llama models
  if (modelId.includes("llama") || modelId.includes("meta")) {
    console.log(`Invoking Llama model ${modelId}`);
    return invokeModel({ modelId, system, prompt, temperature, maxTokens });
  }

  logger.warn(`Unsupported Bedrock modelId for text generation: ${modelId}`);
  throw new Error(`Unsupported Bedrock modelId: ${modelId}`);
}

module.exports = {
  bedrock,
  generateTextWithBedrock,
};
