import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import QuickTry from '@/components/QuickTry';
import HomeBelowFold from '@/components/HomeBelowFold';

const SITE_VERSION = '0.3.2';

export default function Home() {
  const location = useLocation();
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
