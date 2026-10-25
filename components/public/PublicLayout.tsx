import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Logo from '../Logo';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-rose-600 font-bold transition-colors'
    : 'text-slate-600 hover:text-rose-500 font-medium transition-colors';

const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

// Public-facing shell for signed-out visitors: nav + footer around a routed
// page (Home / About Us / Services / Contact). "Login" is a CTA button, not a
// page rendered inside this layout - it routes to the standalone Auth screen.
const PublicLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              <Logo className="h-10 w-auto" />
            </NavLink>

            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden md:flex items-center">
              <NavLink
                to="/login"
                className="bg-rose-500 text-white px-5 py-2 rounded-full font-bold hover:bg-rose-600 transition-all"
              >
                Login
              </NavLink>
            </div>

            <button
              type="button"
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden flex flex-col gap-4 pb-6">
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

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; 2026 GLHC Rewards. Nurturing growth, one step at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
