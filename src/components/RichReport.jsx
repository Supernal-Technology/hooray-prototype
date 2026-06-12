import { useState } from 'react'
import { CheckCircle2, MessageCircle, Sparkles, ArrowUpRight } from 'lucide-react'
import Chart from './Chart'

// Shared rich monthly-report renderer, used by BOTH the client portal (ClientView)
// and the AM review queue (ReportApprovals) so the two stay identical. Driven by a
// report's `sections` data; the AM view layers its sign-off controls on top.

// Deck chapters, mirrored in the report tab bar (Creatives/assets intentionally omitted).
export const CHAPTER_OF = {
  summary: '01 · Plan', planning: '01 · Plan',
  website: '02 · Performance', paid: '02 · Performance', social: '02 · Performance', display: '02 · Performance', media: '02 · Performance',
}

export function ReportTabBar({ sections, tabId, setTabId, className = '' }) {
  return (
    <div className={`flex items-end gap-1 -mb-px overflow-x-auto border-b border-hairline ${className}`}>
      {sections.map((s) => (
        <button key={s.id} onClick={() => setTabId(s.id)} className={`px-3.5 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${s.id === tabId ? 'border-accent-dark text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}>{s.label}</button>
      ))}
    </div>
  )
}

export function KpiTile({ label, value, delta, good }) {
  return (
    <div className="card p-4">
      <p className="eyebrow leading-tight">{label}</p>
      <div className="mt-2 font-serif font-medium text-ink text-[26px] leading-none tracking-tight">{value}</div>
      {delta && <p className={`text-[11px] mt-1.5 font-medium ${good ? 'text-accent-dark' : 'text-amber-text'}`}>{delta}</p>}
    </div>
  )
}

export function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((m) => <KpiTile key={m.label} {...m} />)}
    </div>
  )
}

export function DataTable({ table }) {
  const al = (a) => (a === 'right' ? 'text-right' : 'text-left')
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-subtle text-[11px] uppercase tracking-wide font-semibold text-ink-3">
            {table.columns.map((c) => <th key={c.key} className={`px-4 py-2.5 ${al(c.align)}`}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i} className="border-t border-hairline-soft">
              {table.columns.map((c, j) => (
                <td key={c.key} className={`px-4 py-2.5 ${al(c.align)} ${j === 0 ? 'font-medium text-ink' : 'text-ink-3 font-mono text-[13px]'}`}>{r[c.key]}</td>
              ))}
            </tr>
          ))}
          {table.total && (
            <tr className="border-t border-hairline bg-subtle/50">
              {table.columns.map((c, j) => (
                <td key={c.key} className={`px-4 py-2.5 ${al(c.align)} font-semibold ${j === 0 ? 'text-ink' : 'text-ink-2 font-mono text-[13px]'}`}>{table.total[c.key]}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function RoadmapBoard({ roadmap, salFocus }) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {roadmap.map((col) => (
          <div key={col.window} className="card p-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-medium text-ink text-lg leading-none">{col.window.split(' ')[0]}</span>
              <span className="eyebrow">days</span>
            </div>
            <div className="h-px bg-hairline-soft my-3" aria-hidden="true" />
            <ul className="space-y-2.5">
              {col.items.map((it, j) => (
                <li key={j}>
                  <div className="text-sm font-medium text-ink leading-snug">{it.title}</div>
                  <span className="mt-1 inline-block text-[10px] font-mono uppercase tracking-wide text-ink-3 rounded-full border border-hairline px-2 py-0.5">{it.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {salFocus?.length > 0 && (
        <div className="rounded-card border border-accent bg-accent-pale p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-accent-dark" aria-hidden="true" />
            <span className="eyebrow">Where SAL recommends focusing</span>
          </div>
          <ul className="space-y-1.5">
            {salFocus.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-2 leading-relaxed">
                <ArrowUpRight size={14} className="text-accent-dark mt-0.5 flex-shrink-0" aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function PeriodBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${active ? 'bg-accent-dark text-cream' : 'text-ink-3 hover:text-ink'}`}>{children}</button>
  )
}

export function SectionView({ section, period: reportPeriod, onAskAbout, footer }) {
  const [period, setPeriod] = useState('month')
  const hasYtd = !!section.ytd
  const view = (period === 'ytd' && section.ytd ? section.ytd : section.month) || {}
  const isSummary = section.id === 'summary'

  return (
    <article className="space-y-7">
      <header>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="eyebrow">{section.eyebrow}</div>
            <h2 className="text-2xl font-serif font-medium tracking-tight text-ink mt-1.5">{section.label}</h2>
          </div>
          {hasYtd && (
            <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5 mt-1">
              <PeriodBtn active={period === 'month'} onClick={() => setPeriod('month')}>This month</PeriodBtn>
              <PeriodBtn active={period === 'ytd'} onClick={() => setPeriod('ytd')}>Year to date</PeriodBtn>
            </div>
          )}
        </div>
        <div className="h-1 w-14 rounded-full bg-accent mt-3" aria-hidden="true" />
        <p className="text-lg font-serif text-ink-2 leading-relaxed mt-4 max-w-prose">{section.lede}</p>
        {section.budget && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-3">
            <span><span className="text-ink-2 font-medium">Budget</span> {section.budget.gross} gross · {section.budget.net} net</span>
            <span><span className="text-ink-2 font-medium">Campaigns</span> {section.budget.campaigns}</span>
          </div>
        )}
      </header>

      {/* 30-60-90 roadmap (planning section) */}
      {section.roadmap && <RoadmapBoard roadmap={section.roadmap} salFocus={section.salFocus} />}

      {/* Key takeaways, the "what it means", front and center */}
      {section.takeaways?.length > 0 && (
      <section>
        <h3 className="eyebrow mb-2">Key takeaways</h3>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {section.takeaways.map((t, i) => (
            <div key={i} className="rounded-card border border-hairline bg-card p-3.5">
              <div className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1">
                <CheckCircle2 size={14} className="text-accent-dark flex-shrink-0" aria-hidden="true" /> {t.title}
              </div>
              <p className="text-[13px] text-ink-2 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>
      )}

      {isSummary && section.recommendation && (
        <section className="rounded-card border border-accent bg-accent-pale p-4">
          <div className="eyebrow mb-1">What we recommend</div>
          <p className="text-sm text-ink-2 leading-relaxed">{section.recommendation}</p>
        </section>
      )}

      {/* The numbers */}
      {view.kpis && (
        <section>
          <h3 className="eyebrow mb-3">The numbers{hasYtd ? ` · ${period === 'ytd' ? 'year to date' : reportPeriod}` : ''} <span className="text-ghost font-normal normal-case tracking-normal">· vs last year</span></h3>
          <KpiGrid kpis={view.kpis} />
        </section>
      )}

      {/* Charts */}
      {view.charts?.length > 0 && (
        <section className={`grid ${view.charts.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
          {view.charts.map((c, i) => (
            <div key={i} className="rounded-card border border-hairline bg-card p-4">
              <div className="eyebrow mb-2.5">{c.title}</div>
              <Chart spec={c.spec} />
            </div>
          ))}
        </section>
      )}

      {/* Table */}
      {view.table && (
        <section>
          <h3 className="eyebrow mb-2">{view.table.title}</h3>
          <DataTable table={view.table} />
        </section>
      )}

      {/* Campaign breakdown (social) */}
      {view.campaigns?.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2">Campaign breakdown</h3>
          <div className="space-y-1.5">
            {view.campaigns.map((c, i) => (
              <div key={i} className="rounded-lg border border-hairline bg-card px-3.5 py-2.5 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink">{c.name}</span>
                <span className="text-[11px] font-mono text-ink-3">{c.detail}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benchmarks */}
      {section.benchmarks?.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2">Benchmarks</h3>
          <ul className="text-[12px] text-ink-3 space-y-1">
            {section.benchmarks.map((b, i) => <li key={i} className="font-mono">· {b}</li>)}
          </ul>
        </section>
      )}

      <div className="border-t border-hairline pt-3 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[11px] text-ink-3">{footer || 'Prepared by SAL · reviewed and approved by your Hooray account director · simulated data.'}</p>
        {onAskAbout && (
          <button onClick={() => onAskAbout({ promptId: section.questions?.[0]?.id })} className="text-[11px] font-medium text-accent-dark hover:underline inline-flex items-center gap-1">
            <MessageCircle size={11} aria-hidden="true" /> Ask SAL about this section
          </button>
        )}
      </div>
    </article>
  )
}
