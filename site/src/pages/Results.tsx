import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import { useLang } from '@/i18n/useLang';

// ── 資料層 ──────────────────────────────────────────────────────────────────

const S1_TASKS = [
  {
    idZh:      'T1 · 跨 repo 重新命名函式',
    idEn:      'T1 · Rename function across repo',
    tier:      'Tier-Exec',
    tierColor: '#10B981',
    modelA:    'Claude Opus',
    modelB:    'Qwen3-Coder',
    costA:     '$0.01173',
    costB:     '$0.00014',
    costSave:  99,
    scoreA:    5,
    scoreB:    3,
    winnerZh:  'Opus 勝',
    winnerEn:  'Opus wins',
  },
  {
    idZh:      'T2 · 重構數據層至 React Query v5',
    idEn:      'T2 · Refactor to React Query v5',
    tier:      'Tier-Mid',
    tierColor: '#06B6D4',
    modelA:    'Claude Opus',
    modelB:    'Claude Sonnet',
    costA:     '$0.07849',
    costB:     '$0.01191',
    costSave:  85,
    scoreA:    4,
    scoreB:    5,
    winnerZh:  '✦ Sonnet 勝',
    winnerEn:  '✦ Sonnet wins',
  },
  {
    idZh:      'T3 · 設計 SSO + MFA 認證架構',
    idEn:      'T3 · Design SSO + MFA auth architecture',
    tier:      'Tier-A',
    tierColor: '#D946EF',
    modelA:    'Claude Opus',
    modelB:    'Claude Opus',
    costA:     '$0.07885',
    costB:     '$0.07885',
    costSave:  0,
    scoreA:    4,
    scoreB:    4,
    winnerZh:  '平手',
    winnerEn:  'Tie',
  },
];

const S2_METRICS = [
  { pct: 100, labelZh: '路由準確率',       labelEn: 'Routing accuracy',    noteZh: '30/30 任務（Exp-2A）', noteEn: '30/30 tasks (Exp-2A)', color: '#10B981' },
  { pct:  87, labelZh: '路由穩定性',       labelEn: 'Routing stability',   noteZh: '±1 擾動後仍正確',     noteEn: '±1 perturbation resistance', color: '#06B6D4' },
  { pct:  94, labelZh: '品質保留率',       labelEn: 'Quality retention',   noteZh: '14.1/15（盲測 LLM 評分）', noteEn: '14.1/15 (blind LLM-as-Judge)', color: '#F59E0B' },
  { pct:  98, labelZh: 'Exec 任務省成本',  labelEn: 'Cost saved (Exec)',   noteZh: '相較 All-Opus 基線',   noteEn: 'vs All-Opus baseline', color: '#D946EF' },
];

const S3_STRATEGIES = [
  { nameZh: 'S0 基準（無提示詞）', nameEn: 'S0 Baseline (no prompt)', score: 13.7, costPer: '$0.006', model: 'Sonnet', barPct: 91 },
  { nameZh: 'S2 Chain-of-Thought', nameEn: 'S2 Chain-of-Thought',     score: 14.3, costPer: '$0.007', model: 'Sonnet', barPct: 95 },
  { nameZh: 'S3 CoT + 角色',       nameEn: 'S3 CoT + Role',           score: 15.0, costPer: '$0.008', model: 'Sonnet', barPct: 100 },
  { nameZh: 'S1 角色 + 深度（最佳）', nameEn: 'S1 Role + Depth (best)', score: 15.0, costPer: '$0.006', model: 'Sonnet', barPct: 100, highlight: true },
  { nameZh: 'Opus 基準',           nameEn: 'Opus baseline',           score: 12.7, costPer: '$0.045', model: 'Opus',   barPct: 85 },
];

const S4_DOMAINS = [
  { nameZh: '前端', nameEn: 'Frontend',         correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
  { nameZh: '後端', nameEn: 'Backend',           correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
  { nameZh: '數據工程', nameEn: 'Data Eng.',     correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
  { nameZh: 'DevOps', nameEn: 'DevOps',          correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
];

// ── 子元件 ──────────────────────────────────────────────────────────────────

function ScoreDots({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < score ? 'bg-ink' : 'bg-neutral-200 dark:bg-[#2A2A2A]'}`}
        />
      ))}
    </div>
  );
}

function CostBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#2A2A2A] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function TierPill({ tier, color }: { tier: string; color: string }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color, background: `${color}18` }}
    >
      {tier}
    </span>
  );
}

// ── 主元件 ──────────────────────────────────────────────────────────────────

export default function Results() {
  const [lang] = useLang();
  const zh = lang === 'zh';

  return (
    <div className="min-h-screen bg-background text-ink">
      <Nav />

      {/* ── PAGE HERO ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-neutral-200 dark:border-[#2A2A2A] text-[11px] uppercase tracking-wider text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {zh ? '三個系列 · 共 62 項測試' : '3 series · 62 experiments total'}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight mb-5" style={{ letterSpacing: '-0.03em' }}>
          {zh
            ? <>路由真的有效嗎？<br /><span style={{ color: '#6F6F6F' }}>數據給出答案。</span></>
            : <>Does tier routing work?<br /><span style={{ color: '#6F6F6F' }}>The data says yes.</span></>}
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          {zh
            ? '我們通過三個系列的受控實驗，驗證了 gstack-plus 的路由準確性、成本節省效果，以及 S1 提示詞策略的品質提升。'
            : 'Three controlled experiment series validated gstack-plus routing accuracy, cost savings, and the quality lift from the S1 prompt strategy.'}
        </p>
      </section>

      {/* ── 3 KEY NUMBERS ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: '−46%',    labelZh: '首輪實驗成本節省',     labelEn: 'cost saved in Series 1',     noteZh: '品質幾乎不受影響',       noteEn: 'quality nearly unaffected', color: '#F59E0B' },
            { num: '100%',    labelZh: '路由準確率',           labelEn: 'routing accuracy',            noteZh: '30/30 任務正確路由',     noteEn: '30/30 tasks correctly routed', color: '#10B981' },
            { num: '15.0/15', labelZh: 'Sonnet S1 品質分數',  labelEn: 'Sonnet S1 quality score',    noteZh: '超越 Opus（12.7/15）',   noteEn: 'beats Opus at 12.7/15', color: '#D946EF' },
          ].map(({ num, labelZh, labelEn, noteZh, noteEn, color }) => (
            <div key={num} className="rounded-2xl border border-neutral-200 dark:border-[#2A2A2A] p-6 sm:p-8 bg-surface">
              <div className="font-display text-4xl sm:text-5xl mb-2" style={{ color }}>{num}</div>
              <div className="font-medium text-ink text-sm mb-1">{zh ? labelZh : labelEn}</div>
              <div className="text-xs text-muted">{zh ? noteZh : noteEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERIES 1 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列一 · 2026-05-04' : 'Series 1 · 2026-05-04'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '成本 vs 品質：3 任務基準測試' : 'Cost vs Quality: 3-Task Benchmark'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '將三個不同複雜度的真實任務，分別送給 All-Opus（基線）和 gstack-plus 路由（實驗組），對比成本與品質。'
              : 'Three real tasks at different complexity levels, sent to All-Opus (baseline) vs gstack-plus routing (experimental), comparing cost and quality.'}
          </p>
        </div>

        <div className="space-y-4">
          {S1_TASKS.map((t) => (
            <div key={t.idZh} className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] p-5 sm:p-6 bg-surface">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="font-medium text-ink text-sm mb-1">{zh ? t.idZh : t.idEn}</div>
                  <TierPill tier={t.tier} color={t.tierColor} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted mb-0.5">{zh ? '品質：路由 vs Opus' : 'Quality: Routed vs Opus'}</div>
                  <div className="text-sm font-semibold" style={{ color: t.tierColor }}>
                    {zh ? t.winnerZh : t.winnerEn}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Cost comparison */}
                <div>
                  <div className="text-[11px] text-muted uppercase tracking-wider mb-3">{zh ? '成本對比' : 'Cost comparison'}</div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted">{t.modelA} (All-Opus)</span>
                        <span className="text-ink font-mono">{t.costA}</span>
                      </div>
                      <CostBar pct={100} color="#2A2A2A" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted">{t.modelB} ({zh ? '路由' : 'routed'})</span>
                        <span className="font-mono font-semibold" style={{ color: t.tierColor }}>{t.costB}</span>
                      </div>
                      <CostBar pct={t.costSave === 0 ? 100 : 100 - t.costSave} color={t.tierColor} />
                    </div>
                    {t.costSave > 0 && (
                      <div className="text-xs font-semibold" style={{ color: t.tierColor }}>
                        {zh ? `節省 ${t.costSave}%` : `−${t.costSave}% cost`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quality dots */}
                <div>
                  <div className="text-[11px] text-muted uppercase tracking-wider mb-3">{zh ? '品質評分（5 分制）' : 'Quality score (out of 5)'}</div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">{t.modelA}</span>
                      <div className="flex items-center gap-2">
                        <ScoreDots score={t.scoreA} />
                        <span className="text-xs font-mono text-ink">{t.scoreA}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">{t.modelB}</span>
                      <div className="flex items-center gap-2">
                        <ScoreDots score={t.scoreB} />
                        <span className="text-xs font-mono font-semibold" style={{ color: t.tierColor }}>{t.scoreB}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Series 1 insight */}
        <div className="mt-6 px-5 py-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-amber-800 dark:text-amber-300">
            {zh
              ? 'Tier-Mid 任務（T2）中，Sonnet 以 Opus 85% 更低的成本獲得了更高的品質分（5/5 vs 4/5）。路由不只省錢，在這個場景中反而提升了品質。'
              : 'On the Tier-Mid task (T2), Sonnet achieved higher quality (5/5 vs 4/5) at 85% lower cost than Opus. Routing didn\'t just save money — it improved quality in this case.'}
          </div>
        </div>
      </section>

      {/* ── SERIES 2 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 border-t border-neutral-200 dark:border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列二 · 2026-05-05' : 'Series 2 · 2026-05-05'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '路由穩定性驗證：9 實驗 · 30 任務' : 'Routing Validation: 9 Experiments · 30 Tasks'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '系統性地測試路由演算法的準確性、穩定性（面對評分擾動）與品質保留能力，並使用 LLM-as-Judge 盲測評分。'
              : 'Systematically tested routing accuracy, stability under score perturbation, and quality retention — with blind LLM-as-Judge scoring.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {S2_METRICS.map((m) => (
            <div key={m.labelEn} className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] p-5 bg-surface">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-muted uppercase tracking-wider mb-1">{zh ? m.labelZh : m.labelEn}</div>
                  <div className="font-display text-3xl" style={{ color: m.color }}>{m.pct}%</div>
                </div>
                <div className="text-right text-xs text-muted mt-1">{zh ? m.noteZh : m.noteEn}</div>
              </div>
              <CostBar pct={m.pct} color={m.color} />
            </div>
          ))}
        </div>

        {/* Series 2 insight */}
        <div className="mt-6 px-5 py-4 rounded-xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950/30">
          <div className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-cyan-800 dark:text-cyan-300">
            {zh
              ? '「判斷力（Judgment）」維度最為關鍵 — 分數變動 ±1，就會改變 32% 任務的路由決定。評分時應謹慎對待這個維度。'
              : 'The "Judgment" dimension is the most critical — a ±1 score change alters routing decisions for 32% of tasks. Take extra care when scoring this dimension.'}
          </div>
        </div>
      </section>

      {/* ── SERIES 3 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 border-t border-neutral-200 dark:border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列三 · 2026-05-05' : 'Series 3 · 2026-05-05'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? 'S1 提示詞策略：Sonnet 超越 Opus' : 'S1 Prompt Strategy: Sonnet Beats Opus'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '對比 4 種提示詞策略在 Tier-Mid 任務上的表現，並用 20 個真實的 git 歷史任務驗證路由準確性。'
              : 'Compared 4 prompt strategies on Tier-Mid tasks, then validated routing accuracy on 20 real tasks from actual git history.'}
          </p>
        </div>

        {/* Strategy comparison */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-muted mb-4">{zh ? '策略品質對比（滿分 15 分，3 任務 × 5 分）' : 'Strategy quality comparison (15 pts max, 3 tasks × 5 pts)'}</div>
          <div className="space-y-3">
            {S3_STRATEGIES.map((s) => (
              <div
                key={s.nameEn}
                className={`rounded-xl p-4 border transition-colors ${
                  s.highlight
                    ? 'border-fuchsia-300 dark:border-fuchsia-800 bg-fuchsia-50 dark:bg-fuchsia-950/30'
                    : 'border-neutral-200 dark:border-[#2A2A2A] bg-surface'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">{zh ? s.nameZh : s.nameEn}</span>
                    {s.highlight && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300 font-semibold">
                        {zh ? '★ 最佳策略' : '★ Best strategy'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted">{s.model}</span>
                    <span className="font-mono text-muted">{s.costPer}{zh ? '/任務' : '/task'}</span>
                    <span
                      className="font-display text-lg font-semibold"
                      style={{ color: s.highlight ? '#D946EF' : s.score === 12.7 ? '#F59E0B' : 'inherit' }}
                    >
                      {s.score}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.barPct}%`,
                      background: s.highlight ? '#D946EF' : s.score === 12.7 ? '#F59E0B' : '#6F6F6F',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost comparison */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] p-5 bg-surface">
            <div className="text-xs text-muted uppercase tracking-wider mb-4">{zh ? 'S1 Sonnet vs Opus 成本' : 'S1 Sonnet vs Opus cost'}</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted">Claude Opus</span>
                  <span className="font-mono text-ink">$0.045{zh ? '/任務' : '/task'}</span>
                </div>
                <CostBar pct={100} color="#F59E0B" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted">Sonnet + S1</span>
                  <span className="font-mono font-semibold text-fuchsia-600 dark:text-fuchsia-400">$0.006{zh ? '/任務' : '/task'}</span>
                </div>
                <CostBar pct={13} color="#D946EF" />
              </div>
              <div className="text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                {zh ? '節省 86%，且品質更高' : '−86% cost, higher quality'}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] p-5 bg-surface">
            <div className="text-xs text-muted uppercase tracking-wider mb-4">{zh ? '真實 git 任務路由驗證' : 'Real git history routing validation'}</div>
            <div className="text-center py-3">
              <div className="font-display text-5xl mb-2" style={{ color: '#10B981' }}>20/20</div>
              <div className="text-sm text-ink font-medium mb-1">
                {zh ? '路由準確率 100%' : '100% routing accuracy'}
              </div>
              <div className="text-xs text-muted">
                {zh
                  ? 'gstack-plus git 歷史中的真實任務，任務分佈：45% Exec · 35% Mid · 20% Tier-A'
                  : 'Real tasks from gstack-plus git history. Distribution: 45% Exec · 35% Mid · 20% Tier-A'}
              </div>
            </div>
          </div>
        </div>

        {/* Series 3 insight */}
        <div className="px-5 py-4 rounded-xl border border-fuchsia-200 dark:border-fuchsia-900 bg-fuchsia-50 dark:bg-fuchsia-950/30">
          <div className="text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-fuchsia-800 dark:text-fuchsia-300">
            {zh
              ? 'S1 提示詞（角色 + 深度思考指令）讓 Sonnet 達到 15.0/15，超越 Opus 的 12.7/15，成本卻只有 Opus 的 13.3%。這說明模型能力的上限，很大程度取決於提示詞質量，而非模型本身的大小。'
              : 'The S1 prompt (role identity + depth instruction) lets Sonnet reach 15.0/15, beating Opus at 12.7/15, at just 13.3% of Opus\'s cost. Model ceiling is largely determined by prompt quality, not model size alone.'}
          </div>
        </div>
      </section>

      {/* ── Series 4 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 border-t border-neutral-200 dark:border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列四 · 2026-05-06' : 'Series 4 · 2026-05-06'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '5 維度框架：跨領域 100% 適用' : '5-Dimension Framework: 100% Cross-Domain Accuracy'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '20 個任務跨前端 / 後端 / 數據工程 / DevOps，由 AI 代理使用評分指南獨立評分後路由，每個領域準確率均為 100%，5 個評分維度的平均偏差均為 0。'
              : '20 tasks across Frontend, Backend, Data Engineering, and DevOps — independently scored by an AI agent using the scoring guide. 100% routing accuracy in every domain, with zero average deviation across all 5 dimensions.'}
          </p>
        </div>

        {/* Domain accuracy grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {S4_DOMAINS.map((d) => (
            <div key={d.nameEn} className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 p-4 text-center">
              <div className="font-display text-3xl mb-1" style={{ color: '#10B981' }}>5/5</div>
              <div className="text-sm font-medium text-ink mb-2">{zh ? d.nameZh : d.nameEn}</div>
              <div className="space-y-0.5">
                {d.tasks.map((t) => (
                  <div key={t} className="text-[11px] text-muted">{t}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Score deviation */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-5 mb-8">
          <div className="text-xs text-muted uppercase tracking-wider mb-4">
            {zh ? 'AI 獨立評分 vs 基準評分：各維度平均偏差' : 'AI independent scoring vs baseline — avg deviation per dimension'}
          </div>
          <div className="grid grid-cols-5 gap-3 text-center">
            {(['J 判斷', 'C 上下文', 'R 風險', 'V 可驗證', 'Cr 創意'] as const).map((dim) => (
              <div key={dim}>
                <div className="font-mono text-lg font-semibold" style={{ color: '#10B981' }}>0.00</div>
                <div className="text-[11px] text-muted mt-0.5">{zh ? dim : dim.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-center text-muted mt-3">
            {zh ? '完全一致 — 評分框架的定義清晰且跨領域通用' : 'Perfect agreement — scoring rubric is clear and domain-agnostic'}
          </div>
        </div>

        {/* Series 4 insight */}
        <div className="px-5 py-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30">
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-emerald-800 dark:text-emerald-300">
            {zh
              ? 'gstack-plus 5 維度評分框架在前端、後端、數據工程、DevOps 四個技術領域 20/20 = 100% 路由準確。AI 代理獨立評分與人工基準完全一致（Δ = 0），證明框架定義足夠清晰，可在無需領域特殊訓練的情況下跨域通用。'
              : 'The gstack-plus 5-dimension scoring framework achieves 20/20 = 100% routing accuracy across Frontend, Backend, Data Engineering, and DevOps. AI agent scores matched the human baseline exactly (Δ = 0), proving the framework is clear enough to be applied cross-domain without domain-specific training.'}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 text-center">
        <div className="rounded-2xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-10 sm:p-14">
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '看完報告，親自試試。' : 'Read the data. Now try it yourself.'}
          </h2>
          <p className="text-muted text-sm mb-8 max-w-md mx-auto">
            {zh
              ? '在試玩場輸入你的任務，用 5 維評分看看系統會給出什麼路由決定。'
              : 'Enter your task in the Playground, score it on 5 dimensions, and see what tier the system routes it to.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/playground"
              className="rounded-full px-8 py-4 text-sm bg-ink text-white dark:text-black hover:scale-[1.03] transition-transform"
            >
              {zh ? '打開試玩場' : 'Open Playground'}
            </Link>
            <Link
              to="/doc/getting-started"
              className="rounded-full px-8 py-4 text-sm border border-neutral-300 dark:border-[#383838] text-ink hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors"
            >
              {zh ? '讀完整文檔' : 'Read the docs'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
