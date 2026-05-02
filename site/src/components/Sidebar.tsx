import { NavLink } from 'react-router-dom';
import { NAV } from '@/content/manifest';

export default function Sidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-neutral-200 px-6 py-10 sticky top-0 h-screen overflow-y-auto">
      {NAV.map(section => (
        <div key={section.id} className="mb-8">
          <div className="font-display text-xl text-ink mb-3">{section.title}</div>
          <ul className="space-y-1.5">
            {section.items
              .slice()
              .sort((a, b) => a.order - b.order)
              .map(item => (
                <li key={item.slug}>
                  <NavLink
                    to={`/doc/${item.slug}`}
                    className={({ isActive }) =>
                      `block text-sm transition-colors ${isActive ? 'text-ink font-medium' : 'text-muted hover:text-ink'}`
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
