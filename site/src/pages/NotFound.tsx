import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div className="font-display text-7xl mb-2">404</div>
        <p className="text-muted mb-6">這個路徑不在文檔索引裡。</p>
        <Link to="/" className="rounded-full px-8 py-3 bg-ink text-white text-sm">回首頁</Link>
      </div>
    </div>
  );
}
