import { useState, useRef } from 'react'
import { ChevronDown, Hotel } from 'lucide-react'
import { getClient } from '../data/clients'
import { reportForClient } from '../data/reports'
import { CURRENT_PERIOD } from '../data/performance'
import ReportArticle from '../components/ReportArticle'
import ChatPanel from '../components/ChatPanel'

// CLIENT VIEW, the hero. A hotel client opens their monthly report and talks to
// their own data. Report fills the main column; "Talk to this data" is docked
// right and open by default (it is the product, not a drawer). Scoped to one
// property only, no portfolio, no other clients, no approval machinery.
const CLIENT_ID = 'resorts-world'

export default function ClientView({ onToast }) {
  const client = getClient(CLIENT_ID)
  const report = reportForClient(CLIENT_ID, CURRENT_PERIOD)
  // askSignal carries report → chat prefills ("Ask SAL about this").
  const [askSignal, setAskSignal] = useState(null)
  const seq = useRef(0)

  const askAbout = (payload) => {
    seq.current += 1
    setAskSignal({ seq: seq.current, ...payload })
  }

  return (
    <div className="flex h-full min-h-0">
      <main className="flex-1 min-w-[520px] overflow-auto">
        <div className="px-8 py-4 border-b border-hairline-soft bg-page/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <Hotel size={16} className="text-accent-ink" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="eyebrow">Client portal</div>
              <div className="text-sm font-medium text-ink truncate">{client.name}</div>
            </div>
          </div>
          <PeriodSelector onToast={onToast} />
        </div>

        <div className="px-8 py-8">
          <ReportArticle report={report} client={client} mode="client" onAskAbout={askAbout} />
        </div>
      </main>

      {/* Chat is docked, open by default, the product, not a drawer. */}
      <aside className="w-[400px] flex-shrink-0 border-l border-hairline h-full">
        <ChatPanel askSignal={askSignal} />
      </aside>
    </div>
  )
}

// Visibly present, politely stubbed, a self-serve data product obviously needs
// a period picker; only May is loaded in the prototype.
function PeriodSelector({ onToast }) {
  return (
    <button
      onClick={() => onToast?.({ title: 'May 2026 is the loaded period', body: 'Historical periods are stubbed in this prototype.' })}
      className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
      title="Period selection is stubbed in this prototype"
    >
      May 2026 <ChevronDown size={13} aria-hidden="true" />
    </button>
  )
}
