import { useParams, Link } from 'react-router-dom';
import { NAV } from '@/content/manifest';
import { loadMarkdown } from '@/content/loader';
import Sidebar from '@/components/Sidebar';
import Markdown from '@/components/Markdown';

export default function DocPage() {
  const { slug } = useParams();
  const item = NAV.flatMap(s => s.items).find(i => i.slug === slug);
  if (!item) {
    return (
      <div className="p-12">
        <p className="text-muted">找不到這篇文章。</p>
        <Link className="underline" to="/">回首頁</Link>
      </div>
    );
  }
  const md = loadMarkdown(item.source);
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 px-10 py-12">
        <div className="mb-6">
          <Link to="/" className="font-display text-2xl">gstack<sup>+</sup></Link>
        </div>
        <h1 className="font-display text-4xl mb-2">{item.title}</h1>
        <p className="text-xs text-muted mb-8">來源：<code>{item.source}</code></p>
        {md ? <Markdown source={md} /> : <p className="text-muted">Markdown 尚未載入。</p>}
      </main>
    </div>
  );
}
