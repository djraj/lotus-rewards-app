import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

// Shown after the user follows a password-reset link. At this point Supabase
// has already exchanged the recovery token for a session, so all we do is set
// a new password on the current user and hand control back to the app.
const UpdatePassword: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('The two passwords don\'t match.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    onDone();
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

        <h1 className="text-2xl font-bold text-slate-800 mb-1">Choose a new password</h1>
        <p className="text-slate-500 text-sm mb-6">Enter it twice so we know it's right.</p>

        {error && (
          <div className="p-4 rounded-2xl text-sm mb-6 bg-rose-50 text-rose-700 border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">New password</label>
            <input
              required
              type="password"
              minLength={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm new password</label>
            <input
              required
              type="password"
              minLength={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="********"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-rose-500 text-white py-3 rounded-2xl font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save new password'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full text-slate-500 text-sm mt-4 hover:underline"
        >
          Cancel and sign out
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
