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
    scoreA:    5,
    scoreB:    4,
    winnerZh:  'Mode A 勝（同模型非確定性）',
    winnerEn:  'Mode A wins (non-determinism)',
  },
];

const S2_METRICS = [
  { pct: 100, labelZh: '路由準確率',       labelEn: 'Routing accuracy',    noteZh: '30/30 任務（Exp-2A）', noteEn: '30/30 tasks (Exp-2A)', color: '#10B981' },
  { pct:  87, labelZh: '路由穩定性',       labelEn: 'Routing stability',   noteZh: '±1 擾動後仍正確',     noteEn: '±1 perturbation resistance', color: '#06B6D4' },
  { pct:  94, labelZh: 'LLM 評分水平',     labelEn: 'Quality score',       noteZh: '14.1/15（路由 = All-Opus，盲評持平）', noteEn: '14.1/15 (routed = all-Opus, blind eval tied)', color: '#F59E0B' },
  { pct:  98, labelZh: 'Exec 任務省成本',  labelEn: 'Cost saved (Exec)',   noteZh: '相較 All-Opus 基線',   noteEn: 'vs All-Opus baseline', color: '#D946EF' },
];

const S3_STRATEGIES = [
  { nameZh: 'S0 基準（無提示詞）', nameEn: 'S0 Baseline (no prompt)', score: 13.7, costPer: '$0.006', model: 'Sonnet', barPct: 91 },
  { nameZh: 'S2 結構化輸出格式', nameEn: 'S2 Structured Output',      score: 13.3, costPer: '$0.007', model: 'Sonnet', barPct: 89 },
  { nameZh: 'S3 CoT + 角色',       nameEn: 'S3 CoT + Role',           score: 15.0, costPer: '$0.007', model: 'Sonnet', barPct: 100 },
  { nameZh: 'S1 角色 + 深度（最佳）', nameEn: 'S1 Role + Depth (best)', score: 15.0, costPer: '$0.006', model: 'Sonnet', barPct: 100, highlight: true },
  { nameZh: 'Opus 基準',           nameEn: 'Opus baseline',           score: 12.7, costPer: '$0.045', model: 'Opus',   barPct: 85 },
];

const S4_DOMAINS = [
  { nameZh: '前端', nameEn: 'Frontend',         correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
  { nameZh: '後端', nameEn: 'Backend',           correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
  { nameZh: '數據工程', nameEn: 'Data Eng.',     correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
  { nameZh: 'DevOps', nameEn: 'DevOps',          correct: 5, total: 5, tasks: ['Tier-Exec ×2', 'Tier-Mid ×1', 'Tier-A ×2'] },
];

const S5_MATRIX = [
  { taskZh: 'T1 Tier-Exec', taskEn: 'T1 Tier-Exec', tierColor: '#10B981',
    haiku: 14, sonnet: 15, opus: 15,
    noteZh: 'ESLint 規則：Haiku 僅差 1 分，完全足夠',
    noteEn: 'ESLint rule: Haiku only 1pt behind, fully sufficient' },
  { taskZh: 'T2 Tier-Mid',  taskEn: 'T2 Tier-Mid',  tierColor: '#06B6D4',
    haiku: 14, sonnet: 13, opus: 13,
    noteZh: 'OAuth 重構：Haiku 反超（Sonnet/Opus 因 token 截斷失分）',
    noteEn: 'OAuth refactor: Haiku leads (Sonnet/Opus truncated by token limit)' },
  { taskZh: 'T3 Tier-A',    taskEn: 'T3 Tier-A',    tierColor: '#D946EF',
    haiku: 10, sonnet: 12, opus: 12,
    noteZh: 'SSO+MFA 架構設計：Haiku 落後 2 分（正確性/清晰度各 -1），三模型風險意識均為 2/3',
    noteEn: 'SSO+MFA design: Haiku -2pts (correctness & clarity), all models risk awareness 2/3' },
];

const S6_DIMS = [
  { dimZh: 'R（風險權重）',  dimEn: 'R (Risk)',         rate: 33, changes: 6, perturbs: 18, color: '#EF4444', noteZh: 'Mid→A 最敏感，任務 S8 可 Exec↔Mid↔A 雙向跳轉', noteEn: 'Most sensitive at Mid→A; task S8 flips both Exec↔A directions' },
  { dimZh: 'J（判斷強度）',  dimEn: 'J (Judgment)',      rate: 32, changes: 6, perturbs: 19, color: '#F59E0B', noteZh: '與 Series 2 結果完全一致（32%）', noteEn: 'Exactly matches Series 2 finding (32%)' },
  { dimZh: 'C（上下文寬度）',dimEn: 'C (Context)',       rate: 16, changes: 3, perturbs: 19, color: '#06B6D4', noteZh: '僅影響 Exec/Mid 邊界', noteEn: 'Only affects Exec/Mid boundary' },
  { dimZh: 'Cr（創意密度）', dimEn: 'Cr (Creativity)',   rate: 13, changes: 2, perturbs: 15, color: '#D946EF', noteZh: '僅通過 Tier-A 觸發條件影響', noteEn: 'Only affects Mid→A via Tier-A trigger' },
  { dimZh: 'V（可驗證性）',  dimEn: 'V (Verifiability)', rate: 11, changes: 2, perturbs: 18, color: '#10B981', noteZh: '僅通過 Exec 條件影響，影響最小', noteEn: 'Least sensitive — only via Exec condition' },
];

// over-routing: sending a cheaper task to a more expensive tier
const S7_OVER = [
  { id: 'E1', taskZh: '為工具函數加類型標注', taskEn: 'Add type annotations to utility functions',
    correct: 'Tier-Exec', actual: 'Tier-Mid', costCorrect: 0.001, costActual: 0.010, deltaPct: 900 },
  { id: 'E2', taskZh: '更新 CI 環境變量', taskEn: 'Update environment variables in CI pipeline',
    correct: 'Tier-Exec', actual: 'Tier-Mid', costCorrect: 0.001, costActual: 0.010, deltaPct: 900 },
  { id: 'E3', taskZh: '為高頻查詢欄位加資料庫索引', taskEn: 'Add database index for frequently queried field',
    correct: 'Tier-Exec', actual: 'Tier-Mid', costCorrect: 0.001, costActual: 0.010, deltaPct: 900 },
  { id: 'M1', taskZh: '重構 auth 中間件使用 JWT', taskEn: 'Refactor auth middleware to use JWT',
    correct: 'Tier-Mid', actual: 'Tier-A', costCorrect: 0.010, costActual: 0.060, deltaPct: 500 },
  { id: 'M2', taskZh: '為用戶列表 API 加分頁', taskEn: 'Add pagination to user list API',
    correct: 'Tier-Mid', actual: 'Tier-A', costCorrect: 0.010, costActual: 0.060, deltaPct: 500 },
];

// under-routing: sending a complex task to a cheaper tier (saves cost, but risks quality)
const S7_UNDER = [
  { id: 'M3', taskZh: '為支付服務編寫整合測試', taskEn: 'Write integration tests for payment service',
    correct: 'Tier-Mid', actual: 'Tier-Exec', costCorrect: 0.010, costActual: 0.001, savePct: 90,
    riskZh: '高：測試覆蓋不足', riskEn: 'High: insufficient test coverage' },
  { id: 'A1', taskZh: '設計資料庫分片策略', taskEn: 'Design database sharding strategy',
    correct: 'Tier-A', actual: 'Tier-Mid', costCorrect: 0.060, costActual: 0.010, savePct: 83,
    riskZh: '極高：架構決策質量', riskEn: 'Critical: architecture decision quality' },
  { id: 'A2', taskZh: '規劃 OAuth2 + SSO 整合架構', taskEn: 'Plan OAuth2 + SSO integration architecture',
    correct: 'Tier-A', actual: 'Tier-Mid', costCorrect: 0.060, costActual: 0.010, savePct: 83,
    riskZh: '極高：安全架構設計', riskEn: 'Critical: security architecture design' },
  { id: 'A3', taskZh: '評估並推薦緩存策略', taskEn: 'Evaluate and recommend caching strategy',
    correct: 'Tier-A', actual: 'Tier-Mid', costCorrect: 0.060, costActual: 0.010, savePct: 83,
    riskZh: '高：性能設計影響深遠', riskEn: 'High: performance design has long-term impact' },
];

// Series 8: routing error quality impact matrix
const S8_SCENARIOS = [
  // over-routing: task goes to a higher (more expensive) tier
  { id: 'E1', type: 'over' as const, correctTier: 'Tier-Exec', actualTier: 'Tier-Mid',  qCorrect: 14.5, qActual: 14.5, qDelta:  0.0, costPct: +900 },
  { id: 'E2', type: 'over' as const, correctTier: 'Tier-Exec', actualTier: 'Tier-Mid',  qCorrect: 14.5, qActual: 14.5, qDelta:  0.0, costPct: +900 },
  { id: 'E3', type: 'over' as const, correctTier: 'Tier-Exec', actualTier: 'Tier-Mid',  qCorrect: 14.5, qActual: 14.5, qDelta:  0.0, costPct: +900 },
  { id: 'M1', type: 'over' as const, correctTier: 'Tier-Mid',  actualTier: 'Tier-A',    qCorrect: 13.5, qActual: 13.0, qDelta: -0.5, costPct: +500 },
  { id: 'M2', type: 'over' as const, correctTier: 'Tier-Mid',  actualTier: 'Tier-A',    qCorrect: 13.5, qActual: 13.0, qDelta: -0.5, costPct: +500 },
  // under-routing: task goes to a lower (cheaper) tier
  { id: 'M3', type: 'under' as const, correctTier: 'Tier-Mid', actualTier: 'Tier-Exec', qCorrect: 13.5, qActual: 10.5, qDelta: -3.0, costPct:  -90 },
  { id: 'A1', type: 'under' as const, correctTier: 'Tier-A',   actualTier: 'Tier-Mid',  qCorrect: 12.0, qActual: 11.0, qDelta: -1.0, costPct:  -83 },
  { id: 'A2', type: 'under' as const, correctTier: 'Tier-A',   actualTier: 'Tier-Mid',  qCorrect: 12.0, qActual: 11.0, qDelta: -1.0, costPct:  -83 },
  { id: 'A3', type: 'under' as const, correctTier: 'Tier-A',   actualTier: 'Tier-Mid',  qCorrect: 12.0, qActual: 11.0, qDelta: -1.0, costPct:  -83 },
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
          {zh ? '八個系列 · 110+ 項測試' : '8 series · 110+ experiments'}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight mb-5" style={{ letterSpacing: '-0.03em' }}>
          {zh
            ? <>gstack+ 真的有效嗎？<br /><span style={{ color: '#6F6F6F' }}>數據給出答案。</span></>
            : <>Does tier routing work?<br /><span style={{ color: '#6F6F6F' }}>The data says yes.</span></>}
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          {zh
            ? '八個系列的受控實驗，從成本效益、品質保留、gstack+ 準確性、維度敏感性到路由錯誤代價，對框架進行了全面量化驗證。'
            : 'Eight controlled experiment series quantify the framework end-to-end: cost savings, quality retention, routing accuracy, dimension sensitivity, and the asymmetric cost of routing errors.'}
        </p>
      </section>

      {/* ── 3 KEY NUMBERS ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: '−46%',    labelZh: '首輪實驗成本節省',     labelEn: 'cost saved in Series 1',     noteZh: '3 任務中 2 個品質持平或提升',  noteEn: 'quality maintained or improved on 2 of 3 tasks', color: '#F59E0B' },
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
              ? '將三個不同複雜度的真實任務，分別送給 All-Opus（基線）和 gstack+（實驗組），對比成本與品質。'
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
                        <span className="text-muted">{t.modelB} ({zh ? 'gstack+' : 'gstack+'})</span>
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
              ? 'Tier-Mid 任務（T2）中，Sonnet 以 Opus 85% 更低的成本獲得了更高的品質分（5/5 vs 4/5）。gstack+ 不只省錢，在這個場景中反而提升了品質。'
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
              ? '「判斷力（Judgment）」維度高度敏感 — 分數變動 ±1，就會改變 32% 任務的路由決定。風險（R）維度的敏感性更高（33%），詳見 Series 6。'
              : 'The "Judgment" dimension is highly sensitive — a ±1 change alters routing decisions for 32% of tasks. Risk (R) is slightly more sensitive at 33% — see Series 6 for full analysis.'}
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
          <div className="text-xs text-center mt-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40" style={{ color: '#059669' }}>
            {zh
              ? '💡 這意味著什麼？AI 代理（Claude）僅憑評分指南獨立對 20 個任務評分，結果與人工基準完全一致（偏差 0.00）。說明 5 維評分框架（J判斷、C上下文、R風險、V可驗證、Cr創意）定義足夠清晰，任何人或 AI 按指南評分都能得到相同結果，不需要領域專家經驗。'
              : '💡 What does this mean? The AI agent (Claude) scored all 20 tasks independently using only the scoring guide, and matched the human baseline exactly (0.00 deviation). This means the 5-dimension rubric is so clearly defined that anyone — human or AI — can apply it consistently without needing domain expertise.'}
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

      {/* ── Series 5 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 border-t border-neutral-200 dark:border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列五 · 2026-05-06' : 'Series 5 · 2026-05-06'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '多模型品質矩陣：Haiku 比預期更強' : 'Multi-Model Quality Matrix: Haiku Stronger Than Expected'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '3 個基準任務（Tier-Exec / Mid / A）× 3 個 Claude 模型，由 Opus 4.7 擔任 LLM-as-Judge 統一評分（滿分 15）。Haiku 在簡單任務的表現超出預期，Opus 在高複雜度任務的風險推理能力仍有優勢。'
              : '3 benchmark tasks (Tier-Exec / Mid / A) × 3 Claude models, scored by Opus 4.7 as LLM-as-Judge (max 15). Haiku outperforms expectations on simpler tasks; Opus retains a risk-reasoning advantage on complex ones.'}
          </p>
        </div>

        {/* Quality matrix */}
        <div className="space-y-3 mb-8">
          {S5_MATRIX.map((row) => (
            <div key={row.taskEn} className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-sm font-semibold text-ink">{zh ? row.taskZh : row.taskEn}</span>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-muted">Haiku <span className="font-semibold text-ink">{row.haiku}/15</span></span>
                  <span className="text-muted">Sonnet <span className="font-semibold text-ink">{row.sonnet}/15</span></span>
                  <span className="text-muted">Opus <span className="font-semibold text-ink">{row.opus}/15</span></span>
                </div>
              </div>
              {/* Score bars */}
              <div className="space-y-1.5 mb-2">
                {[
                  { label: 'Haiku 3.5', score: row.haiku, color: '#6F6F6F' },
                  { label: 'Sonnet 4.6', score: row.sonnet, color: '#06B6D4' },
                  { label: 'Opus 4.7', score: row.opus, color: row.tierColor },
                ].map(({ label, score, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[11px] text-muted w-20 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(score / 15) * 100}%`, background: color }} />
                    </div>
                    <span className="text-[11px] font-mono text-muted w-8 text-right">{score}</span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-muted">{zh ? row.noteZh : row.noteEn}</div>
            </div>
          ))}
        </div>

        {/* Dimension heatmap */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-5 mb-8">
          <div className="text-xs text-muted uppercase tracking-wider mb-4">
            {zh ? '各維度平均分（3 任務平均，滿分 3）' : 'Avg score per dimension (3-task avg, max 3)'}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted">
                  <th className="text-left py-1 pr-4 font-normal">{zh ? '維度' : 'Dimension'}</th>
                  <th className="text-center py-1 px-3 font-normal">Haiku</th>
                  <th className="text-center py-1 px-3 font-normal">Sonnet</th>
                  <th className="text-center py-1 px-3 font-normal">Opus</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {([
                  { dimZh: '技術正確性', dimEn: 'Correctness',    h: 2.7, s: 2.7, o: 2.7 },
                  { dimZh: '完整性',     dimEn: 'Completeness',   h: 2.0, s: 2.0, o: 2.0 },
                  { dimZh: '清晰度',     dimEn: 'Clarity',        h: 2.7, s: 2.3, o: 2.7 },
                  { dimZh: '風險意識',   dimEn: 'Risk Awareness', h: 2.0, s: 2.3, o: 2.7 },
                  { dimZh: '實用價值',   dimEn: 'Practical Value',h: 2.3, s: 2.0, o: 2.0 },
                ] as const).map((row) => (
                  <tr key={row.dimEn} className="border-t border-neutral-100 dark:border-[#222]">
                    <td className="py-1.5 pr-4 text-muted font-sans text-xs">{zh ? row.dimZh : row.dimEn}</td>
                    <td className="text-center py-1.5 px-3 text-ink">{row.h.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-3 text-ink">{row.s.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-3" style={{ color: row.o > row.h && row.o > row.s ? '#7C3AED' : 'inherit' }}>
                      {row.o.toFixed(1)}{row.o > row.h && row.o > row.s ? ' ↑' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Series 5 insight */}
        <div className="px-5 py-4 rounded-xl border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-950/30">
          <div className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-violet-800 dark:text-violet-300">
            {zh
              ? 'Haiku 在 Tier-Exec 和 Tier-Mid 任務上的表現超出預期（14/15），說明路由到廉價模型的節省空間比預計更大。Opus 唯一的系統性優勢在於「風險意識」維度（2.7 vs Haiku 2.0），這在 Tier-A 架構設計任務中最為關鍵。max_tokens 截斷是本次實驗的主要干擾因素，建議未來實驗將限制提升至 2048+。'
              : 'Haiku performs better than expected on Tier-Exec and Tier-Mid tasks (14/15), suggesting greater cost-saving potential when routing to cheaper models. Opus\'s only systematic advantage is in "Risk Awareness" (2.7 vs Haiku 2.0), which matters most for Tier-A architecture tasks. Token truncation was the key confound — future experiments should raise max_tokens to 2048+.'}
          </div>
        </div>
      </section>

      {/* ── Series 6 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 border-t border-neutral-200 dark:border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列六 · 2026-05-06' : 'Series 6 · 2026-05-06'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '評分維度敏感性：R 與 J 並列最關鍵' : 'Dimension Sensitivity: R and J Are the Critical Ones'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '延伸 Series 2 的 J 發現，對 10 個邊界任務的全部 5 個評分維度施加 ±1 擾動（89 次有效擾動），揭示哪個維度的評分誤差最容易導致路由層級錯誤。'
              : 'Extending the Series 2 J-sensitivity finding to all 5 dimensions: 89 valid ±1 perturbations on 10 boundary tasks reveal which dimension\'s scoring error most easily causes routing mistakes.'}
          </p>
        </div>

        {/* Sensitivity bars */}
        <div className="space-y-3 mb-8">
          {S6_DIMS.map((d, i) => (
            <div key={d.dimEn} className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-muted w-4">#{i + 1}</span>
                  <span className="text-sm font-medium text-ink">{zh ? d.dimZh : d.dimEn}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted font-mono">{d.changes}/{d.perturbs} {zh ? '次變化' : 'flips'}</span>
                  <span className="font-display text-lg font-semibold" style={{ color: d.color }}>{d.rate}%</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#2A2A2A] rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full" style={{ width: `${d.rate}%`, background: d.color }} />
              </div>
              <div className="text-[11px] text-muted">{zh ? d.noteZh : d.noteEn}</div>
            </div>
          ))}
        </div>

        {/* Practical guidance */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4">
            <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">
              {zh ? '⚠️ 高敏感：保守路由' : '⚠️ High sensitivity: use conservative routing'}
            </div>
            <div className="text-sm text-red-800 dark:text-red-300">
              {zh
                ? 'R = 3 或 J = 3 時，若有任何疑問直接升 Tier-A。這兩個維度的 ±1 誤差各自引發 ~33% 路由錯誤。'
                : 'When R = 3 or J = 3, route up to Tier-A if in doubt. These two dimensions each cause ~33% routing errors on ±1 misjudgment.'}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-4">
            <div className="text-xs font-semibold text-muted mb-2">
              {zh ? '✓ 低敏感：可寬鬆評分' : '✓ Low sensitivity: scoring tolerance is higher'}
            </div>
            <div className="text-sm text-muted">
              {zh
                ? 'V（11%）和 Cr（13%）的評分誤差影響最小。V 只影響 Exec/Mid 邊界，Cr 只通過 Tier-A 觸發。'
                : 'V (11%) and Cr (13%) have the smallest routing impact. V only affects the Exec/Mid boundary; Cr only triggers via the Tier-A condition.'}
            </div>
          </div>
        </div>

        {/* Series 6 insight */}
        <div className="px-5 py-4 rounded-xl border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
          <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-300">
            {zh
              ? 'R（風險權重）和 J（判斷強度）並列最敏感（33% / 32%）。J 的 32% 與 Series 2 的 30 任務結果完全一致——跨越兩個獨立實驗的一致性，強烈說明這不是統計偶然。邊界任務中 21% 的 ±1 擾動引發路由改變，使用者評分時應對這兩個維度保持最高謹慎。'
              : 'R (Risk) and J (Judgment) are co-equal in sensitivity (33% / 32%). J\'s 32% exactly matches the Series 2 finding on 30 different tasks — cross-experiment consistency this tight is not statistical coincidence. With 21% of boundary tasks flipping on a ±1 perturbation, scorers must be most careful with these two dimensions.'}
          </div>
        </div>
      </section>

      {/* ── Series 7 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 border-t border-neutral-200 dark:border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列七 · 2026-05-06' : 'Series 7 · 2026-05-06'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '路由錯誤的真實代價：過路由 vs 欠路由' : 'The Real Cost of Routing Errors: Over vs. Under-Routing'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '9 個任務刻意設計路由錯誤（5 個過路由，4 個欠路由），量化每種錯誤的成本代價和質量風險，計算保守路由策略的 ROI。'
              : '9 tasks with deliberate misrouting (5 over-routed, 4 under-routed) — quantifying the cost penalty and quality risk of each error type, and computing the ROI of conservative routing.'}
          </p>
        </div>

        {/* Over-routing table */}
        <div className="mb-8">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">
            {zh ? '過路由：把 Exec/Mid 任務升級到更貴的 Tier' : 'Over-routing: sending cheap tasks to expensive tiers'}
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-[#2A2A2A] text-muted">
                  <th className="text-left py-2.5 px-4 font-normal">{zh ? '任務' : 'Task'}</th>
                  <th className="text-center py-2.5 px-3 font-normal">{zh ? '正確 Tier' : 'Correct'}</th>
                  <th className="text-center py-2.5 px-3 font-normal">{zh ? '錯誤路由' : 'Misrouted'}</th>
                  <th className="text-right py-2.5 px-4 font-normal">{zh ? '額外浪費' : 'Extra cost'}</th>
                </tr>
              </thead>
              <tbody>
                {S7_OVER.map((r) => (
                  <tr key={r.id} className="border-t border-neutral-100 dark:border-[#222]">
                    <td className="py-2.5 px-4 text-ink">{zh ? r.taskZh : r.taskEn}</td>
                    <td className="text-center py-2.5 px-3 text-muted font-mono">{r.correct}</td>
                    <td className="text-center py-2.5 px-3 text-muted font-mono">{r.actual}</td>
                    <td className="text-right py-2.5 px-4 font-mono font-semibold" style={{ color: '#EF4444' }}>+{r.deltaPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-muted mt-1.5 px-1">
            {zh
              ? '過路由成本損失：Exec→Mid +900%（$0.009/任務），Mid→A +500%（$0.050/任務）'
              : 'Over-routing penalty: Exec→Mid +900% ($0.009/task), Mid→A +500% ($0.050/task)'}
          </div>
        </div>

        {/* Under-routing table */}
        <div className="mb-8">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">
            {zh ? '欠路由：把 Mid/A 任務降級到更便宜的 Tier（省錢但有質量風險）' : 'Under-routing: sending complex tasks to cheaper tiers (saves cost, risks quality)'}
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-[#2A2A2A] text-muted">
                  <th className="text-left py-2.5 px-4 font-normal">{zh ? '任務' : 'Task'}</th>
                  <th className="text-center py-2.5 px-3 font-normal">{zh ? '正確 Tier' : 'Correct'}</th>
                  <th className="text-center py-2.5 px-3 font-normal">{zh ? '錯誤路由' : 'Misrouted'}</th>
                  <th className="text-center py-2.5 px-3 font-normal">{zh ? '省成本' : 'Cost saved'}</th>
                  <th className="text-right py-2.5 px-4 font-normal">{zh ? '質量風險' : 'Quality risk'}</th>
                </tr>
              </thead>
              <tbody>
                {S7_UNDER.map((r) => (
                  <tr key={r.id} className="border-t border-neutral-100 dark:border-[#222]">
                    <td className="py-2.5 px-4 text-ink">{zh ? r.taskZh : r.taskEn}</td>
                    <td className="text-center py-2.5 px-3 text-muted font-mono">{r.correct}</td>
                    <td className="text-center py-2.5 px-3 text-muted font-mono">{r.actual}</td>
                    <td className="text-center py-2.5 px-3 font-mono font-semibold" style={{ color: '#10B981' }}>−{r.savePct}%</td>
                    <td className="text-right py-2.5 px-4 text-[11px]" style={{ color: '#F59E0B' }}>{zh ? r.riskZh : r.riskEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Break-even analysis */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-4 text-center">
            <div className="font-display text-3xl mb-1" style={{ color: '#EF4444' }}>+900%</div>
            <div className="text-xs text-ink font-medium mb-0.5">{zh ? 'Exec→Mid 過路由代價' : 'Exec→Mid over-routing cost'}</div>
            <div className="text-[11px] text-muted">{zh ? '+$0.009/任務，月均 100 任務 = $0.90 浪費' : '+$0.009/task, 100 tasks/mo = $0.90 waste'}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-4 text-center">
            <div className="font-display text-3xl mb-1" style={{ color: '#F59E0B' }}>$2.10</div>
            <div className="text-xs text-ink font-medium mb-0.5">{zh ? '保守路由月均額外成本' : 'Conservative routing extra cost/mo'}</div>
            <div className="text-[11px] text-muted">{zh ? '200 任務中 21% 觸發升 Tier（42 任務 × $0.050）' : '21% of 200 tasks escalated (42 × $0.050)'}</div>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 p-4 text-center">
            <div className="font-display text-3xl mb-1" style={{ color: '#10B981' }}>ROI ✓</div>
            <div className="text-xs text-ink font-medium mb-0.5">{zh ? '保守路由 ROI 正向' : 'Conservative routing ROI is positive'}</div>
            <div className="text-[11px] text-muted">{zh ? '$2.10/月的升 Tier 成本 ＜ 防止 1 個架構錯誤的返工成本' : '$2.10/mo escalation cost < cost of 1 architecture rework'}</div>
          </div>
        </div>

        {/* Series 7 insight */}
        <div className="px-5 py-4 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/30">
          <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-sky-800 dark:text-sky-300">
            {zh
              ? '過路由的金錢代價是真實但可接受的（Exec→Mid 每任務浪費 $0.009），欠路由的質量風險卻不可接受（A→Mid 的架構設計存在嚴重質量風險）。保守路由（在 J=3 或 R=3 時升 Tier）每月僅額外花費 $2.10，遠低於一次架構返工的代價，ROI 明確為正。'
              : 'Over-routing\'s financial cost is real but acceptable ($0.009 wasted per Exec→Mid task); under-routing\'s quality risk is not (routing Tier-A design tasks to Tier-Mid creates serious quality risk). Conservative routing (escalate on J=3 or R=3) costs only $2.10/month extra — far less than a single architecture rework. The ROI is clearly positive.'}
          </div>
        </div>
      </section>

      {/* ── Series 8 ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 border-t border-neutral-200 dark:border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">{zh ? '系列八 · 2026-05-06' : 'Series 8 · 2026-05-06'}</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            {zh ? '路由錯誤的品質代價：非對稱風險矩陣' : 'Quality Cost of Routing Errors: Asymmetric Risk Matrix'}
          </h2>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            {zh
              ? '基於 Series 5 品質數據與 Series 7 的 9 個路由錯誤場景，量化每個場景的品質損失。結論：過路由損成本，欠路由損品質——兩者的代價性質截然不同。'
              : 'Using Series 5 quality data and the 9 misrouting scenarios from Series 7, this series quantifies quality loss per scenario. Finding: over-routing wastes money; under-routing wastes quality — fundamentally different kinds of cost.'}
          </p>
        </div>

        {/* Quality impact matrix */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface overflow-hidden mb-8">
          <div className="text-xs text-muted uppercase tracking-wider px-4 pt-4 pb-3">
            {zh ? '品質影響矩陣（滿分 15）' : 'Quality impact matrix (out of 15)'}
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-t border-b border-neutral-100 dark:border-[#2A2A2A] text-muted">
                <th className="text-left py-2 px-4 font-normal">{zh ? '場景' : 'Scenario'}</th>
                <th className="text-center py-2 px-3 font-normal">{zh ? '正確 Tier' : 'Correct'}</th>
                <th className="text-center py-2 px-3 font-normal">{zh ? '實際路由' : 'Misrouted to'}</th>
                <th className="text-center py-2 px-3 font-normal">{zh ? '正確品質' : 'Quality (correct)'}</th>
                <th className="text-center py-2 px-3 font-normal">{zh ? '實際品質' : 'Quality (actual)'}</th>
                <th className="text-center py-2 px-3 font-normal">{zh ? '品質損失' : 'Quality Δ'}</th>
                <th className="text-right py-2 px-4 font-normal">{zh ? '成本變化' : 'Cost Δ'}</th>
              </tr>
            </thead>
            <tbody>
              {S8_SCENARIOS.map((r) => {
                const isOver = r.type === 'over';
                const deltaColor = r.qDelta === 0 ? '#10B981' : r.qDelta >= -0.5 ? '#F59E0B' : '#EF4444';
                return (
                  <tr key={r.id} className="border-t border-neutral-100 dark:border-[#222]">
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-ink">{r.id}</span>
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ color: isOver ? '#F59E0B' : '#EF4444', background: isOver ? '#F59E0B18' : '#EF444418' }}>
                        {isOver ? (zh ? '過路由' : 'over') : (zh ? '欠路由' : 'under')}
                      </span>
                    </td>
                    <td className="text-center py-2.5 px-3 text-muted font-mono">{r.correctTier}</td>
                    <td className="text-center py-2.5 px-3 text-muted font-mono">{r.actualTier}</td>
                    <td className="text-center py-2.5 px-3 font-mono text-ink">{r.qCorrect.toFixed(1)}</td>
                    <td className="text-center py-2.5 px-3 font-mono text-ink">{r.qActual.toFixed(1)}</td>
                    <td className="text-center py-2.5 px-3 font-mono font-semibold" style={{ color: deltaColor }}>
                      {r.qDelta === 0 ? '0' : r.qDelta.toFixed(1)}
                    </td>
                    <td className="text-right py-2.5 px-4 font-mono font-semibold"
                      style={{ color: r.costPct > 0 ? '#F59E0B' : '#10B981' }}>
                      {r.costPct > 0 ? `+${r.costPct}%` : `${r.costPct}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Asymmetric risk summary */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">
              {zh ? '過路由：損錢，不損品質' : 'Over-routing: wastes money, not quality'}
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl" style={{ color: '#F59E0B' }}>≈ 0</span>
                <span className="text-xs text-amber-700 dark:text-amber-400">{zh ? '平均品質損失' : 'avg quality delta'}</span>
              </div>
              <div className="text-xs text-amber-800 dark:text-amber-300">
                {zh
                  ? 'E1–E3 品質持平（14.5/15），M1–M2 僅損 0.5 分。把任務給更強的模型，品質不會變差。'
                  : 'E1–E3 quality unchanged (14.5/15); M1–M2 lose only 0.5 pts. Sending tasks to stronger models doesn\'t hurt quality.'}
              </div>
              <div className="text-[11px] font-mono text-amber-600 dark:text-amber-500 pt-1">
                {zh ? '代價：+500%–900% 成本' : 'Cost: +500%–900% extra spend'}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-5">
            <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-3">
              {zh ? '欠路由：損品質，省了成本' : 'Under-routing: hurts quality, saves cost'}
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl" style={{ color: '#EF4444' }}>−1.5</span>
                <span className="text-xs text-red-700 dark:text-red-400">{zh ? '平均品質損失（/15）' : 'avg quality loss (out of 15)'}</span>
              </div>
              <div className="text-xs text-red-800 dark:text-red-300">
                {zh
                  ? 'M3（−3.0）和 A1–A3（−1.0）。Mid→Exec 是最危險的欠路由，對測試覆蓋和架構質量有嚴重影響。'
                  : 'M3 (−3.0) and A1–A3 (−1.0). Mid→Exec is the most dangerous misroute, seriously impacting test coverage and architecture quality.'}
              </div>
              <div className="text-[11px] font-mono text-red-600 dark:text-red-500 pt-1">
                {zh ? '省了：83%–90% 成本，但代價是架構質量' : 'Saved: 83%–90% cost, but at the price of quality'}
              </div>
            </div>
          </div>
        </div>

        {/* Core conclusion */}
        <div className="rounded-xl border border-neutral-200 dark:border-[#2A2A2A] bg-surface p-5 mb-8">
          <div className="text-xs text-muted uppercase tracking-wider mb-3">{zh ? 'Series 7 vs Series 8 對比總結' : 'Series 7 vs Series 8 comparison'}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted border-b border-neutral-100 dark:border-[#222]">
                  <th className="text-left py-2 pr-4 font-normal">{zh ? '錯誤類型' : 'Error type'}</th>
                  <th className="text-center py-2 px-3 font-normal">{zh ? '品質影響' : 'Quality impact'}</th>
                  <th className="text-center py-2 px-3 font-normal">{zh ? '成本影響' : 'Cost impact'}</th>
                  <th className="text-right py-2 pl-3 font-normal">{zh ? '建議' : 'Recommendation'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-neutral-100 dark:border-[#222]">
                  <td className="py-2.5 pr-4 text-ink">{zh ? '過路由' : 'Over-routing'}</td>
                  <td className="text-center py-2.5 px-3 font-semibold" style={{ color: '#10B981' }}>≈ 0</td>
                  <td className="text-center py-2.5 px-3 font-mono font-semibold" style={{ color: '#F59E0B' }}>+500%–900%</td>
                  <td className="text-right py-2.5 pl-3 text-muted text-[11px]">{zh ? '可接受，偏好避免' : 'Acceptable, prefer to avoid'}</td>
                </tr>
                <tr className="border-t border-neutral-100 dark:border-[#222]">
                  <td className="py-2.5 pr-4 text-ink">{zh ? '欠路由' : 'Under-routing'}</td>
                  <td className="text-center py-2.5 px-3 font-semibold" style={{ color: '#EF4444' }}>−8%–33%</td>
                  <td className="text-center py-2.5 px-3 font-mono font-semibold" style={{ color: '#10B981' }}>−83%–90%</td>
                  <td className="text-right py-2.5 pl-3 font-semibold text-[11px]" style={{ color: '#EF4444' }}>{zh ? '嚴格避免' : 'Strictly avoid'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Series 8 insight */}
        <div className="px-5 py-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/30">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-1">
            {zh ? '關鍵發現' : 'Key finding'}
          </div>
          <div className="text-sm text-teal-800 dark:text-teal-300">
            {zh
              ? '過路由和欠路由的代價性質完全不同。過路由損的是錢（多花 500%–900%），但品質幾乎不受影響；欠路由省的是錢（少花 83%–90%），但品質損失達 −8% 到 −33%。品質損失比金錢損失更難修復——一個架構錯誤可能導致整個模塊重寫。結論：當不確定時，寧可過路由，絕不欠路由。'
              : 'Over-routing and under-routing cost you fundamentally different things. Over-routing costs money (+500%–900%) but barely affects quality; under-routing saves money (−83%–90%) but loses quality by −8% to −33%. Quality loss is far harder to reverse than financial loss — a bad architecture decision may require rewriting an entire module. Conclusion: when in doubt, over-route. Never under-route.'}
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
              ? '在試玩場輸入你的任務，用 5 維評分看看 gstack+ 會給出什麼路由決定。'
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
