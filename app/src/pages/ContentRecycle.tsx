import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Recycle,
  TrendingUp,
  Calendar,
  Sparkles,
  RefreshCw,
  Check,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Filter,
  Search,
  Wand2,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
  DialogFooter,
} from '@/components/ui/dialog';

const recyclableContent = [
  {
    id: '1',
    title: '10 AI Trends Shaping 2025',
    type: 'blog',
    originalPlatform: 'Blog',
    publishDate: '2024-01-15',
    performance: {
      views: 45000,
      likes: 3200,
      comments: 180,
      shares: 890,
    },
    viralityScore: 87,
    suggestions: [
      { platform: 'Twitter', format: 'Thread', potential: 85 },
      { platform: 'LinkedIn', format: 'Article', potential: 78 },
      { platform: 'Instagram', format: 'Carousel', potential: 72 },
    ],
    lastRecycled: null,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=150&fit=crop',
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Remote Work',
    type: 'video',
    originalPlatform: 'YouTube',
    publishDate: '2024-02-01',
    performance: {
      views: 125000,
      likes: 8900,
      comments: 560,
      shares: 2300,
    },
    viralityScore: 92,
    suggestions: [
      { platform: 'Blog', format: 'Written Guide', potential: 88 },
      { platform: 'Twitter', format: 'Tips Thread', potential: 82 },
      { platform: 'TikTok', format: 'Short Clips', potential: 90 },
    ],
    lastRecycled: '2024-03-01',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=150&fit=crop',
  },
  {
    id: '3',
    title: '5 Productivity Hacks for Developers',
    type: 'social',
    originalPlatform: 'Twitter',
    publishDate: '2024-01-28',
    performance: {
      views: 28000,
      likes: 2100,
      comments: 95,
      shares: 450,
    },
    viralityScore: 76,
    suggestions: [
      { platform: 'LinkedIn', format: 'Article', potential: 80 },
      { platform: 'Instagram', format: 'Reel', potential: 75 },
      { platform: 'Blog', format: 'Expanded Post', potential: 82 },
    ],
    lastRecycled: null,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop',
  },
  {
    id: '4',
    title: 'Building a Personal Brand in Tech',
    type: 'blog',
    originalPlatform: 'Medium',
    publishDate: '2024-02-10',
    performance: {
      views: 32000,
      likes: 1800,
      comments: 120,
      shares: 670,
    },
    viralityScore: 81,
    suggestions: [
      { platform: 'LinkedIn', format: 'Post Series', potential: 85 },
      { platform: 'Twitter', format: 'Thread', potential: 78 },
      { platform: 'YouTube', format: 'Video', potential: 72 },
    ],
    lastRecycled: null,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=150&fit=crop',
  },
];

const seasonalContent = [
  {
    id: '5',
    title: 'Year-End Review: Content Strategy',
    type: 'blog',
    season: 'Q4',
    performance: {
      views: 67000,
      likes: 4500,
      comments: 320,
      shares: 1800,
    },
    viralityScore: 89,
    nextRecommended: '2024-12-01',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop',
  },
  {
    id: '6',
    title: 'New Year, New Goals: Setting Content Objectives',
    type: 'social',
    season: 'Q1',
    performance: {
      views: 54000,
      likes: 3800,
      comments: 280,
      shares: 1500,
    },
    viralityScore: 85,
    nextRecommended: '2025-01-01',
    image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=200&h=150&fit=crop',
  },
];

export default function ContentRecycle() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<typeof recyclableContent[0] | null>(null);
  const [isRecycling, setIsRecycling] = useState(false);
  const [showRecycleDialog, setShowRecycleDialog] = useState(false);
  const [recycledContent, setRecycledContent] = useState<string[]>([]);

  const filteredContent = recyclableContent.filter((content) =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecycle = async (contentId: string) => {
    setIsRecycling(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRecycledContent([...recycledContent, contentId]);
    setIsRecycling(false);
    setShowRecycleDialog(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Content Recycling</h1>
          <p className="text-zinc-500">Transform your top-performing content for maximum reach.</p>
        </div>
        <Badge className="bg-green-100 text-green-700 w-fit">
          <Recycle className="w-3 h-3 mr-1" />
          Smart Suggestions
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Recyclable Content', value: '24', icon: RefreshCw, color: 'bg-blue-100 text-blue-700' },
          { label: 'Recycled This Month', value: '8', icon: Check, color: 'bg-green-100 text-green-700' },
          { label: 'Avg Performance Boost', value: '+45%', icon: TrendingUp, color: 'bg-amber-100 text-amber-700' },
          { label: 'Time Saved', value: '12h', icon: Clock, color: 'bg-purple-100 text-purple-700' },
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search content to recycle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="performance">
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="virality">Virality Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="suggestions">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="recycled">Recycled</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex">
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-32 h-full object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {content.originalPlatform}
                          </Badge>
                          <h3 className="font-semibold text-zinc-900 line-clamp-2">{content.title}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{content.viralityScore}</span>
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(content.performance.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {formatNumber(content.performance.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {content.performance.comments}
                        </span>
                      </div>

                      {/* Suggestions */}
                      <div className="mt-4">
                        <p className="text-xs text-zinc-500 mb-2">Recycle as:</p>
                        <div className="flex flex-wrap gap-2">
                          {content.suggestions.slice(0, 2).map((suggestion, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-zinc-100"
                            >
                              {suggestion.platform} ({suggestion.potential}%)
                            </Badge>
                          ))}
                          {content.suggestions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{content.suggestions.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedContent(content);
                            setShowRecycleDialog(true);
                          }}
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Recycle
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {seasonalContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex">
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-32 h-full object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-2 bg-amber-100 text-amber-700">
                            <Calendar className="w-3 h-3 mr-1" />
                            {content.season}
                          </Badge>
                          <h3 className="font-semibold text-zinc-900 line-clamp-2">{content.title}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{content.viralityScore}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-zinc-500">
                          Next recommended: <span className="font-medium">{content.nextRecommended}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recycled" className="mt-6">
          {recycledContent.length > 0 ? (
            <div className="space-y-4">
              {recycledContent.map((id) => {
                const content = recyclableContent.find(c => c.id === id);
                if (!content) return null;
                return (
                  <Card key={id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-zinc-900">{content.title}</h4>
                          <p className="text-sm text-zinc-500">Recycled successfully</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Recycle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">No recycled content yet</h3>
                <p className="text-sm text-zinc-500 mb-4">
                  Start recycling your top-performing content to maximize reach.
                </p>
                <Button onClick={() => {}}>
                  View Suggestions
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Recycle Dialog */}
      <Dialog open={showRecycleDialog} onOpenChange={setShowRecycleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Recycle Content
            </DialogTitle>
            <DialogDescription>
              Choose how you want to transform "{selectedContent?.title}"
            </DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4 py-4">
              {selectedContent.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 border border-zinc-200 rounded-lg hover:border-zinc-900 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-900">{suggestion.platform}</p>
                      <p className="text-sm text-zinc-500">{suggestion.format}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700">
                        {suggestion.potential}% potential
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecycleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedContent && handleRecycle(selectedContent.id)}
              disabled={isRecycling}
            >
              {isRecycling ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Recycling...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Recycle Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
