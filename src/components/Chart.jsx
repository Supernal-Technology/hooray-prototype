// Inline SVG charts for Ask-SAL answers. No chart library, hand-rolled so the
// palette and type stay on the design system (accent / amber / ink only, serif
// numerals, axis-minimal). Animated draw-in ≤300ms; honors prefers-reduced-motion
// via the .chart-* keyframes in index.css.
//
// A chart is described by a plain `spec` object (see data/clientChat.js), so the
// demo can be redirected by editing data, not components.

const ACCENT_DARK = '#8B9A3B'
const ACCENT = '#E3EB84'
const ACCENT_DEEP = '#6F7C2D'
const AMBER = '#F59E0B'
const INK = '#100F0E'
const INK_3 = '#665F55'
const HAIRLINE = 'rgba(16,15,14,0.10)'

export default function Chart({ spec }) {
  if (!spec) return null
  switch (spec.type) {
    case 'line': return <LineChart spec={spec} />
    case 'groupedBars': return <GroupedBars spec={spec} />
    case 'stacked': return <StackedBar spec={spec} />
    case 'stat': return <StatCallout spec={spec} />
    case 'bars': return <RankedBars spec={spec} />
    default: return null
  }
}

/* ---------- Ranked horizontal bars (revenue by channel / rate plan) ---------- */
function RankedBars({ spec }) {
  const { items, format, highlightTop = true } = spec // items: [{label, value}]
  const max = Math.max(...items.map((i) => i.value)) || 1
  return (
    <figure className="mt-1 space-y-1.5">
      {items.map((it, i) => {
        const pct = Math.max(2, (it.value / max) * 100)
        const color = highlightTop && i === 0 ? ACCENT_DARK : i < 3 ? ACCENT_DARK : ACCENT
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-28 text-[11px] text-ink-2 truncate flex-shrink-0 text-right">{it.label}</span>
            <div className="flex-1 h-4 rounded bg-subtle overflow-hidden">
              <div className="chart-bar-grow h-full rounded" style={{ width: `${pct}%`, backgroundColor: color, animationDelay: `${i * 40}ms` }} />
            </div>
            <span className="w-16 text-[10px] font-mono text-ink-3 flex-shrink-0">{fmt(it.value, format)}</span>
          </div>
        )
      })}
    </figure>
  )
}

function fmt(v, format) {
  if (format === 'currency') return v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
  if (format === 'currency-full') return `$${Math.round(v).toLocaleString()}`
  if (format === 'x') return `${v.toFixed(1)}x`
  if (format === 'pct') return `${Math.round(v)}%`
  if (format === 'money2') return `$${v.toFixed(2)}`
  return v >= 1000 ? Math.round(v).toLocaleString() : String(v)
}

/* ---------- Line (trends) ---------- */
function LineChart({ spec }) {
  const { points, xLabels = [], format, flagged, latestLabel } = spec
  const W = 320, H = 132, padX = 10, padTop = 14, padBottom = 22
  const min = Math.min(...points), max = Math.max(...points)
  const range = max - min || 1
  const stepX = (W - padX * 2) / (points.length - 1)
  const stroke = flagged ? AMBER : ACCENT_DARK
  const coords = points.map((v, i) => {
    const x = padX + i * stepX
    const y = padTop + (1 - (v - min) / range) * (H - padTop - padBottom)
    return [x, y]
  })
  const d = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = coords.at(-1)
  return (
    <figure className="mt-1">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.alt || 'trend chart'}>
        <line x1={padX} y1={H - padBottom} x2={W - padX} y2={H - padBottom} stroke={HAIRLINE} strokeWidth="1" />
        <path className="chart-line-draw" d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
        <circle className="chart-dot" cx={lastX} cy={lastY} r="3.5" fill={stroke} />
        {xLabels.map((lab, i) => (
          <text key={i} x={padX + i * stepX} y={H - 6} textAnchor="middle" fontSize="9" fontFamily="'JetBrains Mono', monospace" fill={INK_3}>{lab}</text>
        ))}
      </svg>
      <figcaption className="flex items-baseline justify-between mt-1">
        <span className="text-[10px] font-mono text-ink-3">{xLabels[0]} → {xLabels.at(-1)}</span>
        <span className={`font-serif font-medium text-lg ${flagged ? 'text-amber-text' : 'text-ink'}`}>{fmt(points.at(-1), format)}{latestLabel && <span className="text-[10px] font-sans text-ink-3 ml-1">{latestLabel}</span>}</span>
      </figcaption>
    </figure>
  )
}

/* ---------- Grouped bars (comparisons) ---------- */
function GroupedBars({ spec }) {
  // categories: [{label, prior, current}], format
  const { categories, format, priorLabel = 'Prior', currentLabel = 'Current' } = spec
  const max = Math.max(...categories.flatMap((c) => [c.prior, c.current])) || 1
  return (
    <figure className="mt-1">
      <div className="space-y-2.5">
        {categories.map((c, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between text-[11px] mb-1">
              <span className="text-ink-2 font-medium">{c.label}</span>
              <span className="font-mono text-ink-3">{fmt(c.current, format)}</span>
            </div>
            <div className="space-y-1">
              <Bar value={c.prior} max={max} color={ACCENT} delay={i * 60} />
              <Bar value={c.current} max={max} color={c.flagged ? AMBER : ACCENT_DARK} delay={i * 60 + 40} />
            </div>
          </div>
        ))}
      </div>
      <Legend items={[[priorLabel, ACCENT], [currentLabel, ACCENT_DARK]]} />
    </figure>
  )
}

function Bar({ value, max, color, delay = 0 }) {
  const pct = Math.max(2, (value / max) * 100)
  return (
    <div className="h-2.5 rounded-full bg-subtle overflow-hidden">
      <div className="chart-bar-grow h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, animationDelay: `${delay}ms` }} />
    </div>
  )
}

/* ---------- Stacked / proportional (breakdowns) ---------- */
function StackedBar({ spec }) {
  const { segments, format } = spec // [{label,value,color?}]
  const total = segments.reduce((n, s) => n + s.value, 0) || 1
  const palette = [ACCENT_DARK, ACCENT, ACCENT_DEEP, INK_3]
  return (
    <figure className="mt-1">
      <div className="flex h-7 rounded-lg overflow-hidden border border-hairline">
        {segments.map((s, i) => (
          <div key={i} className="chart-seg-grow h-full" style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color || palette[i % palette.length], animationDelay: `${i * 70}ms` }} title={`${s.label}: ${fmt(s.value, format)}`} />
        ))}
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-ink-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color || palette[i % palette.length] }} />
              <span className="truncate">{s.label}</span>
            </span>
            <span className="font-mono text-ink-3 flex-shrink-0">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </figure>
  )
}

/* ---------- Single-stat callout ---------- */
function StatCallout({ spec }) {
  const { value, label, delta, flagged, sub } = spec
  return (
    <figure className="mt-1 chart-stat-in rounded-card border border-hairline bg-subtle px-4 py-3">
      <div className="text-[10px] uppercase tracking-wide text-ink-3">{label}</div>
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className={`font-serif font-medium text-3xl tracking-tight ${flagged ? 'text-amber-text' : 'text-ink'}`}>{value}</span>
        {delta && <span className={`text-xs font-semibold ${delta.startsWith('-') ? 'text-amber-text' : 'text-accent-dark'}`}>{delta}</span>}
      </div>
      {sub && <div className="text-[11px] text-ink-3 mt-1">{sub}</div>}
    </figure>
  )
}

function Legend({ items }) {
  return (
    <div className="flex items-center gap-3 mt-2.5">
      {items.map(([label, color], i) => (
        <span key={i} className="flex items-center gap-1.5 text-[10px] text-ink-3">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} /> {label}
        </span>
      ))}
    </div>
  )
}
