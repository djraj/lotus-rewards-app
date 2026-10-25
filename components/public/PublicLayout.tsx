import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import { CENTRE_NAME, CENTRE_SHORT_NAME, CENTRE_TAGLINE, CONTACT_DETAILS } from './centreInfo';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-rose-600 font-bold transition-colors'
    : 'text-slate-600 hover:text-rose-500 font-medium transition-colors';

const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/workshops', label: 'Workshops' },
  { to: '/seminars', label: 'Seminars' },
  { to: '/services', label: 'Services' },
  { to: '/donate', label: 'Donate' },
  { to: '/contact', label: 'Contact' },
];

// Public-facing shell for signed-out visitors: nav + footer around a routed
// centre page. "Login" is a CTA button, not a page rendered inside this
// layout - it routes to the standalone Auth screen (the member area).
const PublicLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // HashRouter keeps the scroll position between pages; start each at the top.
  // Also close the mobile menu, which otherwise stays open after back/forward
  // or an in-page link.
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
          scrolled ? 'bg-white/90 border-slate-200 shadow-lg shadow-slate-200/50' : 'bg-white/70 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              <Logo className="h-10 w-auto" />
            </NavLink>

            <div className="hidden lg:flex items-center space-x-6">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <NavLink
                to="/login"
                className="bg-rose-500 text-white px-5 py-2 rounded-full font-bold hover:bg-rose-600 transition-all"
              >
                Login
              </NavLink>
            </div>

            <button
              type="button"
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {menuOpen && (
            <div className="lg:hidden flex flex-col gap-4 pb-6">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-rose-500 text-white text-center px-5 py-2 rounded-full font-bold hover:bg-rose-600 transition-all"
              >
                Login
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Keyed on the route so each page fades in on navigation. */}
      <main key={pathname} className="flex-grow gl-page">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="inline-block bg-white rounded-2xl px-3 py-2">
              <Logo className="h-9 w-auto" />
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              {CENTRE_NAME} - Pranic Healing, seminars and workshops for body, mind and spirit.
            </p>
            <ul className="mt-4 space-y-1 text-sm">
              {CONTACT_DETAILS.map((c) => (
                <li key={c.label}>
                  <i className={`fa-solid ${c.icon} w-5 text-rose-300`}></i> {c.value}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-4">Explore</p>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className="hover:text-rose-300 transition-colors">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-4">Members</p>
            <p className="text-sm mb-4">Log in to GLHC Member Rewards to log tasks, earn Lotus Points, and redeem rewards.</p>
            <NavLink
              to="/login"
              className="inline-block bg-rose-500 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-rose-600 transition-all"
            >
              Member Login
            </NavLink>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs">
          <p>&copy; 2026 {CENTRE_NAME} ({CENTRE_SHORT_NAME}). {CENTRE_TAGLINE}</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
