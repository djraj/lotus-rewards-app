import React from 'react';
import { NavLink } from 'react-router-dom';

const SERVICES = [
  {
    icon: 'fa-list-check',
    title: 'Task Tracking & Submission',
    text: 'Browse active tasks, start one when you are ready, and submit a photo as proof once it is done.',
  },
  {
    icon: 'fa-clipboard-check',
    title: 'Admin Review & Approval',
    text: 'Every submission is reviewed by an admin, who approves it and awards Lotus Points - or lets you know what to fix.',
  },
  {
    icon: 'fa-gift',
    title: 'Rewards Marketplace',
    text: 'Spend the points you have earned on rewards in the marketplace, from everyday perks to standout prizes.',
  },
  {
    icon: 'fa-chart-pie',
    title: 'Personal Dashboard',
    text: 'See your point balance, recent activity, and progress toward your next reward at a glance.',
  },
];

const Services: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <header className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-4xl font-serif font-bold text-slate-800">What GLHC Rewards Offers</h1>
      <p className="mt-6 text-lg text-slate-500">
        A simple loop: complete a task, get it approved, earn points, redeem a reward. Here's how
        each piece works.
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      {SERVICES.map((s) => (
        <div key={s.title} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex gap-5">
          <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl">
            <i className={`fa-solid ${s.icon}`}></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
            <p className="text-sm text-slate-500">{s.text}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center">
      <NavLink
        to="/login"
        className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-all"
      >
        Member Login
      </NavLink>
    </div>
  </div>
);

export default Services;
