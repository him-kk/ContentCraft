const { GoogleGenerativeAI } = require('@google/generative-ai');
const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class ImageService {
  // Generate images via Gemini 3.1 Flash Image preview API.
  // Returns an array of { image: { imageBytes: '<base64>' } } objects
  // to keep the rest of the class compatible.
  async _imagenGenerate(prompt, numberOfImages, _aspectRatio) {
    const axios = require('axios');
   const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent';

    const count = Math.min(numberOfImages, 4);

    // Fire `count` parallel requests (each call returns one image)
    const requests = Array.from({ length: count }, () =>
      axios.post(
        url,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        },
        {
          params: { key: process.env.GEMINI_API_KEY },
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    const responses = await Promise.all(requests);

    // Extract inline image parts from each response
    const results = [];
    for (const res of responses) {
      const parts = res.data?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          results.push({ image: { imageBytes: part.inlineData.data } });
        }
      }
    }
    return results;
  }

  // Generate image with Imagen 3
  async generateImage(options) {
    const {
      prompt,
      size = '1024x1024',
      quality = 'standard',
      style = 'vivid',
      n = 1,
    } = options;

    const aspectRatioMap = {
      '1024x1024': '1:1',
      '1792x1024': '16:9',
      '1024x1792': '9:16',
      '1280x720':  '16:9',
      '720x1280':  '9:16',
    };
    const aspectRatio = aspectRatioMap[size] || '1:1';

    try {
      const generatedImages = await this._imagenGenerate(prompt, n, aspectRatio);

      const images = await Promise.all(
        generatedImages.map(async (generatedImage, index) => {
          const imgBuffer = Buffer.from(generatedImage.image.imageBytes, 'base64');
          const uploadResult = await this.uploadBuffer(imgBuffer, {
            folder: 'ai-generated',
            tags: ['ai-generated', 'gemini-flash'],
          });

          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            revisedPrompt: prompt,
            index: index + 1,
          };
        })
      );

      return {
        success: true,
        images,
        metadata: {
          model: 'gemini-3.1-flash-image-preview',
          size,
          aspectRatio,
          quality,
          style,
          prompt,
        },
      };
    } catch (error) {
      logger.error('Image generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate image variations using Gemini Vision + Imagen 3
  async generateVariations(imageUrl, n = 4) {
    try {
      const visionModel = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' });
      const imageData = await this.downloadImageAsBase64(imageUrl);

      const descriptionResult = await visionModel.generateContent([
        { inlineData: { data: imageData.base64, mimeType: imageData.mimeType } },
        'Describe this image in rich detail to create a prompt for generating visually similar variations. Focus on style, subject, colors, composition, lighting, and mood.',
      ]);
      const variationPrompt = descriptionResult.response.text();

      const generatedImages = await this._imagenGenerate(variationPrompt, n, '1:1');

      const images = await Promise.all(
        generatedImages.map(async (generatedImage, index) => {
          const imgBuffer = Buffer.from(generatedImage.image.imageBytes, 'base64');
          const uploadResult = await this.uploadBuffer(imgBuffer, { folder: 'ai-variations' });
          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            index: index + 1,
          };
        })
      );

      return { success: true, images };
    } catch (error) {
      logger.error('Variation generation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Edit image using Gemini Vision understanding + Imagen 3 generation
  async editImage(imageUrl, maskUrl, prompt, n = 1) {
    try {
      const visionModel = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' });
      const imageData = await this.downloadImageAsBase64(imageUrl);

      const editPromptResult = await visionModel.generateContent([
        { inlineData: { data: imageData.base64, mimeType: imageData.mimeType } },
        `Based on this image, write a detailed image generation prompt that applies the following edit while preserving all other aspects: "${prompt}". Respond with ONLY the prompt.`,
      ]);
      const editedPrompt = editPromptResult.response.text();

      const generatedImages = await this._imagenGenerate(editedPrompt, n, '1:1');

      const images = await Promise.all(
        generatedImages.map(async (generatedImage, index) => {
          const imgBuffer = Buffer.from(generatedImage.image.imageBytes, 'base64');
          const uploadResult = await this.uploadBuffer(imgBuffer, { folder: 'ai-edited' });
          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            index: index + 1,
          };
        })
      );

      return { success: true, images };
    } catch (error) {
      logger.error('Image edit error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate image from content
  async generateFromContent(content, options = {}) {
    const { platform = 'blog', style = 'photorealistic', count = 1 } = options;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' });

      // First, generate an image prompt from the content
      const promptResult = await model.generateContent(
        `Create a detailed image generation prompt based on this content. 
The image should be suitable for ${platform}.
Style: ${style}

Content: ${content.substring(0, 1000)}

Respond with ONLY the image prompt, no explanations.`
      );

      const imagePrompt = promptResult.response.text();

      // Generate the image
      return await this.generateImage({
        prompt: imagePrompt,
        ...options,
        n: count,
      });
    } catch (error) {
      logger.error('Content-to-image error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Suggest image prompt using Gemini
  async suggestPrompt(content, platform = 'blog', style = 'photorealistic') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent(
        `You are an expert at creating image generation prompts. Create detailed, vivid prompts that generate high-quality images.

Create 3 different image prompts for this content. Each prompt should be optimized for a different visual approach.
Platform: ${platform}
Style: ${style}

Content: ${content.substring(0, 1000)}

Respond with exactly 3 prompts, each on its own numbered line (1. 2. 3.). No extra explanation.`
      );

      const responseText = result.response.text();
      const prompts = responseText
        .split(/\n/)
        .map(p => p.replace(/^\d+\.\s*/, '').trim())
        .filter(p => p.length > 20);

      return {
        success: true,
        prompts: prompts.slice(0, 3),
        content,
        platform,
        style,
      };
    } catch (error) {
      logger.error('Prompt suggestion error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload to Cloudinary
  async uploadToCloudinary(imageUrl, options = {}) {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: options.folder || 'contentcraft',
        tags: options.tags || [],
        ...options,
      });

      return result;
    } catch (error) {
      logger.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  // Upload from buffer (for direct uploads)
  async uploadBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'contentcraft',
          tags: options.tags || [],
          ...options,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Download image for processing (returns Buffer)
  async downloadImage(url) {
    const axios = require('axios');
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  }

  // Download image as base64 for Gemini Vision
  async downloadImageAsBase64(url) {
    const axios = require('axios');
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const mimeType = contentType.split(';')[0].trim();
    return {
      base64: buffer.toString('base64'),
      mimeType,
    };
  }

  // Remove background using Cloudinary
  async removeBackground(publicId) {
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [
          {
            background_removal: 'cloudinary_ai',
          },
        ],
      });

      return {
        success: true,
        url: result.eager[0].secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      logger.error('Background removal error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upscale image
  async upscaleImage(publicId, scale = 2) {
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [
          {
            width: scale === 2 ? 2048 : 4096,
            height: scale === 2 ? 2048 : 4096,
            crop: 'scale',
            quality: 'auto:best',
          },
        ],
      });

      return {
        success: true,
        url: result.eager[0].secure_url,
        publicId: result.public_id,
        scale,
      };
    } catch (error) {
      logger.error('Upscale error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Apply filters and effects
  async applyEffects(publicId, effects = []) {
    try {
      const transformation = effects.map(effect => {
        switch (effect.type) {
          case 'brightness':
            return { effect: `brightness:${effect.value}` };
          case 'contrast':
            return { effect: `contrast:${effect.value}` };
          case 'saturation':
            return { effect: `saturation:${effect.value}` };
          case 'blur':
            return { effect: `blur:${effect.value}` };
          case 'sharpen':
            return { effect: 'sharpen' };
          case 'grayscale':
            return { effect: 'grayscale' };
          case 'sepia':
            return { effect: 'sepia' };
          case 'vignette':
            return { effect: 'vignette' };
          default:
            return {};
        }
      });

      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: transformation,
      });

      return {
        success: true,
        url: result.eager[result.eager.length - 1].secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      logger.error('Effect application error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Crop image
  async cropImage(publicId, cropOptions) {
    const { x, y, width, height, gravity = 'center' } = cropOptions;

    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [
          {
            x,
            y,
            width,
            height,
            crop: 'crop',
            gravity,
          },
        ],
      });

      return {
        success: true,
        url: result.eager[0].secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      logger.error('Crop error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Resize image
  async resizeImage(publicId, width, height, options = {}) {
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [
          {
            width,
            height,
            crop: options.crop || 'fit',
            quality: options.quality || 'auto',
          },
        ],
      });

      return {
        success: true,
        url: result.eager[0].secure_url,
        publicId: result.public_id,
        dimensions: { width, height },
      };
    } catch (error) {
      logger.error('Resize error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Add text overlay
  async addTextOverlay(publicId, text, options = {}) {
    const {
      font = 'Arial',
      fontSize = 40,
      color = 'white',
      position = 'center',
      background = 'black',
      opacity = 50,
    } = options;

    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [
          {
            overlay: {
              font_family: font,
              font_size: fontSize,
              text: encodeURIComponent(text),
              font_color: color,
            },
            gravity: position,
            background: background,
            opacity: opacity,
          },
        ],
      });

      return {
        success: true,
        url: result.eager[0].secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      logger.error('Text overlay error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete image
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        result,
      };
    } catch (error) {
      logger.error('Delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get image info
  async getImageInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        success: true,
        info: {
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
          createdAt: result.created_at,
          tags: result.tags,
          url: result.secure_url,
        },
      };
    } catch (error) {
      logger.error('Get info error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new ImageService();