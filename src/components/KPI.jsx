import { AlertTriangle } from 'lucide-react'

export default function KPI({ label, value, delta, deltaSub, anomaly, missing }) {
  const isPositive = (delta || '').startsWith('+')
  const negative = (delta || '').startsWith('-')
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="eyebrow">{label}</p>
        {anomaly && <AlertTriangle size={14} className="text-amber flex-shrink-0" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
        <span className="font-serif font-medium text-ink text-[34px] leading-none tracking-tight">
          {missing ? ', ' : value}
        </span>
        {!missing && delta && (
          <span className={`text-xs font-semibold ${negative ? 'text-amber-text' : isPositive ? 'text-accent-dark' : 'text-ink-3'}`}>
            {delta}
          </span>
        )}
      </div>
      {deltaSub && <p className="text-[11px] text-ink-3 mt-1.5">{deltaSub}</p>}
    </div>
  )
}
