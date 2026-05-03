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
    <section className="relative pt-6 sm:pt-10 pb-20 sm:pb-32">
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-6">
        {/* release pill */}
        <a
          href="https://github.com/zhewenzhang/gstack-plus/releases/tag/v0.1.0"
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-neutral-200 bg-white text-[11px] uppercase tracking-wider hover:border-ink transition-colors animate-fade-rise"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-ink">{s.pill[lang]}</span>
          <span className="text-muted">→</span>
        </a>

        <h1
          className="font-display font-normal animate-fade-rise text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl"
          style={{ letterSpacing: '-0.04em', color: '#000000' }}
          dangerouslySetInnerHTML={{ __html: s.headlineHtml[lang] }}
        />

        <p
          className="font-body text-sm sm:text-base md:text-lg max-w-2xl mt-6 sm:mt-8 leading-relaxed animate-fade-rise-delay px-2"
          style={{ color: '#6F6F6F' }}
        >
          {s.sub[lang]}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10 animate-fade-rise-delay-2">
          <button
            onClick={() => navigate('/playground')}
            className="rounded-full px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base bg-ink text-white transition-transform hover:scale-[1.03] cursor-pointer"
          >
            {s.ctaPrimary[lang]}
          </button>
          <button
            onClick={() => document.getElementById('quick-try')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-full px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base border border-neutral-300 text-ink hover:bg-neutral-50 transition-colors cursor-pointer"
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
      </div>

      {/* video band */}
      <div className="relative mt-12 sm:mt-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="w-full h-auto block"
            style={{ opacity: 0, transition: 'opacity 0.05s linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
