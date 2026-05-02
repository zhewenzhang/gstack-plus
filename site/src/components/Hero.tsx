import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

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
    <section className="relative" style={{ paddingTop: 'calc(8rem - 75px)', paddingBottom: '10rem' }}>
      {/* video layer */}
      <div className="absolute z-0" style={{ top: '300px', inset: 'auto 0 0 0' }}>
        <video
          ref={videoRef}
          src={VIDEO_URL}
          className="w-full h-auto"
          style={{ opacity: 0, transition: 'opacity 0.05s linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <h1
          className="font-display text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal animate-fade-rise"
          style={{ lineHeight: 0.95, letterSpacing: '-2.46px', color: '#000000' }}
        >
          Beyond <em className="italic" style={{ color: '#6F6F6F' }}>silos,</em> we orchestrate{' '}
          <em className="italic" style={{ color: '#6F6F6F' }}>the eternal.</em>
        </h1>

        <p
          className="font-body text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay"
          style={{ color: '#6F6F6F' }}
        >
          A multi-tier model orchestration framework for brilliant minds, fearless makers, and
          thoughtful souls. Through the noise of single-model thinking, we craft tiered systems
          for deep judgment and pure execution.
        </p>

        <Link
          to="/doc/roadmap"
          className="rounded-full px-14 py-5 text-base mt-12 bg-ink text-white transition-transform hover:scale-[1.03] animate-fade-rise-delay-2"
        >
          Begin Journey
        </Link>
      </div>
    </section>
  );
}
