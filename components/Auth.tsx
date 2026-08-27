
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

type Mode = 'sign-in' | 'sign-up';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === 'sign-up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || email.split('@')[0] } },
        });
        if (error) throw error;
        setMessage({ text: 'Account created. Check your email to confirm, then sign in.', type: 'success' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Something went wrong.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ text: 'Enter your email first, then tap "Forgot password".', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage({ text: 'Password reset email sent — check your inbox.', type: 'success' });
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Something went wrong.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ text: 'Enter your email first.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setMessage({ text: 'Magic link sent — check your email.', type: 'success' });
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Something went wrong.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-300 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
            <i className="fa-solid fa-seedling"></i>
          </div>
          <span className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Golden Lotus</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {mode === 'sign-in' ? 'Sign in to continue your journey.' : 'Start earning Lotus Points today.'}
        </p>

        {message && (
          <div className={`p-4 rounded-2xl text-sm mb-6 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordAuth} className="space-y-4">
          {mode === 'sign-up' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input
              required
              type="email"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input
              required
              type="password"
              minLength={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            {mode === 'sign-in' && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs text-rose-600 font-bold hover:underline mt-2 disabled:opacity-50"
              >
                Forgot password?
              </button>
            )}
          </div>
          <button
            disabled={loading}
            className="w-full bg-rose-500 text-white py-3 rounded-2xl font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-grow h-px bg-slate-100"></div>
          <span className="text-xs text-slate-400 font-medium">OR</span>
          <div className="flex-grow h-px bg-slate-100"></div>
        </div>

        <button
          onClick={handleMagicLink}
          disabled={loading}
          className="w-full bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          Send Magic Link
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          {mode === 'sign-in' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setMessage(null); }}
            className="text-rose-600 font-bold hover:underline"
          >
            {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
