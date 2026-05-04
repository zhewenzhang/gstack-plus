import type { Scoring } from '@/lib/route';

const SIZE = 160;
const CX = SIZE / 2;
const CY = SIZE / 2;
const MAX_R = SIZE / 2 - 16;
const LABEL_R = SIZE / 2 - 4;

// Pentagon: 5 axes, starting from top (-90°), clockwise every 72°
const ANGLES_DEG = [-90, -18, 54, 126, 198];
const KEYS: (keyof Scoring)[] = ['judgment', 'context', 'risk', 'verifiability', 'creativity'];
const LABELS_ZH = ['判斷', '上下文', '風險', '可驗', '創意'];
const LABELS_EN = ['Judg.', 'Ctx', 'Risk', 'Verif.', 'Creat.'];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function point(r: number, angleDeg: number) {
  return {
    x: CX + r * Math.cos(toRad(angleDeg)),
    y: CY + r * Math.sin(toRad(angleDeg)),
  };
}

function polyPoints(values: number[]) {
  return values
    .map((v, i) => {
      const r = Math.max(4, ((v - 1) / 4) * MAX_R);
      const p = point(r, ANGLES_DEG[i]);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(' ');
}

function outerPoints() {
  return ANGLES_DEG.map(a => {
    const p = point(MAX_R, a);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(' ');
}

const TIER_FILL: Record<string, string> = {
  'Tier-A':    'rgba(217,70,239,0.15)',
  'Tier-Mid':  'rgba(6,182,212,0.15)',
  'Tier-Exec': 'rgba(16,185,129,0.15)',
};
const TIER_STROKE: Record<string, string> = {
  'Tier-A':    'rgb(192,38,211)',
  'Tier-Mid':  'rgb(6,182,212)',
  'Tier-Exec': 'rgb(16,185,129)',
};

type Props = { scoring: Scoring; tier: string; lang: 'zh' | 'en' };

export default function PentagonChart({ scoring, tier, lang }: Props) {
  const values = KEYS.map(k => scoring[k]);
  const labels = lang === 'en' ? LABELS_EN : LABELS_ZH;
  const fill = TIER_FILL[tier] ?? 'rgba(0,0,0,0.08)';
  const stroke = TIER_STROKE[tier] ?? '#000';

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="shrink-0"
      aria-label="5-dimension scoring radar"
    >
      {/* Grid rings at 1,2,3,4,5 */}
      {[1, 2, 3, 4, 5].map(level => (
        <polygon
          key={level}
          points={outerPoints().split(' ').map((p, i) => {
            const [ox, oy] = p.split(',').map(Number);
            const r = ((level - 1) / 4) * MAX_R;
            const pt = point(r, ANGLES_DEG[i]);
            return `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
          }).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      ))}

      {/* Axis lines */}
      {ANGLES_DEG.map((a, i) => {
        const outer = point(MAX_R, a);
        return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="#e5e7eb" strokeWidth="0.5" />;
      })}

      {/* Score polygon */}
      <polygon
        points={polyPoints(values)}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Score dots */}
      {values.map((v, i) => {
        const r = Math.max(4, ((v - 1) / 4) * MAX_R);
        const p = point(r, ANGLES_DEG[i]);
        return <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={stroke} />;
      })}

      {/* Labels */}
      {ANGLES_DEG.map((a, i) => {
        const p = point(LABEL_R, a);
        const anchor = p.x < CX - 4 ? 'end' : p.x > CX + 4 ? 'start' : 'middle';
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="8"
            fill="#6b7280"
            fontFamily="system-ui, sans-serif"
          >
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}
