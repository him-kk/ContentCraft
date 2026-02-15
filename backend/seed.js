// seed.js - Final fixed version
// Usage: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import your models
const User = require('./models/User');
const Content = require('./models/Content');
const Schedule = require('./models/Schedule');
const Analytics = require('./models/Analytics');
const Trend = require('./models/Trend');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contentcraft', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('📦 Connected to MongoDB');
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Content.deleteMany({});
    await Schedule.deleteMany({});
    await Analytics.deleteMany({});
    await Trend.deleteMany({});
    
    // Create demo user
    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@contentcraft.com',
      password: 'password123',
      isEmailVerified: true,
      preferences: {
        theme: 'dark',
        defaultPlatform: 'twitter',
        brandVoice: {
          tone: 'professional',
        },
      },
      subscription: {
        plan: 'pro',
        status: 'active',
        limits: {
          aiGenerations: 1000,
          imageGenerations: 500,
          scheduledPosts: 100,
          teamMembers: 5,
        },
      },
    });
    
    console.log('✅ Demo user created:', demoUser.email);
    console.log('   Password: password123');
    
    // Create sample content
    console.log('📝 Creating sample content...');
    
    const contentData = [
      {
        user: demoUser._id,
        title: '10 AI Trends Shaping 2025',
        content: 'Artificial Intelligence is revolutionizing how we create and consume content. From generative AI to predictive analytics, discover the top 10 trends that will define the future of digital content creation. #AI #ContentCreation #Tech',
        type: 'blog',
        platform: 'twitter',
        tone: 'professional',
        status: 'published',
        tags: ['AI', 'Technology', 'Trends'],
        hashtags: ['#AI', '#ContentCreation', '#Tech'],
        performance: {
          views: 12543,
          likes: 1204,
          comments: 89,
          shares: 234,
          impressions: 18000,
          reach: 15000,
        },
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        title: 'The Future of Remote Work',
        content: 'Remote work is here to stay. Learn how companies are adapting their strategies for a hybrid workforce and the tools that make distributed teams successful.',
        type: 'social',
        platform: 'linkedin',
        tone: 'professional',
        status: 'published',
        tags: ['Remote Work', 'Business', 'Productivity'],
        hashtags: ['#RemoteWork', '#WorkFromHome', '#Productivity'],
        performance: {
          views: 8921,
          likes: 567,
          comments: 45,
          shares: 123,
          impressions: 12000,
          reach: 9500,
        },
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        title: 'Quick Tips for Better Social Media Engagement',
        content: 'Boost your social media presence with these proven strategies: 1) Post consistently 2) Use trending hashtags 3) Engage with your audience 4) Share valuable content 5) Analyze your metrics',
        type: 'social',
        platform: 'instagram',
        tone: 'casual',
        status: 'published',
        tags: ['Social Media', 'Marketing', 'Tips'],
        hashtags: ['#SocialMedia', '#Marketing', '#Tips'],
        performance: {
          views: 15678,
          likes: 2341,
          comments: 178,
          shares: 445,
          impressions: 22000,
          reach: 18000,
        },
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        title: 'Understanding Machine Learning Basics',
        content: 'A comprehensive guide to machine learning fundamentals. This article covers supervised learning, unsupervised learning, neural networks, and practical applications.',
        type: 'blog',
        platform: 'blog',
        tone: 'professional',
        status: 'draft',
        tags: ['Machine Learning', 'AI', 'Education'],
        performance: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          impressions: 0,
          reach: 0,
        },
      },
      {
        user: demoUser._id,
        title: 'Productivity Hacks for Entrepreneurs',
        content: 'Time is money! Discover the productivity techniques used by successful entrepreneurs to maximize their output and achieve more in less time.',
        type: 'social',
        platform: 'twitter',
        tone: 'inspirational',
        status: 'published',
        tags: ['Productivity', 'Entrepreneurship', 'Business'],
        hashtags: ['#Productivity', '#Entrepreneur', '#Business'],
        performance: {
          views: 9234,
          likes: 876,
          comments: 67,
          shares: 189,
          impressions: 13000,
          reach: 10500,
        },
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        title: 'Content Marketing Strategy Guide',
        content: 'Build a winning content marketing strategy from scratch. Learn how to identify your audience, create compelling content, and measure success.',
        type: 'blog',
        platform: 'linkedin',
        tone: 'professional',
        status: 'scheduled',
        tags: ['Marketing', 'Content Strategy', 'Business'],
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        performance: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          impressions: 0,
          reach: 0,
        },
      },
      {
        user: demoUser._id,
        title: 'Social Media Algorithm Changes 2025',
        content: 'Stay ahead of the curve! Here are the latest social media algorithm updates and how to optimize your content for maximum visibility.',
        type: 'social',
        platform: 'instagram',
        tone: 'friendly',
        status: 'published',
        tags: ['Social Media', 'Algorithms', 'Marketing'],
        hashtags: ['#SocialMedia', '#Algorithm', '#Marketing'],
        performance: {
          views: 11234,
          likes: 1456,
          comments: 123,
          shares: 267,
          impressions: 16000,
          reach: 13500,
        },
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        title: 'Building Your Personal Brand Online',
        content: 'Your personal brand is your most valuable asset. Learn how to build, maintain, and grow your online presence across multiple platforms.',
        type: 'blog',
        platform: 'blog',
        tone: 'inspirational',
        status: 'draft',
        tags: ['Personal Brand', 'Career', 'Marketing'],
        performance: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          impressions: 0,
          reach: 0,
        },
      },
    ];
    
    const createdContent = await Content.insertMany(contentData);
    console.log(`✅ Created ${createdContent.length} content items`);
    
    // Calculate engagement rates
    for (const content of createdContent) {
      if (content.performance.impressions > 0) {
        content.calculateEngagementRate();
        await content.save();
      }
    }
    
    // Create scheduled posts
    console.log('📅 Creating scheduled posts...');
    
    const scheduleData = [
      {
        user: demoUser._id,
        content: createdContent[5]._id,
        platforms: [
          { platform: 'linkedin', status: 'pending' },
          { platform: 'twitter', status: 'pending' },
        ],
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        timezone: 'UTC',
      },
      {
        user: demoUser._id,
        content: createdContent[3]._id,
        platforms: [
          { platform: 'blog', status: 'pending' },
        ],
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending',
        timezone: 'UTC',
      },
      {
        user: demoUser._id,
        content: createdContent[7]._id,
        platforms: [
          { platform: 'instagram', status: 'pending' },
          { platform: 'facebook', status: 'pending' },
        ],
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        timezone: 'UTC',
      },
    ];
    
    const createdSchedules = await Schedule.insertMany(scheduleData);
    console.log(`✅ Created ${createdSchedules.length} scheduled posts`);
    
    // Create analytics data
    console.log('📊 Creating analytics data...');
    
    const analyticsData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      
      const totalViews = Math.floor(Math.random() * 5000) + 3000;
      const totalLikes = Math.floor(Math.random() * 500) + 200;
      const totalComments = Math.floor(Math.random() * 100) + 50;
      const totalShares = Math.floor(Math.random() * 200) + 100;
      const totalImpressions = Math.floor(totalViews * 1.5);
      
      analyticsData.push({
        user: demoUser._id,
        date,
        period: 'day',
        overview: {
          totalContent: Math.floor(Math.random() * 10) + 5,
          publishedContent: Math.floor(Math.random() * 8) + 3,
          scheduledContent: Math.floor(Math.random() * 3) + 1,
          totalViews,
          totalLikes,
          totalComments,
          totalShares,
          totalImpressions,
          averageEngagementRate: ((totalLikes + totalComments + totalShares) / totalImpressions * 100).toFixed(2),
          totalReach: Math.floor(totalViews * 0.8),
        },
        byPlatform: {
          twitter: {
            posts: Math.floor(Math.random() * 3) + 1,
            views: Math.floor(totalViews * 0.3),
            likes: Math.floor(totalLikes * 0.3),
            comments: Math.floor(totalComments * 0.3),
            shares: Math.floor(totalShares * 0.4),
            engagementRate: (Math.random() * 5 + 3).toFixed(2),
            reach: Math.floor(totalViews * 0.25),
          },
          linkedin: {
            posts: Math.floor(Math.random() * 2) + 1,
            views: Math.floor(totalViews * 0.25),
            likes: Math.floor(totalLikes * 0.25),
            comments: Math.floor(totalComments * 0.35),
            shares: Math.floor(totalShares * 0.25),
            engagementRate: (Math.random() * 6 + 4).toFixed(2),
            reach: Math.floor(totalViews * 0.2),
          },
          instagram: {
            posts: Math.floor(Math.random() * 3) + 1,
            views: Math.floor(totalViews * 0.35),
            likes: Math.floor(totalLikes * 0.35),
            comments: Math.floor(totalComments * 0.25),
            shares: Math.floor(totalShares * 0.25),
            engagementRate: (Math.random() * 8 + 5).toFixed(2),
            reach: Math.floor(totalViews * 0.3),
          },
          facebook: {
            posts: Math.floor(Math.random() * 2),
            views: Math.floor(totalViews * 0.1),
            likes: Math.floor(totalLikes * 0.1),
            comments: Math.floor(totalComments * 0.1),
            shares: Math.floor(totalShares * 0.1),
            engagementRate: (Math.random() * 4 + 2).toFixed(2),
            reach: Math.floor(totalViews * 0.08),
          },
        },
      });
    }
    
    await Analytics.insertMany(analyticsData);
    console.log(`✅ Created ${analyticsData.length} days of analytics data`);
    
    // Create trends data - ONLY use valid platforms: twitter, reddit, tiktok, youtube, google, news
    console.log('📈 Creating trends data...');
    
    const trendsData = [
      {
        keyword: 'AI Revolution',
        platforms: [
          {
            platform: 'twitter', // ✅ Valid
            mentions: 125000,
            velocity: 5200,
            sentiment: 'positive',
          },
          {
            platform: 'reddit', // ✅ Valid
            mentions: 45000,
            velocity: 1800,
            sentiment: 'mixed',
          },
        ],
        totalMentions: 170000,
        velocity: 7000,
        velocityChange: 45.5,
        lifecycle: 'rising',
        categories: ['Technology', 'Innovation'],
        relatedKeywords: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
        hashtags: ['#AI', '#MachineLearning', '#Tech'],
        sentiment: {
          overall: 'positive',
          score: 0.75,
        },
        isActive: true,
      },
      {
        keyword: 'Remote Work',
        platforms: [
          {
            platform: 'twitter', // ✅ Valid
            mentions: 89000,
            velocity: 3700,
            sentiment: 'neutral',
          },
          {
            platform: 'news', // ✅ Valid
            mentions: 34000,
            velocity: 1400,
            sentiment: 'neutral',
          },
        ],
        totalMentions: 123000,
        velocity: 5100,
        velocityChange: 23.2,
        lifecycle: 'peaking',
        categories: ['Business', 'Work Culture'],
        relatedKeywords: ['Work From Home', 'Hybrid Work', 'Digital Nomad'],
        hashtags: ['#RemoteWork', '#WorkFromHome', '#Productivity'],
        sentiment: {
          overall: 'neutral',
          score: 0.05,
        },
        isActive: true,
      },
      {
        keyword: 'Content Marketing',
        platforms: [
          {
            platform: 'twitter', // ✅ Valid
            mentions: 67500,
            velocity: 2800,
            sentiment: 'positive',
          },
          {
            platform: 'youtube', // ✅ Valid
            mentions: 28000,
            velocity: 1200,
            sentiment: 'positive',
          },
        ],
        totalMentions: 95500,
        velocity: 4000,
        velocityChange: 18.7,
        lifecycle: 'rising',
        categories: ['Marketing', 'Digital Media'],
        relatedKeywords: ['Content Strategy', 'Social Media Marketing', 'SEO'],
        hashtags: ['#ContentMarketing', '#DigitalMarketing', '#SocialMedia'],
        sentiment: {
          overall: 'positive',
          score: 0.6,
        },
        isActive: true,
      },
      {
        keyword: 'Sustainability',
        platforms: [
          {
            platform: 'twitter', // ✅ Valid
            mentions: 156000,
            velocity: 6500,
            sentiment: 'positive',
          },
          {
            platform: 'tiktok', // ✅ Valid
            mentions: 89000,
            velocity: 3700,
            sentiment: 'positive',
          },
        ],
        totalMentions: 245000,
        velocity: 10200,
        velocityChange: 67.3,
        lifecycle: 'peaking',
        categories: ['Environment', 'Green Tech'],
        relatedKeywords: ['Climate Change', 'Green Energy', 'Eco Friendly'],
        hashtags: ['#Sustainability', '#ClimateAction', '#GreenLiving'],
        sentiment: {
          overall: 'positive',
          score: 0.8,
        },
        isActive: true,
      },
      {
        keyword: 'Web3',
        platforms: [
          {
            platform: 'twitter', // ✅ Valid
            mentions: 98000,
            velocity: 4100,
            sentiment: 'mixed',
          },
          {
            platform: 'reddit', // ✅ Valid
            mentions: 56000,
            velocity: 2300,
            sentiment: 'mixed',
          },
        ],
        totalMentions: 154000,
        velocity: 6400,
        velocityChange: 89.1,
        lifecycle: 'rising',
        categories: ['Technology', 'Blockchain'],
        relatedKeywords: ['Blockchain', 'Cryptocurrency', 'Decentralization'],
        hashtags: ['#Web3', '#Blockchain', '#Crypto'],
        sentiment: {
          overall: 'mixed',
          score: 0.15,
        },
        isActive: true,
      },
    ];
    
    await Trend.insertMany(trendsData);
    console.log(`✅ Created ${trendsData.length} trending topics`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: demo@contentcraft.com');
    console.log('   Password: password123');
    console.log('\n📊 Summary:');
    console.log(`   ✅ 1 demo user`);
    console.log(`   ✅ ${createdContent.length} content items`);
    console.log(`   ✅ ${createdSchedules.length} scheduled posts`);
    console.log(`   ✅ 30 days of analytics data`);
    console.log(`   ✅ ${trendsData.length} trending topics`);
    console.log('\n🚀 You can now login to your frontend!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
});