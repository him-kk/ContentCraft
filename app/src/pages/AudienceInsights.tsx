import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  MapPin,
  Heart,
  AlertCircle,
  Sparkles,
  Download,
  BarChart3,
  PieChart,
  Activity,
  ShoppingBag,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const demographicData = {
  age: [
    { name: '18-24', value: 25, color: '#3B82F6' },
    { name: '25-34', value: 35, color: '#8B5CF6' },
    { name: '35-44', value: 22, color: '#10B981' },
    { name: '45-54', value: 12, color: '#F59E0B' },
    { name: '55+', value: 6, color: '#EF4444' },
  ],
  gender: [
    { name: 'Male', value: 52, color: '#3B82F6' },
    { name: 'Female', value: 45, color: '#EC4899' },
    { name: 'Other', value: 3, color: '#8B5CF6' },
  ],
  location: [
    { name: 'United States', value: 42 },
    { name: 'United Kingdom', value: 18 },
    { name: 'Canada', value: 12 },
    { name: 'Australia', value: 8 },
    { name: 'Germany', value: 6 },
    { name: 'Others', value: 14 },
  ],
};

const interestData = [
  { name: 'Technology', score: 92 },
  { name: 'Business', score: 85 },
  { name: 'Marketing', score: 78 },
  { name: 'Design', score: 72 },
  { name: 'Finance', score: 68 },
  { name: 'Health', score: 65 },
  { name: 'Travel', score: 58 },
  { name: 'Food', score: 52 },
];

const personas = [
  {
    id: '1',
    name: 'Tech-Savvy Professional',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    demographics: {
      age: '25-34',
      location: 'Urban US/UK',
      income: '$75K-$150K',
    },
    interests: ['AI/ML', 'SaaS', 'Productivity', 'Startups'],
    painPoints: [
      'Staying updated with rapidly changing tech',
      'Finding quality content among noise',
      'Time management',
    ],
    contentPreferences: ['In-depth articles', 'Video tutorials', 'Case studies'],
    engagementRate: 8.7,
    purchaseIntent: 78,
  },
  {
    id: '2',
    name: 'Creative Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    demographics: {
      age: '28-40',
      location: 'Global',
      income: '$50K-$100K',
    },
    interests: ['Design', 'Marketing', 'Branding', 'Social Media'],
    painPoints: [
      'Standing out in crowded markets',
      'Creating consistent content',
      'Measuring ROI',
    ],
    contentPreferences: ['Visual content', 'How-to guides', 'Inspiration'],
    engagementRate: 12.3,
    purchaseIntent: 65,
  },
  {
    id: '3',
    name: 'Business Decision Maker',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    demographics: {
      age: '35-50',
      location: 'Major Cities',
      income: '$150K+',
    },
    interests: ['Strategy', 'Leadership', 'Innovation', 'ROI'],
    painPoints: [
      'Making data-driven decisions',
      'Keeping team aligned',
      'Proving content value',
    ],
    contentPreferences: ['Whitepapers', 'Executive summaries', 'Data reports'],
    engagementRate: 5.2,
    purchaseIntent: 92,
  },
];

const contentGaps = [
  {
    topic: 'AI Implementation Guides',
    demand: 89,
    supply: 45,
    opportunity: 'High',
  },
  {
    topic: 'Remote Team Management',
    demand: 76,
    supply: 62,
    opportunity: 'Medium',
  },
  {
    topic: 'Sustainable Business Practices',
    demand: 68,
    supply: 34,
    opportunity: 'High',
  },
  {
    topic: 'No-Code Development',
    demand: 82,
    supply: 71,
    opportunity: 'Medium',
  },
];

export default function AudienceInsights() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Audience Insights</h1>
          <p className="text-zinc-500">Understand your audience with AI-powered persona generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="btn-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Persona
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Audience', value: '48.2K', change: '+5.2%', icon: Users, color: 'bg-blue-100 text-blue-700' },
          { label: 'Avg Engagement', value: '8.7%', change: '+1.2%', icon: Activity, color: 'bg-green-100 text-green-700' },
          { label: 'Personas', value: '12', change: 'Active', icon: Target, color: 'bg-purple-100 text-purple-700' },
          { label: 'Content Gaps', value: '8', change: 'Opportunities', icon: AlertCircle, color: 'bg-amber-100 text-amber-700' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="text-xs text-zinc-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-zinc-700" />
                  Age Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={demographicData.age}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {demographicData.age.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChart className="w-5 h-5 text-zinc-700" />
                  Gender Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={demographicData.gender}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        {demographicData.gender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-zinc-700" />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {demographicData.location.map((loc, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                    <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900">{loc.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full"
                            style={{ width: `${loc.value}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">{loc.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personas" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Persona List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Audience Personas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100">
                  {personas.map((persona) => (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-zinc-50 ${
                        selectedPersona.id === persona.id ? 'bg-zinc-50 border-l-4 border-l-zinc-900' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={persona.avatar} />
                          <AvatarFallback>{persona.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 truncate">{persona.name}</p>
                          <p className="text-xs text-zinc-500">{persona.demographics.age} • {persona.demographics.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Persona Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedPersona.avatar} />
                    <AvatarFallback>{selectedPersona.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedPersona.name}</CardTitle>
                    <p className="text-sm text-zinc-500">
                      {selectedPersona.demographics.age} • {selectedPersona.demographics.location} • {selectedPersona.demographics.income}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-zinc-600">Engagement Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900">{selectedPersona.engagementRate}%</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-zinc-600">Purchase Intent</span>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900">{selectedPersona.purchaseIntent}%</p>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-700 mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPersona.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        <Heart className="w-3 h-3 mr-1" />
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pain Points */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-700 mb-3">Pain Points</h4>
                  <ul className="space-y-2">
                    {selectedPersona.painPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <span className="text-sm text-zinc-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Content Preferences */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-700 mb-3">Content Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPersona.contentPreferences.map((pref, index) => (
                      <Badge key={index} variant="outline">
                        <Bookmark className="w-3 h-3 mr-1" />
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-zinc-700" />
                Audience Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interestData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                    <XAxis type="number" stroke="#71717A" />
                    <YAxis dataKey="name" type="category" stroke="#71717A" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E4E4E7',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-zinc-700" />
                Content Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contentGaps.map((gap, index) => (
                  <div key={index} className="p-4 bg-zinc-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-zinc-900">{gap.topic}</h4>
                      <Badge className={
                        gap.opportunity === 'High' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }>
                        {gap.opportunity} Opportunity
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-zinc-500">Audience Demand</span>
                          <span className="text-xs font-medium">{gap.demand}%</span>
                        </div>
                        <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${gap.demand}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-zinc-500">Current Supply</span>
                          <span className="text-xs font-medium">{gap.supply}%</span>
                        </div>
                        <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-500 rounded-full"
                            style={{ width: `${gap.supply}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-3">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Content
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
