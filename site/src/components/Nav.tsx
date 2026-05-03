import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileDrawer from './MobileDrawer';
import Sidebar from './Sidebar';

const items = [
  { label: 'Home', to: '/' },
  { label: 'Manual', to: '/doc/architecture' },
  { label: 'Notes', to: '/doc/gstack-overview' },
  { label: 'Experiments', to: '/doc/experiments-readme' },
  { label: 'Strategy', to: '/doc/yc-blindspots' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="relative z-20 max-w-7xl mx-auto flex justify-between items-center px-5 sm:px-8 py-5 sm:py-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden w-9 h-9 flex flex-col justify-center items-center gap-[5px] -ml-2"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[1.5px] bg-ink" />
            <span className="block w-5 h-[1.5px] bg-ink" />
            <span className="block w-5 h-[1.5px] bg-ink" />
          </button>
          <Link to="/" className="font-display text-2xl sm:text-3xl tracking-tight text-ink">
            gstack<sup className="text-base sm:text-xl">+</sup>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {items.map(i => (
            <NavLink
              key={i.label}
              to={i.to}
              end={i.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
              }
            >
              {i.label}
            </NavLink>
          ))}
          <span className="w-px h-4 bg-neutral-300" />
          <a
            href="https://www.npmjs.com/package/gstack-plus"
            target="_blank" rel="noreferrer"
            className="text-sm text-muted hover:text-ink transition-colors"
            aria-label="npm package"
          >
            npm
          </a>
          <a
            href="https://github.com/zhewenzhang/gstack-plus"
            target="_blank" rel="noreferrer"
            className="text-sm text-muted hover:text-ink transition-colors"
            aria-label="GitHub repository"
          >
            GitHub
          </a>
        </div>

        <a
          href="/#quick-try"
          className="rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm bg-ink text-white transition-transform hover:scale-[1.03] whitespace-nowrap"
        >
          Get started
        </a>
      </nav>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <Sidebar onNavigate={() => setOpen(false)} />
      </MobileDrawer>
    </>
  );
}
