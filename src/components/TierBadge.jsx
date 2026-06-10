// Access tier badge, Tier 1/2/3. Mono (data) type, accent ladder.
// T3 (manual CSV) carries amber: the most fragile source, genuinely needs attention.

const TIER_STYLES = {
  1: { bg: 'var(--accent)',   border: 'transparent',          color: 'var(--accent-ink)', label: 'T1' },
  2: { bg: 'var(--card)',     border: 'var(--hairline-strong)', color: 'var(--ink-3)',    label: 'T2' },
  3: { bg: 'var(--amber-bg)', border: 'var(--amber-border)',  color: 'var(--amber-text)', label: 'T3' },
}

export default function TierBadge({ tier, withLabel = false }) {
  const s = TIER_STYLES[tier] ?? TIER_STYLES[1]
  return (
    <span
      className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium font-mono tracking-wide"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
      title={`Access Tier ${tier}`}
    >
      {s.label}
      {withLabel && <span className="ml-1 opacity-80">{tier === 1 ? 'Hooray-managed' : tier === 2 ? 'Delegated' : 'Manual CSV'}</span>}
    </span>
  )
}
