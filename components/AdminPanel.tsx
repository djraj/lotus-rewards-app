
import React, { useState, useEffect } from 'react';
import { Submission, User } from '../types';
import { supabase } from '../services/supabaseClient';

interface Props {
  submissions: Submission[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onPointsAdjusted: () => Promise<void>;
}

const AdminPanel: React.FC<Props> = ({ submissions, onUpdateStatus, onPointsAdjusted }) => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<string>('');
  const [adjusting, setAdjusting] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [path: string]: string }>({});

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('name');
    const list = (data ?? []) as User[];
    setProfiles(list);
    if (!selectedUserId && list.length > 0) setSelectedUserId(list[0].id);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    const missing = pendingSubmissions
      .map(s => s.proofImagePath)
      .filter(path => !imageUrls[path]);
    if (missing.length === 0) return;

    (async () => {
      const { data } = await supabase.storage.from('proof-photos').createSignedUrls(missing, 60 * 60);
      if (!data) return;
      setImageUrls(prev => {
        const next = { ...prev };
        data.forEach(entry => {
          if (entry.path && entry.signedUrl) next[entry.path] = entry.signedUrl;
        });
        return next;
      });
    })();
  }, [submissions]);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    setReviewingId(id);
    try {
      await onUpdateStatus(id, status);
      await loadProfiles();
    } finally {
      setReviewingId(null);
    }
  };

  const handleManualPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(manualAmount, 10);
    if (!selectedUserId || isNaN(val)) return;

    setAdjusting(true);
    try {
      const { error } = await supabase.rpc('adjust_points', { p_user_id: selectedUserId, p_amount: val });
      if (error) throw error;
      setManualAmount('');
      await loadProfiles();
      await onPointsAdjusted();
    } finally {
      setAdjusting(false);
    }
  };

  const selectedUser = profiles.find(p => p.id === selectedUserId) ?? null;
  const totalApproved = submissions.filter(s => s.status === 'approved').length;
  const totalRejected = submissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-serif font-bold text-slate-800">Admin Conservatory</h1>
        <p className="text-slate-500 mt-2">Oversee the growth of the community.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
              Pending Verifications
            </h3>

            <div className="space-y-6">
              {pendingSubmissions.length > 0 ? (
                pendingSubmissions.map((sub) => (
                  <div key={sub.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{sub.taskTitle}</h4>
                        <p className="text-xs text-slate-400">{new Date(sub.timestamp).toLocaleString()}</p>
                      </div>
                      <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                        +{sub.pointsAwarded} Pts
                      </span>
                    </div>

                    {imageUrls[sub.proofImagePath] ? (
                      <img
                        src={imageUrls[sub.proofImagePath]}
                        alt="Proof"
                        className="w-full max-h-80 object-cover rounded-2xl border border-slate-200"
                      />
                    ) : (
                      <div className="w-full h-40 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <i className="fa-solid fa-image"></i>
                      </div>
                    )}

                    {sub.proofNote && (
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 italic">
                        "{sub.proofNote}"
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => handleReview(sub.id, 'approved')}
                        disabled={reviewingId === sub.id}
                        className="bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(sub.id, 'rejected')}
                        disabled={reviewingId === sub.id}
                        className="bg-slate-200 text-slate-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <i className="fa-solid fa-circle-check text-4xl mb-3 block opacity-20"></i>
                  <p>All clear! No pending submissions.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-user-pen text-slate-400"></i>
              Quick Adjust
            </h3>

            <form onSubmit={handleManualPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">User</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.points} pts)</option>
                  ))}
                </select>
              </div>

              {selectedUser && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
                  {selectedUser.avatar && <img src={selectedUser.avatar} className="w-10 h-10 rounded-full" alt="User" />}
                  <div>
                    <p className="font-bold text-slate-800">{selectedUser.name}</p>
                    <p className="text-xs text-rose-500 font-bold">{selectedUser.points} Lotus Points</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Adjust Points</label>
                <input
                  type="number"
                  placeholder="e.g. 50 or -20"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                />
              </div>
              <button
                disabled={adjusting || !selectedUserId}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {adjusting ? 'Updating...' : 'Update Balance'}
              </button>
            </form>
          </section>

          <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4">Admin Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-slate-400">Total Approved</span>
                <span className="font-bold text-emerald-400">{totalApproved}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-slate-400">Total Rejected</span>
                <span className="font-bold text-rose-400">{totalRejected}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-400">Total Submissions</span>
                <span className="font-bold">{submissions.length}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
