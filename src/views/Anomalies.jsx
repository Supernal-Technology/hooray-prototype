import { useState } from 'react'
import { Lightbulb, TrendingUp, Check, ExternalLink } from 'lucide-react'
import { SIGNALS } from '../data/signals'
import { getClient } from '../data/clients'
import { getPlatform } from '../data/sources'
import { useReports } from '../state/reportsStore'
import ClientAvatar from '../components/ClientAvatar'
import TierBadge from '../components/TierBadge'

// INSIGHTS — the upside. Recommendations and opportunities SAL surfaces to act on
// and grow. Problems (anomalies, missing data) live in the Anomalies feed instead.
export default function Insights({ onOpenAskSal, onToast }) {
  const [approved, setApproved] = useState({})
  const [dismissed, setDismissed] = useState({})
  const { inScope } = useReports()

  const recommendations = SIGNALS.filter((s) => s.kind === 'recommendation' && !dismissed[s.id] && inScope(s.clientId))
  const opportunities = SIGNALS.filter((s) => s.kind === 'mom-jump' && !dismissed[s.id] && inScope(s.clientId))

  const handleApprove = (sig) => {
    setApproved((a) => ({ ...a, [sig.id]: true }))
    onToast({ title: 'Recommendation approved', body: `${getClient(sig.clientId).name}: ${sig.suggestedAction}` })
  }
  const handleDismiss = (sig) => setDismissed((d) => ({ ...d, [sig.id]: true }))

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <div className="eyebrow">Insights</div>
        <h1 className="text-2xl font-serif font-medium tracking-tight text-ink mt-1">Insights</h1>
        <p className="text-sm text-ink-3 mt-1">Performance wins and opportunities. What's working and where to lean in.</p>
      </header>

      <Panel
        title="Recommendations"
        subtitle={`${recommendations.length} next-step suggestions awaiting approval`}
        icon={<Lightbulb size={14} className="text-accent-dark" />}
      >
        {recommendations.map((s) => (
          <SignalRow key={s.id} sig={s} approved={approved[s.id]} onApprove={handleApprove} onDismiss={handleDismiss} onOpenAskSal={onOpenAskSal} />
        ))}
        {recommendations.length === 0 && <Empty label="No recommendations this cycle." />}
      </Panel>

      <Panel
        title="Opportunities"
        subtitle={`${opportunities.length} positive moves worth capturing`}
        icon={<TrendingUp size={14} className="text-accent-dark" />}
      >
        {opportunities.map((s) => (
          <SignalRow key={s.id} sig={s} approved={approved[s.id]} onApprove={handleApprove} onDismiss={handleDismiss} onOpenAskSal={onOpenAskSal} />
        ))}
        {opportunities.length === 0 && <Empty label="No new opportunities this cycle." />}
      </Panel>
    </div>
  )
}

function Panel({ title, subtitle, icon, children }) {
  return (
    <section className="mb-9">
      <h3 className="flex items-center gap-2 text-base font-serif font-medium tracking-tight text-ink mb-1">{icon} {title}</h3>
      <p className="text-xs text-ink-3 mb-3">{subtitle}</p>
      <div className="card divide-y divide-hairline">{children}</div>
    </section>
  )
}

function SignalRow({ sig, approved, onApprove, onDismiss, onOpenAskSal }) {
  const client = getClient(sig.clientId)
  const platform = getPlatform(sig.platformId)
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <ClientAvatar name={client.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-ink truncate">{client.name}</span>
              <span className="text-[11px] text-ink-3">·</span>
              <span className="text-xs text-ink-2">{platform?.name || sig.platformId}</span>
              <TierBadge tier={client.tier} />
              <span className="pill pill-sm pill-ready inline-flex items-center gap-1"><TrendingUp size={11} /> Opportunity</span>
            </div>
            {sig.metric && (
              <div className="text-[11px] text-ink-3 mt-1 font-mono">
                {sig.metric.toUpperCase()} · observed <span className="font-semibold text-ink">{fmtMetric(sig.observed)}</span> vs baseline {fmtMetric(sig.baseline)} <span className="text-accent-dark">({(sig.deltaPct * 100).toFixed(0)}%)</span>
              </div>
            )}
            <p className="text-sm text-ink-2 mt-2 leading-relaxed">{sig.narrative}</p>
            {sig.suggestedAction && (
              <div className="mt-2 rounded-lg border border-hairline bg-muted px-3 py-2">
                <div className="eyebrow mb-0.5">SAL recommends</div>
                <div className="text-sm text-ink-2">{sig.suggestedAction}</div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {approved ? (
            <span className="pill pill-sm pill-done inline-flex items-center gap-1"><Check size={12} /> Approved</span>
          ) : (
            <button onClick={() => onApprove(sig)} className="btn-primary text-xs px-3 py-1.5 inline-flex items-center gap-1">
              <Check size={12} /> Approve
            </button>
          )}
          <button onClick={() => onOpenAskSal(sig.clientId)} className="text-[11px] text-ink-2 hover:text-accent-dark inline-flex items-center gap-1">
            Ask SAL <ExternalLink size={10} />
          </button>
          <button onClick={() => onDismiss(sig)} className="text-[11px] text-ghost hover:text-ink-2">Dismiss</button>
        </div>
      </div>
    </div>
  )
}

function Empty({ label }) {
  return <div className="px-5 py-6 text-center text-sm text-ink-3">{label}</div>
}

function fmtMetric(v) {
  if (typeof v !== 'number') return String(v)
  if (v < 10) return v.toFixed(2)
  return Math.round(v).toLocaleString()
}
