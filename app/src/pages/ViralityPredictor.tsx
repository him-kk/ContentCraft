// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Zap,
//   TrendingUp,
//   Clock,
//   AlertTriangle,
//   Lightbulb,
//   RefreshCw,
//   Heart,
//   MessageCircle,
//   Share2,
//   Eye,
//   Target,
//   Sparkles,
//   Check,
//   BarChart3,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// const mockPredictionData = {
//   score: 87,
//   confidence: 92,
//   predictedEngagement: {
//     likes: 12500,
//     comments: 890,
//     shares: 2340,
//     views: 125000,
//   },
//   optimalTime: 'Tuesday, 2:00 PM',
//   riskLevel: 'low' as const,
//   riskFactors: [],
//   suggestions: [
//     'Add a compelling call-to-action in the first paragraph',
//     'Include 2-3 relevant hashtags for better discoverability',
//     'Consider adding a visual element to increase engagement',
//     'The title could be more attention-grabbing',
//   ],
//   hourlyData: [
//     { hour: '6AM', engagement: 15 },
//     { hour: '8AM', engagement: 35 },
//     { hour: '10AM', engagement: 55 },
//     { hour: '12PM', engagement: 70 },
//     { hour: '2PM', engagement: 95 },
//     { hour: '4PM', engagement: 80 },
//     { hour: '6PM', engagement: 60 },
//     { hour: '8PM', engagement: 45 },
//     { hour: '10PM', engagement: 25 },
//   ],
//   factorScores: [
//     { name: 'Headline', score: 85, color: '#22C55E' },
//     { name: 'Content', score: 92, color: '#22C55E' },
//     { name: 'Timing', score: 78, color: '#EAB308' },
//     { name: 'Hashtags', score: 65, color: '#EAB308' },
//     { name: 'Visuals', score: 90, color: '#22C55E' },
//   ],
// };

// export default function ViralityPredictor() {
//   const [content, setContent] = useState('');
//   const [title, setTitle] = useState('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [prediction, setPrediction] = useState<typeof mockPredictionData | null>(null);
//   const [activeTab, setActiveTab] = useState('overview');

//   const handleAnalyze = async () => {
//     setIsAnalyzing(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2500));
//     setPrediction(mockPredictionData);
//     setIsAnalyzing(false);
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return 'text-green-600';
//     if (score >= 60) return 'text-amber-600';
//     return 'text-red-600';
//   };

//   const getScoreBg = (score: number) => {
//     if (score >= 80) return 'bg-green-500';
//     if (score >= 60) return 'bg-amber-500';
//     return 'bg-red-500';
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-zinc-900">Virality Predictor</h1>
//           <p className="text-zinc-500">Predict your content's viral potential with AI.</p>
//         </div>
//         <Badge className="bg-amber-100 text-amber-700 w-fit">
//           <Zap className="w-3 h-3 mr-1" />
//           85%+ Accuracy
//         </Badge>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Input Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="space-y-6"
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg">
//                 <Target className="w-5 h-5 text-zinc-700" />
//                 Content to Analyze
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-zinc-700 mb-2 block">Title/Headline</label>
//                 <Input
//                   placeholder="Enter your content title..."
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-zinc-700 mb-2 block">Content</label>
//                 <Textarea
//                   placeholder="Paste your content here for virality analysis..."
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   className="min-h-[250px]"
//                 />
//               </div>
//               <Button
//                 onClick={handleAnalyze}
//                 disabled={isAnalyzing || !content.trim()}
//                 className="w-full btn-primary"
//               >
//                 {isAnalyzing ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                     Analyzing...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="w-4 h-4 mr-2" />
//                     Predict Virality
//                   </>
//                 )}
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Tips Card */}
//           <Card className="bg-blue-50/50 border-blue-200">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
//                 <Lightbulb className="w-5 h-5" />
//                 Tips for Better Predictions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2 text-sm text-blue-800">
//                 <li className="flex items-start gap-2">
//                   <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   Include your full content for accurate analysis
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   Add relevant hashtags to improve discoverability score
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   Consider your target audience when writing
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   Use compelling visuals to boost engagement
//                 </li>
//               </ul>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Results Section */}
//         <AnimatePresence>
//           {prediction && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-6"
//             >
//               {/* Main Score Card */}
//               <Card className="border-2 border-zinc-900">
//                 <CardContent className="p-8">
//                   <div className="text-center">
//                     <p className="text-sm text-zinc-500 mb-4">Virality Score</p>
//                     <div className="relative inline-flex items-center justify-center mb-4">
//                       <svg className="w-40 h-40 transform -rotate-90">
//                         <circle
//                           cx="80"
//                           cy="80"
//                           r="70"
//                           stroke="#E4E4E7"
//                           strokeWidth="16"
//                           fill="none"
//                         />
//                         <circle
//                           cx="80"
//                           cy="80"
//                           r="70"
//                           stroke={getScoreBg(prediction.score)}
//                           strokeWidth="16"
//                           fill="none"
//                           strokeDasharray={`${(prediction.score / 100) * 439.82} 439.82`}
//                           strokeLinecap="round"
//                           className="transition-all duration-1000"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex flex-col items-center justify-center">
//                         <motion.span
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ duration: 0.5, delay: 0.3 }}
//                           className={`text-5xl font-bold ${getScoreColor(prediction.score)}`}
//                         >
//                           {prediction.score}
//                         </motion.span>
//                         <span className="text-sm text-zinc-500">/100</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-center gap-2 mb-2">
//                       <Badge className={prediction.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
//                         {prediction.score >= 80 ? 'High Viral Potential' : prediction.score >= 60 ? 'Moderate Potential' : 'Low Potential'}
//                       </Badge>
//                       <span className="text-sm text-zinc-500">
//                         {prediction.confidence}% confidence
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Predicted Engagement */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <BarChart3 className="w-5 h-5 text-zinc-700" />
//                     Predicted Engagement
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="text-center p-4 bg-zinc-50 rounded-lg">
//                       <Eye className="w-5 h-5 text-blue-600 mx-auto mb-2" />
//                       <p className="text-2xl font-bold text-zinc-900">
//                         {(prediction.predictedEngagement.views / 1000).toFixed(1)}K
//                       </p>
//                       <p className="text-xs text-zinc-500">Views</p>
//                     </div>
//                     <div className="text-center p-4 bg-zinc-50 rounded-lg">
//                       <Heart className="w-5 h-5 text-rose-600 mx-auto mb-2" />
//                       <p className="text-2xl font-bold text-zinc-900">
//                         {(prediction.predictedEngagement.likes / 1000).toFixed(1)}K
//                       </p>
//                       <p className="text-xs text-zinc-500">Likes</p>
//                     </div>
//                     <div className="text-center p-4 bg-zinc-50 rounded-lg">
//                       <MessageCircle className="w-5 h-5 text-purple-600 mx-auto mb-2" />
//                       <p className="text-2xl font-bold text-zinc-900">
//                         {prediction.predictedEngagement.comments}
//                       </p>
//                       <p className="text-xs text-zinc-500">Comments</p>
//                     </div>
//                     <div className="text-center p-4 bg-zinc-50 rounded-lg">
//                       <Share2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
//                       <p className="text-2xl font-bold text-zinc-900">
//                         {prediction.predictedEngagement.shares}
//                       </p>
//                       <p className="text-xs text-zinc-500">Shares</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Detailed Analysis */}
//       {prediction && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.2 }}
//         >
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
//               <TabsTrigger value="overview">Overview</TabsTrigger>
//               <TabsTrigger value="timing">Timing</TabsTrigger>
//               <TabsTrigger value="factors">Factors</TabsTrigger>
//             </TabsList>

//             <TabsContent value="overview" className="mt-6">
//               <div className="grid lg:grid-cols-2 gap-6">
//                 {/* Suggestions */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2 text-lg">
//                       <Lightbulb className="w-5 h-5 text-amber-600" />
//                       Improvement Suggestions
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       {prediction.suggestions.map((suggestion, index) => (
//                         <div
//                           key={index}
//                           className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg"
//                         >
//                           <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0">
//                             <span className="text-xs text-white font-medium">{index + 1}</span>
//                           </div>
//                           <p className="text-sm text-zinc-700">{suggestion}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Risk Analysis */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2 text-lg">
//                       <AlertTriangle className="w-5 h-5 text-zinc-700" />
//                       Risk Analysis
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {prediction.riskLevel === 'low' ? (
//                       <div className="text-center py-8">
//                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                           <Check className="w-8 h-8 text-green-600" />
//                         </div>
//                         <p className="font-medium text-zinc-900">Low Risk</p>
//                         <p className="text-sm text-zinc-500 mt-1">
//                           Your content looks great! No major risks detected.
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="space-y-3">
//                         {prediction.riskFactors.map((factor, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
//                           >
//                             <AlertTriangle className="w-5 h-5 text-red-600" />
//                             <p className="text-sm text-red-700">{factor}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             <TabsContent value="timing" className="mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <Clock className="w-5 h-5 text-zinc-700" />
//                     Optimal Posting Time
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-4 mb-6">
//                     <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center">
//                       <Clock className="w-8 h-8 text-amber-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-zinc-900">{prediction.optimalTime}</p>
//                       <p className="text-sm text-zinc-500">Best time to post for maximum engagement</p>
//                     </div>
//                   </div>
//                   <div className="h-[300px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={prediction.hourlyData}>
//                         <defs>
//                           <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
//                             <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
//                         <XAxis dataKey="hour" stroke="#71717A" fontSize={12} />
//                         <YAxis stroke="#71717A" fontSize={12} />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: 'white',
//                             border: '1px solid #E4E4E7',
//                             borderRadius: '8px',
//                           }}
//                         />
//                         <Area
//                           type="monotone"
//                           dataKey="engagement"
//                           stroke="#EAB308"
//                           strokeWidth={2}
//                           fillOpacity={1}
//                           fill="url(#colorEngagement)"
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="factors" className="mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <TrendingUp className="w-5 h-5 text-zinc-700" />
//                     Factor Breakdown
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     {prediction.factorScores.map((factor, index) => (
//                       <div key={index}>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="font-medium text-zinc-900">{factor.name}</span>
//                           <span className={`font-semibold ${getScoreColor(factor.score)}`}>
//                             {factor.score}/100
//                           </span>
//                         </div>
//                         <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: `${factor.score}%` }}
//                             transition={{ duration: 0.5, delay: index * 0.1 }}
//                             className="h-full rounded-full"
//                             style={{ backgroundColor: factor.color }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </motion.div>
//       )}
//     </div>
//   );
// }
import { useState } from 'react';
import { Zap, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { aiApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function ViralityPredictor() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const predictVirality = async () => {
    if (!content.trim()) {
      toast({ title: 'Error', description: 'Please enter content', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const response = await aiApi.predictVirality(content, platform);
      setPrediction(response.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to predict virality', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Virality Predictor</h1>
        <p className="text-gray-600">Predict how viral your content will be</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px]"
            />
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full btn-purple" onClick={predictVirality} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
              Predict Virality
            </Button>
          </CardContent>
        </Card>

        {prediction && (
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-purple-600 mb-2">{prediction.score}</div>
                <p className="text-gray-600">Virality Score</p>
                <Progress value={prediction.score} className="mt-4" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Factors</h4>
                  {Object.entries(prediction.factors || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium">{value?.toFixed(1) || 0}/10</span>
                    </div>
                  ))}
                </div>

                {prediction.suggestions && prediction.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Suggestions</h4>
                    {prediction.suggestions.map((suggestion: string, i: number) => (
                      <div key={i} className="flex gap-2 py-2">
                        <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
