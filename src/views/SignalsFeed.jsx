import { useMemo, useState } from 'react'
import { AlertTriangle, Lightbulb, FileX, TrendingUp } from 'lucide-react'
import { SIGNALS } from '../data/signals'
import { CLIENTS, getClient } from '../data/clients'
import { PLATFORMS, getPlatform } from '../data/sources'
import ClientAvatar from '../components/ClientAvatar'

const KIND_META = {
  anomaly:        { label: 'Anomaly',        icon: AlertTriangle, flagged: true },
  recommendation: { label: 'Recommendation', icon: Lightbulb,     flagged: false },
  'missing-data': { label: 'Missing data',   icon: FileX,         flagged: true },
  'mom-jump':     { label: 'MoM jump',       icon: TrendingUp,    flagged: false },
}

export default function SignalsFeed({ onOpenAskSal, onOpenClient }) {
  const [clientFilter, setClientFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [kindFilter, setKindFilter] = useState('')

  const filtered = useMemo(() => {
    return SIGNALS
      .filter((s) => !clientFilter || s.clientId === clientFilter)
      .filter((s) => !platformFilter || s.platformId === platformFilter)
      .filter((s) => !kindFilter || s.kind === kindFilter)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
  }, [clientFilter, platformFilter, kindFilter])

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="eyebrow">Signals</p>
        <h1 className="text-2xl font-serif font-semibold text-ink mt-1">Signals Feed</h1>
        <p className="text-sm text-ink-3 mt-1">Chronological stream of every change SAL detected.</p>
      </header>

      <div className="card p-3 mb-6 flex items-center gap-3 flex-wrap">
        <Filter label="Client" value={clientFilter} onChange={setClientFilter} options={[['', 'All clients'], ...CLIENTS.map((c) => [c.id, c.name])]} />
        <Filter label="Platform" value={platformFilter} onChange={setPlatformFilter} options={[['', 'All platforms'], ...Object.values(PLATFORMS).map((p) => [p.id, p.name])]} />
        <Filter label="Event" value={kindFilter} onChange={setKindFilter} options={[['', 'All events'], ...Object.entries(KIND_META).map(([k, m]) => [k, m.label])]} />
        <div className="ml-auto font-mono text-xs text-ghost">{filtered.length} of {SIGNALS.length} events</div>
      </div>

      <div className="card divide-y divide-hairline-soft">
        {filtered.map((s) => {
          const meta = KIND_META[s.kind] || KIND_META.anomaly
          const Icon = meta.icon
          const client = getClient(s.clientId)
          const platform = getPlatform(s.platformId)
          return (
            <div key={s.id} className="px-5 py-4 flex items-start gap-4 hover:bg-muted transition-colors">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted border border-hairline flex items-center justify-center">
                <Icon size={16} className={meta.flagged ? 'text-amber' : 'text-accent-dark'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="eyebrow">{meta.label}</span>
                  {meta.flagged && (
                    <span className="pill pill-sm pill-warning"><AlertTriangle size={11} /> Flagged</span>
                  )}
                  <span className="font-mono text-xs text-ghost">{fmtAbs(s.occurredAt)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <ClientAvatar name={client.name} size={22} />
                  <span className="text-sm font-semibold text-ink">{client.name}</span>
                  <span className="text-xs text-ink-3">· {platform?.name}</span>
                </div>
                <p className="text-sm text-ink-2 mt-1.5 leading-relaxed">{s.narrative}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <button onClick={() => onOpenClient(s.clientId)} className="text-xs text-ink-2 hover:text-accent-dark font-medium">Open client</button>
                <button onClick={() => onOpenAskSal(s.clientId)} className="text-xs text-ink-3 hover:text-accent-dark">Ask SAL</button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-sm text-ink-3">No signals match these filters.</div>}
      </div>
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
