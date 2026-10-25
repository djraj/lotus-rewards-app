import React, { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import PageHeader from './PageHeader';
import { ContactScene } from './Illustrations';
import { CONTACT_DETAILS } from './centerInfo';
import { supabase } from '../../services/supabaseClient';

const MESSAGE_MAX = 2000;

// Messages land in contact_messages via the submit_contact_message RPC, which
// works signed out and does the real validation/throttling; admins read them
// in the Admin panel inbox.
const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Honeypot: hidden from people, but naive bots fill every field.
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const errorRef = useRef<HTMLDivElement | null>(null);

  // The banner sits above the fields, often scrolled out of view on submit.
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (website) {
      // Pretend it worked so the bot moves on; nothing is stored.
      setSent(true);
      return;
    }
    setSending(true);
    const { error: rpcError } = await supabase.rpc('submit_contact_message', {
      p_name: name,
      p_email: email,
      p_message: message,
    });
    setSending(false);
    if (rpcError) {
      // RPC validation errors are lowercase sentences; capitalise for display.
      const text = rpcError.message || 'your message could not be sent. Please try again.';
      setError(text.charAt(0).toUpperCase() + text.slice(1));
      return;
    }
    setSent(true);
  };

  return (
    <div>
      <PageHeader eyebrow="Contact" title="Get in Touch">
        Want to book a healing session, ask about the next workshop, or find out how to volunteer?
        We'd love to hear from you.
      </PageHeader>

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
              {error && (
                <div ref={errorRef} className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 text-sm" role="alert">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i>
                  {error}
                </div>
              )}
              <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input
                  required
                  maxLength={100}
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
                  maxLength={254}
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
                  maxLength={MESSAGE_MAX}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-200 outline-none resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                />
                <p className="text-right text-xs text-slate-400 mt-1">{message.length} / {MESSAGE_MAX}</p>
              </div>
              <button
                disabled={sending}
                className="w-full bg-rose-500 text-white py-3 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {sending ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
};

export default Contact;
