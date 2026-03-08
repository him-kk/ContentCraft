import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ChromeExtension() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute w-96 h-96 -top-40 -right-40 bg-white rounded-full" />
              <div className="absolute w-64 h-64 -bottom-20 -left-20 bg-white rounded-full" />
            </div>
            <div className="relative h-full flex items-center px-8">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-12 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Chrome Extension
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Power-up your content creation workflow directly from your browser!
              </p>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-block mb-8"
              >
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-6 py-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                  <span className="text-amber-900 font-semibold">Under Review</span>
                </div>
              </motion.div>

              {/* Description */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-8 text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What's Coming Soon
                </h2>
                <ul className="space-y-3">
                  {[
                    'Generate AI content directly from your browser',
                    'Analyze trending topics in real-time',
                    'Schedule posts across all platforms',
                    'Get virality predictions instantly',
                    'Access quick AI writing tools',
                    'Sync content with your dashboard',
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 rounded-xl p-8 mb-8 text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  {[
                    { status: '✓', phase: 'Development', date: 'Completed', color: 'text-green-600' },
                    { status: '⏳', phase: 'Chrome Review', date: 'In Progress', color: 'text-amber-600' },
                    { status: '○', phase: 'Public Release', date: 'Coming Soon', color: 'text-gray-400' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${item.color}`}>{item.status}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.phase}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('https://chrome.google.com/webstore', '_blank')}
                >
                  View on Chrome Web Store
                </Button>
              </div>

              {/* Notification */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-sm text-blue-800">
                  Want to be notified when the extension launches?{' '}
                  <button className="font-semibold text-blue-600 hover:text-blue-700 underline">
                    Join our waitlist
                  </button>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Expected release: <span className="font-semibold">March 2026</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
