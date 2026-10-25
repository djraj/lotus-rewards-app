import React from 'react';
import { NavLink } from 'react-router-dom';
import { getDailyQuote } from '../../constants';
import Reveal from './Reveal';
import { LotusHero, FloatingPetals, WaveDivider, HeroBadges } from './Illustrations';
import { CENTRE_NAME } from './centreInfo';

const TOPICS = [
  { icon: 'fa-heart', title: 'Emotional Well-being & Relationships', to: '/seminars', tone: 'from-rose-400 to-pink-500' },
  { icon: 'fa-heart-pulse', title: 'Health & Vitality', to: '/services', tone: 'from-emerald-400 to-teal-500' },
  { icon: 'fa-om', title: 'Meditation & Inner Peace', to: '/seminars', tone: 'from-sky-400 to-indigo-400' },
  { icon: 'fa-seedling', title: 'Personal Growth', to: '/workshops', tone: 'from-lime-400 to-emerald-500' },
  { icon: 'fa-sun', title: 'Prosperity & Purpose', to: '/services', tone: 'from-amber-400 to-orange-400' },
  { icon: 'fa-dove', title: 'Spirituality & Mindfulness', to: '/workshops', tone: 'from-violet-400 to-purple-500' },
];

const PILLARS = [
  {
    icon: 'fa-chalkboard-user',
    title: 'Seminars',
    text: 'Short, practical talks on stress, happiness, relationships and self-confidence - simple techniques you can use the same day.',
    to: '/seminars',
    cta: 'View seminars',
    tone: 'from-rose-400 to-rose-500',
  },
  {
    icon: 'fa-hands-holding-circle',
    title: 'Workshops',
    text: 'Learn Pranic Healing step by step, from the basic course to advanced, psychotherapy and spiritual series.',
    to: '/workshops',
    cta: 'View workshops',
    tone: 'from-amber-400 to-orange-400',
  },
  {
    icon: 'fa-spa',
    title: 'Healing Services',
    text: 'Personal sessions with trained healers - energy scanning, cleansing and energising, in person or at a distance.',
    to: '/services',
    cta: 'View services',
    tone: 'from-emerald-400 to-teal-500',
  },
];

const SESSION_STEPS = [
  { icon: 'fa-magnifying-glass', label: 'Scan', text: 'The healer feels for congested or depleted areas of your energy body.' },
  { icon: 'fa-wind', label: 'Cleanse', text: 'Used-up, dirty energy is gently swept away.' },
  { icon: 'fa-bolt', label: 'Energise', text: 'Fresh prana is projected to the areas that need it.' },
  { icon: 'fa-shield-heart', label: 'Stabilise', text: 'The new energy is sealed in so your body can recover.' },
];

const Home: React.FC = () => (
  <div>
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-amber-50/40 to-slate-50">
      <FloatingPetals />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" aria-hidden="true" />
      <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 md:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <span className="gl-fade-up inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-rose-100 text-rose-600 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
            <i className="fa-solid fa-spa"></i> {CENTRE_NAME}
          </span>
          <h1
            className="gl-fade-up mt-6 text-4xl md:text-6xl font-serif font-bold text-slate-800 leading-tight"
            style={{ animationDelay: '0.1s' }}
          >
            Balance your energy, <span className="gl-shimmer-text">transform your life.</span>
          </h1>
          <p className="gl-fade-up mt-6 text-lg text-slate-500 max-w-xl mx-auto lg:mx-0" style={{ animationDelay: '0.2s' }}>
            GLHC is a Pranic Healing centre - a home for no-touch energy healing, practical seminars
            and step-by-step workshops that help you feel better, think clearer and live with more
            purpose.
          </p>
          <div
            className="gl-fade-up mt-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start"
            style={{ animationDelay: '0.3s' }}
          >
            <NavLink
              to="/workshops"
              className="group bg-rose-500 text-white px-7 py-3.5 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-0.5 transition-all"
            >
              Explore Workshops
              <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
            </NavLink>
            <NavLink
              to="/seminars"
              className="bg-white text-slate-700 border border-slate-200 px-7 py-3.5 rounded-full font-bold hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
            >
              View Seminars
            </NavLink>
            <NavLink
              to="/services"
              className="bg-white text-slate-700 border border-slate-200 px-7 py-3.5 rounded-full font-bold hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
            >
              Book a Healing
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
            <HeroBadges />
          </div>
        </div>
      </div>

      <WaveDivider fill="#ffffff" />
    </section>

    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-widest">Begin your journey</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-slate-800">Healing starts from within</h2>
          <p className="mt-4 text-slate-500">Choose what matters most to you right now - we'll point you to the right place to start.</p>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {TOPICS.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <NavLink
                to={t.to}
                className="gl-lift group h-full flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100 text-center sm:text-left"
              >
                <span className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${t.tone} text-white flex items-center justify-center text-xl shadow-lg`}>
                  <i className={`fa-solid ${t.icon}`}></i>
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-slate-800 leading-snug">{t.title}</span>
                  <span className="text-sm text-rose-500 font-semibold">
                    Explore <i className="fa-solid fa-chevron-right text-xs ml-1 transition-transform group-hover:translate-x-1"></i>
                  </span>
                </span>
              </NavLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-widest">What we offer</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-slate-800">Learn it, experience it, live it</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div className="gl-lift h-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.tone} text-white flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                  <i className={`fa-solid ${p.icon}`}></i>
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3">{p.title}</h3>
                <p className="text-slate-500 leading-relaxed flex-1">{p.text}</p>
                <NavLink to={p.to} className="group mt-6 font-bold text-rose-500 hover:text-rose-600">
                  {p.cta} <i className="fa-solid fa-arrow-right ml-1 transition-transform group-hover:translate-x-1"></i>
                </NavLink>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-widest">What is Pranic Healing?</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-slate-800">Working with your body's own life energy</h2>
          <p className="mt-4 text-slate-500">
            Pranic Healing is a no-touch, drug-free system of energy healing developed by Grand Master
            Choa Kok Sui. It works on the energy body to support the physical body's natural ability to
            recover, and is used alongside - never instead of - conventional medical care.
          </p>
        </Reveal>
        <div className="relative">
          <div
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-rose-200"
            aria-hidden="true"
          />
          <ol className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {SESSION_STEPS.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 150} className="relative text-center">
                <div className="relative mx-auto w-16 h-16 rounded-full bg-white border-4 border-rose-100 text-rose-500 flex items-center justify-center text-xl shadow-md">
                  <i className={`fa-solid ${s.icon}`}></i>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-4 font-bold text-slate-700">{s.label}</p>
                <p className="mt-1 text-sm text-slate-500">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-widest">For members</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-slate-800">GLHC Member Rewards</h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            Our members keep the centre running - volunteering, sharing, and bringing friends to
            healing sessions. Log those tasks with a photo, an admin approves them, and you earn
            Lotus Points to redeem for sessions, workshops and products.
          </p>
          <NavLink
            to="/login"
            className="group inline-block mt-8 bg-slate-900 text-white px-7 py-3.5 rounded-full font-bold hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
          >
            Member Login
            <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
          </NavLink>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: 'fa-list-check', label: 'Complete a task', tone: 'text-rose-500 bg-rose-50' },
            { icon: 'fa-camera', label: 'Share your proof', tone: 'text-sky-500 bg-sky-50' },
            { icon: 'fa-leaf', label: 'Earn Lotus Points', tone: 'text-amber-500 bg-amber-50' },
            { icon: 'fa-gift', label: 'Redeem rewards', tone: 'text-emerald-500 bg-emerald-50' },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 100}>
              <div className="gl-lift bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
                <span className={`mx-auto w-12 h-12 rounded-2xl ${item.tone} flex items-center justify-center text-xl`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </span>
                <p className="mt-3 font-semibold text-slate-700 text-sm">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="px-4 pb-8">
      <Reveal className="relative overflow-hidden max-w-5xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-rose-500 via-rose-500 to-amber-500 text-center px-6 py-14 md:py-16 shadow-2xl shadow-rose-200">
        <FloatingPetals />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Help us keep healing accessible</h2>
          <p className="text-rose-50 max-w-xl mx-auto mb-8">
            Your donation supports free healing sessions, community meditations and the upkeep of the
            centre. Every contribution, large or small, makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/donate"
              className="inline-block bg-white text-rose-600 px-8 py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              <i className="fa-solid fa-hand-holding-heart mr-2"></i>Donate
            </NavLink>
            <NavLink
              to="/contact"
              className="inline-block border-2 border-white/70 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Get in Touch
            </NavLink>
          </div>
        </div>
      </Reveal>
    </section>
  </div>
);

export default Home;
