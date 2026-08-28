
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Submission, User, RewardClaim, Reward } from '../types';
import { supabase } from '../services/supabaseClient';

interface Props {
  rewards: Reward[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onPointsAdjusted: () => Promise<void>;
}

const mapClaim = (row: any): RewardClaim => ({
  id: row.id,
  userId: row.user_id,
  rewardId: row.reward_id,
  rewardTitle: row.reward_title,
  cost: row.cost,
  status: row.status,
  remark: row.remark,
  grantedBy: row.granted_by,
  timestamp: row.created_at,
});

const mapSubmission = (row: any): Submission => ({
  id: row.id,
  userId: row.user_id,
  taskId: row.task_id,
  taskTitle: row.task_title,
  proofNote: row.proof_note,
  proofImagePath: row.proof_image_path,
  timestamp: row.created_at,
  updatedAt: row.updated_at,
  status: row.status,
  pointsAwarded: row.points_awarded,
});

const AdminPanel: React.FC<Props> = ({ rewards, onUpdateStatus, onPointsAdjusted }) => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [manualAmount, setManualAmount] = useState<string>('');
  const [manualRemark, setManualRemark] = useState<string>('');
  const [adjusting, setAdjusting] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [path: string]: string }>({});
  const [actionError, setActionError] = useState<string | null>(null);

  // All non-draft submissions across every user - admins can see these via
  // RLS, but this is independent of App.tsx's "submissions" state, which is
  // scoped to the signed-in user's own rows even for an admin.
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);

  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [reviewingClaimId, setReviewingClaimId] = useState<string | null>(null);

  const [sendUserId, setSendUserId] = useState('');
  const [sendRewardId, setSendRewardId] = useState('');
  const [sendRemark, setSendRemark] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  const pendingSubmissions = allSubmissions.filter(s => s.status === 'pending');

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('name');
    const list = (data ?? []) as User[];
    setProfiles(list);
    if (!selectedUserId && list.length > 0) setSelectedUserId(list[0].id);
    if (!sendUserId && list.length > 0) setSendUserId(list[0].id);
  };

  const loadSubmissions = async () => {
    const { data } = await supabase.from('submissions').select('*').neq('status', 'ongoing').order('created_at', { ascending: false });
    setAllSubmissions((data ?? []).map(mapSubmission));
  };

  const loadClaims = async () => {
    const { data } = await supabase.from('reward_claims').select('*').eq('status', 'pending').order('created_at');
    setClaims((data ?? []).map(mapClaim));
  };

  useEffect(() => {
    loadProfiles();
    loadSubmissions();
    loadClaims();
  }, []);

  useEffect(() => {
    if (!sendRewardId && rewards.length > 0) setSendRewardId(rewards[0].id);
  }, [rewards]);

  useEffect(() => {
    const missing = pendingSubmissions
      .map(s => s.proofImagePath)
      .filter((path): path is string => Boolean(path) && !imageUrls[path]);
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
  }, [allSubmissions]);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    setReviewingId(id);
    setActionError(null);
    try {
      await onUpdateStatus(id, status);
      await loadSubmissions();
      await loadProfiles();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update this submission.');
    } finally {
      setReviewingId(null);
    }
  };

  const handleReviewClaim = async (id: string, decision: 'approved' | 'rejected') => {
    setReviewingClaimId(id);
    setActionError(null);
    try {
      const { error } = await supabase.rpc('approve_reward_claim', { p_claim_id: id, p_decision: decision });
      if (error) throw error;
      await loadClaims();
      await loadProfiles();
      await onPointsAdjusted();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update this redemption request.');
    } finally {
      setReviewingClaimId(null);
    }
  };

  const handleManualPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(manualAmount, 10);
    if (!selectedUserId || isNaN(val) || !manualRemark.trim()) return;

    setAdjusting(true);
    setActionError(null);
    try {
      const { error } = await supabase.rpc('adjust_points', {
        p_user_id: selectedUserId,
        p_amount: val,
        p_remark: manualRemark.trim(),
      });
      if (error) throw error;
      setManualAmount('');
      setManualRemark('');
      await loadProfiles();
      await onPointsAdjusted();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to adjust points.');
    } finally {
      setAdjusting(false);
    }
  };

  const handleSendReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendUserId || !sendRewardId || !sendRemark.trim()) return;

    setSending(true);
    setActionError(null);
    setSendSuccess(null);
    try {
      const { error } = await supabase.rpc('send_reward', {
        p_user_id: sendUserId,
        p_reward_id: sendRewardId,
        p_remark: sendRemark.trim(),
      });
      if (error) throw error;
      const rewardTitle = rewards.find(r => r.id === sendRewardId)?.title ?? 'reward';
      const userName = profiles.find(p => p.id === sendUserId)?.name ?? 'user';
      setSendSuccess(`Sent ${rewardTitle} to ${userName}.`);
      setSendRemark('');
      setTimeout(() => setSendSuccess(null), 4000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to send this reward.');
    } finally {
      setSending(false);
    }
  };

  const selectedUser = profiles.find(p => p.id === selectedUserId) ?? null;
  const totalApproved = allSubmissions.filter(s => s.status === 'approved').length;
  const totalRejected = allSubmissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-800">Admin Conservatory</h1>
          <p className="text-slate-500 mt-2">Oversee the growth of the community.</p>
        </div>
        <Link
          to="/admin/history"
          className="inline-flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm font-semibold text-slate-600 hover:text-rose-500 hover:border-rose-200 transition-colors"
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          View Full History
        </Link>
      </header>

      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 text-sm font-semibold">
          {actionError}
        </div>
      )}

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

                    {sub.proofImagePath && imageUrls[sub.proofImagePath] ? (
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

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-gift text-slate-400"></i>
              Redemption Requests
            </h3>

            <div className="space-y-4">
              {claims.length > 0 ? (
                claims.map((claim) => {
                  const requester = profiles.find(p => p.id === claim.userId);
                  return (
                    <div key={claim.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {requester?.avatar && <img src={requester.avatar} className="w-10 h-10 rounded-full" alt="" />}
                        <div>
                          <p className="font-bold text-slate-800">{claim.rewardTitle}</p>
                          <p className="text-xs text-slate-400">
                            {requester?.name ?? 'Unknown user'} &middot; {new Date(claim.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                          {claim.cost} Pts
                        </span>
                        <button
                          onClick={() => handleReviewClaim(claim.id, 'approved')}
                          disabled={reviewingClaimId === claim.id}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewClaim(claim.id, 'rejected')}
                          disabled={reviewingClaimId === claim.id}
                          className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-all disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <i className="fa-solid fa-circle-check text-4xl mb-3 block opacity-20"></i>
                  <p>All clear! No pending redemption requests.</p>
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
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Remark (required)</label>
                <textarea
                  required
                  placeholder="Why is this adjustment being made?"
                  className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none resize-none"
                  value={manualRemark}
                  onChange={(e) => setManualRemark(e.target.value)}
                ></textarea>
              </div>
              <button
                disabled={adjusting || !selectedUserId || !manualAmount || !manualRemark.trim()}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {adjusting ? 'Updating...' : 'Update Balance'}
              </button>
            </form>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-gifts text-slate-400"></i>
              Send a Reward
            </h3>

            <form onSubmit={handleSendReward} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">User</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
                  value={sendUserId}
                  onChange={(e) => setSendUserId(e.target.value)}
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reward</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
                  value={sendRewardId}
                  onChange={(e) => setSendRewardId(e.target.value)}
                >
                  {rewards.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.cost} pts)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Remark (required)</label>
                <textarea
                  required
                  placeholder="Why is this reward being sent?"
                  className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none resize-none"
                  value={sendRemark}
                  onChange={(e) => setSendRemark(e.target.value)}
                ></textarea>
              </div>
              {sendSuccess && (
                <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">{sendSuccess}</p>
              )}
              <button
                disabled={sending || !sendUserId || !sendRewardId || !sendRemark.trim()}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Reward'}
              </button>
              <p className="text-[11px] text-slate-400">
                <i className="fa-solid fa-info-circle mr-1"></i>
                This does not deduct points from the recipient - it's a direct gift, recorded for reporting.
              </p>
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
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-slate-400">Total Submissions</span>
                <span className="font-bold">{allSubmissions.length}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-400">Pending Redemptions</span>
                <span className="font-bold text-amber-400">{claims.length}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
