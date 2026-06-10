import { useState, useMemo, useEffect } from 'react'
import { Search, X, ChevronRight, AlertTriangle, Lock, ArrowRight } from 'lucide-react'
import { CLIENTS } from '../data/clients'
import { managerForClient } from '../data/people'
import { reportForClient } from '../data/reports'
import { LEADERSHIP } from '../data/leadership'
import { CURRENT_PERIOD } from '../data/performance'
import { SOURCES, getPlatform } from '../data/sources'
import { useReports } from '../state/reportsStore'
import KPI from '../components/KPI'
import StatusPill from '../components/StatusPill'
import TierBadge from '../components/TierBadge'
import ClientAvatar from '../components/ClientAvatar'
import Sparkline from '../components/Sparkline'

// Total anomalies SAL surfaced in a client's report (platform flags + flagged KPIs).
function anomalyCount(report) {
  if (!report) return 0
  const plat = report.platforms?.reduce((n, p) => n + (p.anomalies?.length || 0), 0) || 0
  const kpi = report.overview?.kpis?.filter((k) => k.anomaly).length || 0
  return plat + kpi
}

export default function Portfolio({ onOpenReport, onOpenAskSal, onToast, onPhase2 }) {
  const [query, setQuery] = useState('')
  const [activeClient, setActiveClient] = useState(null)
  const { statusForClient, inScope, currentUser } = useReports()

  // Account-access scope: directors see only their book; partners see all.
  const scopedClients = useMemo(() => CLIENTS.filter((c) => inScope(c.id)), [inScope])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return scopedClients
    return scopedClients.filter((c) => {
      const amName = managerForClient(c.id)?.name?.toLowerCase() || ''
      return (
        c.name.toLowerCase().includes(q) ||
        c.collection.toLowerCase().includes(q) ||
        amName.includes(q)
      )
    })
  }, [query, scopedClients])

  const tier = (t) => scopedClients.filter((c) => c.tier === t).length
  const portfolioKPIs = [
    { label: 'Active clients', value: String(scopedClients.length), deltaSub: `${tier(1)} T1 · ${tier(2)} T2 · ${tier(3)} T3` },
    { label: 'On-time delivery (MTD)', value: `${Math.round(LEADERSHIP.reporting.onTimePct.value * 100)}%`, delta: '+2pp', deltaSub: 'vs 90% prior cycle' },
    { label: 'Anomalies this cycle', value: String(LEADERSHIP.reporting.anomaliesCaught.mtd), delta: '+2', deltaSub: `${LEADERSHIP.reporting.anomaliesCaught.mtd} flagged · awaiting AM review`, anomaly: true },
    { label: 'Equivalent hours recovered', value: String(LEADERSHIP.equivalentHumanHours.mtd), delta: LEADERSHIP.equivalentHumanHours.delta, deltaSub: 'MTD' },
  ]

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow mb-2">Hooray roster</div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-ink">Portfolio</h1>
          <p className="text-sm text-ink-3 mt-1">
            {currentUser?.scope === 'all'
              ? `${scopedClients.length} client accounts across the Hooray roster. Click a row to inspect.`
              : `${scopedClients.length} accounts you manage. Click a row to inspect.`}
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by hotel, collection, or AM"
            aria-label="Search clients by hotel, collection, or account manager"
            className="input pl-9 w-72"
          />
        </div>
      </header>

      <div className="eyebrow mb-3">Pulse · account health monitoring</div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {portfolioKPIs.map((k) => <KPI key={k.label} {...k} />)}
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1fr_180px_150px_180px_28px] px-5 py-3 border-b border-hairline-soft bg-subtle text-[11px] uppercase tracking-wide font-semibold text-ink-3">
          <span>Client</span>
          <span>Account manager</span>
          <span>Access</span>
          <span>This month</span>
          <span></span>
        </div>
        {filtered.map((c) => {
          const am = managerForClient(c.id)
          const report = reportForClient(c.id, CURRENT_PERIOD)
          const liveStatus = statusForClient(c.id, CURRENT_PERIOD)
          const status = liveStatus ?? (c.compliance === 'pending' ? 'pending' : 'drafting')
          const anomalies = anomalyCount(report)
          return (
            <button
              key={c.id}
              onClick={() => setActiveClient(c)}
              className="w-full grid grid-cols-[1fr_180px_150px_180px_28px] items-center px-5 py-3.5 border-b border-hairline-soft last:border-b-0 hover:bg-subtle focus-within:bg-subtle text-left transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ClientAvatar name={c.name} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink truncate">{c.name}</span>
                    {anomalies > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-text" title={`${anomalies} anomalies flagged`}>
                        <AlertTriangle size={11} aria-hidden="true" />{anomalies}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-3 truncate">{c.collection}</div>
                </div>
              </div>
              <div className="text-sm text-ink-3 truncate">{am?.name}</div>
              <div>{c.tier ? <TierBadge tier={c.tier} withLabel /> : <span className="text-ink-3 font-mono text-xs">, </span>}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusPill status={status} />
              </div>
              <ChevronRight size={15} className="text-ghost group-hover:text-ink-3 transition-colors" aria-hidden="true" />
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-ink-3">
            No clients match “{query}”. Try a hotel name, collection, or account manager, or clear the search to see all {CLIENTS.length}.
          </div>
        )}
      </div>

      {/* Phase 2 teaser (spec §2.5) */}
      <button
        onClick={onPhase2}
        className="mt-6 w-full rounded-card border border-dashed border-hairline-strong bg-transparent px-5 py-4 flex items-center gap-3 text-left hover:bg-subtle transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Lock size={16} className="text-ink-3" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-ink">SAL Expands: From Reporting to Strategy</div>
          <div className="text-xs text-ink-3 mt-0.5">Phase 2: richer signal, deeper strategy, client self-serve. Preview what's next.</div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-dark flex-shrink-0">
          Preview <ArrowRight size={12} aria-hidden="true" />
        </span>
      </button>

      {activeClient && (
        <ClientDrawer
          client={activeClient}
          onClose={() => setActiveClient(null)}
          onOpenReport={onOpenReport}
          onOpenAskSal={onOpenAskSal}
          onToast={onToast}
        />
      )}
    </div>
  )
}

function fmtDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const SOURCE_CONDITION = {
  'csv-missing': 'CSV not received',
  'delegated-pending': 'pull in progress',
}

function ClientDrawer({ client, onClose, onOpenReport, onOpenAskSal, onToast }) {
  const am = managerForClient(client.id)
  const report = reportForClient(client.id, CURRENT_PERIOD)
  const sources = SOURCES.filter((s) => s.clientId === client.id)
  const { statusForClient, stateForClient } = useReports()
  const status = statusForClient(client.id, CURRENT_PERIOD) ?? (client.compliance === 'pending' ? 'pending' : 'drafting')
  const reportState = stateForClient(client.id, CURRENT_PERIOD)
  const [note, setNote] = useState(client.contextNote)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const saveNote = () => {
    // [SIM] persist to backend + inject into drafting context; here local + toast.
    onToast?.({ title: 'Context note saved', body: 'SAL uses it on the next draft.' })
  }

  const isCompliancePending = client.compliance === 'pending'
  const isDelivered = status === 'delivered'

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${client.name} detail`}>
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} aria-hidden="true" />
      <div className="absolute right-0 top-0 bottom-0 w-[440px] bg-card border-l border-hairline overflow-y-auto animate-slide-up">
        <header className="sticky top-0 bg-card border-b border-hairline px-6 py-4 flex items-start justify-between gap-3 z-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-medium tracking-tight text-ink truncate">{client.name}</h2>
              <TierBadge tier={client.tier} />
            </div>
            <p className="text-xs text-ink-3 mt-0.5 truncate">{client.collection} · AM: {am?.name}</p>
          </div>
          <button onClick={onClose} className="text-ghost hover:text-ink-2" aria-label="Close"><X size={18} aria-hidden="true" /></button>
        </header>

        <div className="p-6 space-y-8">
          {/* 1. This-month report (spec §2.4, report first) */}
          <section>
            <h3 className="eyebrow mb-2">This-month report</h3>
            {isCompliancePending ? (
              <div className="rounded-card border border-amber-border bg-amber-bg p-4">
                <div className="flex items-center gap-2 mb-1.5"><StatusPill status="pending" /></div>
                <p className="text-sm text-amber-text leading-relaxed">{client.contextNote}</p>
              </div>
            ) : report ? (
              <div className="card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2"><StatusPill status={status} /><span className="text-xs font-mono text-ink-3">{report.period}</span></div>
                  <button onClick={() => { onOpenReport(report.id); onClose() }} className="btn-primary text-xs px-3 py-1.5">
                    Open in Approvals
                  </button>
                </div>
                {isDelivered && reportState?.signedOff && (
                  <p className="text-[11px] text-ink-3 mt-2.5 font-mono">
                    Signed off by {reportState.signedOff.by} · {fmtDate(reportState.signedOff.at)} · sent to {am?.name}
                  </p>
                )}
                <p className="text-xs text-ink-2 mt-2 leading-relaxed">{report.sectionsSummary}</p>
              </div>
            ) : (
              <p className="text-sm text-ink-3">No report drafted yet for this cycle.</p>
            )}
          </section>

          {/* 2. Connected sources (Genome) */}
          <section>
            <h3 className="eyebrow mb-2">Connected sources</h3>
            {sources.length === 0 ? (
              <p className="text-sm text-ink-3">No sources are connected for {client.name} yet. Connect a platform to let SAL draft from live data.</p>
            ) : (
              <div className="space-y-1">
                {sources.map((s) => {
                  const platform = getPlatform(s.platformId)
                  const late = s.status === 'csv-missing' || s.status === 'delegated-pending'
                  const condition = SOURCE_CONDITION[s.status]
                  return (
                    <div key={s.platformId + s.clientId} className="flex items-center justify-between text-sm border-b border-hairline-soft py-1.5 last:border-b-0">
                      <span className="text-ink-2">{platform?.name || s.platformId}</span>
                      <div className="flex items-center gap-2">
                        <TierBadge tier={s.tier} />
                        {late ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-text">
                            <AlertTriangle size={10} aria-hidden="true" /> {condition}
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-ink-3">as of {fmtDate(s.dataAsOf)}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* 3. Baselines */}
          <section>
            <h3 className="eyebrow mb-2">Baselines · trailing 6 months</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <BaselineCard label="ROAS" value={`${client.baseline.roas.toFixed(1)}x`} series={[client.baseline.roas * 1.05, client.baseline.roas * 1.02, client.baseline.roas * 0.99, client.baseline.roas * 1.04, client.baseline.roas * 0.97, client.baseline.roas]} />
              <BaselineCard label="RevPAR" value={`$${client.baseline.revpar}`} series={[client.baseline.revpar * 0.96, client.baseline.revpar * 0.98, client.baseline.revpar * 1.01, client.baseline.revpar * 0.99, client.baseline.revpar * 1.02, client.baseline.revpar]} />
              <BaselineCard label="Occupancy" value={`${Math.round(client.baseline.occupancy * 100)}%`} series={[client.baseline.occupancy * 0.97, client.baseline.occupancy * 1.01, client.baseline.occupancy * 0.99, client.baseline.occupancy * 1.02, client.baseline.occupancy * 0.98, client.baseline.occupancy]} />
            </div>
          </section>

          {/* 4. Context note */}
          <section>
            <h3 className="eyebrow mb-2">Context note</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add context SAL should weigh, seasonality, account priorities, things to watch"
              aria-label="Context note for SAL"
              className="input w-full"
            />
            <p className="text-[11px] text-ink-3 mt-1.5">SAL reads this before drafting.</p>
            <button onClick={saveNote} className="btn-secondary mt-2 text-xs px-3 py-1.5">Save Note</button>
          </section>

          <button onClick={() => { onOpenAskSal(client.id); onClose() }} className="btn-secondary w-full">
            Ask SAL about {client.name} →
          </button>
        </div>
      </div>
    </div>
  )
}

function BaselineCard({ label, value, series }) {
  return (
    <div className="rounded-lg border border-hairline bg-subtle p-3">
      <div className="text-[11px] font-mono text-ink-3">{label}</div>
      <div className="text-base font-serif font-medium text-ink mt-0.5">{value}</div>
      <div className="mt-1.5"><Sparkline series={series} width={96} height={24} stroke="#665F55" /></div>
    </div>
  )
}
