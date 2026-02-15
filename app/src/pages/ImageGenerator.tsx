import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Wand2,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Sparkles,
  Palette,
  Maximize,
  ChevronRight,
  Settings,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { aiApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const styleOptions = [
  { value: 'photorealistic', label: 'Photorealistic', icon: Image },
  { value: 'artistic', label: 'Artistic', icon: Palette },
  { value: '3d', label: '3D Render', icon: Maximize },
  { value: 'illustration', label: 'Illustration', icon: Star },
  { value: 'minimalist', label: 'Minimalist', icon: Settings },
];

const aspectRatioOptions = [
  { value: '1:1', label: 'Square (1:1)', dimensions: '1024x1024' },
  { value: '16:9', label: 'Widescreen (16:9)', dimensions: '1792x1024' },
  { value: '9:16', label: 'Portrait (9:16)', dimensions: '1024x1792' },
];

const mockGeneratedImages = [
  {
    id: '1',
    prompt: 'A futuristic cityscape at sunset with flying cars and neon lights',
    style: 'artistic',
    aspectRatio: '16:9',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    prompt: 'Minimalist logo design for a tech startup, clean and modern',
    style: '3d',
    aspectRatio: '1:1',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop',
    createdAt: '5 hours ago',
  },
  {
    id: '3',
    prompt: 'Professional business meeting in a modern office',
    style: 'photorealistic',
    aspectRatio: '1:1',
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
    createdAt: '1 day ago',
  },
  {
    id: '4',
    prompt: 'Abstract geometric patterns in blue and purple gradient',
    style: 'artistic',
    aspectRatio: '1:1',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=800&fit=crop',
    createdAt: '2 days ago',
  },
];

const promptSuggestions = [
  'A serene mountain landscape at sunrise with misty valleys',
  'Modern abstract art with bold colors and geometric shapes',
  'Professional headshot of a confident business person',
  'Cute cartoon character for a children\'s app',
  'Elegant product photography of a luxury watch',
  'Vibrant street art mural in an urban setting',
];

export default function ImageGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState(mockGeneratedImages);
  const [selectedImage, setSelectedImage] = useState<typeof mockGeneratedImages[0] | null>(null);
  const [activeTab, setActiveTab] = useState('generate');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Map aspect ratio to size format expected by backend
      const sizeMap: Record<string, string> = {
        '1:1': '1024x1024',
        '16:9': '1792x1024',
        '9:16': '1024x1792',
      };
      
      // Call the actual API
      const response = await aiApi.generateImage({
        prompt: prompt,
        style: selectedStyle,
        size: sizeMap[selectedRatio] || '1024x1024',
      });

      const result = response.data.data;
      
      // Handle the response - the backend returns { images: [...], metadata: {...} }
      let imageUrl = '';
      
      if (result.images && Array.isArray(result.images) && result.images.length > 0) {
        // Response has images array
        imageUrl = result.images[0].url;
      } else if ((result as any).url) {
        // Fallback: response has url directly
        imageUrl = (result as any).url;
      } else {
        throw new Error('No image URL in response');
      }
    
      if (!imageUrl) {
        throw new Error('Invalid image URL received');
      }
      
      // Create new image entry from API response
      const newImage = {
        id: Date.now().toString(),
        prompt: prompt,
        style: selectedStyle,
        aspectRatio: selectedRatio,
        url: imageUrl,
        createdAt: 'Just now',
      };
      
      setGeneratedImages([newImage, ...generatedImages]);
      setActiveTab('gallery');
      setPrompt(''); // Clear prompt after successful generation
      
      toast({
        title: 'Success',
        description: 'Image generated successfully',
      });
      
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to generate image',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Prompt copied to clipboard',
    });
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.substring(0, 50)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Success',
        description: 'Image downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">AI Image Generator</h1>
          <p className="text-zinc-500">Create stunning images with DALL-E 3.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700 w-fit">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by DALL-E 3
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="gallery">Gallery ({generatedImages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Generation Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wand2 className="w-5 h-5 text-purple-600" />
                    Describe Your Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prompt Input */}
                  <div>
                    <label className="text-sm font-medium text-zinc-700 mb-2 block">
                      Prompt
                    </label>
                    <Textarea
                      placeholder="Describe the image you want to create..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                      Be specific and descriptive for best results. Include details about style, lighting, and composition.
                    </p>
                  </div>

                  {/* Settings */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-zinc-700 mb-2 block">
                        Style
                      </label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {styleOptions.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              <div className="flex items-center gap-2">
                                <style.icon className="w-4 h-4" />
                                {style.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-700 mb-2 block">
                        Aspect Ratio
                      </label>
                      <Select value={selectedRatio} onValueChange={setSelectedRatio}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          {aspectRatioOptions.map((ratio) => (
                            <SelectItem key={ratio.value} value={ratio.value}>
                              {ratio.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Prompt Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prompt Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {promptSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-zinc-200 py-2 px-3"
                        onClick={() => setPrompt(suggestion)}
                      >
                        {suggestion}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tips Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Better Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Be Specific',
                        description: 'Include details about colors, lighting, and mood.',
                      },
                      {
                        title: 'Mention Style',
                        description: 'Specify art style like "digital art", "photorealistic", or "oil painting".',
                      },
                      {
                        title: 'Add Context',
                        description: 'Describe the setting, time of day, and atmosphere.',
                      },
                      {
                        title: 'Use References',
                        description: 'Mention specific artists or styles for inspiration.',
                      },
                    ].map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-purple-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{tip.title}</p>
                          <p className="text-sm text-zinc-500">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          {generatedImages.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Image className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">No images yet</h3>
                <p className="text-zinc-500 mb-4">Generate your first AI image to get started</p>
                <Button onClick={() => setActiveTab('generate')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Image
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {generatedImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden group cursor-pointer" onClick={() => setSelectedImage(image)}>
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary">
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-zinc-700 line-clamp-2 mb-2">{image.prompt}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {image.style}
                          </Badge>
                          <span className="text-xs text-zinc-500">{image.createdAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>Generated Image</DialogTitle>
                <DialogDescription>
                  {selectedImage.prompt}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="w-full rounded-lg"
                />
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="capitalize">
                    {selectedImage.style}
                  </Badge>
                  <Badge variant="outline">
                    {selectedImage.aspectRatio}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleDownload(selectedImage.url, selectedImage.prompt)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => handleCopyPrompt(selectedImage.prompt)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}