// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   TrendingUp,
//   Clock,
//   Target,
//   Zap,
//   Filter,
//   Search,
//   Hash,
//   Globe,
//   Bookmark,
//   Share2,
//   RefreshCw,
//   Sparkles,
//   BarChart3,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from 'recharts';

// const mockTrends = [
//   {
//     id: '1',
//     topic: '#AITrends2025',
//     platform: 'Twitter',
//     volume: '2.4M',
//     growth: 127,
//     sentiment: 'positive',
//     lifecycle: 'rising',
//     opportunityScore: 92,
//     relatedHashtags: ['#MachineLearning', '#AI', '#TechTrends'],
//     description: 'Discussions about upcoming AI trends and predictions for 2025.',
//     discoveredAt: '2 hours ago',
//     chartData: [
//       { time: '00:00', volume: 1200 },
//       { time: '04:00', volume: 1800 },
//       { time: '08:00', volume: 3200 },
//       { time: '12:00', volume: 5400 },
//       { time: '16:00', volume: 7800 },
//       { time: '20:00', volume: 9200 },
//     ],
//   },
//   {
//     id: '2',
//     topic: '#SustainableTech',
//     platform: 'LinkedIn',
//     volume: '1.2M',
//     growth: 234,
//     sentiment: 'positive',
//     lifecycle: 'emerging',
//     opportunityScore: 88,
//     relatedHashtags: ['#GreenTech', '#Sustainability', '#ClimateAction'],
//     description: 'Growing interest in sustainable technology solutions.',
//     discoveredAt: '4 hours ago',
//     chartData: [
//       { time: '00:00', volume: 800 },
//       { time: '04:00', volume: 1200 },
//       { time: '08:00', volume: 2100 },
//       { time: '12:00', volume: 3800 },
//       { time: '16:00', volume: 5200 },
//       { time: '20:00', volume: 6100 },
//     ],
//   },
//   {
//     id: '3',
//     topic: '#RemoteWorkTips',
//     platform: 'Instagram',
//     volume: '890K',
//     growth: 45,
//     sentiment: 'neutral',
//     lifecycle: 'peaking',
//     opportunityScore: 72,
//     relatedHashtags: ['#WorkFromHome', '#Productivity', '#DigitalNomad'],
//     description: 'Tips and tricks for effective remote work.',
//     discoveredAt: '6 hours ago',
//     chartData: [
//       { time: '00:00', volume: 5000 },
//       { time: '04:00', volume: 4800 },
//       { time: '08:00', volume: 5200 },
//       { time: '12:00', volume: 5100 },
//       { time: '16:00', volume: 4900 },
//       { time: '20:00', volume: 4700 },
//     ],
//   },
//   {
//     id: '4',
//     topic: '#CryptoNews',
//     platform: 'Twitter',
//     volume: '3.1M',
//     growth: -15,
//     sentiment: 'negative',
//     lifecycle: 'declining',
//     opportunityScore: 45,
//     relatedHashtags: ['#Bitcoin', '#Crypto', '#Blockchain'],
//     description: 'Latest cryptocurrency news and market updates.',
//     discoveredAt: '12 hours ago',
//     chartData: [
//       { time: '00:00', volume: 8000 },
//       { time: '04:00', volume: 7500 },
//       { time: '08:00', volume: 6800 },
//       { time: '12:00', volume: 6200 },
//       { time: '16:00', volume: 5800 },
//       { time: '20:00', volume: 5400 },
//     ],
//   },
//   {
//     id: '5',
//     topic: '#MentalHealth',
//     platform: 'TikTok',
//     volume: '1.8M',
//     growth: 89,
//     sentiment: 'positive',
//     lifecycle: 'rising',
//     opportunityScore: 85,
//     relatedHashtags: ['#Wellness', '#SelfCare', '#Mindfulness'],
//     description: 'Conversations about mental health awareness and self-care.',
//     discoveredAt: '8 hours ago',
//     chartData: [
//       { time: '00:00', volume: 1500 },
//       { time: '04:00', volume: 2200 },
//       { time: '08:00', volume: 3800 },
//       { time: '12:00', volume: 5200 },
//       { time: '16:00', volume: 6800 },
//       { time: '20:00', volume: 7900 },
//     ],
//   },
// ];

// const lifecycleColors = {
//   emerging: 'bg-blue-100 text-blue-700',
//   rising: 'bg-green-100 text-green-700',
//   peaking: 'bg-amber-100 text-amber-700',
//   declining: 'bg-red-100 text-red-700',
// };

// const sentimentColors = {
//   positive: 'text-green-600',
//   neutral: 'text-zinc-600',
//   negative: 'text-red-600',
// };

// export default function TrendDashboard() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedPlatform, setSelectedPlatform] = useState('all');
//   const [selectedTrend, setSelectedTrend] = useState(mockTrends[0]);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const filteredTrends = mockTrends.filter((trend) => {
//     const matchesSearch = trend.topic.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesPlatform = selectedPlatform === 'all' || trend.platform.toLowerCase() === selectedPlatform;
//     return matchesSearch && matchesPlatform;
//   });

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     setIsRefreshing(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-zinc-900">Trend Dashboard</h1>
//           <p className="text-zinc-500">Monitor and capitalize on trending topics in real-time.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
//             <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//           <Badge className="bg-green-100 text-green-700">
//             <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
//             Live Updates
//           </Badge>
//         </div>
//       </div>

//       {/* Stats Row */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label: 'Active Trends', value: '24', change: '+5 today', icon: TrendingUp, color: 'bg-blue-100 text-blue-700' },
//           { label: 'High Opportunity', value: '8', change: 'Ready to hijack', icon: Target, color: 'bg-green-100 text-green-700' },
//           { label: 'Avg Growth', value: '+67%', change: 'Last 24 hours', icon: BarChart3, color: 'bg-amber-100 text-amber-700' },
//           { label: 'Platforms', value: '5', change: 'Monitoring', icon: Globe, color: 'bg-purple-100 text-purple-700' },
//         ].map((stat, index) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.1 }}
//           >
//             <Card>
//               <CardContent className="p-6">
//                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
//                   <stat.icon className="w-5 h-5" />
//                 </div>
//                 <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
//                 <p className="text-sm text-zinc-500">{stat.label}</p>
//                 <p className="text-xs text-zinc-400 mt-1">{stat.change}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
//           <Input
//             placeholder="Search trends..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
//           <SelectTrigger className="w-40">
//             <Filter className="w-4 h-4 mr-2" />
//             <SelectValue placeholder="Platform" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Platforms</SelectItem>
//             <SelectItem value="twitter">Twitter</SelectItem>
//             <SelectItem value="linkedin">LinkedIn</SelectItem>
//             <SelectItem value="instagram">Instagram</SelectItem>
//             <SelectItem value="tiktok">TikTok</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Trends Grid */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Trends List */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="lg:col-span-1 space-y-4"
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Trending Topics</CardTitle>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="divide-y divide-zinc-100">
//                 {filteredTrends.map((trend) => (
//                   <div
//                     key={trend.id}
//                     onClick={() => setSelectedTrend(trend)}
//                     className={`p-4 cursor-pointer transition-colors hover:bg-zinc-50 ${
//                       selectedTrend.id === trend.id ? 'bg-zinc-50 border-l-4 border-l-zinc-900' : ''
//                     }`}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-zinc-900 truncate">{trend.topic}</p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <Badge variant="secondary" className="text-xs">
//                             {trend.platform}
//                           </Badge>
//                           <span className={`text-xs ${sentimentColors[trend.sentiment as keyof typeof sentimentColors]}`}>
//                             {trend.growth > 0 ? '+' : ''}{trend.growth}%
//                           </span>
//                         </div>
//                       </div>
//                       <Badge className={lifecycleColors[trend.lifecycle as keyof typeof lifecycleColors]}>
//                         {trend.lifecycle}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between mt-2">
//                       <span className="text-xs text-zinc-500">{trend.volume} posts</span>
//                       <div className="flex items-center gap-1">
//                         <Zap className="w-3 h-3 text-amber-500" />
//                         <span className="text-xs font-medium">{trend.opportunityScore}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Trend Details */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="lg:col-span-2 space-y-6"
//         >
//           <Card>
//             <CardHeader className="flex flex-row items-start justify-between">
//               <div>
//                 <div className="flex items-center gap-3 mb-2">
//                   <CardTitle className="text-xl">{selectedTrend.topic}</CardTitle>
//                   <Badge className={lifecycleColors[selectedTrend.lifecycle as keyof typeof lifecycleColors]}>
//                     {selectedTrend.lifecycle}
//                   </Badge>
//                 </div>
//                 <p className="text-sm text-zinc-500">{selectedTrend.description}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm">
//                   <Bookmark className="w-4 h-4 mr-2" />
//                   Save
//                 </Button>
//                 <Button size="sm" className="btn-primary">
//                   <Sparkles className="w-4 h-4 mr-2" />
//                   Create Content
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Stats Grid */}
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center p-4 bg-zinc-50 rounded-lg">
//                   <p className="text-2xl font-bold text-zinc-900">{selectedTrend.volume}</p>
//                   <p className="text-xs text-zinc-500">Posts</p>
//                 </div>
//                 <div className="text-center p-4 bg-zinc-50 rounded-lg">
//                   <p className={`text-2xl font-bold ${selectedTrend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                     {selectedTrend.growth > 0 ? '+' : ''}{selectedTrend.growth}%
//                   </p>
//                   <p className="text-xs text-zinc-500">Growth</p>
//                 </div>
//                 <div className="text-center p-4 bg-zinc-50 rounded-lg">
//                   <p className="text-2xl font-bold text-amber-600">{selectedTrend.opportunityScore}</p>
//                   <p className="text-xs text-zinc-500">Opportunity</p>
//                 </div>
//               </div>

//               {/* Chart */}
//               <div>
//                 <h4 className="text-sm font-medium text-zinc-700 mb-3">24-Hour Trend</h4>
//                 <div className="h-[200px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={selectedTrend.chartData}>
//                       <defs>
//                         <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
//                           <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
//                       <XAxis dataKey="time" stroke="#71717A" fontSize={12} />
//                       <YAxis stroke="#71717A" fontSize={12} />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: 'white',
//                           border: '1px solid #E4E4E7',
//                           borderRadius: '8px',
//                         }}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="volume"
//                         stroke="#3B82F6"
//                         strokeWidth={2}
//                         fillOpacity={1}
//                         fill="url(#colorVolume)"
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Related Hashtags */}
//               <div>
//                 <h4 className="text-sm font-medium text-zinc-700 mb-3">Related Hashtags</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedTrend.relatedHashtags.map((tag, index) => (
//                     <Badge
//                       key={index}
//                       variant="secondary"
//                       className="cursor-pointer hover:bg-zinc-200"
//                     >
//                       <Hash className="w-3 h-3 mr-1" />
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-3">
//                 <Button variant="outline">
//                   <Share2 className="w-4 h-4 mr-2" />
//                   Share Trend
//                 </Button>
//                 <Button variant="outline">
//                   <BarChart3 className="w-4 h-4 mr-2" />
//                   Deep Analysis
//                 </Button>
//                 <Button variant="outline">
//                   <Clock className="w-4 h-4 mr-2" />
//                   Set Alert
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Search, Filter, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { trendsApi, aiApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function TrendDashboard() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const response = await trendsApi.getLive({ limit: 20 });
      setTrends(response.data.data?.trends || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load trends',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateContentFromTrend = async (trend: any) => {
    try {
      setGenerating(trend._id);
      const response = await trendsApi.generateContent(
        trend._id,
        'twitter',
        {}
      );
      
      toast({
        title: 'Success',
        description: 'Content generated from trend!',
      });
      
      // You could navigate to content editor with this content
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate content',
        variant: 'destructive',
      });
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trending Topics</h1>
          <p className="text-gray-600">Discover and hijack trending topics</p>
        </div>
        <Button className="btn-purple" onClick={fetchTrends}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Trends
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map((trend, index) => (
          <motion.div
            key={trend._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{trend.keyword}</h3>
                    <Badge variant="secondary" className="mb-2">
                      {trend.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      +{trend.growth?.toFixed(0) || 0}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Volume</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(trend.volume / 1000).toFixed(1)}K
                    </p>
                  </div>
                  
                  {trend.relatedHashtags && trend.relatedHashtags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Related Hashtags</p>
                      <div className="flex flex-wrap gap-2">
                        {trend.relatedHashtags.slice(0, 3).map((tag: string, i: number) => (
                          <Badge key={i} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full btn-purple"
                    onClick={() => generateContentFromTrend(trend)}
                    disabled={generating === trend._id}
                  >
                    {generating === trend._id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}