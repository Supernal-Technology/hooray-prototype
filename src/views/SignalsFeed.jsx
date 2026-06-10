import { useMemo, useState } from 'react'
import { AlertTriangle, FileX, ShieldAlert } from 'lucide-react'
import { SIGNALS } from '../data/signals'
import { CLIENTS, getClient } from '../data/clients'
import { PLATFORMS, getPlatform } from '../data/sources'
import { useReports } from '../state/reportsStore'
import ClientAvatar from '../components/ClientAvatar'

const KIND_META = {
  anomaly:        { label: 'Baseline anomaly', icon: AlertTriangle, tone: 'warning' },
  'missing-data': { label: 'Missing data',     icon: FileX,         tone: 'warning' },
}

export default function SignalsFeed({ onOpenAskSal, onOpenClient }) {
  const [clientFilter, setClientFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [kindFilter, setKindFilter] = useState('')
  const { inScope } = useReports()

  const scopedSignals = useMemo(() => SIGNALS.filter((s) => ['anomaly', 'missing-data'].includes(s.kind) && inScope(s.clientId)), [inScope])
  const scopedClients = useMemo(() => CLIENTS.filter((c) => inScope(c.id)), [inScope])

  const filtered = useMemo(() => {
    return scopedSignals
      .filter((s) => !clientFilter || s.clientId === clientFilter)
      .filter((s) => !platformFilter || s.platformId === platformFilter)
      .filter((s) => !kindFilter || s.kind === kindFilter)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
  }, [clientFilter, platformFilter, kindFilter, scopedSignals])

  const anomalyCount = scopedSignals.filter((s) => s.kind === 'anomaly').length
  const missingCount = scopedSignals.filter((s) => s.kind === 'missing-data').length
  const highPriorityCount = scopedSignals.filter((s) => s.severity === 'high').length

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="eyebrow">Exceptions</p>
        <h1 className="text-2xl font-serif font-semibold text-ink mt-1">Data Watchlist</h1>
        <p className="text-sm text-ink-3 mt-1">Baseline breaks, missing inputs, and operational items that need AM attention.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <WatchStat label="Anomalies" value={anomalyCount} detail="Metrics outside expected range" />
        <WatchStat label="Missing Inputs" value={missingCount} detail="Sources excluded or waiting on files" />
        <WatchStat label="High Priority" value={highPriorityCount} detail="Needs review before report delivery" />
      </div>

      <div className="card p-3 mb-6 flex items-center gap-3 flex-wrap">
        <Filter label="Client" value={clientFilter} onChange={setClientFilter} options={[['', 'All clients'], ...scopedClients.map((c) => [c.id, c.name])]} />
        <Filter label="Platform" value={platformFilter} onChange={setPlatformFilter} options={[['', 'All platforms'], ...Object.values(PLATFORMS).map((p) => [p.id, p.name])]} />
        <Filter label="Issue" value={kindFilter} onChange={setKindFilter} options={[['', 'All issues'], ...Object.entries(KIND_META).map(([k, m]) => [k, m.label])]} />
        <div className="ml-auto font-mono text-xs text-ghost">{filtered.length} of {scopedSignals.length} issues</div>
      </div>

      <div className="card divide-y divide-hairline-soft">
        {filtered.map((s) => {
          const meta = KIND_META[s.kind] || KIND_META.anomaly
          const Icon = meta.icon
          const client = getClient(s.clientId)
          const platform = getPlatform(s.platformId)
          return (
            <div key={s.id} className="px-5 py-4 flex items-start gap-4 hover:bg-muted transition-colors">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-bg border border-amber-border flex items-center justify-center">
                <Icon size={16} className="text-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="eyebrow">{meta.label}</span>
                  <span className="pill pill-sm pill-warning"><AlertTriangle size={11} /> Needs attention</span>
                  <SeverityChip severity={s.severity} />
                  <span className="font-mono text-xs text-ghost">{fmtAbs(s.occurredAt)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <ClientAvatar name={client.name} size={22} />
                  <span className="text-sm font-semibold text-ink">{client.name}</span>
                  <span className="text-xs text-ink-3">· {platform?.name}</span>
                </div>
                <p className="text-sm text-ink-2 mt-1.5 leading-relaxed">{s.narrative}</p>
                <div className="mt-2 rounded-lg border border-hairline bg-muted px-3 py-2">
                  <div className="eyebrow mb-0.5">Resolution Path</div>
                  <div className="text-sm text-ink-2">{s.suggestedAction}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <button onClick={() => onOpenClient(s.clientId)} className="text-xs text-ink-2 hover:text-accent-dark font-medium">Open client</button>
                <button onClick={() => onOpenAskSal(s.clientId)} className="text-xs text-ink-3 hover:text-accent-dark">Ask SAL</button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-sm text-ink-3">No watchlist items match these filters.</div>}
      </div>
    </div>
  )
}

function WatchStat({ label, value, detail }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-amber-text mb-3">
        <ShieldAlert size={15} aria-hidden="true" />
        <span className="eyebrow">Watchlist</span>
      </div>
      <div className="text-2xl font-serif font-semibold text-ink">{value}</div>
      <div className="text-sm font-semibold text-ink mt-1">{label}</div>
      <p className="text-xs text-ink-3 mt-1 leading-relaxed">{detail}</p>
    </div>
  )
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="text-xs text-ink-2 inline-flex items-center gap-1.5">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input text-xs py-1 px-2 w-auto"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
}

function fmtAbs(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function SeverityChip({ severity }) {
  if (severity === 'high') return <span className="pill pill-sm pill-warning">High</span>
  if (severity === 'medium') return <span className="pill pill-sm pill-neutral">Medium</span>
  return <span className="pill pill-sm pill-neutral">Low</span>
}
