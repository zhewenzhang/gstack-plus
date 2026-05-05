import { useEffect, useState } from 'react';

type Heading = { id: string; text: string; level: number };

export default function DocToc({ html }: { html: HTMLElement | null }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!html) return;
    const found: Heading[] = [];
    html.querySelectorAll('h2, h3').forEach(h => {
      const id = h.id || h.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      if (!h.id) h.id = id;
      found.push({ id, text: h.textContent || '', level: h.tagName === 'H2' ? 2 : 3 });
    });
    setHeadings(found);

    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) { setActiveId(e.target.id); break; }
        }
      },
      { rootMargin: '0px 0px -70% 0px' }
    );
    found.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [html]);

  if (headings.length < 2) return null;

  return (
    <nav className="hidden xl:block w-56 shrink-0 sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto pl-6 border-l border-neutral-100 dark:border-[#2A2A2A]">
      <div className="text-[11px] uppercase tracking-wider text-muted mb-3">本頁目錄</div>
      <ul className="space-y-1.5">
        {headings.map(h => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? 12 : 0 }}>
            <a
              href={`#${h.id}`}
              className={`block text-xs leading-snug transition-colors ${
                activeId === h.id ? 'text-ink font-medium' : 'text-muted hover:text-ink'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
