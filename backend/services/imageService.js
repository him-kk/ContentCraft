const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────
//  AWS Clients
// ─────────────────────────────────────────────

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// S3 uses ap-south-1 (Mumbai) — separate from Bedrock region
const S3_REGION = process.env.AWS_S3_REGION || process.env.AWS_REGION || 'ap-south-1';

const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────

const S3_BUCKET = process.env.AWS_S3_BUCKET;

// Image generation model (Amazon Titan)
const IMAGE_MODEL_ID = 'amazon.titan-image-generator-v2:0';

// Text-only model — Llama 3 8B
const TEXT_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'meta.llama3-8b-instruct-v1:0';

// Vision model — Llama 3.2 11B Vision
const VISION_MODEL_ID = 'us.meta.llama3-2-11b-instruct-v1:0';

const SIZE_MAP = {
  '1024x1024': { width: 1024, height: 1024 },
  '1792x1024': { width: 1792, height: 1024 },
  '1024x1792': { width: 1024, height: 1792 },
  '1280x720':  { width: 1280, height: 720  },
  '720x1280':  { width: 720,  height: 1280 },
};

// Presigned URL expiry — 7 days (max for IAM user credentials)
const PRESIGNED_URL_EXPIRY = 60 * 60 * 24 * 7;

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

/**
 * Upload buffer to S3 (private object) and return a presigned URL.
 * No bucket policy or ACL changes needed — works with default S3 settings.
 */
async function uploadBufferToS3(buffer, folder = 'ai-generated') {
  const key = `${folder}/${uuidv4()}.png`;

  // Upload the object (private by default — no ACL needed)
  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    })
  );

  // Generate a presigned URL so the frontend can display it
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
    { expiresIn: PRESIGNED_URL_EXPIRY }
  );

  return { key, url };
}

/**
 * Call Bedrock Titan Image Generator with a text prompt.
 * Returns an array of base64-encoded PNG strings.
 */
async function bedrockGenerateImages(prompt, count = 1, width = 1024, height = 1024) {
  const safeCount = Math.min(count, 4);

  const payload = {
    taskType: 'TEXT_IMAGE',
    textToImageParams: { text: prompt },
    imageGenerationConfig: {
      numberOfImages: safeCount,
      width,
      height,
      quality: 'standard',
      cfgScale: 8.0,
    },
  };

  const command = new InvokeModelCommand({
    modelId: IMAGE_MODEL_ID,
    body: JSON.stringify(payload),
    contentType: 'application/json',
    accept: 'application/json',
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(Buffer.from(response.body).toString('utf8'));
  return result.images || [];
}

/**
 * Call Llama 3 8B on Bedrock for text-only tasks.
 * Uses proper Llama 3 chat template format.
 */
async function bedrockGenerateText(prompt, systemPrompt = '') {
  const formattedPrompt = systemPrompt
    ? `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`
    : `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;

  const payload = {
    prompt: formattedPrompt,
    max_gen_len: 1024,
    temperature: 0.1,
  };

  const command = new InvokeModelCommand({
    modelId: TEXT_MODEL_ID,
    body: JSON.stringify(payload),
    contentType: 'application/json',
    accept: 'application/json',
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(Buffer.from(response.body).toString('utf8'));
  return (result.generation || result.output || '').trim();
}

/**
 * Call Llama 3.2 Vision on Bedrock for image + text tasks.
 */
async function bedrockGenerateTextWithImage(base64Image, mimeType, textPrompt) {
  const payload = {
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: textPrompt,
          },
        ],
      },
    ],
    max_tokens: 1024,
    temperature: 0.1,
  };

  const command = new InvokeModelCommand({
    modelId: VISION_MODEL_ID,
    body: JSON.stringify(payload),
    contentType: 'application/json',
    accept: 'application/json',
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(Buffer.from(response.body).toString('utf8'));
  return (
    result.choices?.[0]?.message?.content ||
    result.generation ||
    result.output ||
    ''
  ).trim();
}

/**
 * Download a remote image and return base64 string + MIME type + buffer.
 */
async function downloadImageAsBase64(url) {
  const axios = require('axios');
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
  const mimeType = (response.headers['content-type'] || 'image/jpeg').split(';')[0].trim();
  return { base64: buffer.toString('base64'), mimeType, buffer };
}

// ─────────────────────────────────────────────
//  ImageService
// ─────────────────────────────────────────────

class ImageService {
  // ── Generate image from a text prompt ──────────────────────────────────────

  async generateImage(options = {}) {
    const { prompt, size = '1024x1024', n = 1 } = options;
    const { width, height } = SIZE_MAP[size] || SIZE_MAP['1024x1024'];

    try {
      const base64Images = await bedrockGenerateImages(prompt, n, width, height);

      const images = await Promise.all(
        base64Images.map(async (base64, index) => {
          const buffer = Buffer.from(base64, 'base64');
          const { key, url } = await uploadBufferToS3(buffer, 'ai-generated');
          return { url, key, revisedPrompt: prompt, index: index + 1 };
        })
      );

      return {
        success: true,
        images,
        metadata: { model: IMAGE_MODEL_ID, size, prompt },
      };
    } catch (error) {
      logger.error('Image generation error:', error);
      return { success: false, error: error.message };
    }
  }

  // ── Generate variations of an existing image ────────────────────────────────

  async generateVariations(imageUrl, n = 4) {
    try {
      const { base64, mimeType } = await downloadImageAsBase64(imageUrl);

      const variationPrompt = await bedrockGenerateTextWithImage(
        base64,
        mimeType,
        `Describe this image in rich detail so that a text-to-image model can reproduce visually similar variations.
Focus on: subject, style, colors, composition, lighting, mood, and background.
Respond with ONLY the description, no extra explanation.`
      );

      const base64Images = await bedrockGenerateImages(variationPrompt, n, 1024, 1024);

      const images = await Promise.all(
        base64Images.map(async (b64, index) => {
          const buffer = Buffer.from(b64, 'base64');
          const { key, url } = await uploadBufferToS3(buffer, 'ai-variations');
          return { url, key, index: index + 1 };
        })
      );

      return { success: true, images };
    } catch (error) {
      logger.error('Variation generation error:', error);
      return { success: false, error: error.message };
    }
  }

  // ── Edit an image by applying a text instruction ─────────────────────────────

  async editImage(imageUrl, _maskUrl, prompt, n = 1) {
    try {
      const { base64, mimeType } = await downloadImageAsBase64(imageUrl);

      const editedPrompt = await bedrockGenerateTextWithImage(
        base64,
        mimeType,
        `You are an expert image prompt engineer.
Given this image and the edit instruction below, write a single detailed text-to-image prompt
that recreates the image WITH the requested edit applied. Preserve everything else.
Edit instruction: "${prompt}"
Respond with ONLY the new image generation prompt, no extra explanation.`
      );

      const base64Images = await bedrockGenerateImages(editedPrompt, n, 1024, 1024);

      const images = await Promise.all(
        base64Images.map(async (b64, index) => {
          const buffer = Buffer.from(b64, 'base64');
          const { key, url } = await uploadBufferToS3(buffer, 'ai-edited');
          return { url, key, index: index + 1 };
        })
      );

      return { success: true, images };
    } catch (error) {
      logger.error('Image edit error:', error);
      return { success: false, error: error.message };
    }
  }

  // ── Generate image from long-form content ────────────────────────────────────

  async generateFromContent(content, options = {}) {
    const { platform = 'blog', style = 'photorealistic', count = 1, size = '1024x1024' } = options;

    try {
      const imagePrompt = await bedrockGenerateText(
        `Create a detailed image generation prompt based on the content below.
The image must be suitable for: ${platform}
Visual style: ${style}
Respond with ONLY the image prompt, no explanations.

Content:
${content.substring(0, 1000)}`,
        'You are an expert image prompt engineer. Respond with ONLY the image prompt, nothing else.'
      );

      return await this.generateImage({ prompt: imagePrompt, size, n: count });
    } catch (error) {
      logger.error('Content-to-image error:', error);
      return { success: false, error: error.message };
    }
  }

  // ── Suggest image prompts for given content ──────────────────────────────────

  async suggestPrompt(content, platform = 'blog', style = 'photorealistic') {
    try {
      const responseText = await bedrockGenerateText(
        `Create 3 different image generation prompts for the content below. Each should take a different visual approach.
Platform: ${platform}
Style: ${style}

Content:
${content.substring(0, 1000)}

Respond with exactly 3 prompts, each on its own numbered line (1. 2. 3.). No extra explanation.`,
        'You are an expert at creating image generation prompts. Respond with ONLY 3 numbered prompts, nothing else.'
      );

      const prompts = responseText
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 20)
        .slice(0, 3);

      return { success: true, prompts, platform, style };
    } catch (error) {
      logger.error('Prompt suggestion error:', error);
      return { success: false, error: error.message };
    }
  }

  // ── Delete an image from S3 ──────────────────────────────────────────────────

  async deleteImage(s3Key) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: s3Key })
      );
      return { success: true, key: s3Key };
    } catch (error) {
      logger.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }

  // ── Get basic metadata for an S3 object ─────────────────────────────────────

  async getImageInfo(s3Key) {
    try {
      const response = await s3Client.send(
        new HeadObjectCommand({ Bucket: S3_BUCKET, Key: s3Key })
      );

      // Also return a fresh presigned URL for the image
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }),
        { expiresIn: PRESIGNED_URL_EXPIRY }
      );

      return {
        success: true,
        info: {
          key: s3Key,
          url,
          size: response.ContentLength,
          contentType: response.ContentType,
          lastModified: response.LastModified,
        },
      };
    } catch (error) {
      logger.error('Get image info error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ImageService();