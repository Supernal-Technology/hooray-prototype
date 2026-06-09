import { useEffect } from 'react'
import { X, Lock, ArrowRight } from 'lucide-react'

const STEPS = [
  { num: 1, title: 'Intake', body: 'Account team forwards a vague creative request via email or Monday.com → SAL parses it into a structured ticket.' },
  { num: 2, title: 'Classify & clarify', body: 'SAL detects the request type (landing page · social · ad · email) and asks the missing questions: audience, deadline, deliverables, brand constraints.' },
  { num: 3, title: 'Package brief', body: 'A complete brief lands in Monday.com — ready for design or creative ops to start, with the open questions and answers logged in-thread.' },
]

export default function Phase2Modal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(16,15,14,0.4)' }} onClick={onClose} />
      <div className="relative bg-card rounded-card border border-hairline-strong shadow-elevated w-full max-w-2xl overflow-hidden animate-fade-up">
        <div className="px-6 py-4 border-b border-hairline flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Lock size={16} className="text-ink-3" />
            <div>
              <div className="eyebrow">Phase 2 · coming next quarter</div>
              <h2 className="text-xl font-serif font-semibold text-ink">SAL Expands — Creative Request Intelligence</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-ghost hover:text-ink-2"><X size={18} /></button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-ink-2 leading-relaxed mb-5 max-w-[68ch]">
            Phase 2 turns SAL into a full AI employee. Vague creative requests arrive, SAL asks the missing questions, and a complete brief lands in Monday.com — ready for the design team to start. No reformatting, no clarifying calls.
          </p>
          <ol className="space-y-3">
            {STEPS.map((s) => (
              <li key={s.num} className="rounded-card border border-hairline bg-muted px-4 py-3 flex items-start gap-3 opacity-80">
                <div className="w-8 h-8 rounded-full bg-accent-pale text-accent-ink flex items-center justify-center font-mono font-bold text-sm flex-shrink-0">
                  {s.num}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{s.title}</div>
                  <div className="text-xs text-ink-2 mt-0.5 leading-relaxed">{s.body}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-card border border-hairline bg-muted px-4 py-3 text-xs text-ink-2">
            Scope is defined through a working session with Hooray's operations lead and billed separately from Phase 1. <span className="inline-flex items-center gap-1 font-semibold text-accent-dark">Scope it together <ArrowRight size={11} /></span>
          </div>
        </div>
      </div>
    </div>
  )
}
