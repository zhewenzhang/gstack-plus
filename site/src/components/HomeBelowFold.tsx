import { Link } from 'react-router-dom';
import { NAV } from '@/content/manifest';

const READING_PATH = [
  { step: '01', slug: 'roadmap', title: '看路線圖', why: '先了解我們在解什麼問題，分幾個階段' },
  { step: '02', slug: 'architecture', title: '理解三層架構', why: 'Tier-A / Mid / Exec 各自的角色與成本' },
  { step: '03', slug: 'routing-rules', title: '學會分類任務', why: '用 5 維評分把任務路由到正確的 Tier' },
  { step: '04', slug: 'failure-catalog', title: '掌握失敗恢復', why: '當 Exec 出錯時，何時 retry、何時升級' },
];

export default function HomeBelowFold() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
      {/* What is gstack-plus */}
      <div className="max-w-3xl mb-20">
        <div className="text-xs uppercase tracking-widest text-muted mb-3">What is gstack-plus</div>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-4">
          一個放在 gstack 與 superpowers 之上的「模型派遣層」。
        </h2>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          現有的 AI 工作流框架（gstack、superpowers）已經把「角色技能」做得很好，但所有任務還是丟給同一個模型。
          gstack-plus 在它們之上加一層分類器，把判斷、審查、執行分派到三個不同的 tier，
          讓你用 Opus 的判斷力 + Sonnet 的紀律 + Exec 的成本，做出比單模型更好的決策。
        </p>
      </div>

      {/* Reading path */}
      <div className="mb-20">
        <div className="text-xs uppercase tracking-widest text-muted mb-3">推薦閱讀路徑</div>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-8">
          四步看完 gstack-plus。
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {READING_PATH.map(p => (
            <Link
              key={p.slug}
              to={`/doc/${p.slug}`}
              className="group block rounded-xl border border-neutral-200 hover:border-ink transition-colors p-5 bg-white"
            >
              <div className="font-display text-2xl text-muted group-hover:text-ink transition-colors mb-2">
                {p.step}
              </div>
              <div className="font-display text-lg text-ink mb-1.5">{p.title}</div>
              <div className="text-xs text-muted leading-relaxed">{p.why}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="text-xs uppercase tracking-widest text-muted mb-3">完整目錄</div>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-8">
          按你關心的層次切入。
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV.map(section => {
            const first = section.items.slice().sort((a, b) => a.order - b.order)[0];
            return (
              <Link
                key={section.id}
                to={`/doc/${first.slug}`}
                className="group block rounded-xl border border-neutral-200 hover:border-ink transition-colors p-5 bg-white"
              >
                <div className="font-display text-xl text-ink mb-2">{section.title}</div>
                <div className="text-xs text-muted leading-relaxed mb-3">{section.intro}</div>
                <div className="text-xs text-muted">{section.items.length} 篇 →</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
