import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { syncAuthWithExtension, syncAuthWithExtensionPromise } from '@/utils/extensionSync';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Twitter,
  Check,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [extensionSuccess, setExtensionSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // First, complete the login
    await login(email, password);
    
    // Wait for state updates to propagate
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get auth data from localStorage (stored by login function)
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    
    console.log('Login successful, syncing with extension...', {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      hasUser: !!userStr
    });
    
    // Check if login came from extension
    const urlParams = new URLSearchParams(window.location.search);
    const isFromExtension = urlParams.get('source') === 'extension';
    const shouldClose = urlParams.get('redirect') === 'close';
    
    // Sync authentication with extension
    if (token && refreshToken) {
      const user = userStr ? JSON.parse(userStr) : null;
      
      // Call sync function
      const syncSuccess = await syncAuthWithExtensionPromise(token, refreshToken, user);
      
      console.log('Extension sync result:', syncSuccess);
      
      if (isFromExtension && shouldClose) {
        // Show success message for extension users
        setExtensionSuccess(true);
        
        // Wait longer to ensure extension receives the message
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Try to close the tab
        window.close();
        
        // If window.close() doesn't work (some browsers block it),
        // show a message to the user
        setTimeout(() => {
          if (!document.hidden) {
            // Tab is still open, show instruction
            setError('');
          }
        }, 500);
      } else {
        // Normal web app flow
        navigate('/dashboard');
      }
    } else {
      throw new Error('Authentication data not found');
    }
  } catch (err: any) {
    console.error('Login error:', err);
    setError(err?.response?.data?.message || 'Invalid email or password');
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">ContentCraft</span>
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back to<br />
            <span className="gradient-text">ContentCraft AI</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Create viral content, predict engagement, and automate your workflow with AI.
          </p>

          <div className="space-y-4">
            {[
              'AI-powered content generation',
              'Virality prediction with 85%+ accuracy',
              'Real-time trend monitoring',
              'Multi-platform scheduling',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <img
              src="/images/dashboard-visual.jpg"
              alt="ContentCraft Dashboard"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-4">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-900">ContentCraft</span>
                </Link>
              </div>
              <CardTitle className="text-2xl">Sign in to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {extensionSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Login successful!</p>
                      <p className="text-xs">You can now close this tab and return to the extension.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={extensionSuccess}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={extensionSuccess}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={extensionSuccess}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || extensionSuccess}
                  className="w-full btn-purple"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : extensionSuccess ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Success! Closing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              {!extensionSuccess && (
                <>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full border-gray-300">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <Button variant="outline" className="w-full border-gray-300">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-purple-600 hover:text-purple-700">
                      Sign up
                    </Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-purple-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}