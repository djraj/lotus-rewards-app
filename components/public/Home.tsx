import React from 'react';
import { NavLink } from 'react-router-dom';
import { getDailyQuote } from '../../constants';
import Reveal from './Reveal';
import { LotusHero, FloatingPetals, WaveDivider, AppPreviewCards } from './Illustrations';

const FEATURES = [
  {
    icon: 'fa-list-check',
    title: 'Complete Real Tasks',
    text: 'Take on everyday wellness and community tasks, submit your proof, and watch the points add up.',
    tone: 'from-rose-400 to-rose-500',
  },
  {
    icon: 'fa-leaf',
    title: 'Earn Lotus Points',
    text: 'Every approved task earns Lotus Points - a simple way to recognize the effort you put in.',
    tone: 'from-amber-400 to-orange-400',
  },
  {
    icon: 'fa-gift',
    title: 'Redeem Rewards',
    text: 'Trade your points for rewards in our marketplace, from small treats to meaningful perks.',
    tone: 'from-pink-400 to-rose-500',
  },
  {
    icon: 'fa-seedling',
    title: 'Grow With Your Community',
    text: 'Track your progress and celebrate milestones alongside the rest of the GLHC community.',
    tone: 'from-emerald-400 to-teal-500',
  },
];

const STEPS = [
  { icon: 'fa-hand-pointer', label: 'Pick a task' },
  { icon: 'fa-camera', label: 'Snap your proof' },
  { icon: 'fa-circle-check', label: 'Get approved' },
  { icon: 'fa-gift', label: 'Redeem a reward' },
];

const Home: React.FC = () => (
  <div>
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-amber-50/40 to-slate-50">
      <FloatingPetals />
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 md:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <span className="gl-fade-up inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-rose-100 text-rose-600 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
            <i className="fa-solid fa-spa"></i> Golden Lotus Healing Center
          </span>
          <h1
            className="gl-fade-up mt-6 text-4xl md:text-6xl font-serif font-bold text-slate-800 leading-tight"
            style={{ animationDelay: '0.1s' }}
          >
            Nurturing growth, <span className="gl-shimmer-text">one step at a time.</span>
          </h1>
          <p className="gl-fade-up mt-6 text-lg text-slate-500 max-w-xl mx-auto lg:mx-0" style={{ animationDelay: '0.2s' }}>
            GLHC Rewards turns the real-world steps you take toward wellness into Lotus Points - earn
            them by completing tasks, then redeem them for rewards built by your community.
          </p>
          <div
            className="gl-fade-up mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            style={{ animationDelay: '0.3s' }}
          >
            <NavLink
              to="/login"
              className="group bg-rose-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-0.5 transition-all"
            >
              Member Login
              <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
            </NavLink>
            <NavLink
              to="/services"
              className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-bold hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
            >
              See How It Works
            </NavLink>
          </div>
          <p className="gl-fade-up mt-8 italic text-slate-400 max-w-xl mx-auto lg:mx-0" style={{ animationDelay: '0.4s' }}>
            <i className="fa-solid fa-quote-left text-rose-200 mr-2"></i>
            {getDailyQuote()}
          </p>
        </div>

        <div className="relative gl-fade-up max-w-md lg:max-w-none mx-auto w-full" style={{ animationDelay: '0.25s' }}>
          <LotusHero className="w-full h-auto drop-shadow-sm" />
          <div className="hidden sm:block">
            <AppPreviewCards />
          </div>
        </div>
      </div>

      <WaveDivider fill="#ffffff" />
    </section>

    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-widest">Why join</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-slate-800">How GLHC Rewards works</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div className="gl-lift h-full bg-slate-50 p-7 rounded-3xl border border-slate-100 text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${f.tone} text-white flex items-center justify-center text-2xl mb-5 shadow-lg`}
                >
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800">Four steps to your first reward</h2>
        </Reveal>
        <div className="relative">
          <div
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-rose-200"
            aria-hidden="true"
          />
          <ol className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 150} className="relative text-center">
                <div className="relative mx-auto w-16 h-16 rounded-full bg-white border-4 border-rose-100 text-rose-500 flex items-center justify-center text-xl shadow-md">
                  <i className={`fa-solid ${s.icon}`}></i>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-4 font-semibold text-slate-700">{s.label}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>

    <section className="px-4 pb-8">
      <Reveal className="relative overflow-hidden max-w-5xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-rose-500 via-rose-500 to-amber-500 text-center px-6 py-14 md:py-16 shadow-2xl shadow-rose-200">
        <FloatingPetals />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-rose-50 max-w-xl mx-auto mb-8">
            Already a GLHC member? Log in to start logging tasks and earning points today.
          </p>
          <NavLink
            to="/login"
            className="inline-block bg-white text-rose-600 px-8 py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            Member Login
          </NavLink>
        </div>
      </Reveal>
    </section>
  </div>
);

export default Home;
