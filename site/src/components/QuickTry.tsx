import { Link } from 'react-router-dom';
import CodeBlock from './CodeBlock';
import { useLang } from '@/i18n/useLang';
import { STRINGS } from '@/i18n/strings';

const SAMPLE_OUTPUT_ZH = `$ npx gstack-plus classify "Refactor auth middleware to support OAuth"

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

const SAMPLE_OUTPUT_EN = `$ npx gstack-plus --lang en classify "Refactor auth middleware to support OAuth"

Judgment Strength  ›  4
Context Width      ›  3
Risk Weight        ›  4
Verifiability      ›  2
Creativity Density ›  3

────────────────────────────────────────────────
Routing decision: Tier-A
Reason: Tier-A triggered: judgment=4 >= 4, risk=4 >= 4

✓ Handoff doc written → ./handoffs/handoff-2026-05-03-x9p2.md

Next: open the handoff doc, fill in Scope Lock + Completion Criteria, send to your Tier-A model.`;

export default function QuickTry() {
  const [lang] = useLang();
  const s = STRINGS.quickTry;

  return (
    <section className="bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">
          {/* Left — copy + install */}
          <div>
            <div className="text-xs uppercase tracking-widest text-muted mb-3">{s.eyebrow[lang]}</div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-4">
              {s.title[lang]}
            </h2>
            <p className="text-base text-muted leading-relaxed mb-6">
              {s.body[lang]}
            </p>

            <div className="space-y-3 mb-6">
              <CodeBlock caption={s.captionNoInstall[lang]} code={`npx gstack-plus classify "Your task description"`} />
              <CodeBlock caption={s.captionInstall[lang]} code={`npm install -g gstack-plus
gstack-plus classify "Your task description"`} />
              <CodeBlock caption={s.captionSkip[lang]} code={`gstack-plus classify "task" --scores 4,3,4,2,2`} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/playground"
                className="inline-flex items-center text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                {s.linkBrowser[lang]}
              </Link>
              <Link
                to="/doc/getting-started"
                className="inline-flex items-center text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                {s.linkCli[lang]}
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
            <div className="text-xs uppercase tracking-widest text-muted mb-3">{s.sampleEyebrow[lang]}</div>
            <CodeBlock code={lang === 'en' ? SAMPLE_OUTPUT_EN : SAMPLE_OUTPUT_ZH} caption="" />
          </div>
        </div>
      </div>
    </section>
  );
}
