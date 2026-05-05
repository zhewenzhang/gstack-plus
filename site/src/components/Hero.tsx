import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/i18n/useLang';
import { STRINGS } from '@/i18n/strings';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const navigate = useNavigate();
  const [lang] = useLang();
  const s = STRINGS.hero;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; v.playsInline = true; v.autoplay = true;
    v.play().catch(() => {});
    const tick = () => {
      if (!v.duration || isNaN(v.duration)) {
        rafRef.current = requestAnimationFrame(tick); return;
      }
      const t = v.currentTime, d = v.duration;
      let opacity = 1;
      if (t < 0.5) opacity = t / 0.5;
      else if (t > d - 0.5) opacity = Math.max(0, (d - t) / 0.5);
      v.style.opacity = String(opacity);
      rafRef.current = requestAnimationFrame(tick);
    };
    const onEnded = () => {
      v.style.opacity = '0';
      setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); }, 100);
    };
    v.addEventListener('ended', onEnded);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

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
          className="font-body text-base sm:text-lg max-w-2xl mt-6 sm:mt-8 leading-relaxed animate-fade-rise-delay px-2 text-muted"
        >
          {s.sub[lang]}
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

        {/* amber stats bar */}
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 mt-10 sm:mt-12 animate-fade-rise-delay-2">
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl" style={{ color: '#F59E0B' }}>46%</div>
            <div className="text-xs text-muted mt-1 tracking-wide">{s.stats.cost[lang]}</div>
          </div>
          <div className="w-px h-10 bg-neutral-200" />
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl" style={{ color: '#F59E0B' }}>3</div>
            <div className="text-xs text-muted mt-1 tracking-wide">{s.stats.tiers[lang]}</div>
          </div>
          <div className="w-px h-10 bg-neutral-200" />
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl" style={{ color: '#F59E0B' }}>5</div>
            <div className="text-xs text-muted mt-1 tracking-wide">{s.stats.dims[lang]}</div>
          </div>
        </div>
      </div>

      {/* video band */}
      <div className="relative mt-20 sm:mt-28 max-w-6xl mx-auto px-4 sm:px-6 pb-0">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="w-full h-auto block"
            style={{ opacity: 0, transition: 'opacity 0.05s linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-black/40 via-transparent to-transparent" />
        </div>
        <p className="text-center text-xs text-muted mt-3 tracking-wide">
          {lang === 'zh'
            ? <>gstack<sup>+</sup> 實機演示錄像</>
            : <>gstack<sup>+</sup> in action — live demo recording</>}
        </p>
      </div>
    </section>
  );
}
