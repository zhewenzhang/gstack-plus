import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV } from '@/content/manifest';
import { useLang } from '@/i18n/useLang';

type SearchEntry = {
  slug: string;
  title: string;
  titleEn: string;
  section: string;
  sectionEn: string;
  description: string;
  descriptionEn: string;
};

const INDEX: SearchEntry[] = NAV.flatMap(section =>
  section.items.map(item => ({
    slug: item.slug,
    title: item.title,
    titleEn: item.titleEn ?? item.title,
    section: section.title,
    sectionEn: section.titleEn ?? section.title,
    description: item.description ?? '',
    descriptionEn: item.descriptionEn ?? '',
  }))
);

function doSearch(query: string): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 1) return [];
  return INDEX.filter(e => {
    const haystack = `${e.title} ${e.titleEn} ${e.description} ${e.descriptionEn}`.toLowerCase();
    return haystack.includes(q);
  }).slice(0, 6);
}

export default function DocSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [lang] = useLang();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const r = doSearch(val);
    setResults(r);
    setActive(-1);
    setOpen(val.length > 0);
  };

  const handleSelect = useCallback((slug: string) => {
    navigate(`/doc/${slug}`);
    setQuery('');
    setResults([]);
    setOpen(false);
    onNavigate?.();
  }, [navigate, onNavigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && active >= 0 && results[active]) {
      handleSelect(results[active].slug);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const zh = lang === 'zh';

  return (
    <div ref={containerRef} className="relative mb-6">
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setOpen(true)}
          placeholder={zh ? '搜尋文章…' : 'Search docs…'}
          className="w-full pl-8 pr-3 py-1.5 text-sm bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] rounded-lg text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-[#444]"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-neutral-200 dark:border-[#2A2A2A] rounded-lg shadow-lg z-50 overflow-hidden">
          {results.length > 0 ? (
            <ul>
              {results.map((r, i) => (
                <li key={r.slug}>
                  <button
                    onMouseDown={() => handleSelect(r.slug)}
                    onMouseEnter={() => setActive(i)}
                    className={`w-full text-left px-3 py-2.5 transition-colors ${
                      i === active ? 'bg-neutral-100 dark:bg-[#1A1A1A]' : 'hover:bg-neutral-50 dark:hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <div className="text-xs font-medium text-ink truncate">
                      {zh ? r.title : r.titleEn}
                    </div>
                    <div className="text-[11px] text-muted truncate mt-0.5">
                      {zh ? r.section : r.sectionEn}
                      {(zh ? r.description : r.descriptionEn) && (
                        <> · {zh ? r.description : r.descriptionEn}</>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-3 text-xs text-muted">
              {zh ? '沒有找到相關文章' : 'No results found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
