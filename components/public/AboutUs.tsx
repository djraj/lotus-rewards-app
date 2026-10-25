import React from 'react';

const VALUES = [
  {
    icon: 'fa-hand-holding-heart',
    title: 'Community First',
    text: 'GLHC Rewards exists to recognize the everyday effort our community puts into growth and wellness.',
  },
  {
    icon: 'fa-scale-balanced',
    title: 'Fair & Transparent',
    text: 'Every submission is reviewed by hand, and every point earned is tracked openly in your own ledger.',
  },
  {
    icon: 'fa-seedling',
    title: 'Small Steps, Real Change',
    text: "We believe lasting growth comes from small, consistent actions - not grand gestures.",
  },
];

const AboutUs: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <header className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-4xl font-serif font-bold text-slate-800">About GLHC Rewards</h1>
      <p className="mt-6 text-lg text-slate-500">
        GLHC Rewards is the community program for the Golden Lotus Healing Center. We built it to
        turn the real-world steps members take toward wellness - the tasks they complete, the
        habits they build - into something visible and rewarding.
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {VALUES.map((v) => (
        <div key={v.title} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mb-4">
            <i className={`fa-solid ${v.icon}`}></i>
          </div>
          <h3 className="font-bold text-slate-800 mb-2">{v.title}</h3>
          <p className="text-sm text-slate-500">{v.text}</p>
        </div>
      ))}
    </div>

    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
      <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Our Story</h2>
      <p className="text-slate-600 mb-4">
        The Golden Lotus Healing Center has always leaned on its members showing up for each
        other - volunteering, completing wellness practices, and supporting the wider community.
        GLHC Rewards is our way of saying thank you: a simple points system that turns that effort
        into Lotus Points, redeemable for rewards our members actually want.
      </p>
      <p className="text-slate-600">
        Whether you're brand new or have been part of our community for years, there's a task
        waiting for you and points to earn along the way.
      </p>
    </div>
  </div>
);

export default AboutUs;
