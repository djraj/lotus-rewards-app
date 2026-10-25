import React from 'react';
import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import PageHeader from './PageHeader';
import { GrowthScene } from './Illustrations';

const VALUES = [
  {
    icon: 'fa-hand-holding-heart',
    title: 'Compassion & Service',
    text: 'We heal and teach with loving-kindness, and our members give their time to help others do the same.',
    tone: 'from-rose-400 to-rose-500',
  },
  {
    icon: 'fa-scale-balanced',
    title: 'Integrity',
    text: 'Pranic Healing complements medical care - we are honest about what it is, and always encourage you to keep seeing your doctor.',
    tone: 'from-amber-400 to-orange-400',
  },
  {
    icon: 'fa-seedling',
    title: 'Small Steps, Real Change',
    text: 'Lasting healing and growth come from small, consistent practice - one meditation, one session, one kind act at a time.',
    tone: 'from-emerald-400 to-teal-500',
  },
];

const AboutUs: React.FC = () => (
  <div>
    <PageHeader eyebrow="About us" title="Golden Lotus Healing Center">
      GLHC is a Pranic Healing center and a community of healers, students and volunteers. We share
      simple, practical energy-healing techniques so that people can take care of their own
      well-being - and help the people around them.
    </PageHeader>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 120}>
            <div className="gl-lift h-full bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${v.tone} text-white flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                <i className={`fa-solid ${v.icon}`}></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto mb-20">
        <Reveal>
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-5">Our Story</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              The Golden Lotus Healing Center began with a simple wish: to make Pranic Healing easy to
              find, easy to learn and open to everyone. Today the center is a place to receive healing,
              join a meditation, attend a seminar or take your first workshop.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Like a lotus rising from muddy water, we believe everyone can grow through life's
              challenges. Whether you're curious, in need of healing, or ready to become a healer
              yourself, you're welcome here.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-[2rem] p-6 md:p-10 border border-rose-100">
            <GrowthScene className="w-full h-auto" />
          </div>
        </Reveal>
      </div>

      <Reveal className="max-w-4xl mx-auto bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <span className="shrink-0 w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-3xl shadow-xl">
          <i className="fa-solid fa-leaf"></i>
        </span>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-serif font-bold">A thank-you for our members</h2>
          <p className="mt-2 text-slate-300">
            GLHC Member Rewards recognises the people who keep the center going. Members earn Lotus
            Points for volunteering and community tasks, and redeem them for sessions, workshops and
            products.
          </p>
          <NavLink to="/login" className="inline-block mt-5 font-bold text-amber-300 hover:text-amber-200">
            Member Login <i className="fa-solid fa-arrow-right ml-1"></i>
          </NavLink>
        </div>
      </Reveal>
    </div>
  </div>
);

export default AboutUs;
