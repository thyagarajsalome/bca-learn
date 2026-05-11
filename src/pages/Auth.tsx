import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Mail, Lock, User, Globe } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect will be handled by OAuth callback
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google sign in');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5b6af0] to-[#4ecca3] rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#e8eaf6] mb-2">Welcome to BCALearn</h1>
          <p className="text-[#8890b5]">
            {isLogin ? 'Sign in to continue your learning journey' : 'Create your account to get started'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#13172a] rounded-2xl border border-[#1e2340] p-8 shadow-2xl">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Globe className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e2340]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#13172a] text-[#8890b5]">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#e8eaf6] mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8890b5]" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent transition-all"
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8890b5]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[#8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#e8eaf6] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8890b5]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0c0f1a] border border-[#1e2340] rounded-lg text-[#e8eaf6] placeholder-[##8890b5] focus:outline-none focus:ring-2 focus:ring-[#5b6af0] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-[#5b6af0] hover:bg-[#4a5ae0] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[#8890b5] hover:text-[#e8eaf6] text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#8890b5] mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}