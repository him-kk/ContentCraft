// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Sparkles,
//   Save,
//   Send,
//   Hash,
//   Type,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   Bold,
//   Italic,
//   Underline,
//   Link,
//   List,
//   ListOrdered,
//   Quote,
//   Code,
//   Wand2,
//   Languages,
//   FileText,
//   Zap,
//   Check,
//   Copy,
//   RotateCcw,
//   BarChart3,
//   BookOpen,
//   X,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';

// const toneOptions = [
//   { value: 'professional', label: 'Professional', icon: FileText },
//   { value: 'casual', label: 'Casual', icon: Type },
//   { value: 'enthusiastic', label: 'Enthusiastic', icon: Zap },
//   { value: 'humorous', label: 'Humorous', icon: Sparkles },
//   { value: 'educational', label: 'Educational', icon: BookOpen },
// ];

// const platformOptions = [
//   { value: 'blog', label: 'Blog Post', maxLength: 5000 },
//   { value: 'twitter', label: 'Twitter/X', maxLength: 280 },
//   { value: 'linkedin', label: 'LinkedIn', maxLength: 3000 },
//   { value: 'instagram', label: 'Instagram', maxLength: 2200 },
//   { value: 'facebook', label: 'Facebook', maxLength: 63206 },
// ];

// export default function ContentEditor() {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [platform, setPlatform] = useState('blog');
//   const [tone, setTone] = useState('professional');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showAIPanel, setShowAIPanel] = useState(false);
//   const [viralityScore, setViralityScore] = useState<number | null>(null);
//   const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);

//   const maxLength = platformOptions.find(p => p.value === platform)?.maxLength || 5000;
//   const charCount = content.length;
//   const progress = Math.min((charCount / maxLength) * 100, 100);

//   const handleGenerate = async () => {
//     setIsGenerating(true);
//     // Simulate AI generation
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setContent(`Here's an AI-generated sample about ${title || 'your topic'}...

// In today's fast-paced digital landscape, creating engaging content that resonates with your audience is more important than ever. With the rise of artificial intelligence and machine learning, we're seeing unprecedented opportunities for content creators to leverage technology in their creative process.

// Key takeaways:
// • Understand your audience deeply
// • Leverage AI tools for efficiency
// • Focus on authentic storytelling
// • Measure and iterate on performance

// What are your thoughts on using AI in content creation?`);
//     setGeneratedHashtags(['#ContentCreation', '#AITools', '#DigitalMarketing', '#ContentStrategy']);
//     setViralityScore(78);
//     setIsGenerating(false);
//   };

//   const handleImprove = async () => {
//     setIsGenerating(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     setContent(content + '\n\n[Improved with better structure and engagement hooks]');
//     setIsGenerating(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-zinc-900">Content Editor</h1>
//           <p className="text-zinc-500">Create and edit content with AI assistance.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button variant="outline">
//             <Save className="w-4 h-4 mr-2" />
//             Save Draft
//           </Button>
//           <Button className="btn-primary">
//             <Send className="w-4 h-4 mr-2" />
//             Publish
//           </Button>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Main Editor */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="lg:col-span-2 space-y-6"
//         >
//           <Card>
//             <CardContent className="p-6">
//               {/* Title Input */}
//               <Input
//                 placeholder="Enter your content title..."
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="text-xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 mb-4"
//               />

//               {/* Platform & Tone Selectors */}
//               <div className="flex flex-wrap items-center gap-3 mb-4">
//                 <Select value={platform} onValueChange={setPlatform}>
//                   <SelectTrigger className="w-40">
//                     <SelectValue placeholder="Platform" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {platformOptions.map((p) => (
//                       <SelectItem key={p.value} value={p.value}>
//                         {p.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={tone} onValueChange={setTone}>
//                   <SelectTrigger className="w-40">
//                     <SelectValue placeholder="Tone" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {toneOptions.map((t) => (
//                       <SelectItem key={t.value} value={t.value}>
//                         {t.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <div className="flex items-center gap-2 ml-auto">
//                   <span className={`text-sm ${charCount > maxLength ? 'text-red-500' : 'text-zinc-500'}`}>
//                     {charCount}/{maxLength}
//                   </span>
//                   <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
//                     <div
//                       className={`h-full rounded-full transition-all duration-300 ${
//                         charCount > maxLength ? 'bg-red-500' : 'bg-zinc-900'
//                       }`}
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Formatting Toolbar */}
//               <div className="flex items-center gap-1 p-2 bg-zinc-50 rounded-lg mb-4">
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Bold className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Italic className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Underline className="w-4 h-4" />
//                 </Button>
//                 <Separator orientation="vertical" className="h-6 mx-1" />
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <AlignLeft className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <AlignCenter className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <AlignRight className="w-4 h-4" />
//                 </Button>
//                 <Separator orientation="vertical" className="h-6 mx-1" />
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <List className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <ListOrdered className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Quote className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Link className="w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Code className="w-4 h-4" />
//                 </Button>
//                 <div className="flex-1" />
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowAIPanel(!showAIPanel)}
//                   className="text-amber-600"
//                 >
//                   <Sparkles className="w-4 h-4 mr-2" />
//                   AI Assist
//                 </Button>
//               </div>

//               {/* Content Textarea */}
//               <Textarea
//                 placeholder="Start writing your content here..."
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 className="min-h-[400px] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
//               />
//             </CardContent>
//           </Card>

//           {/* AI Generation Panel */}
//           {showAIPanel && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//             >
//               <Card className="border-amber-200 bg-amber-50/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <Sparkles className="w-5 h-5 text-amber-600" />
//                     AI Content Assistant
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-zinc-700 mb-2 block">
//                         What would you like to write about?
//                       </label>
//                       <Textarea
//                         placeholder="Enter a topic, keywords, or brief description..."
//                         className="bg-white"
//                       />
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <Button
//                         onClick={handleGenerate}
//                         disabled={isGenerating}
//                         className="bg-amber-600 hover:bg-amber-700 text-white"
//                       >
//                         {isGenerating ? (
//                           <>
//                             <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
//                             Generating...
//                           </>
//                         ) : (
//                           <>
//                             <Wand2 className="w-4 h-4 mr-2" />
//                             Generate Content
//                           </>
//                         )}
//                       </Button>
//                       <Button variant="outline" onClick={handleImprove}>
//                         <Sparkles className="w-4 h-4 mr-2" />
//                         Improve Existing
//                       </Button>
//                       <Button variant="outline">
//                         <Languages className="w-4 h-4 mr-2" />
//                         Translate
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Sidebar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="space-y-6"
//         >
//           {/* Virality Score */}
//           {viralityScore && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Zap className="w-5 h-5 text-amber-600" />
//                   Virality Prediction
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center">
//                   <div className="relative inline-flex items-center justify-center">
//                     <svg className="w-32 h-32 transform -rotate-90">
//                       <circle
//                         cx="64"
//                         cy="64"
//                         r="56"
//                         stroke="#E4E4E7"
//                         strokeWidth="12"
//                         fill="none"
//                       />
//                       <circle
//                         cx="64"
//                         cy="64"
//                         r="56"
//                         stroke={viralityScore >= 80 ? '#22C55E' : viralityScore >= 60 ? '#EAB308' : '#EF4444'}
//                         strokeWidth="12"
//                         fill="none"
//                         strokeDasharray={`${(viralityScore / 100) * 351.86} 351.86`}
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                       <span className="text-3xl font-bold text-zinc-900">{viralityScore}</span>
//                       <span className="text-xs text-zinc-500">/100</span>
//                     </div>
//                   </div>
//                   <p className="mt-4 text-sm text-zinc-600">
//                     {viralityScore >= 80
//                       ? 'Excellent! This content has high viral potential.'
//                       : viralityScore >= 60
//                       ? 'Good potential. Consider some improvements.'
//                       : 'Low virality. Try adjusting the content.'}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Generated Hashtags */}
//           {generatedHashtags.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Hash className="w-5 h-5 text-blue-600" />
//                   Suggested Hashtags
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-wrap gap-2">
//                   {generatedHashtags.map((tag, index) => (
//                     <Badge
//                       key={index}
//                       variant="secondary"
//                       className="cursor-pointer hover:bg-zinc-200"
//                       onClick={() => setContent(content + ' ' + tag)}
//                     >
//                       {tag}
//                       <Copy className="w-3 h-3 ml-1" />
//                     </Badge>
//                   ))}
//                 </div>
//                 <Button variant="ghost" size="sm" className="w-full mt-4">
//                   <Sparkles className="w-4 h-4 mr-2" />
//                   Generate More
//                 </Button>
//               </CardContent>
//             </Card>
//           )}

//           {/* SEO Suggestions */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg">
//                 <BarChart3 className="w-5 h-5 text-green-600" />
//                 SEO Suggestions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <Check className="w-5 h-5 text-green-600 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-zinc-900">Good title length</p>
//                     <p className="text-xs text-zinc-500">Your title is optimized for search engines.</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <X className="w-5 h-5 text-amber-600 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-zinc-900">Add more keywords</p>
//                     <p className="text-xs text-zinc-500">Include target keywords in the first paragraph.</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <Check className="w-5 h-5 text-green-600 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-zinc-900">Readable structure</p>
//                     <p className="text-xs text-zinc-500">Good use of headings and paragraphs.</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Publishing Options */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Publishing Options</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-zinc-700 mb-2 block">Schedule</label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Publish immediately" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="now">Publish immediately</SelectItem>
//                       <SelectItem value="schedule">Schedule for later</SelectItem>
//                       <SelectItem value="draft">Save as draft</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-zinc-700 mb-2 block">Platforms</label>
//                   <div className="flex flex-wrap gap-2">
//                     {['Blog', 'Twitter', 'LinkedIn', 'Instagram'].map((p) => (
//                       <Badge
//                         key={p}
//                         variant="outline"
//                         className="cursor-pointer hover:bg-zinc-100"
//                       >
//                         {p}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   Save,
//   Sparkles,
//   Eye,
//   Send,
//   Loader2,
//   Wand2,
//   Copy,
//   Trash2,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { contentApi, aiApi } from '@/services/api';
// import { useToast } from '@/hooks/use-toast';

// export default function ContentEditor() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     type: 'blog',
//     platform: 'blog',
//     tone: 'professional',
//     tags: [] as string[],
//     status: 'draft',
//   });
//   const [aiPrompt, setAiPrompt] = useState('');
//   const [viralityScore, setViralityScore] = useState<any>(null);

//   useEffect(() => {
//     if (id) {
//       fetchContent();
//     }
//   }, [id]);

//   const fetchContent = async () => {
//     try {
//       setLoading(true);
//       const response = await contentApi.getById(id!);
//       const content = response.data.data;
//       setFormData({
//         title: content.title,
//         content: content.content,
//         type: content.type,
//         platform: content.platform,
//         tone: content.tone,
//         tags: content.tags || [],
//         status: content.status,
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to load content',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   type ContentStatus = "draft" | "published" | "scheduled";

// interface ContentFormData {
//   title: string;
//   content: string;
//   type: string;
//   platform: string;
//   tone: string;
//   tags: string[];
//   status: ContentStatus;
// }


//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       if (id) {
//         await contentApi.update(id, formData);
//         toast({ title: 'Success', description: 'Content updated successfully' });
//       } else {
//         await contentApi.create(formData);
//         toast({ title: 'Success', description: 'Content created successfully' });
//         navigate('/content');
//       }
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to save content',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateContent = async () => {
//     if (!aiPrompt.trim()) {
//       toast({
//         title: 'Error',
//         description: 'Please enter a prompt',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       setGenerating(true);
//       const response = await aiApi.generateContent({
//         prompt: aiPrompt,
//         type: formData.type,
//         platform: formData.platform,
//         tone: formData.tone,
//       });

//       const generated = response.data.data;
//       setFormData({
//         ...formData,
//         title: generated.title || formData.title,
//         content: generated.content,
//       });

//       toast({
//         title: 'Success',
//         description: 'Content generated successfully',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to generate content',
//         variant: 'destructive',
//       });
//     } finally {
//       setGenerating(false);
//       setAiPrompt('');
//     }
//   };

//   const checkVirality = async () => {
//     if (!formData.content.trim()) return;

//     try {
//       const response = await aiApi.predictVirality(
//         formData.content,
//         formData.platform
//       );
//       setViralityScore(response.data.data);
//     } catch (error) {
//       console.error('Error checking virality:', error);
//     }
//   };

//   useEffect(() => {
//     if (formData.content.length > 50) {
//       const timer = setTimeout(checkVirality, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [formData.content]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {id ? 'Edit Content' : 'Create Content'}
//             </h1>
//             <p className="text-gray-600">
//               {id ? 'Update your content' : 'Create engaging content with AI assistance'}
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate('/content')}>
//               Cancel
//             </Button>
//             <Button className="btn-purple" onClick={handleSave} disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4 mr-2" />
//                   Save
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Main Editor */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* AI Generator */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="w-5 h-5 text-purple-600" />
//                   AI Content Generator
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-3">
//                   <Input
//                     placeholder="E.g., Write a blog post about remote work trends..."
//                     value={aiPrompt}
//                     onChange={(e) => setAiPrompt(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && generateContent()}
//                   />
//                   <Button
//                     className="btn-purple"
//                     onClick={generateContent}
//                     disabled={generating}
//                   >
//                     {generating ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Wand2 className="w-4 h-4" />
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Content Form */}
//             <Card>
//               <CardContent className="p-6 space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Title
//                   </label>
//                   <Input
//                     placeholder="Enter your content title..."
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Content
//                   </label>
//                   <Textarea
//                     placeholder="Write your content here..."
//                     value={formData.content}
//                     onChange={(e) =>
//                       setFormData({ ...formData, content: e.target.value })
//                     }
//                     className="min-h-[400px]"
//                   />
//                   <div className="flex items-center justify-between mt-2">
//                     <p className="text-sm text-gray-500">
//                       {formData.content.length} characters
//                     </p>
//                     {viralityScore && (
//                       <Badge
//                         variant={viralityScore.score > 70 ? 'default' : 'secondary'}
//                       >
//                         Virality Score: {viralityScore.score}/100
//                       </Badge>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Type
//                     </label>
//                     <Select
//                       value={formData.type}
//                       onValueChange={(value) =>
//                         setFormData({ ...formData, type: value })
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="blog">Blog Post</SelectItem>
//                         <SelectItem value="social">Social Media</SelectItem>
//                         <SelectItem value="video">Video Script</SelectItem>
//                         <SelectItem value="newsletter">Newsletter</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Platform
//                     </label>
//                     <Select
//                       value={formData.platform}
//                       onValueChange={(value) =>
//                         setFormData({ ...formData, platform: value })
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="blog">Blog</SelectItem>
//                         <SelectItem value="twitter">Twitter</SelectItem>
//                         <SelectItem value="linkedin">LinkedIn</SelectItem>
//                         <SelectItem value="instagram">Instagram</SelectItem>
//                         <SelectItem value="facebook">Facebook</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Tone
//                     </label>
//                     <Select
//                       value={formData.tone}
//                       onValueChange={(value) =>
//                         setFormData({ ...formData, tone: value })
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="professional">Professional</SelectItem>
//                         <SelectItem value="casual">Casual</SelectItem>
//                         <SelectItem value="humorous">Humorous</SelectItem>
//                         <SelectItem value="inspirational">Inspirational</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Status
//                     </label>
//                     <Select
//                       value={formData.status}
//                       onValueChange={(value) =>
//                         setFormData({ ...formData, status: value })
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="draft">Draft</SelectItem>
//                         <SelectItem value="published">Published</SelectItem>
//                         <SelectItem value="scheduled">Scheduled</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Virality Score */}
//             {viralityScore && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Virality Analysis</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-center mb-4">
//                     <div className="text-5xl font-bold text-purple-600 mb-2">
//                       {viralityScore.score}
//                     </div>
//                     <p className="text-sm text-gray-600">Out of 100</p>
//                   </div>
//                   <div className="space-y-3">
//                     {viralityScore.suggestions?.slice(0, 3).map((suggestion: string, i: number) => (
//                       <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
//                         {suggestion}
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Quick Actions */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Quick Actions</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <Button variant="outline" className="w-full justify-start">
//                   <Eye className="w-4 h-4 mr-2" />
//                   Preview
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Copy className="w-4 h-4 mr-2" />
//                   Duplicate
//                 </Button>
//                 {id && (
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-red-600"
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/ContentEditor.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  Sparkles,
  Eye,
  Send,
  Loader2,
  Wand2,
  Copy,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { contentApi, aiApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

type ContentStatus = 'draft' | 'published' | 'scheduled';

interface ContentFormData {
  title: string;
  content: string;
  type: string;
  platform: string;
  tone: string;
  tags: string[];
  status: ContentStatus;
}

export default function ContentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    content: '',
    type: 'blog',
    platform: 'blog',
    tone: 'professional',
    tags: [],
    status: 'draft',
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [viralityScore, setViralityScore] = useState<any>(null);

  useEffect(() => {
    if (id) fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await contentApi.getById(id!);
      const content = response.data.data;
      setFormData({
        title: content.title,
        content: content.content,
        type: content.type,
        platform: content.platform,
        tone: content.tone,
        tags: content.tags || [],
        status: content.status,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (id) {
        await contentApi.update(id, formData);
        toast({ title: 'Success', description: 'Content updated successfully' });
      } else {
        await contentApi.create(formData);
        toast({ title: 'Success', description: 'Content created successfully' });
        navigate('/content');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      });
      return;
    }

    try {
      setGenerating(true);
      const response = await aiApi.generateContent({
        prompt: aiPrompt,
        type: formData.type,
        platform: formData.platform,
        tone: formData.tone,
      });

      const generated = response.data.data;
      setFormData({
        ...formData,
        title: generated.title || formData.title,
        content: generated.content,
      });

      toast({ title: 'Success', description: 'Content generated successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate content',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
      setAiPrompt('');
    }
  };

  const checkVirality = async () => {
    if (!formData.content.trim()) return;

    try {
      const response = await aiApi.predictVirality(formData.content, formData.platform);
      setViralityScore(response.data.data);
    } catch (error) {
      console.error('Error checking virality:', error);
    }
  };

  useEffect(() => {
    if (formData.content.length > 50) {
      const timer = setTimeout(checkVirality, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {id ? 'Edit Content' : 'Create Content'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Update your content' : 'Create engaging content with AI assistance'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/content')}>
              Cancel
            </Button>
            <Button className="btn-purple" onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="E.g., Write a blog post about remote work trends..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateContent()}
                  />
                  <Button
                    className="btn-purple"
                    onClick={generateContent}
                    disabled={generating}
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Form */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    placeholder="Enter your content title..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <Textarea
                    placeholder="Write your content here..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="min-h-[400px]"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">{formData.content.length} characters</p>
                    {viralityScore && (
                      <Badge
                        variant={viralityScore.score > 70 ? 'default' : 'secondary'}
                      >
                        Virality Score: {viralityScore.score}/100
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="video">Video Script</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) =>
                        setFormData({ ...formData, platform: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone
                    </label>
                    <Select
                      value={formData.tone}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value as ContentStatus })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {viralityScore && (
              <Card>
                <CardHeader>
                  <CardTitle>Virality Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      {viralityScore.score}
                    </div>
                    <p className="text-sm text-gray-600">Out of 100</p>
                  </div>
                  <div className="space-y-3">
                    {viralityScore.suggestions?.slice(0, 3).map((suggestion: string, i: number) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                {id && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
