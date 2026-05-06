import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import QuickTry from '@/components/QuickTry';
import HomeBelowFold from '@/components/HomeBelowFold';
import { useLang } from '@/i18n/useLang';
import { STRINGS } from '@/i18n/strings';

const SITE_VERSION = '0.5.0';

export default function Home() {
  const location = useLocation();
  const [lang] = useLang();
  const f = STRINGS.findings;

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(state.scrollTo!)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <Nav />
      <Hero />
      <div id="quick-try" />
      <QuickTry />

      {/* ── 6 Key Findings ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{f.title[lang]}</div>
          <p className="text-sm text-muted max-w-xl mx-auto">{f.subtitle[lang]}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {f.cards.map((card) => (
            <div key={card.id} className="rounded-2xl border border-neutral-200 dark:border-[#2A2A2A] p-6 bg-surface">
              <div className="font-display text-4xl sm:text-5xl mb-2" style={{ color: '#F59E0B' }}>{card.num}</div>
              <div className="text-sm text-ink font-medium mb-1">{lang === 'zh' ? card.zh : card.en}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/doc/key-findings"
            className="text-sm text-muted hover:text-ink underline-offset-4 hover:underline transition-colors"
          >
            {f.cta[lang]}
          </Link>
        </div>
      </section>

      <HomeBelowFold />
      <footer className="border-t border-neutral-200 py-10 px-5 text-center text-xs text-muted">
        gstack<sup>+</sup> · v{SITE_VERSION} ·
        <a href="https://www.npmjs.com/package/gstack-plus" target="_blank" rel="noreferrer" className="mx-1.5 hover:text-ink underline-offset-4 hover:underline">npm</a>·
        <a href="https://github.com/zhewenzhang/gstack-plus" target="_blank" rel="noreferrer" className="mx-1.5 hover:text-ink underline-offset-4 hover:underline">GitHub</a>·
        <a href="https://github.com/zhewenzhang/gstack-plus/blob/main/LICENSE" target="_blank" rel="noreferrer" className="mx-1.5 hover:text-ink underline-offset-4 hover:underline">MIT</a>
      </footer>
    </div>
  );
}
