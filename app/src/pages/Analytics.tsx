// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   BarChart3,
//   TrendingUp,
//   Users,
//   Eye,
//   Heart,
//   Calendar,
//   Download,
//   Instagram,
//   Twitter,
//   Linkedin,
//   Facebook,
//   Youtube,
//   ArrowUpRight,
//   ArrowDownRight,
//   Target,
//   Clock,
//   Globe,
//   Smartphone,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   BarChart,
//   Bar,
// } from 'recharts';

// const platformIcons = {
//   instagram: Instagram,
//   twitter: Twitter,
//   linkedin: Linkedin,
//   facebook: Facebook,
//   youtube: Youtube,
// };

// const performanceData = [
//   { date: 'Jan 1', views: 12000, engagement: 850, followers: 42000 },
//   { date: 'Jan 5', views: 15000, engagement: 1100, followers: 42500 },
//   { date: 'Jan 10', views: 18000, engagement: 1400, followers: 43200 },
//   { date: 'Jan 15', views: 22000, engagement: 1800, followers: 44100 },
//   { date: 'Jan 20', views: 19000, engagement: 1500, followers: 44800 },
//   { date: 'Jan 25', views: 25000, engagement: 2100, followers: 45800 },
//   { date: 'Jan 30', views: 28000, engagement: 2400, followers: 47000 },
// ];

// const platformData = [
//   { name: 'Instagram', value: 35, color: '#E4405F', views: '850K', engagement: '4.2%' },
//   { name: 'Twitter', value: 28, color: '#1DA1F2', views: '680K', engagement: '3.8%' },
//   { name: 'LinkedIn', value: 22, color: '#0A66C2', views: '540K', engagement: '5.1%' },
//   { name: 'TikTok', value: 15, color: '#000000', views: '360K', engagement: '8.7%' },
// ];

// const topContent = [
//   {
//     id: '1',
//     title: '10 AI Trends for 2025',
//     platform: 'linkedin',
//     views: 125000,
//     likes: 8900,
//     comments: 560,
//     shares: 2300,
//     engagement: 9.2,
//     growth: 127,
//   },
//   {
//     id: '2',
//     title: 'Remote Work Best Practices',
//     platform: 'twitter',
//     views: 98000,
//     likes: 6700,
//     comments: 420,
//     shares: 1800,
//     engagement: 8.9,
//     growth: 89,
//   },
//   {
//     id: '3',
//     title: 'Building Your Personal Brand',
//     platform: 'instagram',
//     views: 87000,
//     likes: 12400,
//     comments: 380,
//     shares: 1200,
//     engagement: 16.1,
//     growth: 65,
//   },
//   {
//     id: '4',
//     title: 'Content Strategy Guide',
//     platform: 'linkedin',
//     views: 76000,
//     likes: 5200,
//     comments: 340,
//     shares: 1500,
//     engagement: 9.3,
//     growth: 45,
//   },
// ];

// const audienceData = {
//   devices: [
//     { name: 'Mobile', value: 68, color: '#3B82F6' },
//     { name: 'Desktop', value: 28, color: '#8B5CF6' },
//     { name: 'Tablet', value: 4, color: '#10B981' },
//   ],
//   sources: [
//     { name: 'Direct', value: 42 },
//     { name: 'Social', value: 35 },
//     { name: 'Search', value: 18 },
//     { name: 'Referral', value: 5 },
//   ],
// };

// const hourlyEngagement = [
//   { hour: '6AM', engagement: 15 },
//   { hour: '8AM', engagement: 35 },
//   { hour: '10AM', engagement: 55 },
//   { hour: '12PM', engagement: 70 },
//   { hour: '2PM', engagement: 95 },
//   { hour: '4PM', engagement: 80 },
//   { hour: '6PM', engagement: 60 },
//   { hour: '8PM', engagement: 45 },
//   { hour: '10PM', engagement: 25 },
// ];

// export default function Analytics() {
//   const [dateRange, setDateRange] = useState('30d');

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M';
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-zinc-900">Analytics Dashboard</h1>
//           <p className="text-zinc-500">Track your content performance across all platforms.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Select value={dateRange} onValueChange={setDateRange}>
//             <SelectTrigger className="w-36">
//               <Calendar className="w-4 h-4 mr-2" />
//               <SelectValue placeholder="Date Range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7d">Last 7 days</SelectItem>
//               <SelectItem value="30d">Last 30 days</SelectItem>
//               <SelectItem value="90d">Last 90 days</SelectItem>
//               <SelectItem value="1y">Last year</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="outline">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label: 'Total Views', value: '2.4M', change: '+12.5%', trend: 'up', icon: Eye, color: 'bg-blue-100 text-blue-700' },
//           { label: 'Engagement', value: '184K', change: '+8.3%', trend: 'up', icon: Heart, color: 'bg-rose-100 text-rose-700' },
//           { label: 'Followers', value: '48.2K', change: '+5.2%', trend: 'up', icon: Users, color: 'bg-purple-100 text-purple-700' },
//           { label: 'Avg Engagement', value: '7.7%', change: '+1.2%', trend: 'up', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
//         ].map((stat, index) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.1 }}
//           >
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
//                     <stat.icon className="w-5 h-5" />
//                   </div>
//                   <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
//                     {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
//                     {stat.change}
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
//                   <p className="text-sm text-zinc-500">{stat.label}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       <Tabs defaultValue="overview">
//         <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="platforms">Platforms</TabsTrigger>
//           <TabsTrigger value="content">Content</TabsTrigger>
//           <TabsTrigger value="audience">Audience</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="mt-6 space-y-6">
//           {/* Performance Chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg">
//                 <BarChart3 className="w-5 h-5 text-zinc-700" />
//                 Performance Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[350px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={performanceData}>
//                     <defs>
//                       <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
//                         <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                       </linearGradient>
//                       <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#E11D48" stopOpacity={0.1}/>
//                         <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
//                     <XAxis dataKey="date" stroke="#71717A" fontSize={12} />
//                     <YAxis stroke="#71717A" fontSize={12} />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: 'white',
//                         border: '1px solid #E4E4E7',
//                         borderRadius: '8px',
//                       }}
//                     />
//                     <Legend />
//                     <Area
//                       type="monotone"
//                       dataKey="views"
//                       name="Views"
//                       stroke="#3B82F6"
//                       strokeWidth={2}
//                       fillOpacity={1}
//                       fill="url(#colorViews)"
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="engagement"
//                       name="Engagement"
//                       stroke="#E11D48"
//                       strokeWidth={2}
//                       fillOpacity={1}
//                       fill="url(#colorEngagement)"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Hourly Engagement */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg">
//                 <Clock className="w-5 h-5 text-zinc-700" />
//                 Best Times to Post
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[250px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={hourlyEngagement}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
//                     <XAxis dataKey="hour" stroke="#71717A" fontSize={12} />
//                     <YAxis stroke="#71717A" fontSize={12} />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: 'white',
//                         border: '1px solid #E4E4E7',
//                         borderRadius: '8px',
//                       }}
//                     />
//                     <Bar dataKey="engagement" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="platforms" className="mt-6">
//           <div className="grid lg:grid-cols-2 gap-6">
//             {/* Platform Distribution */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Globe className="w-5 h-5 text-zinc-700" />
//                   Platform Distribution
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={platformData}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={100}
//                         paddingAngle={5}
//                         dataKey="value"
//                       >
//                         {platformData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Platform Stats */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Platform Performance</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {platformData.map((platform, index) => {
//                     const Icon = platformIcons[platform.name.toLowerCase() as keyof typeof platformIcons];
//                     return (
//                       <div key={index} className="flex items-center gap-4 p-3 bg-zinc-50 rounded-lg">
//                         <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: platform.color + '20' }}>
//                           <Icon className="w-5 h-5" style={{ color: platform.color }} />
//                         </div>
//                         <div className="flex-1">
//                           <p className="font-medium text-zinc-900">{platform.name}</p>
//                           <div className="flex items-center gap-4 mt-1">
//                             <span className="text-xs text-zinc-500">{platform.views} views</span>
//                             <span className="text-xs text-zinc-500">{platform.engagement} engagement</span>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-zinc-900">{platform.value}%</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="content" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Top Performing Content</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {topContent.map((content, index) => {
//                   const Icon = platformIcons[content.platform as keyof typeof platformIcons];
//                   return (
//                     <motion.div
//                       key={content.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.3, delay: index * 0.1 }}
//                       className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg"
//                     >
//                       <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
//                         <span className="text-sm font-medium">{index + 1}</span>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-zinc-900 truncate">{content.title}</p>
//                         <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
//                           <span className="flex items-center gap-1">
//                             <Icon className="w-3 h-3" />
//                             {content.platform}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Eye className="w-3 h-3" />
//                             {formatNumber(content.views)}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Heart className="w-3 h-3" />
//                             {formatNumber(content.likes)}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-zinc-900">{content.engagement}%</p>
//                         <p className="text-xs text-green-600">+{content.growth}%</p>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="audience" className="mt-6">
//           <div className="grid lg:grid-cols-2 gap-6">
//             {/* Device Breakdown */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Smartphone className="w-5 h-5 text-zinc-700" />
//                   Device Breakdown
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[250px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={audienceData.devices}
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={80}
//                         dataKey="value"
//                         label
//                       >
//                         {audienceData.devices.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Traffic Sources */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Target className="w-5 h-5 text-zinc-700" />
//                   Traffic Sources
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {audienceData.sources.map((source, index) => (
//                     <div key={index}>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium text-zinc-700">{source.name}</span>
//                         <span className="text-sm text-zinc-500">{source.value}%</span>
//                       </div>
//                       <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-zinc-900 rounded-full"
//                           style={{ width: `${source.value}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Download,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  BarChart,
  Bar,
} from 'recharts';
import { analyticsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30');
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [overviewRes, trendsRes, platformsRes] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getTrends({ days: parseInt(timeRange) }),
        analyticsApi.getPlatforms(),
      ]);

      setOverview(overviewRes.data.data);
      setTrends(trendsRes.data.data || []);
      setPlatforms(platformsRes.data.data || []);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
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

  const exportReport = async () => {
    try {
      const response = await analyticsApi.exportReport('csv', {
        start: new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000),
        end: new Date(),
      });
      
      toast({
        title: 'Success',
        description: 'Report exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const platformColors = {
    twitter: '#1DA1F2',
    instagram: '#E4405F',
    linkedin: '#0A66C2',
    facebook: '#1877F2',
  };

  const platformChartData = platforms.map((p) => ({
    name: p._id,
    value: p.posts || 0,
    views: p.totalViews || 0,
    engagement: p.avgEngagement || 0,
    color: platformColors[p._id?.toLowerCase() as keyof typeof platformColors] || '#8b5cf6',
  }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your content performance and growth</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Eye className="w-5 h-5 text-blue-700" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Views</h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(overview?.performance?.views || 0)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <Heart className="w-5 h-5 text-rose-700" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Engagement</h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(overview?.performance?.likes || 0)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-purple-700" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Published</h3>
              <p className="text-3xl font-bold text-gray-900">
                {overview?.content?.published || 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-amber-700" />
                </div>
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Engagement</h3>
              <p className="text-3xl font-bold text-gray-900">
                {(overview?.performance?.engagement || 0).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Performance Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
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
                <Area
                  type="monotone"
                  dataKey="likes"
                  stroke="#ec4899"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
            <div className="space-y-3 mt-4">
              {platformChartData.map((platform, index) => {
                const Icon = platformIcons[platform.name.toLowerCase() as keyof typeof platformIcons];
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" style={{ color: platform.color }} />}
                      <span className="text-sm capitalize">{platform.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{platform.value} posts</p>
                      <p className="text-xs text-gray-500">{platform.engagement.toFixed(1)}% engagement</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}