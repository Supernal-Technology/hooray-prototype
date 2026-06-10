import { useState } from 'react'
import { ArrowUpRight, BarChart3, Check, ExternalLink, Lightbulb, TrendingUp } from 'lucide-react'
import { SIGNALS } from '../data/signals'
import { getClient } from '../data/clients'
import { getPlatform } from '../data/sources'
import { useReports } from '../state/reportsStore'
import ClientAvatar from '../components/ClientAvatar'
import TierBadge from '../components/TierBadge'

export default function Anomalies({ onOpenAskSal, onToast }) {
  const [approved, setApproved] = useState({})
  const [dismissed, setDismissed] = useState({})
  const { inScope } = useReports()

  const insights = SIGNALS
    .filter((s) => ['recommendation', 'mom-jump'].includes(s.kind) && !dismissed[s.id] && inScope(s.clientId))
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
  const opportunities = insights.filter((s) => s.kind === 'recommendation')
  const performanceLifts = insights.filter((s) => s.kind === 'mom-jump')

  const handleApprove = (sig) => {
    setApproved((a) => ({ ...a, [sig.id]: true }))
    onToast({
      title: 'Insight accepted',
      body: `${getClient(sig.clientId).name}: ${sig.suggestedAction}`,
    })
  }
  const handleDismiss = (sig) => setDismissed((d) => ({ ...d, [sig.id]: true }))

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <div className="eyebrow">Intelligence</div>
        <h1 className="text-2xl font-serif font-medium tracking-tight text-ink mt-1">Insights</h1>
        <p className="text-sm text-ink-3 mt-1">Performance reads, growth openings, and strategic next moves worth discussing.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <SummaryCard
          icon={<Lightbulb size={15} aria-hidden="true" />}
          label="Opportunities"
          value={opportunities.length}
          detail="Budget shifts, creative tests, and AM actions"
        />
        <SummaryCard
          icon={<TrendingUp size={15} aria-hidden="true" />}
          label="Performance Lifts"
          value={performanceLifts.length}
          detail="Positive movement SAL thinks matters"
        />
        <SummaryCard
          icon={<BarChart3 size={15} aria-hidden="true" />}
          label="Sources Read"
          value="5"
          detail="GA4, Ads, Meta, Revinate, Trade Desk"
        />
      </div>

      <Panel
        title="Performance Opportunities"
        subtitle={`${opportunities.length} SAL-authored next moves for the account team`}
        icon={<Lightbulb size={14} className="text-accent-dark" />}
      >
        {opportunities.map((s) => (
          <InsightRow
            key={s.id}
            sig={s}
            approved={approved[s.id]}
            onApprove={handleApprove}
            onDismiss={handleDismiss}
            onOpenAskSal={onOpenAskSal}
          />
        ))}
        {opportunities.length === 0 && <Empty label="No performance opportunities this cycle." />}
      </Panel>

      <Panel
        title="Notable Performance Lifts"
        subtitle={`${performanceLifts.length} positive signal SAL would carry into the strategy readout`}
        icon={<TrendingUp size={14} className="text-accent-dark" />}
      >
        {performanceLifts.map((s) => (
          <InsightRow
            key={s.id}
            sig={s}
            approved={approved[s.id]}
            onApprove={handleApprove}
            onDismiss={handleDismiss}
            onOpenAskSal={onOpenAskSal}
          />
        ))}
        {performanceLifts.length === 0 && <Empty label="No notable lifts this cycle." />}
      </Panel>
    </div>
  )
}

function SummaryCard({ icon, label, value, detail }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-accent-dark mb-3">{icon}<span className="eyebrow">Insight Lens</span></div>
      <div className="text-2xl font-serif font-semibold text-ink">{value}</div>
      <div className="text-sm font-semibold text-ink mt-1">{label}</div>
      <p className="text-xs text-ink-3 mt-1 leading-relaxed">{detail}</p>
    </div>
  )
}

function Panel({ title, subtitle, icon, children }) {
  return (
    <section className="mb-9">
      <h3 className="flex items-center gap-2 text-base font-serif font-medium tracking-tight text-ink mb-1">
        {icon} {title}
      </h3>
      <p className="text-xs text-ink-3 mb-3">{subtitle}</p>
      <div className="card divide-y divide-hairline">{children}</div>
    </section>
  )
}

function InsightRow({ sig, approved, onApprove, onDismiss, onOpenAskSal }) {
  const client = getClient(sig.clientId)
  const platform = getPlatform(sig.platformId)
  const isLift = sig.kind === 'mom-jump'
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
              <InsightChip kind={sig.kind} />
            </div>
            {sig.metric && (
              <div className="text-[11px] text-ink-3 mt-1 font-mono">
                {sig.metric.toUpperCase()} · observed <span className="font-semibold text-ink">{fmtMetric(sig.observed)}</span> vs baseline {fmtMetric(sig.baseline)} <span className={sig.deltaPct < 0 ? 'text-amber-text' : 'text-accent-dark'}>({(sig.deltaPct * 100).toFixed(0)}%)</span>
              </div>
            )}
            <p className="text-sm text-ink-2 mt-2 leading-relaxed">{sig.narrative}</p>
            <div className="mt-3 rounded-lg border border-hairline bg-accent-pale px-3 py-2">
              <div className="eyebrow mb-0.5">{isLift ? 'Why It Matters' : 'Suggested Next Move'}</div>
              <div className="text-sm text-ink-2">{sig.suggestedAction}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {approved ? (
            <span className="pill pill-sm pill-done inline-flex items-center gap-1"><Check size={12} /> Accepted</span>
          ) : (
            <button onClick={() => onApprove(sig)} className="btn-primary text-xs px-3 py-1.5 inline-flex items-center gap-1">
              {isLift ? <ArrowUpRight size={12} /> : <Check size={12} />}
              {isLift ? 'Add to readout' : 'Accept move'}
            </button>
          )}
          <button
            onClick={() => onOpenAskSal(sig.clientId)}
            className="text-[11px] text-ink-2 hover:text-accent-dark inline-flex items-center gap-1"
          >
            Ask SAL <ExternalLink size={10} />
          </button>
          <button onClick={() => onDismiss(sig)} className="text-[11px] text-ghost hover:text-ink-2">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

function InsightChip({ kind }) {
  if (kind === 'mom-jump') {
    return <span className="pill pill-sm pill-ready inline-flex items-center gap-1"><TrendingUp size={11} /> Performance lift</span>
  }
  return <span className="pill pill-sm pill-ready inline-flex items-center gap-1"><Lightbulb size={11} /> Opportunity</span>
}

function Empty({ label }) {
  return <div className="px-5 py-6 text-center text-sm text-ink-3">{label}</div>
}

function fmtMetric(v) {
  if (typeof v !== 'number') return String(v)
  if (v < 10) return v.toFixed(2)
  return Math.round(v).toLocaleString()
}
