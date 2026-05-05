import { useEffect, useState } from 'react';
import type { Lang } from '@/i18n/strings';

// ── 動畫資料 ──────────────────────────────────────────────────────────────────

interface Task {
  cmdZh: string;
  cmdEn: string;
  scores: [number, number, number, number, number]; // judgment, context, risk, verif, creativity
  tier: 'Tier-Exec' | 'Tier-Mid' | 'Tier-A';
  tierColor: string;
  reasonZh: string;
  reasonEn: string;
}

const TASKS: Task[] = [
  {
    cmdZh:  'classify "在 ESLint 中加一條規則：禁止 console.log"',
    cmdEn:  'classify "Add ESLint rule: ban console.log"',
    scores: [1, 1, 1, 5, 1],
    tier: 'Tier-Exec',
    tierColor: '#10B981',
    reasonZh: 'Tier-Exec：可驗證且低風險',
    reasonEn: 'Tier-Exec: verifiable and low-risk',
  },
  {
    cmdZh:  'classify "重構 Auth 中介層以支援 OAuth"',
    cmdEn:  'classify "Refactor auth middleware to support OAuth"',
    scores: [3, 3, 4, 3, 2],
    tier: 'Tier-Mid',
    tierColor: '#06B6D4',
    reasonZh: 'Tier-Mid：中等複雜度，需仔細審查',
    reasonEn: 'Tier-Mid: moderate complexity, needs careful review',
  },
  {
    cmdZh:  'classify "設計 SSO + MFA 統一認證架構"',
    cmdEn:  'classify "Design SSO + MFA unified auth architecture"',
    scores: [5, 4, 5, 2, 4],
    tier: 'Tier-A',
    tierColor: '#D946EF',
    reasonZh: 'Tier-A 觸發：judgment=5 ≥ 4, risk=5 ≥ 4',
    reasonEn: 'Tier-A triggered: judgment=5 ≥ 4, risk=5 ≥ 4',
  },
];

const DIM_LABELS_ZH = ['判斷強度', '上下文寬度', '風險權重', '可驗證性', '創意密度'];
const DIM_LABELS_EN = ['Judgment  ', 'Context   ', 'Risk      ', 'Verif.    ', 'Creativity'];

// ── 動畫狀態機 ────────────────────────────────────────────────────────────────

type Phase = 'typing' | 'scoring' | 'deciding' | 'done';

interface AnimState {
  taskIdx: number;
  phase: Phase;
  typedLen: number;    // 已打出的字元數
  shownLines: number;  // 已顯示的分數行數（0-5）
  showDecision: boolean;
}

const bar = (v: number) => '█'.repeat(v * 2) + '░'.repeat((5 - v) * 2);

// ── 元件 ──────────────────────────────────────────────────────────────────────

export default function TerminalDemo({ lang }: { lang: Lang }) {
  const [st, setSt] = useState<AnimState>({
    taskIdx: 0, phase: 'typing', typedLen: 0, shownLines: 0, showDecision: false,
  });

  useEffect(() => {
    const task = TASKS[st.taskIdx];
    const cmd  = lang === 'en' ? task.cmdEn : task.cmdZh;
    let timer: ReturnType<typeof setTimeout>;

    if (st.phase === 'typing') {
      if (st.typedLen < cmd.length) {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, typedLen: s.typedLen + 1 })), 32);
      } else {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, phase: 'scoring' })), 300);
      }
    } else if (st.phase === 'scoring') {
      if (st.shownLines < 5) {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, shownLines: s.shownLines + 1 })), 110);
      } else {
        timer = setTimeout(() =>
          setSt(s => ({ ...s, phase: 'deciding' })), 300);
      }
    } else if (st.phase === 'deciding') {
      timer = setTimeout(() =>
        setSt(s => ({ ...s, showDecision: true, phase: 'done' })), 400);
    } else {
      // done — pause then next task
      timer = setTimeout(() => {
        const next = (st.taskIdx + 1) % TASKS.length;
        setSt({ taskIdx: next, phase: 'typing', typedLen: 0, shownLines: 0, showDecision: false });
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [st, lang]);

  const task   = TASKS[st.taskIdx];
  const cmd    = lang === 'en' ? task.cmdEn : task.cmdZh;
  const labels = lang === 'en' ? DIM_LABELS_EN : DIM_LABELS_ZH;
  const reason = lang === 'en' ? task.reasonEn : task.reasonZh;

  return (
    <div className="rounded-xl overflow-hidden border border-[#2A2A2A] shadow-xl font-mono text-[13px] leading-relaxed">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-[11px] text-[#666] select-none">gstack-plus — terminal</span>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0b0b0b] text-[#EDEDED] p-5 min-h-[260px]">

        {/* Prompt line */}
        <div className="mb-3">
          <span className="text-[#10B981]">$ </span>
          <span className="text-[#EDEDED]">npx gstack-plus </span>
          <span className="text-[#FFD700]">{cmd.slice(0, st.typedLen)}</span>
          {st.phase === 'typing' && (
            <span className="animate-pulse text-[#EDEDED]">▋</span>
          )}
        </div>

        {/* Score lines */}
        {st.shownLines > 0 && (
          <div className="mb-3 space-y-0.5">
            {task.scores.slice(0, st.shownLines).map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#888] w-24 shrink-0 text-[12px]">{labels[i]}</span>
                <span className="text-[#06B6D4]">{bar(v)}</span>
                <span className="text-[#EDEDED] ml-1">{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Decision */}
        {st.showDecision && (
          <>
            <div className="text-[#444] mb-2">────────────────────────────────</div>
            <div className="mb-0.5">
              <span className="text-[#888]">Routing decision: </span>
              <span style={{ color: task.tierColor }} className="font-semibold">{task.tier}</span>
            </div>
            <div className="text-[#666] text-[12px] mb-3">
              {reason}
            </div>
            <div className="text-[#10B981] text-[12px]">
              ✓ Handoff doc written → ./handoffs/handoff-{new Date().toISOString().slice(0,10)}-x{Math.random().toString(36).slice(2,6)}.md
            </div>
          </>
        )}
      </div>

      {/* Task indicator dots */}
      <div className="flex justify-center gap-1.5 py-2 bg-[#111] border-t border-[#2A2A2A]">
        {TASKS.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ background: i === st.taskIdx ? '#666' : '#2A2A2A' }}
          />
        ))}
      </div>
    </div>
  );
}
