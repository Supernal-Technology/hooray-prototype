import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import ChatPanel from './ChatPanel'

// One shared Ask SAL drawer for BOTH the client and AM views: a collapsible
// right rail wrapping ChatPanel, plus a full-screen overlay (the immersive
// "Claude chat" experience) reachable from the drawer's expand control.
// Open by default; collapses to a slim tab. An incoming askSignal re-opens it.
export default function ChatDock({ section, askSignal, title }) {
  const [collapsed, setCollapsed] = useState(false)
  const [full, setFull] = useState(false)

  useEffect(() => { if (askSignal) setCollapsed(false) }, [askSignal])
  useEffect(() => {
    if (!full) return
    const onKey = (e) => e.key === 'Escape' && setFull(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [full])

  return (
    <>
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="hidden xl:flex flex-col items-center gap-2 w-10 flex-shrink-0 border-l border-hairline bg-muted hover:bg-accent/10 transition-colors py-4 text-ink-3 hover:text-ink"
          aria-label="Open Ask SAL"
          title="Ask SAL"
        >
          <Sparkles size={16} aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-eyebrow" style={{ writingMode: 'vertical-rl' }}>Ask SAL</span>
        </button>
      ) : (
        <aside className="w-[380px] flex-shrink-0 border-l border-hairline h-full">
          <ChatPanel section={section} askSignal={askSignal} title={title} onCollapse={() => setCollapsed(true)} onExpand={() => setFull(true)} />
        </aside>
      )}

      {full && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFull(false)} aria-hidden="true" />
          <div className="relative w-full max-w-3xl h-[85vh] bg-card rounded-card border border-hairline-strong shadow-elevated overflow-hidden animate-fade-up">
            <ChatPanel section={section} title={title} onCollapse={() => setFull(false)} />
          </div>
        </div>
      )}
    </>
  )
}
