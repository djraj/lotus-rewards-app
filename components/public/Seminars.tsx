import React from 'react';
import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import PageHeader from './PageHeader';

const SEMINARS = [
  { icon: 'fa-feather', title: 'Managing Stress', text: 'Simple breathing and energy techniques to calm the mind and release tension.', tone: 'from-sky-400 to-indigo-400' },
  { icon: 'fa-face-smile', title: 'Cultivating Happiness', text: 'Practical habits and exercises to lift your mood and keep it there.', tone: 'from-amber-400 to-orange-400' },
  { icon: 'fa-yin-yang', title: 'Understanding Karma', text: 'How actions shape outcomes - and how to create more good in your life.', tone: 'from-violet-400 to-purple-500' },
  { icon: 'fa-star', title: 'Building Self-Confidence', text: 'Break limiting beliefs and develop a stronger, kinder self-image.', tone: 'from-rose-400 to-pink-500' },
  { icon: 'fa-people-arrows', title: 'Healing Relationships', text: 'Clear old hurts and bring more harmony to family, partners and colleagues.', tone: 'from-pink-400 to-rose-500' },
  { icon: 'fa-brain', title: 'Super Brain Yoga', text: 'A two-minute exercise to energise the brain, focus and memory - great for all ages.', tone: 'from-emerald-400 to-teal-500' },
  { icon: 'fa-heart', title: 'Meditation on Twin Hearts', text: 'A guided meditation for inner peace and illumination, while blessing the earth with loving-kindness.', tone: 'from-rose-400 to-amber-400' },
];

const Seminars: React.FC = () => (
  <div>
    <PageHeader eyebrow="Seminars" title="Practical wisdom for everyday life">
      Short, friendly sessions that give you simple tools for stress, happiness, relationships and
      success - no experience needed, and you can start using them the same day.
    </PageHeader>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SEMINARS.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 100}>
            <div className="gl-lift h-full bg-white p-7 rounded-3xl border border-slate-100 shadow-sm">
              <span className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.tone} text-white flex items-center justify-center text-xl shadow-lg`}>
                <i className={`fa-solid ${s.icon}`}></i>
              </span>
              <h3 className="mt-5 text-xl font-serif font-bold text-slate-800">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.text}</p>
            </div>
          </Reveal>
        ))}
        <Reveal delay={100}>
          <div className="h-full rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 p-7 text-white flex flex-col justify-between shadow-xl shadow-rose-200">
            <div>
              <h3 className="text-xl font-serif font-bold">Bring a seminar to your group</h3>
              <p className="mt-2 text-sm text-rose-50">
                Interested in a seminar for your school, workplace or community group? Tell us what your group needs.
              </p>
            </div>
            <NavLink
              to="/contact"
              className="mt-6 self-start bg-white text-rose-600 px-5 py-2.5 rounded-full font-bold text-sm hover:-translate-y-0.5 transition-all"
            >
              Contact us
            </NavLink>
          </div>
        </Reveal>
      </div>
    </div>
  </div>
);

export default Seminars;
