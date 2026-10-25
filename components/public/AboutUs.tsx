import React from 'react';
import Reveal from './Reveal';
import { FloatingPetals, GrowthScene, WaveDivider } from './Illustrations';

const VALUES = [
  {
    icon: 'fa-hand-holding-heart',
    title: 'Community First',
    text: 'GLHC Rewards exists to recognize the everyday effort our community puts into growth and wellness.',
    tone: 'from-rose-400 to-rose-500',
  },
  {
    icon: 'fa-scale-balanced',
    title: 'Fair & Transparent',
    text: 'Every submission is reviewed by hand, and every point earned is tracked openly in your own ledger.',
    tone: 'from-amber-400 to-orange-400',
  },
  {
    icon: 'fa-seedling',
    title: 'Small Steps, Real Change',
    text: "We believe lasting growth comes from small, consistent actions - not grand gestures.",
    tone: 'from-emerald-400 to-teal-500',
  },
];

const AboutUs: React.FC = () => (
  <div>
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-slate-50">
      <FloatingPetals />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 md:pt-20 text-center">
        <p className="gl-fade-up text-rose-500 font-semibold text-sm uppercase tracking-widest">Our purpose</p>
        <h1 className="gl-fade-up mt-3 text-4xl md:text-5xl font-serif font-bold text-slate-800" style={{ animationDelay: '0.1s' }}>
          About GLHC Rewards
        </h1>
        <p className="gl-fade-up mt-6 text-lg text-slate-500" style={{ animationDelay: '0.2s' }}>
          GLHC Rewards is the community program for the Golden Lotus Healing Center. We built it to
          turn the real-world steps members take toward wellness - the tasks they complete, the
          habits they build - into something visible and rewarding.
        </p>
      </div>
      <WaveDivider fill="#f8fafc" />
    </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 120}>
            <div className="gl-lift h-full bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <div
                className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${v.tone} text-white flex items-center justify-center text-2xl mb-5 shadow-lg`}
              >
                <i className={`fa-solid ${v.icon}`}></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        <Reveal>
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-5">Our Story</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              The Golden Lotus Healing Center has always leaned on its members showing up for each
              other - volunteering, completing wellness practices, and supporting the wider community.
              GLHC Rewards is our way of saying thank you: a simple points system that turns that effort
              into Lotus Points, redeemable for rewards our members actually want.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether you're brand new or have been part of our community for years, there's a task
              waiting for you and points to earn along the way.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-[2rem] p-6 md:p-10 border border-rose-100">
            <GrowthScene className="w-full h-auto" />
          </div>
        </Reveal>
      </div>
    </div>
  </div>
);

export default AboutUs;
