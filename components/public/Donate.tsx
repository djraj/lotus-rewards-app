import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import PageHeader from './PageHeader';
import { DONATION_BANK, DUITNOW_QR_SRC } from './centreInfo';

const IMPACT = [
  { icon: 'fa-hand-holding-medical', title: 'Healing for all', text: 'Help us offer healing to anyone who needs it, whatever they can afford.' },
  { icon: 'fa-om', title: 'Group meditations', text: 'Support regular Meditation on Twin Hearts sessions for peace and goodwill.' },
  { icon: 'fa-house-chimney-window', title: 'A home for healing', text: 'Help with rent, utilities and upkeep of the centre.' },
];

const BANK_ROWS: { label: string; value: string; copy?: boolean; compact?: boolean }[] = [
  { label: 'Bank', value: DONATION_BANK.bankName },
  { label: 'Account name', value: DONATION_BANK.accountName, copy: true },
  { label: 'Account number', value: DONATION_BANK.accountNumber, copy: true, compact: true },
  { label: 'SWIFT / BIC', value: DONATION_BANK.swiftCode, copy: true, compact: true },
  { label: 'Reference', value: DONATION_BANK.reference },
];

const CopyButton: React.FC<{ value: string; label: string; compact?: boolean }> = ({ value, label, compact }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      // Numbers are spaced for readability; banking apps want them without spaces.
      await navigator.clipboard.writeText(compact ? value.replace(/\s+/g, '') : value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked (insecure context / permissions) - value is still visible to copy by hand */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
        copied ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-500 border-slate-200 hover:text-rose-500 hover:border-rose-200'
      }`}
    >
      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} mr-1`}></i>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const Donate: React.FC = () => {
  const [qrMissing, setQrMissing] = useState(false);

  return (
    <div>
      <PageHeader eyebrow="Donate" title="Support the work of the centre">
        GLHC runs on the generosity of our community. Your gift helps us offer healing, meditation and
        learning to everyone who walks through our doors.
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {IMPACT.map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <div className="gl-lift h-full bg-white p-7 rounded-3xl border border-slate-100 shadow-sm text-center">
                <span className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-400 text-white flex items-center justify-center text-xl shadow-lg">
                  <i className={`fa-solid ${item.icon}`}></i>
                </span>
                <h3 className="mt-4 font-bold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <Reveal className="lg:col-span-3">
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-8">
              <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-building-columns"></i>
                </span>
                Bank transfer
              </h2>
              <dl className="mt-6 divide-y divide-slate-100">
                {BANK_ROWS.map((row) => (
                  <div key={row.label} className="py-4 sm:flex sm:items-center sm:gap-3">
                    <dt className="text-sm text-slate-400 sm:w-36 sm:shrink-0 mb-1 sm:mb-0">{row.label}</dt>
                    <dd className="flex-1 flex items-center justify-between gap-3 min-w-0">
                      <span className="font-semibold text-slate-800 break-words min-w-0">{row.value}</span>
                      {row.copy && <CopyButton value={row.value} label={row.label} compact={row.compact} />}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-slate-500 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <i className="fa-solid fa-receipt text-amber-500 mr-2"></i>
                Would you like an acknowledgement? Send us your transfer reference and name through the{' '}
                <NavLink to="/contact" className="font-semibold text-rose-500 hover:underline">contact page</NavLink>.
              </p>
            </section>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-2">
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-8 text-center">
              <h2 className="text-2xl font-serif font-bold text-slate-800">DuitNow QR</h2>
              <p className="mt-2 text-sm text-slate-500">Scan with any Malaysian banking or e-wallet app.</p>
              <div className="mt-6 mx-auto w-56 h-56 rounded-3xl border-2 border-dashed border-rose-200 bg-rose-50/50 flex items-center justify-center overflow-hidden">
                {qrMissing ? (
                  <div className="text-rose-300 px-6">
                    <i className="fa-solid fa-qrcode text-6xl"></i>
                    <p className="mt-3 text-xs font-semibold text-slate-400">QR code coming soon</p>
                  </div>
                ) : (
                  <img
                    src={DUITNOW_QR_SRC}
                    alt="DuitNow QR code for donations to Golden Lotus Healing Centre"
                    className="w-full h-full object-contain bg-white"
                    onError={() => setQrMissing(true)}
                  />
                )}
              </div>
              <p className="mt-6 text-xs text-slate-400">
                Please check the recipient name shows <span className="font-semibold">{DONATION_BANK.accountName}</span> before you confirm.
              </p>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Donate;
