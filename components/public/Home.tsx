import React from 'react';
import { NavLink } from 'react-router-dom';
import { getDailyQuote } from '../../constants';

const FEATURES = [
  {
    icon: 'fa-list-check',
    title: 'Complete Real Tasks',
    text: 'Take on everyday wellness and community tasks, submit your proof, and watch the points add up.',
  },
  {
    icon: 'fa-leaf',
    title: 'Earn Lotus Points',
    text: 'Every approved task earns Lotus Points - a simple way to recognize the effort you put in.',
  },
  {
    icon: 'fa-gift',
    title: 'Redeem Rewards',
    text: 'Trade your points for rewards in our marketplace, from small treats to meaningful perks.',
  },
  {
    icon: 'fa-seedling',
    title: 'Grow With Your Community',
    text: 'Track your progress and celebrate milestones alongside the rest of the GLHC community.',
  },
];

const Home: React.FC = () => (
  <div>
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-800 leading-tight">
        Nurturing growth, <span className="text-rose-500">one step at a time.</span>
      </h1>
      <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
        GLHC Rewards turns the real-world steps you take toward wellness into Lotus Points - earn
        them by completing tasks, then redeem them for rewards built by your community.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <NavLink
          to="/login"
          className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-all"
        >
          Member Login
        </NavLink>
        <NavLink
          to="/services"
          className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-all"
        >
          See How It Works
        </NavLink>
      </div>
      <p className="mt-8 italic text-slate-400 max-w-xl mx-auto">&ldquo;{getDailyQuote()}&rdquo;</p>
    </section>

    <section className="bg-white border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 text-center mb-12">
          How GLHC Rewards works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mb-4">
                <i className={`fa-solid ${f.icon}`}></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 text-center px-4">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-4">
        Ready to get started?
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mb-8">
        Already a GLHC member? Log in to start logging tasks and earning points today.
      </p>
      <NavLink
        to="/login"
        className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-all"
      >
        Member Login
      </NavLink>
    </section>
  </div>
);

export default Home;
