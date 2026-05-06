import { NavLink } from 'react-router-dom';
import { NAV, type Item } from '@/content/manifest';
import { useLang } from '@/i18n/useLang';
import DocSearch from './DocSearch';

function groupBySubgroup(items: Item[]): { name: string | null; items: Item[] }[] {
  const result: { name: string | null; items: Item[] }[] = [];
  const seen = new Map<string, Item[]>();
  const order: (string | null)[] = [];
  for (const it of items.slice().sort((a, b) => a.order - b.order)) {
    const key = it.subgroup ?? '__none__';
    if (!seen.has(key)) { seen.set(key, []); order.push(it.subgroup ?? null); }
    seen.get(key)!.push(it);
  }
  for (const k of order) {
    result.push({ name: k, items: seen.get(k ?? '__none__')! });
  }
  return result;
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [lang] = useLang();
  return (
    <aside className="h-full w-full overflow-y-auto px-6 py-8 lg:py-10">
      <DocSearch onNavigate={onNavigate} />
      <div className="mb-6">
        <div className="font-display text-lg text-ink">
          {lang === 'en' ? 'Navigation' : '導航'}
        </div>
      </div>
      {NAV.map(section => {
        const grouped = groupBySubgroup(section.items);
        const hasSubgroups = grouped.some(g => g.name);
        return (
          <div key={section.id} className="mb-8">
            <div className="font-display text-xl text-ink mb-1">
              {lang === 'en' && section.titleEn ? section.titleEn : section.title}
            </div>
            {(section.intro || section.introEn) && (
              <p className="text-xs text-muted mb-3 leading-snug">
                {lang === 'en' && section.introEn ? section.introEn : section.intro}
              </p>
            )}
            {hasSubgroups ? (
              grouped.map((g, idx) => (
                <div key={idx} className="mb-3">
                  {g.name && (
                    <div className="text-[11px] uppercase tracking-wider text-muted mb-1.5 mt-2">
                      {g.name}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {g.items.map(item => (
                      <li key={item.slug}>
                        <NavLink
                          to={`/doc/${item.slug}`}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            `block text-sm py-0.5 transition-colors ${isActive ? 'text-ink font-medium' : 'text-muted hover:text-ink'}`
                          }
                        >
                          {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul className="space-y-1">
                {grouped[0].items.map(item => (
                  <li key={item.slug}>
                    <NavLink
                      to={`/doc/${item.slug}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `block text-sm py-0.5 transition-colors ${isActive ? 'text-ink font-medium' : 'text-muted hover:text-ink'}`
                      }
                    >
                      {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}
