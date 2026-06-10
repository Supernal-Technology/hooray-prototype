import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { SIGNALS } from '../data/signals'
import { managerForClient } from '../data/people'
import { getPlatform, sourcesForClient } from '../data/sources'
import KPI from './KPI'
import TierBadge from './TierBadge'

// The v1 editorial report body, shared by the AM Approvals view and the
// client-facing view. `mode` switches the byline, the controls, and the
// "Ask SAL about this" affordances:
//   - mode="am":     editable platform reads + thumbs-feedback (training)
//   - mode="client": read-only, approved-by-a-human byline, hover ask-about chips
const getSignal = (id) => SIGNALS.find((s) => s.id === id)

// Map a KPI/trend label to the best canned client prompt (chart answer).
function promptForLabel(label) {
  const l = label.toLowerCase()
  if (l.includes('roas')) return { promptId: 'roas-6mo' }
  if (l.includes('revpar')) return { promptId: 'revpar-trend' }
  if (l.includes('spend') || l.includes('budget')) return { promptId: 'budget-where' }
  if (l.includes('meta')) return { promptId: 'meta-costs' }
  return { text: `Tell me about my ${label.toLowerCase()}` }
}

export default function ReportArticle({
  report,
  client,
  mode = 'am',
  state = {},
  editMode = false,
  edits = {},
  onEditChange,
  onAskAbout,
  onFeedback,
}) {
  const am = managerForClient(client.id)
  const isClient = mode === 'client'
  const readFor = (p) => edits[p.platformId] ?? state.edits?.[p.platformId] ?? p.read
  const hasEdits = Object.keys(state.edits || {}).length > 0

  return (
    <article className="max-w-[760px] mx-auto space-y-8">
      {/* Masthead */}
      <header>
        <div className="eyebrow">Monthly performance report · {fmtPeriod(report.period)}</div>
        <h2 className="text-3xl font-serif font-medium tracking-tight text-ink mt-1.5">{client.name}</h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-mono text-ink-3">
          <span>Prepared by SAL · {fmtTime(report.draftedAt)}</span>
          <span aria-hidden="true">·</span>
          {isClient ? (
            <span className="text-accent-dark inline-flex items-center gap-1">
              <CheckCircle2 size={12} aria-hidden="true" /> Reviewed and approved by {am?.name}, Hooray Agency
            </span>
          ) : state.status === 'delivered' && state.signedOff ? (
            <span className="text-accent-dark">Signed off by {state.signedOff.by} · {fmtTime(state.signedOff.at)}</span>
          ) : (
            <span>Pending sign-off by {am?.name}</span>
          )}
          <span aria-hidden="true">·</span>
          <span>Data through {dataThrough(report.period)}{isClient && ' · simulated data'}</span>
          {!isClient && (hasEdits || state.editedBy) && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-ink-2">Edited by {state.editedBy || 'you'}</span>
            </>
          )}
        </div>
        <div className="h-1 w-16 rounded-full bg-accent mt-4" aria-hidden="true" />
        <p className="text-lg font-serif text-ink-2 leading-relaxed mt-4 max-w-prose">{report.overview.narrative}</p>
      </header>

      {/* 01 Period overview */}
      <Section number="01" title="Period overview">
        <div className="grid grid-cols-2 gap-3">
          {report.overview.kpis.map((k) => (
            <div key={k.label} className="relative group">
              <KPI label={k.label} value={k.value} delta={k.deltaMoM} deltaSub={`prior ${k.deltaMoM} · baseline ${k.vsBaseline}`} anomaly={k.anomaly} missing={k.missing} />
              {isClient && onAskAbout && !k.missing && (
                <AskChip onClick={() => onAskAbout(promptForLabel(k.label))} />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* 02 By platform */}
      <Section number="02" title="By platform">
        <div className="grid grid-cols-2 gap-3">
          {report.platforms.map((p) => {
            const platform = getPlatform(p.platformId)
            const src = sourcesForClient(client.id).find((s) => s.platformId === p.platformId)
            return (
              <div key={p.platformId} className={`rounded-card border p-4 ${p.missing ? 'border-amber-border bg-amber-bg' : 'border-hairline bg-card'}`}>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-ink truncate">{platform?.name || p.platformId}</span>
                    {src && <TierBadge tier={src.tier} />}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {src?.dataAsOf && <span className="text-[10px] font-mono text-ink-3">as of {fmtDay(src.dataAsOf)}</span>}
                    {p.anomalies?.length > 0 && <AnomalyChip anomalies={p.anomalies} />}
                    {p.missing && <span className="pill pill-sm pill-warning"><AlertTriangle size={11} aria-hidden="true" /> Missing data</span>}
                  </div>
                </div>
                {!isClient && editMode && !p.missing ? (
                  <textarea
                    value={readFor(p)}
                    onChange={(e) => onEditChange?.(p.platformId, e.target.value)}
                    rows={3}
                    className="input w-full text-sm"
                    style={{ borderColor: 'var(--accent-dark)' }}
                    aria-label={`Edit ${platform?.name} read`}
                  />
                ) : (
                  <p className="text-sm text-ink-2 leading-relaxed">{readFor(p)}</p>
                )}
                {/* AM training affordance */}
                {!isClient && !editMode && !p.missing && onFeedback && (
                  <ReadFeedback target={`${platform?.name} read`} onFeedback={onFeedback} />
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* 03 Trends */}
      <Section number="03" title="Trends">
        <div className="card p-5 divide-y divide-hairline-soft">
          {report.trends.map((t) => (
            <div key={t.metric} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 relative group">
              <div className="w-40 min-w-0">
                <div className={`text-sm font-medium ${t.anomalyAtEnd ? 'text-amber-text' : 'text-ink'}`}>{t.metric}</div>
                {t.anomalyAtEnd && <div className="text-[11px] text-amber-text/80 mt-0.5">Latest point breaks from baseline</div>}
              </div>
              <div className="flex-1 flex justify-center"><MiniSpark series={t.series} flagged={t.anomalyAtEnd} /></div>
              <div className={`w-20 text-right font-serif font-medium ${t.anomalyAtEnd ? 'text-amber-text' : 'text-ink'}`}>{fmtSeriesEnd(t.series)}</div>
              {isClient && onAskAbout && <AskChip onClick={() => onAskAbout(promptForLabel(t.metric))} inline />}
            </div>
          ))}
        </div>
      </Section>

      {/* 04 Recommended next steps */}
      <Section number="04" title="Recommended next steps" subtitle="SAL recommends; your team decides.">
        <ol className="space-y-2">
          {report.recommendations.map((r, i) => (
            <li key={i} className={`rounded-card border p-4 ${i === 0 ? 'border-accent bg-accent-pale' : 'border-hairline bg-card'}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold font-mono flex-shrink-0 ${r.priority === 'high' ? 'bg-amber-bg text-amber-text' : 'bg-card text-accent-dark border border-hairline'}`}>{i + 1}</div>
                <p className="text-sm text-ink-2 leading-relaxed">{r.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Footer: provenance + audit (trust signals in client mode) */}
      <footer className="border-t border-hairline pt-4 text-[11px] text-ink-3 leading-relaxed max-w-prose">
        Drafted by SAL from {sourcesForClient(client.id).map((s) => getPlatform(s.platformId)?.name).filter(Boolean).join(', ')} · simulated data.
        {isClient
          ? ' Every figure here was reviewed and approved by your Hooray account manager before delivery. Nothing reaches you without a human sign-off.'
          : ' Nothing reaches the client without an AM sign-off; every delivery is logged with the reviewer, timestamp, and any edits.'}
      </footer>
    </article>
  )
}

function AskChip({ onClick, inline }) {
  return (
    <button
      onClick={onClick}
      className={`absolute ${inline ? 'right-24 top-1/2 -translate-y-1/2' : 'right-3 top-3'} opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-full bg-ink text-cream text-[10px] font-medium px-2.5 py-1 shadow-elevated`}
    >
      <MessageCircle size={10} aria-hidden="true" /> Ask SAL about this
    </button>
  )
}

function ReadFeedback({ target, onFeedback }) {
  const [vote, setVote] = useState(null)
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  if (done) return <div className="mt-2 text-[11px] text-accent-dark">Feedback logged, SAL weights this on the next draft.</div>
  return (
    <div className="mt-2 flex items-center gap-2 flex-wrap">
      <span className="text-[10px] uppercase tracking-wide text-ghost">Train SAL</span>
      <button onClick={() => { onFeedback({ target, vote: 'up' }); setDone(true) }} aria-label="Good read" className="text-ghost hover:text-accent-dark transition-colors"><ThumbsUp size={13} /></button>
      <button onClick={() => setVote('down')} aria-label="Needs work" className={`transition-colors ${vote === 'down' ? 'text-amber-text' : 'text-ghost hover:text-amber-text'}`}><ThumbsDown size={13} /></button>
      {vote === 'down' && (
        <form
          onSubmit={(e) => { e.preventDefault(); onFeedback({ target, vote: 'down', note }); setDone(true) }}
          className="flex items-center gap-1.5 flex-1 min-w-[180px]"
        >
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What should SAL change?" className="input flex-1 text-xs py-1" autoFocus />
          <button type="submit" className="btn-primary text-[11px] px-2 py-1">Send</button>
        </form>
      )}
    </div>
  )
}

/* ---------- Anomaly chip with "Why I flagged this" tooltip ---------- */
export function AnomalyChip({ anomalies }) {
  const sigs = anomalies.map((a) => (typeof a === 'string' ? getSignal(a) : a)).filter(Boolean)
  return (
    <span className="relative group/chip inline-flex">
      <span className="pill pill-sm pill-warning inline-flex items-center gap-1" tabIndex={0} role="button" aria-label="Why I flagged this">
        <AlertTriangle size={10} aria-hidden="true" /> {anomalies.length}
      </span>
      <span className="pointer-events-none absolute right-0 top-full mt-1.5 z-20 w-72 rounded-card border border-hairline-strong bg-card shadow-elevated p-3 text-[11px] text-ink-2 leading-relaxed opacity-0 group-hover/chip:opacity-100 group-focus-within/chip:opacity-100 transition-opacity">
        <span className="font-semibold text-ink block mb-1.5">Why I flagged this</span>
        {sigs.map((s, i) => {
          const positive = typeof s.deltaPct === 'number' && s.deltaPct > 0
          return (
            <span key={i} className="block mb-2 last:mb-0">
              {typeof s.baseline === 'number' && typeof s.observed === 'number' && (
                <span className="font-mono text-ink-3 block mb-0.5">
                  observed {s.observed} vs baseline {s.baseline}
                  {typeof s.deltaPct === 'number' && ` (${s.deltaPct > 0 ? '+' : ''}${Math.round(s.deltaPct * 100)}%)`}
                  {s.occurredAt && ` · onset ${fmtDay(s.occurredAt)}`}
                </span>
              )}
              {s.narrative}
              {positive && <span className="block mt-1 text-accent-dark">Positive break, flagged so the gain is attributed correctly, not so it reads as a problem.</span>}
            </span>
          )
        })}
      </span>
    </span>
  )
}

function MiniSpark({ series, flagged }) {
  if (!series || series.length < 2) return null
  const W = 220, H = 44, pad = 3
  const min = Math.min(...series), max = Math.max(...series), range = max - min || 1
  const stepX = (W - pad * 2) / (series.length - 1)
  const pts = series.map((v, i) => [pad + i * stepX, pad + (1 - (v - min) / range) * (H - pad * 2)])
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lx, ly] = pts.at(-1)
  const stroke = flagged ? '#F59E0B' : '#8B9A3B'
  return (
    <svg width={W} height={H} aria-hidden="true">
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill={stroke} />
    </svg>
  )
}

function Section({ number, title, subtitle, children }) {
  return (
    <section>
      <h3 className="eyebrow mb-1 flex items-center gap-2">
        <span className="w-5 h-5 rounded-md bg-accent-pale text-accent-dark inline-flex items-center justify-center text-[10px] font-bold font-mono">{number}</span>
        {title}
      </h3>
      {subtitle && <p className="text-[11px] text-ink-3 mb-3 ml-7">{subtitle}</p>}
      <div className={subtitle ? '' : 'mt-3'}>{children}</div>
    </section>
  )
}

function fmtTime(iso) { return iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ', ' }
function fmtDay(iso) { return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ', ' }
function fmtPeriod(period) { const [y, m] = period.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }
function dataThrough(period) { const [y, m] = period.split('-').map(Number); return new Date(y, m, 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
function fmtSeriesEnd(s) { const v = s.at(-1); return typeof v === 'number' && v < 100 ? v.toFixed(1) : Math.round(v).toLocaleString() }
