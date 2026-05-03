import { Link } from 'react-router-dom';
import CodeBlock from './CodeBlock';

const SAMPLE_OUTPUT = `$ npx gstack-plus classify "Refactor auth middleware to support OAuth"

判斷強度  ›  4
上下文寬度 ›  3
風險權重  ›  4
可驗證性  ›  2
創意密度  ›  3

────────────────────────────────────────────────
Routing decision: Tier-A
Reason: Tier-A 條件觸發：judgment=4 ≥ 4, risk=4 ≥ 4

✓ Handoff doc written → ./handoffs/handoff-2026-05-03-x9p2.md

Next: open the handoff doc, fill in Scope Lock + 完成標準, send to your Tier-A model.`;

export default function QuickTry() {
  return (
    <section className="bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">
          {/* Left — copy + install */}
          <div>
            <div className="text-xs uppercase tracking-widest text-muted mb-3">v0.1.0 · live on npm</div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-4">
              Try it in 30 seconds.
            </h2>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4" style={{ color: '#555' }}>
              30 秒上手，零安裝。
            </h2>
            <p className="text-base text-muted leading-relaxed mb-6">
              Score any task on 5 dimensions, get a routing decision, and a pre-filled handoff doc.
              No install, no API key needed for the basic flow.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#888' }}>
              給任何任務打 5 個維度評分，即時得到路由決策 + 預填的 Handoff 文件。
              不需安裝、不需 API Key，基本流程即可使用。
            </p>

            <div className="space-y-3 mb-6">
              <CodeBlock caption="No install (recommended for first try)" code={`npx gstack-plus classify "Your task description"`} />
              <CodeBlock caption="Or install globally" code={`npm install -g gstack-plus
gstack-plus classify "Your task description"`} />
              <CodeBlock caption="Skip the prompts" code={`gstack-plus classify "task" --scores 4,3,4,2,2`} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/playground"
                className="inline-flex items-center text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Or try in browser →
              </Link>
              <Link
                to="/doc/cli"
                className="inline-flex items-center text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Read the full CLI guide →
              </Link>
              <a
                href="https://www.npmjs.com/package/gstack-plus"
                target="_blank" rel="noreferrer"
                className="inline-flex items-center text-sm text-muted hover:text-ink underline-offset-4 hover:underline"
              >
                npmjs.com/package/gstack-plus ↗
              </a>
            </div>
          </div>

          {/* Right — sample output */}
          <div>
            <div className="text-xs uppercase tracking-widest text-muted mb-3">What you'll see</div>
            <CodeBlock code={SAMPLE_OUTPUT} caption="" />
          </div>
        </div>
      </div>
    </section>
  );
}
