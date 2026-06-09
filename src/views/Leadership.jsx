import { useState } from 'react'
import { Clock, FileCheck2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { LEADERSHIP, LEADERSHIP_ROLES } from '../data/leadership'
import { CLIENTS, getAM } from '../data/clients'
import { REPORTS } from '../data/reports'
import { CURRENT_PERIOD } from '../data/performance'
import KPI from '../components/KPI'
import Sparkline from '../components/Sparkline'
import StatusPill from '../components/StatusPill'
import TierBadge from '../components/TierBadge'
import ClientAvatar from '../components/ClientAvatar'

export default function Leadership({ role }) {
  const [showMethod, setShowMethod] = useState(false)
  const hero = LEADERSHIP.equivalentHumanHours

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="eyebrow">Leadership view · viewing as {role?.name} ({role?.title})</p>
        <h1 className="text-2xl font-serif font-medium tracking-tight text-ink mt-1">SAL's impact</h1>
      </header>

      <section className="card p-6 mb-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="eyebrow">Equivalent human hours recovered</div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-[40px] leading-none font-medium tracking-tight text-ink font-serif">{hero.mtd}</span>
              <span className="text-sm font-semibold text-accent-dark">{hero.delta}</span>
              <span className="text-sm text-ink-3">MTD</span>
            </div>
            <p className="text-xs text-ink-2 mt-3 max-w-md">6-month trend. Equivalent to ~{Math.round(hero.mtd / 8)} working days returned to the account team this month.</p>
          </div>
          <div className="flex flex-col items-end">
            <Sparkline series={hero.trailing6} width={260} height={64} />
            <div className="text-[11px] font-mono text-ink-3 mt-1">Dec 25 → May 26</div>
          </div>
        </div>
        <button
          onClick={() => setShowMethod((v) => !v)}
          className="mt-4 text-xs text-ink-2 hover:text-accent-dark inline-flex items-center gap-1 font-medium"
        >
          {showMethod ? <ChevronUp size={12} /> : <ChevronDown size={12} />} How it's measured
        </button>
        {showMethod && (
          <p className="text-xs text-ink-2 mt-2 leading-relaxed border-t border-hairline pt-3 max-w-3xl">
            {hero.methodNote}
          </p>
        )}
      </section>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KPI label="On-time delivery" value={`${Math.round(LEADERSHIP.reporting.onTimePct.value * 100)}%`} delta="+2pp" deltaSub="6-mo trailing 90%" />
        <KPI label="Reports shipped (MTD)" value={String(LEADERSHIP.reporting.reportsShipped.mtd)} delta="+0" deltaSub="vs cycle target 9" />
        <KPI label="Anomalies caught (MTD)" value={String(LEADERSHIP.reporting.anomaliesCaught.mtd)} delta="+2" deltaSub="vs prior cycle 12" />
      </div>

      <section className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-hairline">
          <p className="eyebrow">Portfolio health</p>
          <p className="text-xs text-ink-3 mt-1">One row per client. This is the leadership-level rollup.</p>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left eyebrow bg-muted">
            <tr>
              <th className="px-5 py-2.5">Client</th>
              <th className="px-3 py-2.5">AM</th>
              <th className="px-3 py-2.5">Access</th>
              <th className="px-3 py-2.5">This month</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => {
              const am = getAM(c.amId)
              const report = REPORTS.find((r) => r.clientId === c.id && r.period === CURRENT_PERIOD)
              return (
                <tr key={c.id} className="border-t border-hairline-soft">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <ClientAvatar name={c.name} size={26} />
                      <div>
                        <div className="text-sm font-semibold text-ink">{c.name}</div>
                        <div className="text-[11px] text-ink-3">{c.collection}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-ink-2">{am?.name}</td>
                  <td className="px-3 py-3"><TierBadge tier={c.tier} withLabel /></td>
                  <td className="px-3 py-3">
                    {report ? <StatusPill status={report.status} /> : c.compliance === 'pending' ? <StatusPill status="pending" /> : <StatusPill status="drafting" />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export function pickRole(id) {
  return LEADERSHIP_ROLES.find((r) => r.id === id) || LEADERSHIP_ROLES[0]
}
