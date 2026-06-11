import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, FileCheck2, Users, ChevronDown, X, Maximize2 } from 'lucide-react'
import { matchSectionAnswer } from '../data/clientReport'
import Chart from './Chart'
import TierBadge from './TierBadge'

// "Talk to this data", the client chat, scoped to the report section in view.
// Per the Jun-10 call: when a section opens, SAL auto-posts a short overview
// (SemRush-style), and the suggested questions live in a clean dropdown that
// swaps with the section. Free text matches within the section, never fabricates.
export default function ChatPanel({ section, askSignal, title = 'Talk to this data', onCollapse, onExpand }) {
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const endRef = useRef(null)
  const seenSections = useRef(new Set())
  const seenSignal = useRef(0)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [thread, pending])

  const post = (msg) => setThread((t) => [...t, msg])
  const ask = (userText, answer) => {
    post({ role: 'user', text: userText })
    setPending(true)
    setTimeout(() => { setPending(false); post({ role: 'sal', ...answer }) }, 850)
  }

  // Auto-overview the first time a section is opened.
  useEffect(() => {
    if (!section || seenSections.current.has(section.id)) return
    seenSections.current.add(section.id)
    setPending(true)
    const t = setTimeout(() => {
      setPending(false)
      post({ role: 'sal', _overview: section.label, ...section.overview })
    }, 650)
    return () => clearTimeout(t)
  }, [section?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill from outside (report affordances).
  useEffect(() => {
    if (!askSignal || askSignal.seq === seenSignal.current || !section) return
    seenSignal.current = askSignal.seq
    if (pending) return
    const q = askSignal.promptId && section.questions.find((x) => x.id === askSignal.promptId)
    if (q) ask(q.label, q.answer)
    else if (askSignal.text) ask(askSignal.text, matchSectionAnswer(section, askSignal.text))
  }, [askSignal]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendQuestion = (q) => { setMenuOpen(false); if (!pending) ask(q.label, q.answer) }
  const sendFree = () => {
    if (!draft.trim() || pending || !section) return
    const text = draft.trim()
    setDraft('')
    ask(text, matchSectionAnswer(section, text))
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <header className="px-5 py-4 border-b border-hairline flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent-dark" aria-hidden="true" />
            <h2 className="text-base font-serif font-semibold text-ink">{title}</h2>
          </div>
          <p className="text-[11px] text-ink-3 mt-1 leading-snug">
            Ask about {section ? <span className="text-ink-2 font-medium">{section.label}</span> : 'your numbers'}. Answers come from your connected sources, always shown.
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {onExpand && (
            <button onClick={onExpand} className="text-ghost hover:text-ink transition-colors" aria-label="Open full screen" title="Full screen">
              <Maximize2 size={15} aria-hidden="true" />
            </button>
          )}
          {onCollapse && (
            <button onClick={onCollapse} className="text-ghost hover:text-ink transition-colors" aria-label="Collapse chat" title="Collapse">
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {thread.length === 0 && !pending && (
          <div className="text-sm text-ink-2 leading-relaxed max-w-prose">
            Hi, I'm SAL. Open a section and I'll give you the read; ask me why a number moved or what to do next.
          </div>
        )}
        {thread.map((m, i) => (m.role === 'user' ? <UserBubble key={i} text={m.text} /> : <SalAnswer key={i} answer={m} />))}
        {pending && (
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <span className="w-6 h-6 rounded-full bg-accent-pale flex items-center justify-center">
              <Sparkles size={12} className="text-accent-dark" aria-hidden="true" />
            </span>
            <span className="chat-querying">Reading the section…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-hairline px-5 py-3 bg-muted">
        {/* Suggested questions, scoped to the section, as a dropdown (per the call). */}
        {section && (
          <div className="relative mb-2.5">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              disabled={pending}
              className="w-full flex items-center justify-between gap-2 text-xs rounded-lg border border-hairline bg-card px-3 py-2 hover:bg-subtle transition-colors text-ink-2 disabled:opacity-50"
              aria-expanded={menuOpen}
            >
              <span>Suggested questions for {section.label}</span>
              <ChevronDown size={14} className={`text-ink-3 transition-transform ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-hairline-strong rounded-lg shadow-elevated overflow-hidden z-20">
                {section.questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => sendQuestion(q)}
                    className="w-full text-left px-3 py-2 text-xs text-ink hover:bg-accent-pale transition-colors border-b border-hairline-soft last:border-b-0"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); sendFree() }} className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={pending}
            placeholder="Ask SAL"
            className="input flex-1 disabled:opacity-60"
            aria-label="Ask SAL"
          />
          <button type="submit" disabled={!draft.trim() || pending} className="btn-primary text-sm inline-flex items-center gap-1.5 disabled:opacity-50">
            <Send size={14} aria-hidden="true" /> Send
          </button>
        </form>
      </div>
    </div>
  )
}

function ConfidenceTag({ level }) {
  const meta = {
    high: { label: 'High confidence', bars: 3, color: 'var(--accent-dark)' },
    medium: { label: 'Medium confidence', bars: 2, color: 'var(--ink-3)' },
    low: { label: 'Low confidence', bars: 1, color: 'var(--ghost)' },
  }[level]
  if (!meta) return null
  return (
    <div className="mt-2 inline-flex items-center gap-1.5">
      <span className="flex items-end gap-0.5 h-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1 rounded-sm" style={{ height: `${(i + 1) * 4}px`, backgroundColor: i < meta.bars ? meta.color : 'var(--hairline-strong)' }} />
        ))}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: meta.color }}>{meta.label}</span>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-2xl rounded-br-md bg-accent text-accent-ink px-4 py-2.5 text-sm max-w-[85%] leading-relaxed">{text}</div>
    </div>
  )
}

function SalAnswer({ answer }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-accent-pale flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-accent-dark" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        {answer._overview && <div className="eyebrow mb-1">Overview · {answer._overview}</div>}
        <p className="text-sm text-ink-2 leading-relaxed">{answer.narrative}</p>

        {answer.confidence && <ConfidenceTag level={answer.confidence} />}

        {answer.chart && <div className="mt-3 rounded-card border border-hairline bg-card p-3"><Chart spec={answer.chart} /></div>}

        {answer.numbers?.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {answer.numbers.map((n, i) => (
              <div key={i} className="rounded-lg border border-hairline bg-card px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-ink-3">{n.label}</div>
                <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                  <span className="text-base font-serif font-semibold text-ink">{n.value}</span>
                  {n.delta && <span className={`text-[11px] font-medium ${n.delta.startsWith('-') ? 'text-amber-text' : 'text-accent-dark'}`}>{n.delta}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {answer.teamDoing && (
          <div className="mt-3 rounded-card border border-hairline bg-accent-pale/60 px-3 py-2.5">
            <div className="eyebrow flex items-center gap-1.5 mb-1"><Users size={11} aria-hidden="true" /> What your team is doing</div>
            <p className="text-[13px] text-ink-2 leading-relaxed">{answer.teamDoing}</p>
          </div>
        )}

        {answer.sources?.length > 0 && (
          <div className="mt-3 rounded-xl border border-hairline bg-muted px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide font-semibold text-ink-3 mb-1.5 flex items-center gap-1.5">
              <FileCheck2 size={11} aria-hidden="true" /> Sources used
            </div>
            <ul className="space-y-1">
              {answer.sources.map((s, i) => (
                <li key={i} className="text-xs text-ink-2 flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{s.platform}</span>
                  <TierBadge tier={s.tier} />
                  <span className="text-ink-3">·</span>
                  <span className="text-[11px] font-mono text-ink-3">
                    as of {s.dataAsOf ? new Date(s.dataAsOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'n/a'} · simulated
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
