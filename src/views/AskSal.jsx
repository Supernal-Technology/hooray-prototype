import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, FileCheck2, X, Maximize2 } from 'lucide-react'
import { ASK_SAL_PROMPTS } from '../data/askSal'
import { getClient } from '../data/clients'
import TierBadge from '../components/TierBadge'

// Ask SAL — available two ways:
//   variant="dock": persistent right rail, open by default on every AM tab,
//                   collapsible. The default way AMs chat with SAL.
//   variant="full": the immersive, full-screen "Claude chat" experience,
//                   reached from the Ask SAL nav item.
// Both share the same thread/composer logic; only the container differs.
export default function AskSal({ scopedClientId, onClose, onExpand, variant = 'dock' }) {
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const endRef = useRef(null)
  const isFull = variant === 'full'

  const scoped = scopedClientId ? getClient(scopedClientId) : null
  const suggestions = (scopedClientId
    ? ASK_SAL_PROMPTS.filter((p) => !p.clientId || p.clientId === scopedClientId)
    : ASK_SAL_PROMPTS
  ).slice(0, 6)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [thread, pending])

  useEffect(() => {
    if (isFull || !onClose) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, isFull])

  const ask = (userText, answer) => {
    setThread((t) => [...t, { role: 'user', text: userText }])
    setPending(true)
    setTimeout(() => { setPending(false); setThread((t) => [...t, { role: 'sal', ...answer }]) }, 900)
  }
  const sendPrompt = (p) => { if (!pending) ask(p.label, p.answer) }
  const sendFreeform = () => {
    if (!draft.trim() || pending) return
    const text = draft.trim()
    setDraft('')
    ask(text, {
      // [SIM] real app calls the query backend. Honest no-source fallback.
      narrative:
        "I don't have a connected source that answers that yet. I can query Google Ads, Meta, GA4, and the connected CRM and programmatic feeds across the Hooray roster. Name a client and a metric — say \"Salamander paid search ROAS\" or \"which clients risk the day-3 window\" — and I'll pull it with sources.",
      numbers: [], sources: [],
    })
  }

  const Thread = (
    <div className={`flex-1 overflow-y-auto ${isFull ? 'px-6 py-6' : 'p-5'} space-y-4`}>
      {thread.length === 0 && (
        <div className={`text-sm text-ink-2 leading-relaxed max-w-prose ${isFull ? 'mx-auto text-center pt-10' : ''}`}>
          I read from your connected sources — Google Ads, Meta, GA4, and the connected CRM and
          programmatic feeds. Ask me about a client's performance, an anomaly, or the delivery
          pipeline, and I'll answer with the numbers and cite where they came from.
        </div>
      )}
      {thread.map((m, i) => (m.role === 'user' ? <UserMessage key={i} text={m.text} /> : <SalMessage key={i} message={m} />))}
      {pending && (
        <div className="flex items-center gap-2 text-xs text-ink-3">
          <span className="w-6 h-6 rounded-full bg-accent-pale flex items-center justify-center"><Sparkles size={12} className="text-accent-dark" aria-hidden="true" /></span>
          <span className="chat-querying">Querying the Genome…</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )

  const Composer = (
    <div className={`border-t border-hairline ${isFull ? 'px-6 py-4' : 'px-5 py-3'} bg-muted`}>
      <div className={`flex items-center gap-2 flex-wrap mb-3 ${isFull ? 'max-w-3xl mx-auto' : ''}`}>
        {suggestions.map((p) => (
          <button key={p.id} onClick={() => sendPrompt(p)} disabled={pending} className="text-xs rounded-full border border-hairline bg-card px-3 py-1.5 hover:bg-accent-pale transition-colors text-ink-2 disabled:opacity-50">
            {p.label}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); sendFreeform() }} className={`flex items-center gap-2 ${isFull ? 'max-w-3xl mx-auto' : ''}`}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={pending}
          placeholder="Ask SAL anything about a connected client"
          className="input flex-1 disabled:opacity-60"
          aria-label="Ask SAL"
        />
        <button type="submit" disabled={!draft.trim() || pending} className="btn-primary text-sm inline-flex items-center gap-1.5 disabled:opacity-50">
          <Send size={14} aria-hidden="true" /> Send
        </button>
      </form>
    </div>
  )

  if (isFull) {
    return (
      <div className="animate-fade-up flex flex-col h-[calc(100vh-200px)] min-h-[480px]">
        <header className="mb-4">
          <div className="eyebrow">SAL</div>
          <h1 className="text-2xl font-serif font-medium tracking-tight text-ink flex items-center gap-2 mt-1">
            <Sparkles size={20} className="text-accent-dark" aria-hidden="true" /> Ask SAL
          </h1>
          <p className="text-sm text-ink-3 mt-1 max-w-prose">Plain-language questions against the Genome — every connected client's data, with answers cited to source.</p>
        </header>
        <div className="card flex-1 flex flex-col overflow-hidden p-0">
          {Thread}
          {Composer}
        </div>
      </div>
    )
  }

  // dock
  return (
    <>
      <div className="fixed inset-0 bg-ink/30 z-30 xl:hidden" onClick={onClose} aria-hidden="true" />
      <aside className="fixed xl:static inset-y-0 right-0 z-40 w-[380px] shrink-0 bg-card border-l border-hairline shadow-elevated xl:shadow-none flex flex-col h-full">
        <header className="px-5 py-4 border-b border-hairline flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent-dark" aria-hidden="true" />
              <h2 className="text-base font-serif font-semibold text-ink">Ask SAL</h2>
            </div>
            <p className="text-[11px] text-ink-3 mt-1 leading-snug">
              Answers from the Genome — connected sources only, always shown.
              {scoped && <> Scoped to <span className="text-ink-2 font-medium">{scoped.name}</span>.</>}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onExpand && (
              <button onClick={onExpand} className="text-ghost hover:text-ink transition-colors" aria-label="Open full screen" title="Open full screen">
                <Maximize2 size={15} aria-hidden="true" />
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="text-ghost hover:text-ink transition-colors" aria-label="Collapse Ask SAL" title="Collapse">
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        </header>
        {Thread}
        {Composer}
      </aside>
    </>
  )
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-2xl rounded-br-md bg-accent text-accent-ink px-4 py-2.5 text-sm max-w-[85%] leading-relaxed">{text}</div>
    </div>
  )
}

function SalMessage({ message }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-accent-pale flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-accent-dark" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0 max-w-prose">
        <p className="text-sm text-ink-2 leading-relaxed">{message.narrative}</p>
        {message.numbers?.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {message.numbers.map((n, i) => (
              <div key={i} className="rounded-lg border border-hairline bg-card px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-ink-3">{n.label}</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base font-serif font-semibold text-ink">{n.value}</span>
                  {n.delta && <span className={`text-[11px] font-medium ${n.delta.startsWith('-') ? 'text-amber-text' : 'text-accent-dark'}`}>{n.delta}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        {message.sources?.length > 0 && (
          <div className="mt-3 rounded-xl border border-hairline bg-muted px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide font-semibold text-ink-3 mb-1.5 flex items-center gap-1.5">
              <FileCheck2 size={11} aria-hidden="true" /> Sources used
            </div>
            <ul className="space-y-1">
              {message.sources.map((s, i) => (
                <li key={i} className="text-xs text-ink-2 flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{s.platform}</span>
                  <TierBadge tier={s.tier} />
                  <span className="text-ink-3">·</span>
                  <span className={`text-[11px] font-mono ${s.missing ? 'text-amber-text' : 'text-ink-3'}`}>
                    data as of {s.dataAsOf ? new Date(s.dataAsOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'n/a'}
                    {s.missing && ' (missing this cycle)'}
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
