import { Link, NavLink } from 'react-router-dom';

const items = [
  { label: 'Home',     to: '/',          active: true  },
  { label: 'Manual',   to: '/doc/architecture' },
  { label: 'Notes',    to: '/doc/gstack-overview' },
  { label: 'Experiments', to: '/doc/experiments-readme' },
  { label: 'Strategy', to: '/doc/yc-blindspots' },
];

export default function Nav() {
  return (
    <nav className="relative z-10 max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
      <Link to="/" className="font-display text-3xl tracking-tight text-ink">
        gstack<sup className="text-xl">+</sup>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {items.map(i => (
          <NavLink
            key={i.label}
            to={i.to}
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive || i.active ? 'text-ink' : 'text-muted hover:text-ink'}`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </div>
      <Link
        to="/doc/roadmap"
        className="rounded-full px-6 py-2.5 text-sm bg-ink text-white transition-transform hover:scale-[1.03]"
      >
        Begin Journey
      </Link>
    </nav>
  );
}
