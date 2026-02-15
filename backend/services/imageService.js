const OpenAI = require('openai');
const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class ImageService {
  // Generate image with DALL-E 3
  async generateImage(options) {
    const {
      prompt,
      size = '1024x1024',
      quality = 'standard',
      style = 'vivid',
      n = 1,
    } = options;

    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size,
        quality,
        style,
        n,
      });

      const images = await Promise.all(
        response.data.map(async (image, index) => {
          // Upload to Cloudinary for permanent storage
          const uploadResult = await this.uploadToCloudinary(image.url, {
            folder: 'ai-generated',
            tags: ['ai-generated', 'dall-e-3'],
          });

          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            revisedPrompt: image.revised_prompt,
            index: index + 1,
          };
        })
      );

      return {
        success: true,
        images,
        metadata: {
          model: 'dall-e-3',
          size,
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

  // Generate image variations
  async generateVariations(imageUrl, n = 4) {
    try {
      // Download image and create variations
      const response = await openai.images.createVariation({
        image: await this.downloadImage(imageUrl),
        n,
        size: '1024x1024',
      });

      const images = await Promise.all(
        response.data.map(async (image, index) => {
          const uploadResult = await this.uploadToCloudinary(image.url, {
            folder: 'ai-variations',
          });

          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            index: index + 1,
          };
        })
      );

      return {
        success: true,
        images,
      };
    } catch (error) {
      logger.error('Variation generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Edit image with DALL-E
  async editImage(imageUrl, maskUrl, prompt, n = 1) {
    try {
      const response = await openai.images.edit({
        image: await this.downloadImage(imageUrl),
        mask: maskUrl ? await this.downloadImage(maskUrl) : undefined,
        prompt,
        n,
        size: '1024x1024',
      });

      const images = await Promise.all(
        response.data.map(async (image, index) => {
          const uploadResult = await this.uploadToCloudinary(image.url, {
            folder: 'ai-edited',
          });

          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            index: index + 1,
          };
        })
      );

      return {
        success: true,
        images,
      };
    } catch (error) {
      logger.error('Image edit error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate image from content
  async generateFromContent(content, options = {}) {
    const { platform = 'blog', style = 'photorealistic', count = 1 } = options;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

  // Suggest image prompt
  async suggestPrompt(content, platform = 'blog', style = 'photorealistic') {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating DALL-E image prompts. Create detailed, vivid prompts that generate high-quality images.',
          },
          {
            role: 'user',
            content: `Create an image prompt for this content:
Platform: ${platform}
Style: ${style}

Content: ${content.substring(0, 1000)}

Provide 3 different prompt options, each optimized for different visual approaches.`,
          },
        ],
        temperature: 0.8,
      });

      const prompts = response.choices[0].message.content
        .split(/\n\n|\d+\./)
        .map(p => p.trim())
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

  // Download image for processing
  async downloadImage(url) {
    const axios = require('axios');
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
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