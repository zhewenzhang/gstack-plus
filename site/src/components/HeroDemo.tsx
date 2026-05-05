import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/i18n/strings';

// ── 資料 ──────────────────────────────────────────────────────────────────────

interface Task {
  id: number;
  cmdZh: string;
  cmdEn: string;
  scores: [number, number, number, number, number];
  tier: 'Tier-Exec' | 'Tier-Mid' | 'Tier-A';
  tierColor: string;
  costLabel: string;
  handoff: string;
}

const TASKS: Task[] = [
  {
    id: 0,
    cmdZh:     '"在 ESLint 加一條規則：禁止 console.log"',
    cmdEn:     '"Add ESLint rule: ban console.log"',
    scores:    [1, 1, 1, 5, 1],
    tier:      'Tier-Exec',
    tierColor: '#10B981',
    costLabel: '−99%',
    handoff:   'handoff-2026-05-05-a3k1.md',
  },
  {
    id: 1,
    cmdZh:     '"重構 Auth 中介層以支援 OAuth"',
    cmdEn:     '"Refactor auth middleware to support OAuth"',
    scores:    [3, 3, 4, 3, 2],
    tier:      'Tier-Mid',
    tierColor: '#06B6D4',
    costLabel: '−85%',
    handoff:   'handoff-2026-05-05-b7p2.md',
  },
  {
    id: 2,
    cmdZh:     '"設計 SSO + MFA 統一認證架構"',
    cmdEn:     '"Design SSO + MFA unified auth architecture"',
    scores:    [5, 4, 5, 2, 4],
    tier:      'Tier-A',
    tierColor: '#D946EF',
    costLabel: '—',
    handoff:   'handoff-2026-05-05-c9q3.md',
  },
  {
    id: 3,
    cmdZh:     '"替 utils 模組補齊單元測試"',
    cmdEn:     '"Write unit tests for the utils module"',
    scores:    [1, 2, 1, 5, 1],
    tier:      'Tier-Exec',
    tierColor: '#10B981',
    costLabel: '−99%',
    handoff:   'handoff-2026-05-05-d2m4.md',
  },
];

const DIM_ZH = ['判斷', '上下文', '風險', '可驗', '創意'];
const DIM_EN = ['Judge', 'Ctx  ', 'Risk ', 'Verif', 'Creat'];

const bar = (v: number) => '█'.repeat(v * 2) + '░'.repeat((5 - v) * 2);

// ── 歷史記錄 ──────────────────────────────────────────────────────────────────

interface HistoryEntry {
  key: number;
  cmdShort: string;
  tier: string;
  tierColor: string;
  costLabel: string;
  visible: boolean;
}

// ── 動畫狀態機 ────────────────────────────────────────────────────────────────

type Phase = 'typing' | 'scoring' | 'deciding' | 'done';

interface AnimState {
  taskIdx: number;
  phase: Phase;
  typedLen: number;
  shownLines: number;
  showDecision: boolean;
}

// ── 元件 ──────────────────────────────────────────────────────────────────────

export default function HeroDemo({ lang }: { lang: Lang }) {
  const [st, setSt] = useState<AnimState>({
    taskIdx: 0, phase: 'typing', typedLen: 0, shownLines: 0, showDecision: false,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const entryKeyRef = useRef(0);

  useEffect(() => {
    const task = TASKS[st.taskIdx];
    const cmd  = lang === 'en' ? task.cmdEn : task.cmdZh;
    let timer: ReturnType<typeof setTimeout>;

    if (st.phase === 'typing') {
      if (st.typedLen < cmd.length) {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, typedLen: s.typedLen + 1 })), 28);
      } else {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, phase: 'scoring' })), 250);
      }
    } else if (st.phase === 'scoring') {
      if (st.shownLines < 5) {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, shownLines: s.shownLines + 1 })), 100);
      } else {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, phase: 'deciding' })), 250);
      }
    } else if (st.phase === 'deciding') {
      timer = setTimeout(() =>
        setSt(s => ({ ...s, showDecision: true, phase: 'done' })), 380);
    } else {
      // done — push to history, wait, then next task
      timer = setTimeout(() => {
        const key = entryKeyRef.current++;
        const short = (lang === 'en' ? task.cmdEn : task.cmdZh)
          .replace(/^"|"$/g, '').slice(0, 28) + '…';
        const entry: HistoryEntry = {
          key, cmdShort: short,
          tier: task.tier, tierColor: task.tierColor,
          costLabel: task.costLabel, visible: false,
        };
        // Add invisible first, then make visible after 1 frame for CSS transition
        setHistory(prev => [entry, ...prev].slice(0, 5));
        requestAnimationFrame(() => {
          setHistory(prev =>
            prev.map(e => e.key === key ? { ...e, visible: true } : e)
          );
        });
        const next = (st.taskIdx + 1) % TASKS.length;
        setSt({ taskIdx: next, phase: 'typing', typedLen: 0, shownLines: 0, showDecision: false });
      }, 2200);
    }

    return () => clearTimeout(timer);
  }, [st, lang]);

  const task   = TASKS[st.taskIdx];
  const cmd    = lang === 'en' ? task.cmdEn : task.cmdZh;
  const labels = lang === 'en' ? DIM_EN : DIM_ZH;

  return (
    <div className="rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl font-mono text-[12px] leading-relaxed bg-[#0b0b0b]">

      {/* ── Window chrome ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#2A2A2A]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-[11px] text-[#555] select-none">gstack+ — router session</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#444]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          live
        </div>
      </div>

      {/* ── Body: two columns ── */}
      <div className="grid grid-cols-[1fr_1px_1fr] min-h-[280px] sm:min-h-[320px]">

        {/* Left: current task being classified */}
        <div className="p-5 flex flex-col">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-3">
            {lang === 'zh' ? '當前任務' : 'classifying'}
          </div>

          {/* Prompt */}
          <div className="mb-3">
            <span className="text-[#10B981]">$ </span>
            <span className="text-[#888]">npx gstack-plus </span>
            <span className="text-[#FFD700]">{cmd.slice(0, st.typedLen)}</span>
            {st.phase === 'typing' && (
              <span className="animate-pulse text-[#EDEDED]">▋</span>
            )}
          </div>

          {/* Score bars */}
          {st.shownLines > 0 && (
            <div className="space-y-1 mb-3">
              {task.scores.slice(0, st.shownLines).map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#555] w-10 shrink-0 text-[10px]">{labels[i]}</span>
                  <span className="text-[#06B6D4] text-[11px] tracking-[-1px]">{bar(v)}</span>
                  <span className="text-[#888]">{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Routing decision */}
          {st.showDecision && (
            <div className="mt-auto border border-[#2A2A2A] rounded-lg p-3 bg-[#111]">
              <div className="text-[10px] text-[#555] mb-1">
                {lang === 'zh' ? '路由決定' : 'routing decision'}
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: task.tierColor }} className="font-semibold text-sm">
                  {task.tier}
                </span>
                {task.costLabel !== '—' && (
                  <span className="text-[10px] text-[#555]">
                    {lang === 'zh' ? '節省' : 'saved'}{' '}
                    <span className="text-emerald-500">{task.costLabel}</span>
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#444] mt-1.5 truncate">
                ✓ ./handoffs/{task.handoff}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="bg-[#2A2A2A]" />

        {/* Right: routing history */}
        <div className="p-5 flex flex-col">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-3">
            {lang === 'zh' ? '路由記錄' : 'routing log'}
          </div>

          {history.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[#333] text-[11px]">
                {lang === 'zh' ? '等待首個任務完成…' : 'waiting for first task…'}
              </span>
            </div>
          ) : (
            <div className="space-y-2 overflow-hidden">
              {history.map(e => (
                <div
                  key={e.key}
                  className="border border-[#222] rounded-lg p-2.5 bg-[#0f0f0f]"
                  style={{
                    opacity:    e.visible ? 1 : 0,
                    transform:  e.visible ? 'translateY(0)' : 'translateY(-8px)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ color: e.tierColor, background: `${e.tierColor}18` }}
                    >
                      {e.tier}
                    </span>
                    {e.costLabel !== '—' && (
                      <span className="text-[10px] text-emerald-500">{e.costLabel}</span>
                    )}
                  </div>
                  <div className="text-[#555] text-[10px] truncate">{e.cmdShort}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer progress dots ── */}
      <div className="flex items-center justify-between px-5 py-2 bg-[#0f0f0f] border-t border-[#1A1A1A]">
        <div className="flex gap-1.5">
          {TASKS.map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{ background: i === st.taskIdx ? '#555' : '#222' }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[#333]">gstack-plus v0.5.0</span>
      </div>
    </div>
  );
}
