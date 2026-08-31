
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { takeAuthError } from '../services/authCallback';
import Logo from './Logo';

type Mode = 'sign-in' | 'sign-up';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');

  // Surface the reason a magic link / auth redirect failed (e.g. an expired
  // link), stashed by consumeAuthCallback before the app mounted.
  useEffect(() => {
    const err = takeAuthError();
    if (err) setMessage({ text: err, type: 'error' });
  }, []);

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
      setOtpSent(true);
      setMessage({ text: `We sent a 6-8 digit code and a sign-in link to ${email}. Enter the code below, or just click the link in the email.`, type: 'success' });
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Something went wrong.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: 'email',
      });
      if (error) throw error;
      // On success, onAuthStateChange in App.tsx picks up the session and swaps the view.
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'That code was not accepted.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cancelOtp = () => {
    setOtpSent(false);
    setCode('');
    setMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="mb-8">
          <Logo className="h-10 w-auto" />
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

        {otpSent && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Enter your code</label>
              <input
                required
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={8}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-lg tracking-[0.4em] focus:ring-2 focus:ring-rose-200 outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-rose-500 text-white py-3 rounded-2xl font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </button>
            <button
              type="button"
              onClick={cancelOtp}
              disabled={loading}
              className="w-full text-sm text-slate-500 font-bold hover:underline disabled:opacity-50"
            >
              Use a different email
            </button>
          </form>
        )}

        {!otpSent && (
        <>
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
        </>
        )}

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
