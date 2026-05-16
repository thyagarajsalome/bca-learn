import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/ui';
import { X, Mail, Lock, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen } = useUIStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthModalOpen(false);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Check your email for the confirmation link!');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-bg/85 backdrop-blur-md flex items-center justify-center p-6"
         onClick={(e) => e.target === e.currentTarget && setAuthModalOpen(false)}>
      <div className="modal-animate bg-surface border border-border rounded-2xl w-full max-w-md p-8 relative shadow-2xl shadow-accent/10">
        
        <button onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-muted hover:text-white hover:bg-surface2 p-2 rounded-lg transition-all">
          <X size={18} />
        </button>

        <h2 className="font-display font-bold text-3xl mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-muted text-center text-sm mb-8">
          {isLogin ? 'Log in to track your BCA progress.' : 'Sign up for free BCA study material.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-surface2 border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent2 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface2 border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent2 transition-colors"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center p-2 bg-red-400/10 rounded-lg">{error}</p>}
          {success && <p className="text-green-400 text-xs text-center p-2 bg-green-400/10 rounded-lg">{success}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl text-white font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)' }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
            className="text-accent2 hover:underline font-semibold"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
