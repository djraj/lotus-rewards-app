import React from 'react';
import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import { FloatingPetals, SpotIllustration, WaveDivider } from './Illustrations';

const SERVICES = [
  {
    icon: 'fa-list-check',
    tone: 'rose' as const,
    title: 'Task Tracking & Submission',
    text: 'Browse active tasks, start one when you are ready, and submit a photo as proof once it is done.',
  },
  {
    icon: 'fa-clipboard-check',
    tone: 'emerald' as const,
    title: 'Admin Review & Approval',
    text: 'Every submission is reviewed by an admin, who approves it and awards Lotus Points - or lets you know what to fix.',
  },
  {
    icon: 'fa-gift',
    tone: 'amber' as const,
    title: 'Rewards Marketplace',
    text: 'Spend the points you have earned on rewards in the marketplace, from everyday perks to standout prizes.',
  },
  {
    icon: 'fa-chart-pie',
    tone: 'sky' as const,
    title: 'Personal Dashboard',
    text: 'See your point balance, recent activity, and progress toward your next reward at a glance.',
  },
];

const Services: React.FC = () => (
  <div>
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-slate-50">
      <FloatingPetals />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 md:pt-20 text-center">
        <p className="gl-fade-up text-rose-500 font-semibold text-sm uppercase tracking-widest">Services</p>
        <h1 className="gl-fade-up mt-3 text-4xl md:text-5xl font-serif font-bold text-slate-800" style={{ animationDelay: '0.1s' }}>
          What GLHC Rewards Offers
        </h1>
        <p className="gl-fade-up mt-6 text-lg text-slate-500" style={{ animationDelay: '0.2s' }}>
          A simple loop: complete a task, get it approved, earn points, redeem a reward. Here's how
          each piece works.
        </p>
      </div>
      <WaveDivider fill="#f8fafc" />
    </section>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 md:space-y-16">
      {SERVICES.map((s, i) => (
        <Reveal key={s.title}>
          <div
            className={`flex flex-col items-center gap-8 md:gap-14 ${
              i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
            }`}
          >
            <SpotIllustration icon={s.icon} tone={s.tone} className="shrink-0" />
            <div className="gl-lift flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center md:text-left">
              <span className="text-xs font-bold text-rose-400 tracking-widest">STEP {i + 1}</span>
              <h3 className="mt-2 text-2xl font-serif font-bold text-slate-800 mb-3">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed">{s.text}</p>
            </div>
          </div>
        </Reveal>
      ))}

      <Reveal className="text-center pt-4">
        <NavLink
          to="/login"
          className="group inline-block bg-rose-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-0.5 transition-all"
        >
          Member Login
          <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
        </NavLink>
      </Reveal>
    </div>
  </div>
);

export default Services;
