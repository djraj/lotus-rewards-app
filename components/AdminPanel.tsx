
import React, { useState } from 'react';
import { Submission, User } from '../types';
import { verifySubmission } from '../services/geminiService';

interface Props {
  submissions: Submission[];
  user: User;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
  onManualUpdate: (amount: number) => void;
}

const AdminPanel: React.FC<Props> = ({ submissions, user, onUpdateStatus, onManualUpdate }) => {
  const [manualAmount, setManualAmount] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<{ [id: string]: { isValid: boolean, feedback: string, confidenceScore: number } }>({});

  const handleManualPoints = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(manualAmount);
    if (!isNaN(val)) {
      onManualUpdate(val);
      setManualAmount('');
    }
  };

  const handleAiVerify = async (submission: Submission) => {
    setAiLoading(submission.id);
    const result = await verifySubmission(submission.taskTitle, submission.proof);
    setAiFeedback(prev => ({ ...prev, [submission.id]: result }));
    setAiLoading(null);
  };

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
              {submissions.filter(s => s.status === 'pending').length > 0 ? (
                submissions.filter(s => s.status === 'pending').map((sub) => (
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
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 italic">
                      "{sub.proof}"
                    </div>

                    {aiFeedback[sub.id] && (
                      <div className={`p-4 rounded-2xl text-sm flex gap-3 ${aiFeedback[sub.id].isValid ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        <i className={`fa-solid ${aiFeedback[sub.id].isValid ? 'fa-robot' : 'fa-robot'} mt-1`}></i>
                        <div>
                          <p className="font-bold mb-1">AI Recommendation ({Math.round(aiFeedback[sub.id].confidenceScore * 100)}% Confidence):</p>
                          <p>{aiFeedback[sub.id].feedback}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button 
                        onClick={() => handleAiVerify(sub)}
                        disabled={aiLoading === sub.id}
                        className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all flex items-center gap-2"
                      >
                        {aiLoading === sub.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                        AI Verify
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(sub.id, 'approved')}
                        className="bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(sub.id, 'rejected')}
                        className="bg-slate-200 text-slate-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-all"
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
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 mb-6">
              <p className="text-sm text-rose-600 font-medium mb-1">Target User</p>
              <div className="flex items-center gap-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full" alt="User" />
                <div>
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-rose-500 font-bold">{user.points} Lotus Points</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleManualPoints} className="space-y-4">
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
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                Update Balance
              </button>
            </form>
          </section>

          <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4">Admin Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-slate-400">Total Approved</span>
                <span className="font-bold text-emerald-400">{submissions.filter(s => s.status === 'approved').length}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-slate-400">Total Rejected</span>
                <span className="font-bold text-rose-400">{submissions.filter(s => s.status === 'rejected').length}</span>
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
