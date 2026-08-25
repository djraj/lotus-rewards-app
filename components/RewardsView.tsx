
import React, { useState, useMemo } from 'react';
import { Reward, RewardClaim } from '../types';

interface Props {
  rewards: Reward[];
  points: number;
  myClaims: RewardClaim[];
  onRequestReward: (rewardId: string) => Promise<{ ok: boolean; message?: string }>;
}

const CATEGORY_ORDER: Reward['category'][] = ['Products', 'Sessions', 'Workshops', 'Reviews'];

const CLAIM_STATUS_STYLE: Record<RewardClaim['status'], string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-600 border-rose-100',
};

const RewardsView: React.FC<Props> = ({ rewards, points, myClaims, onRequestReward }) => {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [confirmReward, setConfirmReward] = useState<Reward | null>(null);
  const [requesting, setRequesting] = useState(false);

  const pendingRewardIds = useMemo(
    () => new Set(myClaims.filter(c => c.status === 'pending').map(c => c.rewardId)),
    [myClaims]
  );

  const groupedRewards = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? rewards.filter(r => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query))
      : rewards;

    return CATEGORY_ORDER
      .map(category => ({ category, items: filtered.filter(r => r.category === category) }))
      .filter(group => group.items.length > 0);
  }, [rewards, search]);

  const handleConfirmRequest = async () => {
    if (!confirmReward) return;
    setRequesting(true);
    const result = await onRequestReward(confirmReward.id);
    setRequesting(false);
    setConfirmReward(null);

    if (result.ok) {
      setMessage({ text: `Your request for ${confirmReward.title} has been sent for admin approval.`, type: 'success' });
    } else {
      setMessage({ text: result.message ?? 'Could not send this request.', type: 'error' });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-800">Rewards Marketplace</h1>
          <p className="text-slate-500 mt-2">Exchange your efforts for meaningful rewards.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm font-bold text-rose-600">
          <span className="text-slate-400 font-medium">Available:</span>
          <span>{points}</span>
          <i className="fa-solid fa-leaf"></i>
        </div>
      </header>

      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rewards..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
        />
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <p className="font-semibold">{message.text}</p>
        </div>
      )}

      {myClaims.length > 0 && (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-3">My Redemption Requests</h3>
          <div className="space-y-2">
            {myClaims.slice(0, 5).map(claim => (
              <div key={claim.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-600">{claim.rewardTitle}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${CLAIM_STATUS_STYLE[claim.status]}`}>
                  {claim.status === 'pending' ? 'Pending approval' : claim.status === 'approved' ? 'Approved' : 'Declined'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {groupedRewards.length > 0 ? (
        <div className="space-y-10">
          {groupedRewards.map(({ category, items }) => (
            <section key={category}>
              <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                {category}
                <span className="text-xs font-medium text-slate-400">({items.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {items.map((reward) => {
                  const canAfford = points >= reward.cost;
                  const isPending = pendingRewardIds.has(reward.id);
                  return (
                    <div key={reward.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row h-full group hover:shadow-xl transition-all duration-300">
                      <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                        {reward.image ? (
                          <img src={reward.image} alt={reward.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-rose-50 flex items-center justify-center text-rose-300 text-3xl">
                            <i className="fa-solid fa-leaf"></i>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-600 shadow-sm">
                          {reward.cost} Pts
                        </div>
                      </div>
                      <div className="p-8 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3">{reward.title}</h3>
                          <p className="text-slate-500 text-sm mb-6 leading-relaxed">{reward.description}</p>
                        </div>
                        <button
                          onClick={() => setConfirmReward(reward)}
                          disabled={!reward.available || !canAfford || isPending}
                          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${
                            canAfford && !isPending
                            ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-100 active:scale-[0.98]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {!reward.available ? 'Out of Stock' : isPending ? (
                            <>
                              <i className="fa-solid fa-hourglass"></i>
                              Requested
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-bag-shopping"></i>
                              {canAfford ? 'Redeem Reward' : `Need ${reward.cost - points} more`}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <i className="fa-solid fa-magnifying-glass text-4xl mb-3 block opacity-20"></i>
          <p>No rewards match "{search}".</p>
        </div>
      )}

      {confirmReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Confirm Redemption</h2>
            <p className="text-slate-500 mb-6">
              This will deduct <span className="font-bold text-rose-600">{confirmReward.cost} Lotus Points</span> once
              an admin approves your request for <span className="font-bold">{confirmReward.title}</span>.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center justify-between text-sm">
              <span className="text-slate-500">Your balance after approval</span>
              <span className="font-bold text-slate-800">{points - confirmReward.cost} pts</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmReward(null)}
                disabled={requesting}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRequest}
                disabled={requesting}
                className="flex-1 bg-rose-500 text-white py-3 rounded-2xl font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
              >
                {requesting ? 'Sending...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsView;
