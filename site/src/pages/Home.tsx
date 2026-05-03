import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import HomeBelowFold from '@/components/HomeBelowFold';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <Nav />
      <Hero />
      <HomeBelowFold />
      <footer className="border-t border-neutral-200 py-10 text-center text-xs text-muted">
        gstack<sup>+</sup> · MIT License · made for AI thinkers
      </footer>
    </div>
  );
}
