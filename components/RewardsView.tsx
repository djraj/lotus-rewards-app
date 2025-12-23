
import React, { useState } from 'react';
import { Reward } from '../types';

interface Props {
  rewards: Reward[];
  points: number;
  onClaim: (cost: number) => boolean;
}

const RewardsView: React.FC<Props> = ({ rewards, points, onClaim }) => {
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleClaim = (reward: Reward) => {
    if (points >= reward.cost) {
      const success = onClaim(reward.cost);
      if (success) {
        setMessage({ text: `Successfully claimed ${reward.title}!`, type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      }
    } else {
      setMessage({ text: "You don't have enough Lotus Points yet.", type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
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

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <p className="font-semibold">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {rewards.map((reward) => {
          const canAfford = points >= reward.cost;
          return (
            <div key={reward.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row h-full group hover:shadow-xl transition-all duration-300">
              <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                <img src={reward.image} alt={reward.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                  onClick={() => handleClaim(reward)}
                  disabled={!reward.available}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    canAfford 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-100 active:scale-[0.98]' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {reward.available ? (
                    <>
                      <i className="fa-solid fa-bag-shopping"></i>
                      {canAfford ? 'Claim Reward' : `Need ${reward.cost - points} more`}
                    </>
                  ) : 'Out of Stock'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsView;
