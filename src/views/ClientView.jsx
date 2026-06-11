import { useState, useRef } from 'react'
import { LayoutDashboard, FileText, History, ChevronDown, Hotel, CheckCircle2, ArrowRight, MessageCircle, Sparkles, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'
import { CLIENT_REPORT } from '../data/clientReport'
import Chart from '../components/Chart'
import ChatDock from '../components/ChatDock'

// CLIENT VIEW, the hero. The client opens their portal: a left nav (Dashboard /
// Reports / History) mirroring the AM shell, the active content in the middle,
// and the shared Ask SAL drawer docked right. The chat re-scopes per section.
// The Monthly Report faithfully mirrors Hooray's "Web & Media Overview" recap.
const R = CLIENT_REPORT

// Recap download. In the live product this renders the branded PDF; the prototype
// has no backend, so we simulate the generate-then-ready flow with a two-step toast.
function downloadRecap(onToast, period) {
  onToast?.({ title: 'Preparing your PDF', body: `Rendering the ${R.clientName} · ${period} recap.` })
  setTimeout(() => onToast?.({ title: `${period} recap ready`, body: 'PDF export is simulated in this prototype.' }), 1100)
}

const HISTORY_CHAT = {
  id: 'history', label: 'past reports',
  overview: { narrative: 'Your last six monthly recaps are here. Open any month, or ask me to compare periods.', numbers: [], sources: [] },
  questions: [
    { id: 'h-compare', label: 'How did May compare to April?', answer: { confidence: 'high', narrative: 'May revenue ($179.9K) came in below April ($197K) as the market softened, but rate held and blended RoAS stayed strong (5.1:1 vs 5.3:1). The story is consistent: protecting ADR over chasing volume.', numbers: [{ label: 'May vs April revenue', value: '-9%', delta: '' }], sources: [{ platform: 'GA4', tier: 1, dataAsOf: '2026-06-08T22:00Z' }] } },
    { id: 'h-best', label: 'Which month was strongest?', answer: { confidence: 'high', narrative: 'December 2025 led at $241K revenue on a 5.9:1 return, holiday demand. Among 2026 months, March was strongest at $214K.', numbers: [{ label: 'Best month', value: 'Dec 2025', delta: '$241K' }], sources: [{ platform: 'GA4', tier: 1, dataAsOf: '2026-06-08T22:00Z' }] } },
  ],
}
const DASH_CHAT = { id: 'dashboard', label: 'your live data', overview: R.dashboard.overview, questions: R.dashboard.questions }

export default function ClientView({ onToast }) {
  const [view, setView] = useState('report')
  const [tabId, setTabId] = useState('summary')
  const [askSignal, setAskSignal] = useState(null)
  const seq = useRef(0)

  const activeTab = R.sections.find((s) => s.id === tabId) || R.sections[0]
  const chatSection = view === 'report' ? activeTab : view === 'history' ? HISTORY_CHAT : DASH_CHAT
  const askAbout = (payload) => { seq.current += 1; setAskSignal({ seq: seq.current, ...payload }) }

  return (
    <div className="flex h-full min-h-0">
      <ClientNav view={view} setView={setView} />
      <main className="flex-1 min-w-[480px] overflow-auto">
        {view === 'dashboard' && <Dashboard onOpenReport={(tab) => { if (tab) setTabId(tab); setView('report') }} />}
        {view === 'report' && <MonthlyReport tabId={tabId} setTabId={setTabId} onToast={onToast} onAskAbout={askAbout} />}
        {view === 'history' && <ReportHistory onToast={onToast} />}
      </main>
      <ChatDock section={chatSection} askSignal={askSignal} />
    </div>
  )
}

/* ---------------- Left client nav ---------------- */
function ClientNav({ view, setView }) {
  return (
    <aside className="w-[210px] h-full bg-muted border-r border-hairline flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="px-5 py-5 border-b border-hairline-soft">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <Hotel size={18} className="text-accent-ink" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="font-serif font-semibold text-ink text-sm leading-tight truncate">{R.clientName}</div>
            <div className="text-[10px] text-ink-3 truncate">Client portal</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-5">
        <div><NavItem label="Dashboard" icon={<LayoutDashboard size={16} aria-hidden="true" />} active={view === 'dashboard'} onClick={() => setView('dashboard')} /></div>
        <div>
          <div className="px-5 mb-1 eyebrow">Reports</div>
          <NavItem label="Monthly Report" icon={<FileText size={16} aria-hidden="true" />} active={view === 'report'} onClick={() => setView('report')} />
          <NavItem label="History" icon={<History size={16} aria-hidden="true" />} active={view === 'history'} onClick={() => setView('history')} />
        </div>
      </nav>
      <div className="px-5 py-3 border-t border-hairline-soft">
        <p className="text-[10px] text-ghost font-mono">{R.property}</p>
      </div>
    </aside>
  )
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-colors duration-150 border-r-2 text-left ${active ? 'bg-accent/30 text-accent-ink border-r-accent-dark' : 'text-ink-3 border-r-transparent hover:bg-accent/10 hover:text-ink'}`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate flex-1">{label}</span>
    </button>
  )
}

/* ---------------- Shared bits ---------------- */
function KpiTile({ label, value, delta, good }) {
  return (
    <div className="card p-4">
      <p className="eyebrow leading-tight">{label}</p>
      <div className="mt-2 font-serif font-medium text-ink text-[26px] leading-none tracking-tight">{value}</div>
      {delta && <p className={`text-[11px] mt-1.5 font-medium ${good ? 'text-accent-dark' : 'text-amber-text'}`}>{delta}</p>}
    </div>
  )
}

function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((m) => <KpiTile key={m.label} {...m} />)}
    </div>
  )
}

function DataTable({ table }) {
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

/* ---------------- Dashboard (live) ---------------- */
function Dashboard({ onOpenReport }) {
  const D = R.dashboard
  return (
    <div className="animate-fade-up px-8 py-8 max-w-6xl mx-auto">
      <div className="eyebrow">{D.eyebrow}</div>
      <h1 className="text-3xl font-serif font-medium tracking-tight text-ink mt-1.5">Dashboard</h1>
      <p className="text-base font-serif text-ink-2 leading-relaxed mt-3 max-w-prose">{D.lede}</p>

      <div className="mt-6"><KpiGrid kpis={D.kpis} /></div>

      {/* SAL's read + what's driving it, side by side with the revenue mix */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-accent-dark" aria-hidden="true" />
            <span className="eyebrow">SAL's read · {R.period}</span>
          </div>
          <p className="mt-3 text-[17px] font-serif text-ink leading-relaxed">{D.headline.read}</p>
          <div className="mt-5 pt-4 border-t border-hairline-soft grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {D.drivers.map((d) => (
              <div key={d.label} className="flex items-start gap-2.5">
                {d.dir === 'up'
                  ? <ArrowUpRight size={15} className="text-accent-dark mt-0.5 flex-shrink-0" aria-hidden="true" />
                  : <ArrowDownRight size={15} className="text-amber-text mt-0.5 flex-shrink-0" aria-hidden="true" />}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink leading-tight">{d.label}</div>
                  <div className="text-[12px] text-ink-3 mt-0.5">{d.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <span className="eyebrow">{D.channelChart.title}</span>
          <div className="mt-3"><Chart spec={D.channelChart.spec} /></div>
        </div>
      </div>

      {/* The questions this month answers */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-accent-dark" aria-hidden="true" />
          <span className="eyebrow">The questions this month answers</span>
        </div>
        <div className="mt-3 card divide-y divide-hairline-soft overflow-hidden">
          {D.execQuestions.map((item, i) => <ExecQA key={i} item={item} defaultOpen={i === 0} onOpenReport={onOpenReport} />)}
        </div>
      </div>

      {/* Report ready strip */}
      <button onClick={() => onOpenReport()} className="mt-3 w-full text-left rounded-card border border-hairline bg-subtle hover:bg-muted transition-colors px-4 py-3.5 flex items-center gap-3 group">
        <CheckCircle2 size={17} className="text-accent-dark flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink">Your {R.period} recap is signed off and ready</div>
          <div className="text-[12px] text-ink-3 mt-0.5">The full Web &amp; media overview, with the why behind every number.</div>
        </div>
        <span className="text-sm font-medium text-accent-dark inline-flex items-center gap-1 flex-shrink-0">Open Monthly Report <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" /></span>
      </button>

      <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-3">
        <MessageCircle size={13} className="text-accent-dark flex-shrink-0" aria-hidden="true" />
        Ask SAL on the right for a live read on any of this.
      </div>
    </div>
  )
}

function ExecQA({ item, defaultOpen, onOpenReport }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-subtle/60 transition-colors">
        <span className="flex-1 text-[15px] font-serif text-ink leading-snug">{item.q}</span>
        {item.stat && <span className="hidden sm:inline text-[11px] font-mono text-ink-3 flex-shrink-0">{item.stat}</span>}
        <ChevronDown size={15} className={`text-ink-3 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 animate-fade-up">
          <p className="text-sm text-ink-2 leading-relaxed max-w-prose">{item.a}</p>
          {item.to && (
            <button onClick={() => onOpenReport(item.to)} className="mt-3 text-[12px] font-medium text-accent-dark inline-flex items-center gap-1 group">
              See it in the report <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------- Monthly Report ---------------- */
function MonthlyReport({ tabId, setTabId, onToast, onAskAbout }) {
  const section = R.sections.find((s) => s.id === tabId) || R.sections[0]
  return (
    <div className="animate-fade-up">
      <div className="px-8 py-4 border-b border-hairline-soft bg-page/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Monthly recap · Web &amp; media overview</div>
            <div className="text-sm font-medium text-ink mt-0.5">{R.clientName} · {R.period}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onToast?.({ title: `${R.period} is the loaded period`, body: 'Past periods live under History; switching is stubbed here.' })} className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5">
              {R.period} <ChevronDown size={13} aria-hidden="true" />
            </button>
            <button onClick={() => downloadRecap(onToast, R.period)} className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5">
              <Download size={13} aria-hidden="true" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 pt-5 border-b border-hairline sticky top-[61px] bg-page z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-1 -mb-px overflow-x-auto">
          {R.sections.map((s) => (
            <button key={s.id} onClick={() => setTabId(s.id)} className={`px-3.5 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${s.id === tabId ? 'border-accent-dark text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <SectionView key={tabId} section={section} onAskAbout={onAskAbout} />
        </div>
      </div>
    </div>
  )
}

function SectionView({ section, onAskAbout }) {
  const [period, setPeriod] = useState('month')
  const hasYtd = !!section.ytd
  const view = period === 'ytd' && section.ytd ? section.ytd : section.month
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

      {/* Key takeaways, the "what it means", front and center */}
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

      {isSummary && section.recommendation && (
        <section className="rounded-card border border-accent bg-accent-pale p-4">
          <div className="eyebrow mb-1">What we recommend</div>
          <p className="text-sm text-ink-2 leading-relaxed">{section.recommendation}</p>
        </section>
      )}

      {/* The numbers */}
      {view.kpis && (
        <section>
          <h3 className="eyebrow mb-3">The numbers{hasYtd ? ` · ${period === 'ytd' ? 'year to date' : R.period}` : ''} <span className="text-ghost font-normal normal-case tracking-normal">· vs last year</span></h3>
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
        <p className="text-[11px] text-ink-3">Prepared by SAL · reviewed and approved by your Hooray account director · simulated data.</p>
        {onAskAbout && (
          <button onClick={() => onAskAbout({ promptId: section.questions?.[0]?.id })} className="text-[11px] font-medium text-accent-dark hover:underline inline-flex items-center gap-1">
            <MessageCircle size={11} aria-hidden="true" /> Ask SAL about this section
          </button>
        )}
      </div>
    </article>
  )
}

function PeriodBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${active ? 'bg-accent-dark text-cream' : 'text-ink-3 hover:text-ink'}`}>{children}</button>
  )
}

/* ---------------- History ---------------- */
function ReportHistory({ onToast }) {
  return (
    <div className="animate-fade-up px-8 py-8 max-w-4xl mx-auto">
      <div className="eyebrow">Archive</div>
      <h1 className="text-3xl font-serif font-medium tracking-tight text-ink mt-1.5">History</h1>
      <p className="text-sm text-ink-3 mt-1">Your past monthly recaps. Open one, or ask SAL to compare periods.</p>
      <div className="card overflow-hidden mt-6">
        <div className="grid grid-cols-[1fr_120px_120px_150px] px-5 py-3 border-b border-hairline-soft bg-subtle text-[11px] uppercase tracking-wide font-semibold text-ink-3">
          <span>Period</span><span>Revenue</span><span>Blended RoAS</span><span></span>
        </div>
        {R.history.map((h) => (
          <div key={h.period} className="grid grid-cols-[1fr_120px_120px_150px] items-center px-5 py-3.5 border-b border-hairline-soft last:border-b-0 hover:bg-subtle transition-colors">
            <div>
              <div className="text-sm font-medium text-ink">{h.label}</div>
              <div className="text-[11px] text-ink-3 mt-0.5"><span className="pill pill-sm pill-done"><CheckCircle2 size={11} strokeWidth={2.5} /> Delivered</span></div>
            </div>
            <div className="text-sm text-ink-2 font-mono">{h.revenue}</div>
            <div className="text-sm text-ink-2 font-mono">{h.roas}</div>
            <div className="flex items-center gap-3 justify-self-end">
              <button onClick={() => downloadRecap(onToast, h.label)} className="text-ink-3 hover:text-ink transition-colors" title={`Download ${h.label} PDF`} aria-label={`Download ${h.label} PDF`}>
                <Download size={15} aria-hidden="true" />
              </button>
              <button onClick={() => onToast?.({ title: `${h.label} recap`, body: 'Historical recaps are stubbed in this prototype.' })} className="text-xs font-semibold text-accent-dark hover:underline inline-flex items-center gap-1">
                View <ArrowRight size={12} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
