import { useState } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle2, Clock, Plus } from 'lucide-react'
import { CLIENTS } from '../data/clients'
import { SOURCES, PLATFORMS, BULK_SYNC } from '../data/sources'
import { useReports } from '../state/reportsStore'
import TierBadge from '../components/TierBadge'
import StatusPill from '../components/StatusPill'
import ClientAvatar from '../components/ClientAvatar'

const PLATFORM_LIST = Object.values(PLATFORMS)

export default function DataSources({ onToast }) {
  const { inScope } = useReports()
  const scopedClients = CLIENTS.filter((c) => inScope(c.id))
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(BULK_SYNC.lastCompletedAt)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setLastSync(new Date().toISOString())
      onToast({ title: 'Bulk sync complete', body: `${BULK_SYNC.connected} sources refreshed. ${BULK_SYNC.csvMissing} still awaiting CSV delivery.` })
    }, 1800)
  }

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">The Genome</div>
          <h1 className="text-2xl font-serif font-semibold text-ink mt-1">Genome</h1>
          <p className="text-sm text-ink-3 mt-1">The centralized data layer SAL draws from, every client's connections, sync status, and access tier.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="eyebrow">Last bulk sync</div>
            <div className="text-sm font-mono text-ink mt-1">{fmtRelative(lastSync)}</div>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Sync Sources'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Counter icon={<CheckCircle2 size={14} className="text-accent-dark" />} label="Connected" value={BULK_SYNC.connected} />
        <Counter icon={<Clock size={14} className="text-ink-3" />} label="Delegated pending" value={BULK_SYNC.delegatedPending} />
        <Counter icon={<AlertTriangle size={14} className="text-amber" />} label="CSV manual" value={BULK_SYNC.csvManual} />
        <Counter icon={<AlertTriangle size={14} className="text-amber" />} label="CSV missing" value={BULK_SYNC.csvMissing} />
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide font-semibold text-ink-3 bg-subtle">
              <th className="px-5 py-3 sticky left-0 bg-subtle z-10">Client</th>
              <th className="px-3 py-3">Compliance</th>
              {PLATFORM_LIST.map((p) => <th key={p.id} className="px-3 py-3 text-center">{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {scopedClients.map((c) => (
              <tr key={c.id} className="border-t border-hairline-soft hover:bg-subtle">
                <td className="px-5 py-3 sticky left-0 bg-card">
                  <div className="flex items-center gap-2.5">
                    <ClientAvatar name={c.name} size={26} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink truncate max-w-[160px]">{c.name}</div>
                      <div className="mt-0.5"><TierBadge tier={c.tier} /></div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {c.compliance === 'cleared' ? (
                    <span className="pill pill-sm pill-done">Cleared</span>
                  ) : (
                    <StatusPill status="pending" />
                  )}
                </td>
                {PLATFORM_LIST.map((p) => {
                  const s = SOURCES.find((x) => x.clientId === c.id && x.platformId === p.id)
                  return (
                    <td key={p.id} className="px-3 py-3 text-center">
                      {s ? <SourceCell source={s} /> : <span className="text-xs text-ghost">·</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-ink-3 mt-3">
        SAL never delivers a report from a contract-pending client without an explicit AM override. CSV-missing sources are excluded from the cycle with a flagged note.
      </p>
    </div>
  )
}

function SourceCell({ source }) {
  const map = {
    'connected':         { icon: <CheckCircle2 size={14} className="text-accent-dark" />, label: 'OK' },
    'delegated-pending': { icon: <Clock size={14} className="text-ink-3" />, label: 'Pending' },
    'csv-manual':        { icon: <CheckCircle2 size={14} className="text-amber" />, label: 'CSV' },
    'csv-missing':       { icon: <AlertTriangle size={14} className="text-amber" />, label: 'Missing' },
    'disconnected':      { icon: <AlertTriangle size={14} className="text-amber" />, label: 'Off' },
    'available':         { icon: <Plus size={14} className="text-accent-dark" />, label: 'Connect' },
  }
  const m = map[source.status] ?? { icon: null, label: source.status }
  return (
    <div className="inline-flex flex-col items-center gap-0.5" title={source.missingNote || `${source.status} · ${source.dataAsOf || 'n/a'}`}>
      {m.icon}
      <span className="text-[10px] text-ink-3">{m.label}</span>
      {source.dataAsOf && <span className="text-[9px] font-mono text-ghost">{fmtRelative(source.dataAsOf, true)}</span>}
    </div>
  )
}

function Counter({ icon, label, value }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">{icon}<span className="eyebrow">{label}</span></div>
      <div className="text-2xl font-serif font-semibold text-ink mt-1.5">{value}</div>
    </div>
  )
}

function fmtRelative(iso, short = false) {
  if (!iso) return 'never'
  const ts = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - ts)
  const h = Math.floor(diff / 3600000)
  if (h < 24) return short ? `${h}h ago` : `${h} hours ago`
  const d = Math.floor(h / 24)
  return short ? `${d}d ago` : `${d} days ago`
}
