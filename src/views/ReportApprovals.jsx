import { useState, useEffect, useMemo } from 'react'
import { CheckCircle2, MessageCircle, Edit3, AlertTriangle, Save, Bell, Mail } from 'lucide-react'
import { REPORTS, getReport } from '../data/reports'
import { SIGNALS } from '../data/signals'
import { getClient } from '../data/clients'
import { getPlatform, sourcesForClient } from '../data/sources'
import { useReports } from '../state/reportsStore'
import StatusPill from '../components/StatusPill'
import TierBadge from '../components/TierBadge'
import ClientAvatar from '../components/ClientAvatar'
import { CLIENT_REPORT } from '../data/clientReport'
import { SectionView, ReportTabBar } from '../components/RichReport'

// The rich monthly report the AM reviews is the same one the client sees. We have
// one fully-built recap (South Coast Winery); the AM view renders it under the
// selected client's name. [SIM] per-client report data is future work.
const RICH = CLIENT_REPORT

const getSignal = (id) => SIGNALS.find((s) => s.id === id)

function anomalyCount(report) {
  if (!report) return 0
  const plat = report.platforms?.reduce((n, p) => n + (p.anomalies?.length || 0), 0) || 0
  const kpi = report.overview?.kpis?.filter((k) => k.anomaly).length || 0
  return plat + kpi
}

function reportKind(report, state, client) {
  if (client.compliance === 'pending') return 'excluded'
  if (report.missingData?.length > 0) return 'excluded'
  if (state.status === 'drafting' || state.revisionInFlight) return 'drafting'
  return 'report'
}

export default function ReportApprovals({ initialReportId, onOpenAskSal, onToast }) {
  const { states, getState, signOff, sendBack, saveEdits, inScope } = useReports()

  // Only reports for accounts this person manages.
  const scopedReports = useMemo(() => REPORTS.filter((r) => inScope(r.clientId)), [inScope])

  const [selectedId, setSelectedId] = useState(
    initialReportId || scopedReports.find((r) => r.status === 'ready_for_review')?.id || scopedReports[0]?.id
  )

  useEffect(() => { if (initialReportId) setSelectedId(initialReportId) }, [initialReportId])

  // If the selected report falls outside the current person's scope (after a
  // "View as" switch), snap to their first report.
  useEffect(() => {
    if (!scopedReports.some((r) => r.id === selectedId)) {
      setSelectedId(scopedReports.find((r) => r.status === 'ready_for_review')?.id || scopedReports[0]?.id)
    }
  }, [scopedReports]) // eslint-disable-line react-hooks/exhaustive-deps

  const ordered = useMemo(() => {
    const order = ['ready_for_review', 'in_review', 'drafting', 'signed_off', 'delivered']
    return [...scopedReports].sort((a, b) => order.indexOf(states[a.id].status) - order.indexOf(states[b.id].status))
  }, [states, scopedReports])

  // Matches the sidebar badge exactly (scope + same statuses).
  const pending = scopedReports.filter((r) => ['ready_for_review', 'in_review', 'drafting'].includes(states[r.id].status)).length

  const selected = getReport(selectedId)
  const selectedState = getState(selectedId)
  const selectedClient = getClient(selected.clientId)
  const kind = reportKind(selected, selectedState, selectedClient)

  const logFeedback = () => onToast({ title: 'Feedback logged', body: 'SAL weights this on the next draft.' })

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <div className="eyebrow mb-2">This cycle</div>
        <h1 className="text-2xl font-serif font-medium tracking-tight text-ink">Reporting</h1>
        <p className="text-sm text-ink-3 mt-1">Day-3 of the month is the on-time target. Review, train, and approve, SAL holds until you sign off.</p>
      </header>

      <div className="grid grid-cols-[300px_1fr] gap-6 items-start">
        <aside className="card overflow-hidden flex flex-col max-h-[calc(100vh-220px)]">
          <div className="px-4 py-2.5 border-b border-hairline bg-muted eyebrow">{pending} awaiting you · {scopedReports.length} total</div>
          <div className="overflow-y-auto flex-1">
            {ordered.map((r) => {
              const c = getClient(r.clientId)
              const st = states[r.id]
              const anomalies = anomalyCount(r)
              const pending = ['ready_for_review', 'in_review', 'drafting'].includes(st.status)
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  aria-current={r.id === selectedId}
                  className={`w-full text-left px-4 py-3 border-b border-hairline-soft last:border-b-0 transition-colors ${r.id === selectedId ? 'bg-accent-pale' : 'hover:bg-subtle'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <ClientAvatar name={c.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-ink truncate">{c.name}</span>
                        {pending && anomalies > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-text flex-shrink-0">
                            <AlertTriangle size={10} aria-hidden="true" />{anomalies}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-ink-3 mt-0.5 font-mono">{r.period}</div>
                      <div className="mt-1.5"><StatusPill status={st.status} /></div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {kind === 'excluded' && (
            <ExclusionPanel key={selectedId} report={selected} client={selectedClient} onToast={onToast} onOpenAskSal={onOpenAskSal} />
          )}
          {kind === 'drafting' && (
            <DraftingPanel key={selectedId} report={selected} state={selectedState} client={selectedClient} />
          )}
          {kind === 'report' && (
            <ReportDocument
              key={selectedId}
              report={selected}
              state={selectedState}
              client={selectedClient}
              onSignOff={() => signOff(selected)}
              onSendBack={(note) => sendBack(selected, note)}
              onSaveEdits={(edits) => saveEdits(selected, edits)}
              onFeedback={logFeedback}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- Drafting panel ---------- */
function DraftingPanel({ report, state, client }) {
  const sources = sourcesForClient(client.id)
  const revising = state.revisionInFlight
  return (
    <article className="card p-6 animate-fade-up">
      <div className="flex items-center gap-2 mb-3">
        <ClientAvatar name={client.name} size={32} />
        <h2 className="text-xl font-serif font-medium tracking-tight text-ink">{client.name}</h2>
        <StatusPill status="drafting" override={revising ? 'Revising' : 'Drafting'} />
      </div>
      <p className="text-sm text-ink-2 leading-relaxed max-w-prose">
        {revising
          ? "I'm revising this report based on your training notes. I'll move it back to ready for review the moment the pass completes."
          : "I'm still assembling this report. The numbers are in; I'm finishing the platform reads and the recommendation pass before it's ready for your review."}
      </p>
      {revising && state.sendBackNote && (
        <div className="mt-3 rounded-card border border-hairline bg-subtle px-4 py-2.5 text-xs text-ink-2">
          <span className="font-mono text-ink-3 block mb-1">Your note</span>
          {state.sendBackNote}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="eyebrow mb-2">Complete</h3>
          <ul className="text-sm text-ink-2 space-y-1"><li>· Period overview &amp; KPIs</li><li>· Platform metric pull</li></ul>
        </div>
        <div>
          <h3 className="eyebrow mb-2">Pending · ETA a few minutes</h3>
          <ul className="text-sm text-ink-2 space-y-1"><li>· {revising ? 'Re-running the flagged sections' : 'Platform narrative reads'}</li><li>· Recommendation pass</li></ul>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="eyebrow mb-2">Drafting from</h3>
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <span key={s.platformId} className="inline-flex items-center gap-1.5 text-xs rounded-full border border-hairline bg-card px-3 py-1 text-ink-2">
              {getPlatform(s.platformId)?.name || s.platformId}
              <TierBadge tier={s.tier} />
            </span>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-ink-3 mt-6">No actions yet, nothing to approve until SAL finishes drafting.</p>
    </article>
  )
}

/* ---------- Exclusion panel ---------- */
function ExclusionPanel({ report, client, onToast, onOpenAskSal }) {
  const [notifying, setNotifying] = useState(false)
  const missingSig = report.missingData?.[0] ? getSignal(report.missingData[0]) : null
  const platformName = missingSig ? getPlatform(missingSig.platformId)?.name : null
  const stagedPlatforms = (report.platforms || []).filter((p) => !p.missing).map((p) => getPlatform(p.platformId)?.name).filter(Boolean)
  const isCompliance = client.compliance === 'pending'

  const sendReminder = () => onToast?.({ title: `${platformName || 'CSV'} reminder sent`, body: `I emailed the client for the missing ${platformName || 'CSV'}. I'll rebuild the report when it lands.` })
  const toggleNotify = () => { setNotifying(true); onToast?.({ title: 'Subscribed', body: `I'll notify you when the ${platformName || 'data'} arrives.` }) }

  return (
    <article className="animate-fade-up space-y-6">
      <header className="card p-6">
        <div className="flex items-center gap-2 mb-1">
          <ClientAvatar name={client.name} size={32} />
          <h2 className="text-xl font-serif font-medium tracking-tight text-ink">{client.name}</h2>
          <StatusPill status={isCompliance ? 'pending' : 'missing'} />
        </div>
        <p className="text-xs text-ink-3 font-mono">Period {report.period}</p>
      </header>

      <div className="rounded-card border border-amber-border bg-amber-bg p-6">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-amber mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-amber-text">
              {isCompliance ? 'Held for compliance, not publishing' : `${platformName} missing, not publishing a partial report`}
            </h3>
            <p className="text-sm text-amber-text/90 mt-2 leading-relaxed max-w-prose">
              {isCompliance
                ? 'Contract compliance is still pending for this client. I will not draft or deliver an AI-assisted report until it clears, delivering now would be out of scope.'
                : missingSig?.narrative}
            </p>
            {!isCompliance && (
              <p className="text-sm text-amber-text/90 mt-2 leading-relaxed max-w-prose">
                Publishing without it would misstate the share of media mix, the programmatic line is a real slice of spend, and a report that silently drops it reads as complete when it isn't.
              </p>
            )}
          </div>
        </div>
      </div>

      {!isCompliance && (
        <>
          <section className="card p-5">
            <h3 className="eyebrow mb-2">Data staged and ready</h3>
            <div className="flex flex-wrap gap-2">
              {stagedPlatforms.map((name) => (
                <span key={name} className="inline-flex items-center gap-1.5 text-xs rounded-full border border-hairline bg-subtle px-3 py-1 text-ink-2">
                  <CheckCircle2 size={12} className="text-accent-dark" aria-hidden="true" /> {name}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-ink-3 mt-3">I'll assemble the full report automatically once the missing source lands.</p>
          </section>
          <div className="flex items-center gap-2">
            <button onClick={sendReminder} className="btn-primary inline-flex items-center gap-2"><Mail size={14} aria-hidden="true" /> Send CSV Reminder</button>
            <button onClick={toggleNotify} disabled={notifying} className="btn-secondary inline-flex items-center gap-2 disabled:opacity-60"><Bell size={14} aria-hidden="true" /> {notifying ? 'Notifying on arrival' : 'Notify Me on Arrival'}</button>
            <button onClick={() => onOpenAskSal(client.id)} className="btn-ghost inline-flex items-center gap-2"><MessageCircle size={14} aria-hidden="true" /> Ask SAL</button>
          </div>
        </>
      )}
    </article>
  )
}

/* ---------- Full report: action bar (AM controls) + shared ReportArticle ---------- */
function ReportDocument({ report, state, client, onSignOff, onSendBack, onSaveEdits, onFeedback }) {
  const status = state.status
  const isInteractive = status === 'ready_for_review' || status === 'in_review'
  const isDelivered = status === 'delivered'

  const [editMode, setEditMode] = useState(false)
  const [edits, setEdits] = useState(() => ({ ...state.edits }))
  const [showNotes, setShowNotes] = useState(false)
  const [noteText, setNoteText] = useState('')

  const [tabId, setTabId] = useState('summary')
  const section = RICH.sections.find((s) => s.id === tabId) || RICH.sections[0]

  const saveEdits = () => { onSaveEdits(edits); setEditMode(false) }
  const submitNotes = () => {
    if (!noteText.trim()) return
    onSendBack(noteText.trim())
    setShowNotes(false); setNoteText('')
  }

  return (
    <div className="space-y-8">
      {/* Sticky action bar (top) */}
      <div className="sticky top-0 z-10 -mx-1 px-1 pt-2 pb-2 max-w-[760px] mx-auto bg-page">
        <div className="card shadow-elevated flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-3">
          <div className="flex items-center gap-2 min-w-0">
            <StatusPill status={status} />
            {state.sawRevision && isInteractive && (
              <span className="text-[11px] text-accent-dark inline-flex items-center gap-1"><CheckCircle2 size={12} aria-hidden="true" /> SAL revised based on your notes</span>
            )}
          </div>
          {isDelivered ? (
            <span className="text-[11px] text-ink-3 font-mono inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-accent-dark" aria-hidden="true" /> Delivered, signed off by {state.signedOff?.by}
            </span>
          ) : isInteractive ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              {editMode ? (
                <button onClick={saveEdits} className="btn-secondary inline-flex items-center gap-1.5"><Save size={14} aria-hidden="true" /> Save Edits</button>
              ) : (
                <button onClick={() => setEditMode(true)} className="btn-secondary inline-flex items-center gap-1.5"><Edit3 size={14} aria-hidden="true" /> Edit Report</button>
              )}
              <button onClick={() => setShowNotes((v) => !v)} className="btn-ghost">Send Back to Train</button>
              <button onClick={onSignOff} className="btn-primary inline-flex items-center gap-1.5"><CheckCircle2 size={16} aria-hidden="true" /> Sign Off &amp; Deliver</button>
            </div>
          ) : null}
        </div>

        {showNotes && (
          <div className="card mt-2 p-4 animate-fade-up">
            <label className="eyebrow mb-2 block">Train SAL, what should change?</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              autoFocus
              placeholder="e.g. The Meta read buries the lede, lead with the prospecting window, and soften the ROAS framing."
              className="input w-full"
            />
            <p className="text-[11px] text-ink-3 mt-1.5">SAL revises this draft and weights your guidance on future reports.</p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button onClick={() => { setShowNotes(false); setNoteText('') }} className="btn-ghost">Cancel</button>
              <button onClick={submitNotes} disabled={!noteText.trim()} className="btn-primary disabled:opacity-50">Send to SAL</button>
            </div>
          </div>
        )}
      </div>

      {/* Rich report body, the same recap the client sees, with the selected client's byline */}
      <div className="max-w-[760px] mx-auto">
        <div className="eyebrow">Monthly recap · Web &amp; media overview</div>
        <div className="text-sm font-medium text-ink mt-0.5 mb-4">{client.name} · {RICH.period}</div>
        <ReportTabBar sections={RICH.sections} tabId={tabId} setTabId={setTabId} className="mb-10" />
        <SectionView key={tabId} section={section} period={RICH.period} footer={`Drafted by SAL · pending your sign-off · simulated data.`} />
      </div>
    </div>
  )
}
