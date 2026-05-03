import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import MobileDrawer from './MobileDrawer';
import Sidebar from './Sidebar';
import LangToggle from './LangToggle';
import { useLang } from '@/i18n/useLang';
import { STRINGS } from '@/i18n/strings';

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [lang] = useLang();
  const t = STRINGS.nav;

  const items = [
    { label: t.home[lang],        to: '/' },
    { label: t.playground[lang],  to: '/playground' },
    { label: t.manual[lang],      to: '/doc/getting-started' },
    { label: t.notes[lang],       to: '/doc/gstack-overview' },
    { label: t.experiments[lang], to: '/doc/experiments-readme' },
    { label: t.strategy[lang],    to: '/doc/yc-blindspots' },
  ];

  const goToQuickTry = () => {
    if (location.pathname === '/') {
      document.getElementById('quick-try')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: 'quick-try' } });
    }
  };

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
          >npm</a>
          <a
            href="https://github.com/zhewenzhang/gstack-plus"
            target="_blank" rel="noreferrer"
            className="text-sm text-muted hover:text-ink transition-colors"
          >GitHub</a>
        </div>

        <div className="flex items-center gap-3">
          <LangToggle />
          <button
            onClick={goToQuickTry}
            className="rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm bg-ink text-white transition-transform hover:scale-[1.03] whitespace-nowrap"
          >
            {t.getStarted[lang]}
          </button>
        </div>
      </nav>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <Sidebar onNavigate={() => setOpen(false)} />
      </MobileDrawer>
    </>
  );
}
