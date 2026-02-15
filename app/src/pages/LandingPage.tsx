import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Recycle,
  Calendar,
  BarChart3,
  ArrowRight,
  Check,
  Play,
  Star,
  MessageCircle,
  Target,
  Clock,
  Globe,
  ChevronDown,
  Brain,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Zap,
    title: 'AI Virality Predictor',
    description: 'Predict content virality with 85%+ accuracy using advanced AI models.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: TrendingUp,
    title: 'Trend Hijacking Engine',
    description: 'Auto-detect and capitalize on trending topics in real-time.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Users,
    title: 'Audience Persona Generator',
    description: 'Create dynamic audience personas from your analytics data.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Recycle,
    title: 'Content Recycling Engine',
    description: 'Auto-transform evergreen content for maximum reach.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Schedule posts at optimal times across all platforms.',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track performance with comprehensive analytics dashboards.',
    color: 'bg-cyan-100 text-cyan-700',
  },
];

const stats = [
  { value: '85%', label: 'Virality Accuracy', suffix: '+' },
  { value: '10M+', label: 'Content Pieces', suffix: '' },
  { value: '50K+', label: 'Active Users', suffix: '' },
  { value: '3x', label: 'Engagement Boost', suffix: '' },
];

const testimonials = [
  {
    quote: "ContentCraft AI has transformed our content strategy. The virality predictor alone increased our engagement by 200%.",
    author: "Sarah Chen",
    role: "Marketing Director, TechFlow",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "The trend hijacking feature is a game-changer. We're always first to capitalize on emerging topics.",
    author: "Marcus Johnson",
    role: "Content Lead, GrowthLabs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Best investment we've made. The AI-generated content saves us 20+ hours per week.",
    author: "Emily Rodriguez",
    role: "Founder, CreativeStudio",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individual creators',
    features: [
      '5 AI content generations/day',
      'Basic virality prediction',
      '3 social platforms',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'For growing teams and businesses',
    features: [
      'Unlimited AI generations',
      'Advanced virality prediction',
      'All social platforms',
      'Advanced analytics',
      'Trend hijacking engine',
      'Priority support',
      'Team collaboration (5 seats)',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Custom AI training',
      'Dedicated account manager',
      'SLA guarantee',
      'SSO & advanced security',
      'Unlimited team seats',
      'API access',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

// Floating avatar data for Miro-style effect
const floatingAvatars = [
  { name: 'Maria', role: 'Content Creator', x: '10%', y: '20%', delay: 0 },
  { name: 'Tom', role: 'Marketing Lead', x: '85%', y: '15%', delay: 0.5 },
  { name: 'Jess', role: 'Social Manager', x: '75%', y: '70%', delay: 1 },
  { name: 'Alex', role: 'Brand Director', x: '5%', y: '60%', delay: 1.5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Stripe Style */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">ContentCraft</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Resources
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="nav-dropdown">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Documentation</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">API Reference</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Blog</a>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign in
              </Link>
              <Link to="/dashboard">
                <Button className="btn-purple">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Stripe Style with Miro Grid */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden miro-grid-bg">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-amber-50/60 to-pink-50/80" />
        
        {/* Floating Avatars - Miro Style */}
        {floatingAvatars.map((avatar, index) => (
          <motion.div
            key={avatar.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: avatar.delay }}
            className="hidden lg:block absolute floating-avatar"
            style={{ left: avatar.x, top: avatar.y }}
          >
            <img
              src={`https://images.unsplash.com/photo-${index === 0 ? '1494790108377-be9c29b29330' : index === 1 ? '1507003211169-0a1dd7228f2d' : index === 2 ? '1438761681033-6461ffad8d80' : '1472099645785-5658abf4ff4e'}?w=40&h=40&fit=crop&crop=face`}
              alt={avatar.name}
              className="w-6 h-6 rounded-full"
            />
            <div>
              <p className="text-xs font-medium text-gray-900">{avatar.name}</p>
              <p className="text-[10px] text-gray-500">{avatar.role}</p>
            </div>
          </motion.div>
        ))}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Powered by Gemini & DALL-E 3</span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Create viral content with{' '}
              <span className="gradient-text">AI-powered</span>{' '}
              intelligence
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Predict virality, hijack trends, and automate your content creation workflow. 
              The all-in-one platform for modern content creators.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/dashboard">
                <Button size="lg" className="btn-purple text-lg px-8 py-4">
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center gap-6 text-sm text-gray-500"
            >
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                14-day free trial
              </span>
            </motion.div>
          </div>
          
          {/* Hero Visual - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src="/images/dashboard-visual.jpg"
                alt="ContentCraft AI Dashboard"
                className="w-full"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
            
            {/* Floating Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -left-4 lg:-left-12 top-1/4 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Engagement</p>
                  <p className="font-bold text-gray-900">+127%</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -right-4 lg:-right-12 top-1/3 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Virality Score</p>
                  <p className="font-bold text-gray-900">87/100</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Stripe Style */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Miro Style Cards */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm font-medium text-purple-700 mb-6">
              <Wand2 className="w-4 h-4" />
              Features
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create viral content
            </h2>
            <p className="text-lg text-gray-600">
              Powerful AI-driven tools designed to supercharge your content creation workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section - Stripe Style */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/ai-visual.jpg"
                alt="AI Brain Visualization"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm font-medium text-purple-700 mb-6">
                <Brain className="w-4 h-4" />
                Powered by Gemini & DALL-E 3
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                State-of-the-art AI for content creation
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Leverage the power of Google's Gemini for intelligent content generation 
                and OpenAI's DALL-E 3 for stunning visuals.
              </p>
              <div className="space-y-4">
                {[
                  'Natural language content generation',
                  'Multi-tone transformation',
                  'SEO optimization suggestions',
                  'Image generation with DALL-E 3',
                  'Real-time translation',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Virality Predictor Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm font-medium text-amber-700 mb-6">
                <Zap className="w-4 h-4" />
                Virality Predictor
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Predict content success before you publish
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI analyzes your content and predicts its virality potential with 85%+ accuracy. 
                Get actionable suggestions to maximize engagement.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: BarChart3, title: 'Engagement Forecasting', desc: 'Predict likes, comments, and shares' },
                  { icon: Clock, title: 'Optimal Timing', desc: 'Find the best time to post' },
                  { icon: Target, title: 'Risk Analysis', desc: 'Identify potential issues' },
                  { icon: TrendingUp, title: 'Improvement Tips', desc: 'Get actionable suggestions' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <img
                  src="/images/hero-gradient.jpg"
                  alt="Virality Prediction"
                  className="rounded-2xl shadow-2xl"
                />
                {/* Floating Score Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                        <circle cx="32" cy="32" r="28" stroke="#7c3aed" strokeWidth="6" fill="none" strokeDasharray="140" strokeDashoffset="20" strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">87</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Virality Score</p>
                      <p className="text-xs text-green-600">High Potential</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm font-medium text-purple-700 mb-6">
              <MessageCircle className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by content creators worldwide
            </h2>
            <p className="text-lg text-gray-600">
              See what our users have to say about their experience with ContentCraft AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm font-medium text-purple-700 mb-6">
              <Target className="w-4 h-4" />
              Pricing
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-xl scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? 'text-white/70' : 'text-gray-500'}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'btn-purple'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to create viral content?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join 50,000+ creators who are already using ContentCraft AI to supercharge 
              their content creation workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                <Globe className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">ContentCraft</span>
              </Link>
              <p className="text-gray-400 text-sm">
                AI-powered content creation platform for modern creators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2025 ContentCraft AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
