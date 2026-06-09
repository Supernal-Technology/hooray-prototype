// Tiny inline sparkline. SVG only — no axes, no gridlines.
// Stroke: accent-dark (healthy), amber (flagged), ink-3 (neutral).

export default function Sparkline({
  series,
  width = 120,
  height = 32,
  stroke = '#8B9A3B',
  anomalyAtEnd = false,
}) {
  if (!series || series.length < 2) return null
  const lineStroke = anomalyAtEnd ? '#F59E0B' : stroke
  const min = Math.min(...series)
  const max = Math.max(...series)
  const range = max - min || 1
  const pad = 3
  const stepX = (width - pad * 2) / (series.length - 1)
  const points = series.map((v, i) => {
    const x = pad + i * stepX
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return [x, y]
  })
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = points.at(-1)
  return (
    <svg width={width} height={height} aria-hidden="true">
      <path d={d} fill="none" stroke={lineStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={anomalyAtEnd ? 3 : 2.5} fill={lineStroke} />
    </svg>
  )
}
