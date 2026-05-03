import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NAV, type Item } from '@/content/manifest';
import { loadMarkdown } from '@/content/loader';
import Sidebar from '@/components/Sidebar';
import Markdown from '@/components/Markdown';
import MobileDrawer from '@/components/MobileDrawer';
import DocToc from '@/components/DocToc';

const REPO_BASE = 'https://github.com/zhewenzhang/gstack-plus/blob/main/';

function findContext(slug: string | undefined) {
  const flat = NAV.flatMap(s => s.items.map(i => ({ ...i, sectionTitle: s.title })));
  const idx = flat.findIndex(i => i.slug === slug);
  return {
    item: idx >= 0 ? flat[idx] : null,
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
    sectionTitle: idx >= 0 ? (flat[idx] as any).sectionTitle as string : '',
  };
}

export default function DocPage() {
  const { slug } = useParams();
  const { item, prev, next, sectionTitle } = findContext(slug);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const [articleEl, setArticleEl] = useState<HTMLElement | null>(null);

  useEffect(() => { setArticleEl(articleRef.current); }, [slug]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-display text-3xl mb-3">找不到這篇文章</h1>
          <Link className="underline" to="/">回首頁</Link>
        </div>
      </div>
    );
  }

  const md = loadMarkdown((item as Item).source);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar (mobile) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-neutral-200 flex items-center justify-between px-4 py-3">
        <button onClick={() => setDrawerOpen(true)} aria-label="Open sidebar"
          className="w-9 h-9 flex flex-col justify-center items-center gap-[5px]">
          <span className="block w-5 h-[1.5px] bg-ink" />
          <span className="block w-5 h-[1.5px] bg-ink" />
          <span className="block w-5 h-[1.5px] bg-ink" />
        </button>
        <Link to="/" className="font-display text-xl">gstack<sup>+</sup></Link>
        <a href={REPO_BASE + (item as Item).source} target="_blank" rel="noreferrer"
          className="text-xs text-muted hover:text-ink">Edit ↗</a>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Sidebar onNavigate={() => setDrawerOpen(false)} />
      </MobileDrawer>

      <div className="flex max-w-[1500px] mx-auto">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen border-r border-neutral-200">
          <div className="px-6 py-6 border-b border-neutral-200">
            <Link to="/" className="font-display text-2xl">gstack<sup>+</sup></Link>
          </div>
          <Sidebar />
        </aside>

        <main className="flex-1 min-w-0 px-5 sm:px-10 py-8 sm:py-12">
          {/* breadcrumb */}
          <nav className="text-xs text-muted mb-6 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span>{sectionTitle}</span>
            {(item as Item).subgroup && (<><span>/</span><span>{(item as Item).subgroup}</span></>)}
            <span>/</span>
            <span className="text-ink">{item.title}</span>
          </nav>

          <header className="mb-10">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight mb-3">
              {item.title}
            </h1>
            {(item as Item).description && (
              <p className="text-base text-muted leading-relaxed">{(item as Item).description}</p>
            )}
            <div className="mt-4">
              <a
                href={REPO_BASE + (item as Item).source}
                target="_blank" rel="noreferrer"
                className="hidden lg:inline-block text-xs text-muted hover:text-ink underline-offset-4 hover:underline"
              >
                在 GitHub 上編輯本頁 ↗
              </a>
            </div>
          </header>

          <div className="flex gap-10">
            <article ref={articleRef} className="flex-1 min-w-0">
              {md ? <Markdown source={md} /> : <p className="text-muted">Markdown 尚未載入。</p>}

              {/* prev / next */}
              <div className="mt-16 pt-8 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link to={`/doc/${prev.slug}`} className="group block rounded-xl border border-neutral-200 hover:border-ink transition-colors p-4">
                    <div className="text-[11px] uppercase tracking-wider text-muted mb-1.5">← 上一篇</div>
                    <div className="font-display text-base text-ink">{prev.title}</div>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link to={`/doc/${next.slug}`} className="group block rounded-xl border border-neutral-200 hover:border-ink transition-colors p-4 sm:text-right">
                    <div className="text-[11px] uppercase tracking-wider text-muted mb-1.5">下一篇 →</div>
                    <div className="font-display text-base text-ink">{next.title}</div>
                  </Link>
                ) : <div />}
              </div>
            </article>

            <DocToc html={articleEl} />
          </div>
        </main>
      </div>
    </div>
  );
}
