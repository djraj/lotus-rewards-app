
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { User, Submission, AppState } from './types';
import { INITIAL_USER, TASKS, REWARDS } from './constants';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import RewardsView from './components/RewardsView';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('lotus_state');
    if (saved) return JSON.parse(saved);
    return {
      user: INITIAL_USER,
      tasks: TASKS,
      rewards: REWARDS,
      submissions: []
    };
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('lotus_state', JSON.stringify(state));
  }, [state]);

  const addSubmission = (submission: Submission) => {
    setState(prev => ({
      ...prev,
      submissions: [submission, ...prev.submissions]
    }));
  };

  const updateSubmissionStatus = (id: string, status: 'approved' | 'rejected') => {
    setState(prev => {
      const submission = prev.submissions.find(s => s.id === id);
      if (!submission) return prev;
      
      let newPoints = prev.user.points;
      if (status === 'approved' && submission.status !== 'approved') {
        newPoints += submission.pointsAwarded;
      } else if (status === 'rejected' && submission.status === 'approved') {
        newPoints -= submission.pointsAwarded;
      }

      return {
        ...prev,
        user: { ...prev.user, points: newPoints },
        submissions: prev.submissions.map(s => s.id === id ? { ...s, status } : s)
      };
    });
  };

  const manualPointsUpdate = (amount: number) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, points: Math.max(0, prev.user.points + amount) }
    }));
  };

  const claimReward = (cost: number) => {
    if (state.user.points >= cost) {
      setState(prev => ({
        ...prev,
        user: { ...prev.user, points: prev.user.points - cost }
      }));
      return true;
    }
    return false;
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-300 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  <i className="fa-solid fa-seedling"></i>
                </div>
                <span className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Lotus</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">Dashboard</Link>
                <Link to="/tasks" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">Tasks</Link>
                <Link to="/rewards" className="text-slate-600 hover:text-rose-500 font-medium transition-colors">Rewards</Link>
                {isAdmin && <Link to="/admin" className="text-rose-600 font-bold">Admin</Link>}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-rose-50 px-4 py-2 rounded-full border border-rose-100 shadow-sm">
                  <span className="text-rose-600 font-bold mr-2">{state.user.points}</span>
                  <i className="fa-solid fa-leaf text-rose-400"></i>
                </div>
                <button 
                  onClick={() => setIsAdmin(!isAdmin)}
                  className={`p-2 rounded-lg transition-all ${isAdmin ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  title="Switch to Admin Mode"
                >
                  <i className={`fa-solid ${isAdmin ? 'fa-user-shield' : 'fa-user'}`}></i>
                </button>
                <img src={state.user.avatar} className="w-9 h-9 rounded-full ring-2 ring-rose-200" alt="Avatar" />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard state={state} />} />
            <Route path="/tasks" element={<TasksView tasks={state.tasks} onAddSubmission={addSubmission} />} />
            <Route path="/rewards" element={<RewardsView rewards={state.rewards} points={state.user.points} onClaim={claimReward} />} />
            <Route 
              path="/admin" 
              element={
                isAdmin ? (
                  <AdminPanel 
                    submissions={state.submissions} 
                    onUpdateStatus={updateSubmissionStatus} 
                    onManualUpdate={manualPointsUpdate}
                    user={state.user}
                  />
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p>You must be an administrator to view this page.</p>
                  </div>
                )
              } 
            />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; 2024 Lotus Rewards System. Nurturing growth, one step at a time.</p>
          </div>
        </footer>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-50">
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-500">
            <i className="fa-solid fa-chart-pie"></i>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link to="/tasks" className="flex flex-col items-center gap-1 text-slate-500">
            <i className="fa-solid fa-list-check"></i>
            <span className="text-[10px]">Tasks</span>
          </Link>
          <Link to="/rewards" className="flex flex-col items-center gap-1 text-slate-500">
            <i className="fa-solid fa-gift"></i>
            <span className="text-[10px]">Rewards</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex flex-col items-center gap-1 text-rose-500 font-bold">
              <i className="fa-solid fa-shield-halved"></i>
              <span className="text-[10px]">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
