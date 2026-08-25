
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Submission, RewardClaim, User } from '../types';
import { supabase } from '../services/supabaseClient';

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

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const STATUS_BADGE: Record<'draft' | 'pending' | 'approved' | 'rejected', string> = {
  draft: 'bg-slate-100 text-slate-500 border-slate-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-600 border-rose-100',
};

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const AdminHistory: React.FC = () => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    (async () => {
      const [{ data: profileData }, { data: subData }, { data: claimData }] = await Promise.all([
        supabase.from('profiles').select('*').order('name'),
        supabase.from('submissions').select('*').neq('status', 'draft').order('created_at', { ascending: false }),
        supabase.from('reward_claims').select('*').order('created_at', { ascending: false }),
      ]);
      setProfiles((profileData ?? []) as User[]);
      setSubmissions((subData ?? []).map(mapSubmission));
      setClaims((claimData ?? []).map(mapClaim));
      setLoading(false);
    })();
  }, []);

  const userName = (id: string) => profiles.find(p => p.id === id)?.name ?? 'Unknown user';
  const userAvatar = (id: string) => profiles.find(p => p.id === id)?.avatar ?? null;

  const query = search.trim().toLowerCase();

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (!query) return true;
      return s.taskTitle.toLowerCase().includes(query) || userName(s.userId).toLowerCase().includes(query);
    });
  }, [submissions, statusFilter, query, profiles]);

  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (!query) return true;
      return c.rewardTitle.toLowerCase().includes(query) || userName(c.userId).toLowerCase().includes(query);
    });
  }, [claims, statusFilter, query, profiles]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/admin" className="text-sm text-rose-500 font-semibold hover:text-rose-600 transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Admin Conservatory
          </Link>
          <h1 className="text-4xl font-serif font-bold text-slate-800 mt-3">Approval History</h1>
          <p className="text-slate-500 mt-2">The full trail of task and reward decisions across the community.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by task, reward, or member name..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                statusFilter === tab.value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading history...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-slate-400"></i>
              Task Submissions
              <span className="text-xs font-medium text-slate-400">({filteredSubmissions.length})</span>
            </h3>

            {filteredSubmissions.length > 0 ? (
              <div className="space-y-3">
                {filteredSubmissions.map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {userAvatar(sub.userId) && (
                        <img src={userAvatar(sub.userId)!} className="w-9 h-9 rounded-full shrink-0" alt="" />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{sub.taskTitle}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {userName(sub.userId)} &middot; {new Date(sub.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${STATUS_BADGE[sub.status]}`}>
                        {sub.status}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">+{sub.pointsAwarded} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fa-solid fa-magnifying-glass text-4xl mb-3 block opacity-20"></i>
                <p>No task submissions match this filter.</p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-gift text-slate-400"></i>
              Reward Redemptions
              <span className="text-xs font-medium text-slate-400">({filteredClaims.length})</span>
            </h3>

            {filteredClaims.length > 0 ? (
              <div className="space-y-3">
                {filteredClaims.map(claim => (
                  <div key={claim.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {userAvatar(claim.userId) && (
                          <img src={userAvatar(claim.userId)!} className="w-9 h-9 rounded-full shrink-0" alt="" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{claim.rewardTitle}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {userName(claim.userId)} &middot; {new Date(claim.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${STATUS_BADGE[claim.status]}`}>
                          {claim.status}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">{claim.cost} pts</p>
                      </div>
                    </div>
                    {claim.grantedBy && (
                      <p className="text-xs text-rose-500 font-semibold mt-2">
                        <i className="fa-solid fa-gift mr-1"></i>
                        Gifted by {userName(claim.grantedBy)}
                      </p>
                    )}
                    {claim.remark && (
                      <p className="text-sm text-slate-600 italic mt-2 bg-white border border-slate-200 rounded-xl p-3">
                        "{claim.remark}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fa-solid fa-magnifying-glass text-4xl mb-3 block opacity-20"></i>
                <p>No reward redemptions match this filter.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminHistory;
