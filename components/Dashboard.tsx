
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Submission } from '../types';
import { getDailyQuote } from '../constants';

interface Props {
  profile: User;
  submissions: Submission[];
}

const Dashboard: React.FC<Props> = ({ profile, submissions }) => {
  const stats = [
    { label: 'Lotus Points', value: profile.points, icon: 'fa-leaf', color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Completed Tasks', value: submissions.filter(s => s.status === 'approved').length, icon: 'fa-check-double', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const recentActivity = submissions.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-800">Welcome back, {profile.name}</h1>
          <p className="text-slate-500 mt-2">Your journey to wellness continues today.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 max-w-md italic text-slate-600 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-300"></div>
          <p className="relative z-10">"{getDailyQuote()}"</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-history text-slate-400"></i>
            Recent Activity
          </h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      sub.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                      sub.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      <i className={`fa-solid ${
                        sub.status === 'approved' ? 'fa-check' :
                        sub.status === 'rejected' ? 'fa-xmark' : 'fa-hourglass'
                      }`}></i>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{sub.taskTitle}</p>
                      <p className="text-xs text-slate-400">{new Date(sub.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      sub.status === 'approved' ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      {sub.status === 'approved' ? `+${sub.pointsAwarded}` : '...'}
                    </span>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{sub.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <i className="fa-solid fa-feather-pointed text-4xl mb-3 block opacity-20"></i>
              <p>No activity yet. Start a task to earn points!</p>
            </div>
          )}
        </section>

        <section className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 rounded-3xl text-white shadow-xl shadow-rose-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-serif font-bold mb-4">Achieve Your Potential</h3>
            <p className="opacity-90 mb-6">Complete more tasks to unlock exclusive rewards like physical wellness journals and personalized coaching sessions.</p>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Next Milestone</span>
                <span>{profile.points} / 500</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (profile.points / 500) * 100)}%` }}
                ></div>
              </div>
            </div>
            <Link to="/tasks" className="inline-block bg-white text-rose-600 px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all active:scale-95">
              Explore Tasks
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
