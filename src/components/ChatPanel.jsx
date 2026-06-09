import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, FileCheck2, Users } from 'lucide-react'
import { CLIENT_CHAT, answerForPrompt, matchClientAnswer } from '../data/clientChat'
import Chart from './Chart'
import TierBadge from './TierBadge'

// "Talk to this data" — the client-facing chat. This is the product, not a drawer.
// Renders SAL answers as narrative + inline chart + sources, with a simulated
// "Querying the Genome" state so the interaction reads as real. Scoped to one
// client (Resorts World) via CLIENT_CHAT.
//
// `askSignal` ({ seq, promptId?, text? }) lets the report's "Ask SAL about this"
// affordances pre-fill and submit a question from outside the panel.
export default function ChatPanel({ askSignal }) {
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const endRef = useRef(null)
  const seenSeq = useRef(0)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [thread, pending])

  const ask = (userText, answer) => {
    setThread((t) => [...t, { role: 'user', text: userText }])
    setPending(true)
    setTimeout(() => {
      setPending(false)
      setThread((t) => [...t, { role: 'sal', ...answer }])
    }, 900)
  }

  const sendPrompt = (p) => { if (!pending) ask(p.label, answerForPrompt(p.id)) }
  const sendFree = () => {
    if (!draft.trim() || pending) return
    const text = draft.trim()
    setDraft('')
    ask(text, matchClientAnswer(text))
  }

  // External pre-fill from report affordances.
  useEffect(() => {
    if (!askSignal || askSignal.seq === seenSeq.current) return
    seenSeq.current = askSignal.seq
    if (pending) return
    if (askSignal.promptId) {
      const p = CLIENT_CHAT.prompts.find((x) => x.id === askSignal.promptId)
      ask(p?.label || askSignal.text || '…', answerForPrompt(askSignal.promptId))
    } else if (askSignal.text) {
      ask(askSignal.text, matchClientAnswer(askSignal.text))
    }
  }, [askSignal]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-full bg-card">
      <header className="px-5 py-4 border-b border-hairline">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-dark" aria-hidden="true" />
          <h2 className="text-base font-serif font-semibold text-ink">Talk to this data</h2>
        </div>
        <p className="text-[11px] text-ink-3 mt-1 leading-snug">
          Ask anything about your numbers — answers come from your connected sources only, always shown.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {thread.length === 0 && (
          <div className="text-sm text-ink-2 leading-relaxed max-w-prose">
            Hi — I'm SAL. I can pull up your paid media, RevPAR, ROAS, and channel spend, and explain
            anything that moved. Tap a question below or ask in your own words.
          </div>
        )}
        {thread.map((m, i) => (m.role === 'user' ? <UserBubble key={i} text={m.text} /> : <SalAnswer key={i} answer={m} />))}
        {pending && (
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <span className="w-6 h-6 rounded-full bg-accent-pale flex items-center justify-center">
              <Sparkles size={12} className="text-accent-dark" aria-hidden="true" />
            </span>
            <span className="chat-querying">Querying the Genome…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-hairline px-5 py-3 bg-muted">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {CLIENT_CHAT.prompts.map((p) => (
            <button
              key={p.id}
              onClick={() => sendPrompt(p)}
              disabled={pending}
              className="text-xs rounded-full border border-hairline bg-card px-3 py-1.5 hover:bg-accent-pale transition-colors text-ink-2 disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendFree() }} className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={pending}
            placeholder="Ask about a metric, channel, or month"
            className="input flex-1 disabled:opacity-60"
            aria-label="Ask SAL about your data"
          />
          <button type="submit" disabled={!draft.trim() || pending} className="btn-primary text-sm inline-flex items-center gap-1.5 disabled:opacity-50">
            <Send size={14} aria-hidden="true" /> Send
          </button>
        </form>
      </div>
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
        <p className="text-sm text-ink-2 leading-relaxed">{answer.narrative}</p>

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
                    data as of {s.dataAsOf ? new Date(s.dataAsOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'n/a'} · simulated
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
