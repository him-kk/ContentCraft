// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   FileText,
//   TrendingUp,
//   Users,
//   Zap,
//   ArrowUpRight,
//   ArrowDownRight,
//   Plus,
//   Clock,
//   Eye,
//   Heart,
//   Sparkles,
//   Target,
//   BarChart3,
//   ChevronRight,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// const stats = [
//   {
//     title: 'Total Views',
//     value: '2.4M',
//     change: '+12.5%',
//     trend: 'up',
//     icon: Eye,
//     color: 'bg-blue-100 text-blue-700',
//   },
//   {
//     title: 'Engagement Rate',
//     value: '8.7%',
//     change: '+2.3%',
//     trend: 'up',
//     icon: Heart,
//     color: 'bg-rose-100 text-rose-700',
//   },
//   {
//     title: 'Followers',
//     value: '48.2K',
//     change: '+5.1%',
//     trend: 'up',
//     icon: Users,
//     color: 'bg-purple-100 text-purple-700',
//   },
//   {
//     title: 'Avg Virality Score',
//     value: '76/100',
//     change: '+8 pts',
//     trend: 'up',
//     icon: Zap,
//     color: 'bg-amber-100 text-amber-700',
//   },
// ];

// const chartData = [
//   { name: 'Mon', views: 4500, engagement: 320 },
//   { name: 'Tue', views: 5200, engagement: 410 },
//   { name: 'Wed', views: 4800, engagement: 380 },
//   { name: 'Thu', views: 6100, engagement: 520 },
//   { name: 'Fri', views: 7200, engagement: 640 },
//   { name: 'Sat', views: 8900, engagement: 780 },
//   { name: 'Sun', views: 7600, engagement: 650 },
// ];

// const platformData = [
//   { name: 'Instagram', value: 35, color: '#E4405F' },
//   { name: 'Twitter', value: 28, color: '#1DA1F2' },
//   { name: 'LinkedIn', value: 22, color: '#0A66C2' },
//   { name: 'TikTok', value: 15, color: '#000000' },
// ];

// const recentContent = [
//   {
//     id: '1',
//     title: '10 AI Trends Shaping 2025',
//     type: 'blog',
//     status: 'published',
//     viralityScore: 87,
//     views: '12.5K',
//     engagement: '1.2K',
//     publishedAt: '2 hours ago',
//     image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=150&fit=crop',
//   },
//   {
//     id: '2',
//     title: 'The Future of Remote Work',
//     type: 'social',
//     status: 'scheduled',
//     viralityScore: 72,
//     views: '-',
//     engagement: '-',
//     publishedAt: 'Tomorrow, 9:00 AM',
//     image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=150&fit=crop',
//   },
//   {
//     id: '3',
//     title: 'Building a Personal Brand',
//     type: 'video',
//     status: 'draft',
//     viralityScore: 65,
//     views: '-',
//     engagement: '-',
//     publishedAt: 'Draft',
//     image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop',
//   },
// ];

// const upcomingSchedule = [
//   {
//     id: '1',
//     content: 'Product Launch Announcement',
//     platform: 'Instagram',
//     time: 'Today, 3:00 PM',
//     status: 'pending',
//   },
//   {
//     id: '2',
//     content: 'Weekly Tips Thread',
//     platform: 'Twitter',
//     time: 'Today, 6:00 PM',
//     status: 'pending',
//   },
//   {
//     id: '3',
//     content: 'Industry Insights Blog',
//     platform: 'LinkedIn',
//     time: 'Tomorrow, 9:00 AM',
//     status: 'pending',
//   },
// ];

// const trendingTopics = [
//   { topic: '#AITrends2025', volume: '2.4M', growth: '+127%' },
//   { topic: '#RemoteWork', volume: '1.8M', growth: '+89%' },
//   { topic: '#SustainableTech', volume: '1.2M', growth: '+234%' },
//   { topic: '#DigitalMarketing', volume: '956K', growth: '+45%' },
// ];

// const quickActions = [
//   { name: 'Create with AI', icon: Sparkles, href: '/content', color: 'bg-purple-600 text-white', desc: 'Generate content' },
//   { name: 'Check Virality', icon: Zap, href: '/virality', color: 'bg-amber-100 text-amber-700', desc: 'Predict success' },
//   { name: 'Hijack Trends', icon: Target, href: '/trends', color: 'bg-blue-100 text-blue-700', desc: 'Find opportunities' },
//   { name: 'Generate Images', icon: BarChart3, href: '/image-gen', color: 'bg-pink-100 text-pink-700', desc: 'With DALL-E 3' },
// ];

// export default function Dashboard() {
//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-500">Welcome back! Here's what's happening with your content.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Link to="/content">
//             <Button variant="outline" className="border-gray-300">
//               <FileText className="w-4 h-4 mr-2" />
//               View All Content
//             </Button>
//           </Link>
//           <Link to="/content">
//             <Button className="btn-purple">
//               <Plus className="w-4 h-4 mr-2" />
//               Create Content
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.1 }}
//           >
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
//                     <stat.icon className="w-5 h-5" />
//                   </div>
//                   <div className={`flex items-center gap-1 text-sm ${
//                     stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     {stat.trend === 'up' ? (
//                       <ArrowUpRight className="w-4 h-4" />
//                     ) : (
//                       <ArrowDownRight className="w-4 h-4" />
//                     )}
//                     {stat.change}
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                   <p className="text-sm text-gray-500">{stat.title}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts Row */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Main Chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.4 }}
//           className="lg:col-span-2"
//         >
//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
//               <div className="flex items-center gap-2">
//                 <Badge variant="secondary" className="bg-blue-100 text-blue-700">
//                   <Eye className="w-3 h-3 mr-1" />
//                   Views
//                 </Badge>
//                 <Badge variant="secondary" className="bg-rose-100 text-rose-700">
//                   <Heart className="w-3 h-3 mr-1" />
//                   Engagement
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={chartData}>
//                     <defs>
//                       <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
//                         <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
//                       </linearGradient>
//                       <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#db2777" stopOpacity={0.2}/>
//                         <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                     <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
//                     <YAxis stroke="#9CA3AF" fontSize={12} />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: 'white',
//                         border: '1px solid #E5E7EB',
//                         borderRadius: '8px',
//                       }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="views"
//                       stroke="#7c3aed"
//                       strokeWidth={2}
//                       fillOpacity={1}
//                       fill="url(#colorViews)"
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="engagement"
//                       stroke="#db2777"
//                       strokeWidth={2}
//                       fillOpacity={1}
//                       fill="url(#colorEngagement)"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Platform Breakdown */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.5 }}
//         >
//           <Card className="h-full hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-lg font-semibold">Platform Breakdown</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {platformData.map((platform) => (
//                   <div key={platform.name}>
//                     <div className="flex items-center justify-between mb-1">
//                       <span className="text-sm font-medium text-gray-700">{platform.name}</span>
//                       <span className="text-sm text-gray-500">{platform.value}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div
//                         className="h-full rounded-full transition-all duration-500"
//                         style={{ width: `${platform.value}%`, backgroundColor: platform.color }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Total Reach</span>
//                   <span className="font-semibold text-gray-900">2.4M</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Quick Actions */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: 0.6 }}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {quickActions.map((action) => (
//                 <Link key={action.name} to={action.href}>
//                   <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center group">
//                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
//                       <action.icon className="w-6 h-6" />
//                     </div>
//                     <p className="font-medium text-gray-900">{action.name}</p>
//                     <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Content & Schedule Row */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Recent Content */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.7 }}
//         >
//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg font-semibold">Recent Content</CardTitle>
//               <Link to="/content">
//                 <Button variant="ghost" size="sm" className="text-purple-600">
//                   View All
//                   <ChevronRight className="w-4 h-4 ml-1" />
//                 </Button>
//               </Link>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentContent.map((content) => (
//                   <div
//                     key={content.id}
//                     className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
//                   >
//                     <img
//                       src={content.image}
//                       alt={content.title}
//                       className="w-16 h-12 rounded-lg object-cover"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">{content.title}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="secondary" className="text-xs capitalize">
//                           {content.type}
//                         </Badge>
//                         <span className="text-xs text-gray-500">{content.publishedAt}</span>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       {content.viralityScore > 0 && (
//                         <div className="flex items-center gap-1">
//                           <Zap className="w-4 h-4 text-amber-500" />
//                           <span className="font-medium text-gray-900">{content.viralityScore}</span>
//                         </div>
//                       )}
//                       {content.views !== '-' && (
//                         <p className="text-xs text-gray-500">{content.views} views</p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Upcoming Schedule */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.8 }}
//         >
//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg font-semibold">Upcoming Schedule</CardTitle>
//               <Link to="/scheduler">
//                 <Button variant="ghost" size="sm" className="text-purple-600">
//                   View All
//                   <ChevronRight className="w-4 h-4 ml-1" />
//                 </Button>
//               </Link>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {upcomingSchedule.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                       <Clock className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900 truncate">{item.content}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="secondary" className="text-xs">
//                           {item.platform}
//                         </Badge>
//                         <span className="text-xs text-gray-500">{item.time}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Trends & More */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Trending Topics */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.9 }}
//         >
//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg font-semibold">Trending Topics</CardTitle>
//               <Link to="/trends">
//                 <Button variant="ghost" size="sm" className="text-purple-600">
//                   <TrendingUp className="w-4 h-4 mr-1" />
//                   Explore
//                 </Button>
//               </Link>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {trendingTopics.map((topic, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
//                   >
//                     <div>
//                       <p className="font-medium text-gray-900">{topic.topic}</p>
//                       <p className="text-xs text-gray-500">{topic.volume} posts</p>
//                     </div>
//                     <Badge className="bg-green-100 text-green-700">
//                       {topic.growth}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* AI Suggestions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 1 }}
//           className="lg:col-span-2"
//         >
//           <Card className="bg-gradient-to-br from-purple-600 to-pink-500 text-white">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg text-white">
//                 <Sparkles className="w-5 h-5" />
//                 AI Content Suggestions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid sm:grid-cols-3 gap-4">
//                 <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
//                   <p className="text-sm font-medium mb-2">Trending Topic</p>
//                   <p className="text-xs text-white/80 mb-3">#AITrends2025 is gaining momentum</p>
//                   <Button size="sm" variant="secondary" className="w-full bg-white text-purple-600 hover:bg-gray-100">
//                     Create Content
//                   </Button>
//                 </div>
//                 <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
//                   <p className="text-sm font-medium mb-2">Optimal Time</p>
//                   <p className="text-xs text-white/80 mb-3">2:00 PM has highest engagement</p>
//                   <Button size="sm" variant="secondary" className="w-full bg-white text-purple-600 hover:bg-gray-100">
//                     Schedule Now
//                   </Button>
//                 </div>
//                 <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
//                   <p className="text-sm font-medium mb-2">Recycle Content</p>
//                   <p className="text-xs text-white/80 mb-3">Your top post can be repurposed</p>
//                   <Button size="sm" variant="secondary" className="w-full bg-white text-purple-600 hover:bg-gray-100">
//                     View Suggestions
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock,
  Eye,
  Heart,
  Sparkles,
  Target,
  BarChart3,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { analyticsApi, contentApi, schedulerApi, trendsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState<any[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Prevent double API calls in React StrictMode
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch once, even in StrictMode
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel with error handling for each
      const results = await Promise.allSettled([
        analyticsApi.getOverview(),
        contentApi.getAll({ limit: 5, page: 1 }),
        analyticsApi.getTrends({ days: 7 }),
        analyticsApi.getPlatforms(),
        schedulerApi.getAll({ upcoming: true }),
        trendsApi.getLive({ limit: 5 }),
      ]);

      // Process overview
      if (results[0].status === 'fulfilled') {
        setOverview(results[0].value.data.data);
      } else {
        console.error('Overview error:', results[0].reason);
      }

      // Process content
      if (results[1].status === 'fulfilled') {
        setRecentContent(results[1].value.data.data || []);
      } else {
        console.error('Content error:', results[1].reason);
      }

      // Process trends
      if (results[2].status === 'fulfilled') {
        setTrendsData(results[2].value.data.data || []);
      } else {
        console.error('Trends error:', results[2].reason);
      }

      // Process platforms
      if (results[3].status === 'fulfilled') {
        setPlatformStats(results[3].value.data.data || []);
      } else {
        console.error('Platforms error:', results[3].reason);
      }

      // Process schedule
      if (results[4].status === 'fulfilled') {
        setUpcomingSchedule(results[4].value.data.data?.slice(0, 3) || []);
      } else {
        console.error('Schedule error:', results[4].reason);
      }

      // Process trending topics
      if (results[5].status === 'fulfilled') {
        const trends = results[5].value.data.data?.trends || [];
        setTrendingTopics(trends.slice(0, 4));
      } else {
        console.error('Trending topics error:', results[5].reason);
      }

      // Check if all requests failed
      const allFailed = results.every(r => r.status === 'rejected');
      if (allFailed) {
        setError('Failed to load dashboard data');
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again.',
          variant: 'destructive',
        });
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateChange = (current: number, change: number) => {
    if (!change) return '+0%';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => {
            hasFetched.current = false;
            fetchDashboardData();
          }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Views',
      value: formatNumber(overview?.performance?.views || 0),
      change: calculateChange(
        overview?.performance?.views || 0,
        overview?.trends?.viewsChange || 0
      ),
      trend: (overview?.trends?.viewsChange || 0) >= 0 ? 'up' : 'down',
      icon: Eye,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Engagement Rate',
      value: overview?.performance?.engagement ? 
        `${overview.performance.engagement.toFixed(1)}%` : '0%',
      change: calculateChange(
        overview?.performance?.engagement || 0,
        overview?.trends?.engagementChange || 0
      ),
      trend: (overview?.trends?.engagementChange || 0) >= 0 ? 'up' : 'down',
      icon: Heart,
      color: 'bg-rose-100 text-rose-700',
    },
    {
      title: 'Total Content',
      value: overview?.content?.total || 0,
      change: `${overview?.content?.published || 0} published`,
      trend: 'up',
      icon: FileText,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Scheduled',
      value: overview?.content?.scheduled || 0,
      change: `${overview?.content?.draft || 0} drafts`,
      trend: 'neutral',
      icon: Clock,
      color: 'bg-amber-100 text-amber-700',
    },
  ];

  const platformColors = {
    twitter: '#1DA1F2',
    instagram: '#E4405F',
    linkedin: '#0A66C2',
    facebook: '#1877F2',
    tiktok: '#000000',
  };

  const platformChartData = platformStats.map((platform) => ({
    name: platform._id || platform.platform,
    value: platform.posts || platform.totalViews || 0,
    color: platformColors[platform._id?.toLowerCase() as keyof typeof platformColors] || '#8b5cf6',
  }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your content overview.</p>
        </div>
        <Link to="/content/new">
          <Button className="btn-purple">
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === 'up' && (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    )}
                    {stat.trend === 'down' && (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === 'up'
                          ? 'text-green-600'
                          : stat.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Engagement Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {platformChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={platformChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {platformChartData.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        <span className="text-sm capitalize">{platform.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatNumber(platform.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No platform data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content and Schedule */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Content</CardTitle>
            <Link to="/content">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentContent.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No content yet</p>
                <Link to="/content/new">
                  <Button className="btn-purple">Create Your First Content</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div
                    key={content._id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{content.title}</h4>
                        <Badge
                          variant={
                            content.status === 'published'
                              ? 'default'
                              : content.status === 'scheduled'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {content.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {content.platform} • {content.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {content.status === 'published' 
                          ? formatNumber(content.performance?.views || 0) + ' views'
                          : '-'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {content.publishedAt 
                          ? getTimeAgo(content.publishedAt)
                          : getTimeAgo(content.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Schedule</CardTitle>
            <Link to="/scheduler">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingSchedule.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No scheduled posts</p>
                <Link to="/scheduler">
                  <Button className="btn-purple">Schedule a Post</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSchedule.map((schedule) => (
                  <div
                    key={schedule._id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {schedule.platforms?.join(', ')}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(schedule.scheduledAt).toLocaleString()}
                      </p>
                      <Badge variant="outline">{schedule.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Trending Topics</CardTitle>
          <Link to="/trends">
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {trendingTopics.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trending topics available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingTopics.map((trend, index) => (
                <div
                  key={trend._id || index}
                  className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">
                      +{trend.growth?.toFixed(0) || 0}%
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {trend.keyword}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatNumber(trend.volume || 0)} mentions
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}