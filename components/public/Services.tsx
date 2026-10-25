import React from 'react';
import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import PageHeader from './PageHeader';
import { SpotIllustration } from './Illustrations';

const CATEGORIES = [
  {
    title: 'Pranic Healing Treatments',
    icon: 'fa-spa',
    tone: 'rose' as const,
    items: [
      { name: 'Pranic Healing Session', text: 'Scanning, cleansing and energising to support physical recovery and vitality.' },
      { name: 'Pranic Psychotherapy Session', text: 'Release stress, anxiety, grief and unhealthy emotional patterns.' },
      { name: 'Distant Healing', text: 'A full session delivered remotely, wherever you are.' },
      { name: 'Relationship Healing', text: 'Ease tension and heal hurts between you and the people who matter.' },
    ],
  },
  {
    title: 'Scanning & Counselling',
    icon: 'fa-magnifying-glass',
    tone: 'sky' as const,
    items: [
      { name: 'Energy Scanning', text: 'Find where your energy is congested or depleted, with guidance on next steps.' },
      { name: 'Pranic Coaching', text: 'One-to-one guidance to set goals and clear what holds you back.' },
      { name: 'Forgiveness Session', text: 'A guided process to let go of resentment and move on lighter.' },
    ],
  },
  {
    title: 'Home & Prosperity',
    icon: 'fa-house-chimney',
    tone: 'amber' as const,
    items: [
      { name: 'Home & Space Cleansing', text: 'Clear stale or heavy energy from your home or workplace.' },
      { name: 'Pranic Feng Shui', text: 'Arrange and energise your space to support harmony and growth.' },
      { name: 'Business & Prosperity Healing', text: 'Energise your goals, projects and business for success.' },
    ],
  },
];

const Services: React.FC = () => (
  <div>
    <PageHeader eyebrow="Healing Services" title="Personal sessions with trained healers" tone="emerald">
      Every session is gentle, fully clothed and no-touch. Visit the center or receive healing at a
      distance - our healers will listen first, then tailor the session to you.
    </PageHeader>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 md:space-y-16">
      {CATEGORIES.map((c, i) => (
        <Reveal key={c.title}>
          <div className={`flex flex-col items-center gap-8 md:gap-14 ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
            <SpotIllustration icon={c.icon} tone={c.tone} className="shrink-0" />
            <div className="flex-1 w-full bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-serif font-bold text-slate-800 mb-5 text-center md:text-left">{c.title}</h2>
              <ul className="space-y-4">
                {c.items.map((item) => (
                  <li key={item.name} className="flex gap-3">
                    <i className="fa-solid fa-circle-check text-rose-400 mt-1"></i>
                    <div>
                      <p className="font-semibold text-slate-700">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      ))}

      <Reveal className="text-center">
        <NavLink
          to="/contact"
          className="group inline-block bg-rose-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-0.5 transition-all"
        >
          Enquire or book a session
          <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
        </NavLink>
        <p className="mt-6 text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          <i className="fa-solid fa-circle-info mr-1"></i>
          Pranic Healing is a complementary therapy. It does not replace medical diagnosis or treatment -
          please keep seeing your doctor and continue any prescribed care.
        </p>
      </Reveal>
    </div>
  </div>
);

export default Services;
