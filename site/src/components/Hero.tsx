import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/i18n/useLang';
import { STRINGS } from '@/i18n/strings';
import HeroDemo from './HeroDemo';

export default function Hero() {
  const navigate = useNavigate();
  const [lang] = useLang();
  const s = STRINGS.hero;

  return (
    <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-20">
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-6">
        {/* release pill */}
        <a
          href={s.pillUrl}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-neutral-200 dark:border-[#2A2A2A] bg-background text-[11px] uppercase tracking-wider hover:border-ink transition-colors animate-fade-rise"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-ink">{s.pill[lang]}</span>
          <span className="text-muted">→</span>
        </a>

        <h1
          className="font-display font-normal animate-fade-rise text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl text-ink"
          style={{ letterSpacing: '-0.04em' }}
          dangerouslySetInnerHTML={{ __html: s.headlineHtml[lang] }}
        />

        <p
          className="font-body text-sm sm:text-base max-w-2xl mt-6 sm:mt-8 leading-relaxed animate-fade-rise-delay px-2 text-muted"
        >
          {s.subtitle?.[lang] ?? s.sub[lang]}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10 animate-fade-rise-delay-2">
          <button
            onClick={() => navigate('/playground')}
            className="rounded-full px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base bg-ink text-white dark:text-black transition-transform hover:scale-[1.03] cursor-pointer"
          >
            {s.ctaPrimary[lang]}
          </button>
          <button
            onClick={() => document.getElementById('quick-try')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-full px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base border border-neutral-300 dark:border-[#383838] text-ink hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            {s.ctaSecondary[lang]}
          </button>
          <Link
            to="/doc/architecture"
            className="rounded-full px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base text-muted hover:text-ink transition-colors flex items-center justify-center"
          >
            {s.ctaTertiary[lang]}
          </Link>
        </div>

        {/* amber stats bar — 4 metrics */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mt-10 sm:mt-12 animate-fade-rise-delay-2">
          {s.stats.map((stat: any, i: number) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl sm:text-4xl" style={{ color: '#F59E0B' }}>{stat[lang]}</div>
              <div className="text-xs text-muted mt-1 tracking-wide">{(s.statsNotes as any)?.[i]?.[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* terminal demo band */}
      <div className="relative mt-20 sm:mt-28 max-w-5xl mx-auto px-4 sm:px-6 pb-0">
        <HeroDemo lang={lang} />
        <p className="text-center text-xs text-muted mt-3 tracking-wide">
          {lang === 'zh'
            ? <>gstack<sup>+</sup> 路由器 — 即時演示</>
            : <>gstack<sup>+</sup> router — live demo</>}
        </p>
      </div>
    </section>
  );
}
