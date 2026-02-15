import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Sparkles,
  Repeat,
  Zap,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { schedulerApi, contentApi } from '@/services/api';
import type { Schedule, Content } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
};

const platformColors = {
  instagram: 'bg-pink-100 text-pink-700',
  twitter: 'bg-blue-100 text-blue-700',
  linkedin: 'bg-blue-100 text-blue-800',
  facebook: 'bg-blue-100 text-blue-600',
  youtube: 'bg-red-100 text-red-700',
};

interface ScheduleWithContent extends Omit<Schedule, 'content'> {
  content?: Content;
}

interface OptimalTime {
  day: string;
  times: string[];
}

export default function Scheduler() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState('calendar');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduleWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleWithContent[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [stats, setStats] = useState({
    scheduled: 0,
    thisWeek: 0,
    published: 0,
    queue: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    contentId: '',
    platforms: [] as string[],
    scheduledAt: '',
    timezone: 'UTC',
  });
  const [submitting, setSubmitting] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await schedulerApi.getAll({ upcoming: true });
      setSchedules((response.data.data as unknown as ScheduleWithContent[]) || []);
      
      // Calculate stats
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const scheduleData = response.data.data as unknown as ScheduleWithContent[];
      
      setStats({
        scheduled: scheduleData.filter((s) => s.status === 'pending').length,
        thisWeek: scheduleData.filter((s) => {
          const schedDate = new Date(s.scheduledAt);
          return schedDate >= now && schedDate <= weekFromNow;
        }).length,
        published: scheduleData.filter((s) => s.status === 'completed').length,
        queue: scheduleData.filter((s) => s.status === 'processing').length,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch schedules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch contents for dropdown
  const fetchContents = async () => {
    try {
      const response = await contentApi.getAll({ status: 'draft', limit: 100 });
      setContents(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch contents:', error);
    }
  };

  // Fetch optimal times
  const fetchOptimalTimes = async (platform: string = 'twitter') => {
    try {
      const response = await schedulerApi.getOptimalTimes(platform);
      setOptimalTimes(response.data.data || []);
    } catch (error: any) {
      // Silently fail if endpoint doesn't exist - it's optional
      console.log('Optimal times not available:', error.response?.status);
      setOptimalTimes([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchContents();
    fetchOptimalTimes();
  }, []);

  // Create schedule
  // Create schedule
  const handleCreateSchedule = async () => {
    if (!formData.contentId || formData.platforms.length === 0 || !formData.scheduledAt) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Transform platforms array of strings to array of objects as expected by schema
      const platformsData = formData.platforms.map(platformName => ({
        platform: platformName,
        status: 'pending'
      }));

      await schedulerApi.create({
        content: formData.contentId,
        platforms: platformsData,  // Send as array of objects
        scheduledAt: formData.scheduledAt,
      });

      toast({
        title: 'Success',
        description: 'Post scheduled successfully',
      });

      setShowCreateDialog(false);
      setFormData({
        contentId: '',
        platforms: [],
        scheduledAt: '',
        timezone: 'UTC',
      });
      fetchSchedules();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to schedule post',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (id: string) => {
    try {
      await schedulerApi.cancel(id);
      toast({
        title: 'Success',
        description: 'Schedule cancelled successfully',
      });
      fetchSchedules();
      setSelectedPost(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel schedule',
        variant: 'destructive',
      });
    }
  };

  // Auto-schedule feature
  const handleAutoSchedule = async () => {
    try {
      // Get all draft content
      const draftContents = contents.filter(c => c.status === 'draft');
      
      if (draftContents.length === 0) {
        toast({
          title: 'No Content',
          description: 'No draft content available to schedule',
          variant: 'destructive',
        });
        return;
      }

      // Create schedules for next 7 days
      const schedules = draftContents.slice(0, 7).map((content, index) => {
        const scheduleDate = new Date();
        scheduleDate.setDate(scheduleDate.getDate() + index + 1);
        scheduleDate.setHours(14, 0, 0, 0); // 2 PM optimal time

        return {
          content: content._id,
          platforms: [content.platform],
          scheduledAt: scheduleDate.toISOString(),
        };
      });

      await schedulerApi.bulkSchedule(schedules);
      
      toast({
        title: 'Success',
        description: `${schedules.length} posts auto-scheduled`,
      });
      
      fetchSchedules();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to auto-schedule',
        variant: 'destructive',
      });
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: 0,
        isCurrentMonth: false,
        posts: [],
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayPosts = schedules.filter(schedule => {
        const schedDate = new Date(schedule.scheduledAt);
        return schedDate.getDate() === i &&
               schedDate.getMonth() === month &&
               schedDate.getFullYear() === year;
      });
      
      days.push({
        date: i,
        isCurrentMonth: true,
        posts: dayPosts,
      });
    }
    
    // Fill remaining cells
    const remaining = 35 - days.length;
    for (let i = 0; i < remaining; i++) {
      days.push({
        date: 0,
        isCurrentMonth: false,
        posts: [],
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Content Scheduler</h1>
          <p className="text-zinc-500">Plan and schedule your content across all platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleAutoSchedule}>
            <Zap className="w-4 h-4 mr-2" />
            Auto-Schedule
          </Button>
          <Button className="btn-primary" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', value: stats.scheduled, icon: Calendar, color: 'bg-blue-100 text-blue-700' },
          { label: 'This Week', value: stats.thisWeek, icon: Clock, color: 'bg-green-100 text-green-700' },
          { label: 'Published', value: stats.published, icon: Check, color: 'bg-purple-100 text-purple-700' },
          { label: 'Queue', value: stats.queue, icon: Repeat, color: 'bg-amber-100 text-amber-700' },
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

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-zinc-200 rounded-lg overflow-hidden">
                {/* Weekday Headers */}
                {weekDays.map((day) => (
                  <div key={day} className="bg-zinc-50 p-3 text-center text-sm font-medium text-zinc-700">
                    {day}
                  </div>
                ))}
                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`bg-white min-h-[100px] p-2 ${
                      !day.isCurrentMonth ? 'bg-zinc-50/50 text-zinc-400' : ''
                    }`}
                  >
                    <span className="text-sm">{day.date > 0 ? day.date : ''}</span>
                    <div className="mt-1 space-y-1">
                      {day.posts.slice(0, 2).map((post) => {
                        const platform = post.platforms?.[0]?.platform || 'twitter';
                        const Icon = platformIcons[platform as keyof typeof platformIcons] || Twitter;
                        return (
                          <div
                            key={post._id}
                            onClick={() => setSelectedPost(post)}
                            className="flex items-center gap-1 p-1 rounded bg-zinc-100 cursor-pointer hover:bg-zinc-200"
                          >
                            <Icon className="w-3 h-3" />
                            <span className="text-[10px] truncate">
                              {post.content?.title || 'Untitled'}
                            </span>
                          </div>
                        );
                      })}
                      {day.posts.length > 2 && (
                        <div className="text-[10px] text-zinc-500 text-center">
                          +{day.posts.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                  <p className="text-zinc-500">No scheduled posts yet</p>
                  <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Your First Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.map((post, index) => {
                    const platform = post.platforms?.[0]?.platform || 'twitter';
                    const Icon = platformIcons[platform as keyof typeof platformIcons] || Twitter;
                    return (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platformColors[platform as keyof typeof platformColors]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 truncate">
                            {post.content?.title || 'Untitled'}
                          </p>
                          <p className="text-sm text-zinc-500 truncate">
                            {post.content?.content || 'No content'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-zinc-900">{formatDate(post.scheduledAt)}</p>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {post.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedPost(post)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDeleteSchedule(post._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Schedule New Post
            </DialogTitle>
            <DialogDescription>
              Create and schedule content for your social media platforms.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 mb-2 block">Content</label>
              <Select value={formData.contentId} onValueChange={(value) => setFormData({ ...formData, contentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content" />
                </SelectTrigger>
                <SelectContent>
                  {contents.length === 0 ? (
                    <SelectItem value="none" disabled>No draft content available</SelectItem>
                  ) : (
                    contents.map((content) => (
                      <SelectItem key={content._id} value={content._id}>
                        {content.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700 mb-2 block">Platforms</label>
              <div className="grid grid-cols-2 gap-2">
                {['twitter', 'linkedin', 'instagram', 'facebook'].map((platform) => {
                  const Icon = platformIcons[platform as keyof typeof platformIcons];
                  const isSelected = formData.platforms.includes(platform);
                  return (
                    <Button
                      key={platform}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      className="justify-start"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          platforms: isSelected
                            ? formData.platforms.filter(p => p !== platform)
                            : [...formData.platforms, platform],
                        });
                      }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700 mb-2 block">Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
            </div>

            {optimalTimes.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Optimal times today: <strong>{optimalTimes[0]?.times.join(', ')}</strong>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button className="btn-primary" onClick={handleCreateSchedule} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const platform = selectedPost.platforms?.[0]?.platform || 'twitter';
                    const Icon = platformIcons[platform as keyof typeof platformIcons] || Twitter;
                    return (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platformColors[platform as keyof typeof platformColors]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    );
                  })()}
                  <div>
                    <DialogTitle>{selectedPost.content?.title || 'Untitled'}</DialogTitle>
                    <DialogDescription>
                      Scheduled for {formatDate(selectedPost.scheduledAt)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4">
                <p className="text-zinc-700">{selectedPost.content?.content || 'No content'}</p>

                <div className="flex items-center gap-4 mt-6 p-4 bg-zinc-50 rounded-lg">
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-zinc-900 capitalize">{selectedPost.status}</p>
                    <p className="text-xs text-zinc-500">Status</p>
                  </div>
                  <div className="w-px h-12 bg-zinc-200" />
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-zinc-900">{selectedPost.platforms?.length || 0}</p>
                    <p className="text-xs text-zinc-500">Platforms</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleDeleteSchedule(selectedPost._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel Schedule
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}