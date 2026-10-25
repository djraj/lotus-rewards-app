import React, { useState } from 'react';
import Reveal from './Reveal';
import { ContactScene, FloatingPetals, WaveDivider } from './Illustrations';

const CONTACT_DETAILS = [
  { icon: 'fa-envelope', label: 'Email', value: 'hello@glhcrewards.example' },
  { icon: 'fa-phone', label: 'Phone', value: '(555) 010-2024' },
  { icon: 'fa-location-dot', label: 'Address', value: '123 Lotus Way, Serenity Springs' },
];

// Sample contact form - no backend wired up yet. It just confirms the
// message locally so the page reads as finished rather than broken; a real
// submit path (e.g. a Supabase table or email webhook) is future work.
const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-slate-50">
        <FloatingPetals />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 md:pt-20 text-center">
          <p className="gl-fade-up text-rose-500 font-semibold text-sm uppercase tracking-widest">Contact</p>
          <h1 className="gl-fade-up mt-3 text-4xl md:text-5xl font-serif font-bold text-slate-800" style={{ animationDelay: '0.1s' }}>
            Get in Touch
          </h1>
          <p className="gl-fade-up mt-6 text-lg text-slate-500" style={{ animationDelay: '0.2s' }}>
            Questions about GLHC Rewards, a task, or your account? Reach out and we will get back to
            you.
          </p>
        </div>
        <WaveDivider fill="#f8fafc" />
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        <Reveal className="md:col-span-2 space-y-6">
          <ContactScene className="w-full max-w-xs mx-auto md:mx-0 h-auto" />
          {CONTACT_DETAILS.map((c) => (
            <div key={c.label} className="flex items-start gap-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 text-white flex items-center justify-center text-lg shadow-md shadow-rose-200">
                <i className={`fa-solid ${c.icon}`}></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">{c.label}</p>
                <p className="text-sm text-slate-500">{c.value}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={150} className="md:col-span-3 bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 self-start">
          {sent ? (
            <div className="text-center py-10 gl-fade-up">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl mb-4">
                <i className="fa-solid fa-check"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Message sent</h2>
              <p className="text-slate-500">Thanks for reaching out - we will be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  required
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                />
              </div>
              <button className="w-full bg-rose-500 text-white py-3 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-0.5 transition-all">
                Send message
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
};

export default Contact;
