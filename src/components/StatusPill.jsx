// Report status pill. NYT-style — maps the lifecycle to the accent ladder.
import { Check, AlertTriangle } from 'lucide-react'

const STYLES = {
  drafting:         { cls: 'pill-neutral', label: 'Drafting' },
  ready_for_review: { cls: 'pill-ready',   label: 'Ready for review' },
  in_review:        { cls: 'pill-active',  label: 'In review' },
  signed_off:       { cls: 'pill-done',    label: 'Signed off', icon: 'check' },
  delivered:        { cls: 'pill-done',    label: 'Delivered',  icon: 'check' },
  anomaly:          { cls: 'pill-warning', label: 'Anomaly',          icon: 'warn' },
  missing:          { cls: 'pill-warning', label: 'Missing data',     icon: 'warn' },
  pending:          { cls: 'pill-warning', label: 'Compliance pending', icon: 'warn' },
}

export default function StatusPill({ status, override }) {
  const s = STYLES[status] ?? { cls: 'pill-neutral', label: status }
  const label = override ?? s.label
  return (
    <span className={`pill pill-sm ${s.cls}`}>
      {s.icon === 'check' && <Check size={11} strokeWidth={2.5} />}
      {s.icon === 'warn' && <AlertTriangle size={11} strokeWidth={2} />}
      {label}
    </span>
  )
}
