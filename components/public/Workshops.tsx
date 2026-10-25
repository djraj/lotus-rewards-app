import React from 'react';
import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import PageHeader from './PageHeader';
import { SpotIllustration } from './Illustrations';

type Workshop = { icon: string; title: string; text: string; note?: string };

const SERIES: { name: string; intro: string; spot: { icon: string; tone: 'rose' | 'amber' | 'sky' | 'emerald' }; items: Workshop[] }[] = [
  {
    name: 'Healing Series',
    intro: 'Learn to work with prana - life energy - to help yourself, your family and others.',
    spot: { icon: 'fa-hands-holding-circle', tone: 'rose' },
    items: [
      {
        icon: 'fa-hand-sparkles',
        title: 'Basic Pranic Healing',
        text: 'The foundation course. Discover the energy body, learn to feel and scan energy, and practise cleansing and energising techniques for common ailments.',
        note: 'No prerequisites - start here',
      },
      {
        icon: 'fa-palette',
        title: 'Advanced Pranic Healing',
        text: 'Take your healing further with coloured pranas for faster, more precise results on a wider range of conditions.',
        note: 'After Basic Pranic Healing',
      },
      {
        icon: 'fa-brain',
        title: 'Pranic Psychotherapy',
        text: 'Understand how thoughts and emotions live in the energy body, and learn to release stress, trauma, fears and unhealthy habits.',
        note: 'After Advanced Pranic Healing',
      },
      {
        icon: 'fa-gem',
        title: 'Pranic Crystal Healing',
        text: 'Use crystals to amplify, protect and stabilise your healing work.',
        note: 'After Basic Pranic Healing',
      },
      {
        icon: 'fa-shield-halved',
        title: 'Psychic Self-Defence',
        text: 'Practical techniques to protect yourself, your loved ones and your home from negative energies.',
        note: 'After Basic Pranic Healing',
      },
    ],
  },
  {
    name: 'Spiritual Series',
    intro: 'For those ready to go deeper - meditation, inner stillness and connection with the higher self.',
    spot: { icon: 'fa-dove', tone: 'sky' },
    items: [
      {
        icon: 'fa-sun',
        title: 'Achieving Oneness with the Higher Soul',
        text: 'An introduction to the spiritual teachings behind Pranic Healing, with powerful meditations to connect with your higher self.',
      },
      {
        icon: 'fa-om',
        title: 'Arhatic Yoga',
        text: 'A systematic, safe path of meditation and character building that accelerates spiritual growth.',
        note: 'Has prerequisites - ask us',
      },
    ],
  },
];

const Workshops: React.FC = () => (
  <div>
    <PageHeader eyebrow="Workshops" title="Learn the art and science of energy healing" tone="amber">
      Our workshops teach the Pranic Healing system developed by Grand Master Choa Kok Sui - practical,
      step-by-step and open to anyone. Each course builds on the last, so you can grow at your own pace.
    </PageHeader>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {SERIES.map((series) => (
        <section key={series.name}>
          <Reveal className="flex flex-col md:flex-row items-center gap-8 mb-10 text-center md:text-left">
            <SpotIllustration icon={series.spot.icon} tone={series.spot.tone} className="shrink-0" />
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800">{series.name}</h2>
              <p className="mt-3 text-slate-500 text-lg max-w-2xl">{series.intro}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {series.items.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 120}>
                <div className="gl-lift h-full bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex gap-5">
                  <span className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-400 text-white flex items-center justify-center text-xl shadow-lg">
                    <i className={`fa-solid ${w.icon}`}></i>
                  </span>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-800">{w.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{w.text}</p>
                    {w.note && (
                      <span className="inline-block mt-3 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                        {w.note}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <Reveal className="text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">Interested in the next intake?</h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto">
          Workshop dates are announced to our community first. Get in touch and we'll let you know when the
          next class opens.
        </p>
        <NavLink
          to="/contact"
          className="group inline-block mt-6 bg-rose-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-0.5 transition-all"
        >
          Ask about dates
          <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
        </NavLink>
      </Reveal>
    </div>
  </div>
);

export default Workshops;
