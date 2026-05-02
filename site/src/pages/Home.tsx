import Nav from '@/components/Nav';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Nav />
      <Hero />
    </div>
  );
}
