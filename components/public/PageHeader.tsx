import React from 'react';
import { FloatingPetals, WaveDivider } from './Illustrations';

const TONES = {
  rose: 'from-rose-50 to-slate-50',
  amber: 'from-amber-50 to-slate-50',
  sky: 'from-sky-50 to-slate-50',
  emerald: 'from-emerald-50 to-slate-50',
} as const;

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  tone?: keyof typeof TONES;
};

// The gradient + petals + wave banner every public subpage opens with.
const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, children, tone = 'rose' }) => (
  <section className={`relative overflow-hidden bg-gradient-to-b ${TONES[tone]}`}>
    <FloatingPetals />
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 md:pt-20 text-center">
      <p className="gl-fade-up text-rose-500 font-semibold text-sm uppercase tracking-widest">{eyebrow}</p>
      <h1
        className="gl-fade-up mt-3 text-4xl md:text-5xl font-serif font-bold text-slate-800"
        style={{ animationDelay: '0.1s' }}
      >
        {title}
      </h1>
      {children && (
        <div className="gl-fade-up mt-6 text-lg text-slate-500" style={{ animationDelay: '0.2s' }}>
          {children}
        </div>
      )}
    </div>
    <WaveDivider fill="#f8fafc" />
  </section>
);

export default PageHeader;
