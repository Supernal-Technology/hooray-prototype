import { useState, useCallback, useEffect } from 'react'
import {
  LayoutDashboard,
  ClipboardCheck,
  Sparkles,
  Lock,
  ChevronDown,
  Database,
  AlertTriangle,
  Lightbulb,
  X,
} from 'lucide-react'
import Portfolio from './views/Portfolio'
import ReportApprovals from './views/ReportApprovals'
import DataSources from './views/DataSources'
import Anomalies from './views/Anomalies'
import SignalsFeed from './views/SignalsFeed'
import AskSal from './views/AskSal'
import ClientView from './views/ClientView'
import Phase2Modal from './views/Phase2Modal'
import ToastStack from './components/Toast'
import { ReportsProvider, useReports } from './state/reportsStore'
import { BULK_SYNC } from './data/sources'
import { PEOPLE, scopeCount } from './data/people'

export default function App() {
  // Two audiences, one interface. Client view is the hero and the default.
  const [mode, setMode] = useState('client') // 'client' | 'am'
  const [bannerOpen, setBannerOpen] = useState(true)

  // AM-shell state (preserved across mode toggles, both shells stay mounted).
  const [active, setActive] = useState('portfolio')
  const [reportContext, setReportContext] = useState(null)
  const [askOpen, setAskOpen] = useState(true) // dock open by default, every tab
  const [askContext, setAskContext] = useState(null)
  const [showPhase2, setShowPhase2] = useState(false)
  const [role, setRole] = useState(PEOPLE[0]) // Steven (full access) by default

  const [toasts, setToasts] = useState([])
  const fireToast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((list) => [...list, { ...t, id }])
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4000)
  }, [])
  const dismissToast = (id) => setToasts((list) => list.filter((x) => x.id !== id))

  const handleNav = (id) => {
    if (id !== 'reports') setReportContext(null)
    setActive(id)
  }
  const handleOpenReport = (reportId) => { setReportContext(reportId); setActive('reports') }
  const handleOpenAskSal = (clientId = null) => {
    setAskContext(clientId)
    setAskOpen(true)
    if (active === 'ask') setActive('portfolio') // scoped asks land in the dock, not the full page
  }

  return (
    <ReportsProvider currentUser={role} onToast={fireToast}>
      <div className="flex flex-col h-screen bg-page text-ink">
        <TopStrip mode={mode} setMode={setMode} />
        {bannerOpen && <Banner onDismiss={() => setBannerOpen(false)} />}

        <div className="flex-1 min-h-0">
          {/* Both shells stay mounted so per-mode state (chat thread, selected
              report) survives toggling; only the active one is shown. */}
          <div className="h-full" style={{ display: mode === 'client' ? 'block' : 'none' }}>
            <ClientView onToast={fireToast} />
          </div>
          <div className="h-full" style={{ display: mode === 'am' ? 'block' : 'none' }}>
            <AMShell
              active={active}
              onNav={handleNav}
              askOpen={askOpen}
              askContext={askContext}
              onCloseAsk={() => setAskOpen(false)}
              onReopenAsk={() => setAskOpen(true)}
              onOpenReport={handleOpenReport}
              onOpenAskSal={handleOpenAskSal}
              reportContext={reportContext}
              onPhase2={() => setShowPhase2(true)}
              role={role}
              setRole={setRole}
              onToast={fireToast}
            />
          </div>
        </div>

        {showPhase2 && <Phase2Modal onClose={() => setShowPhase2(false)} />}
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </div>
    </ReportsProvider>
  )
}

function TopStrip({ mode, setMode }) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-hairline bg-card flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <Sparkles size={15} className="text-accent-ink" aria-hidden="true" />
        </div>
        <span className="font-serif font-semibold text-ink text-sm">SAL</span>
        <span className="text-[11px] text-ink-3">· Hooray Agency</span>
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5" role="tablist" aria-label="Audience view">
        <ModeButton active={mode === 'client'} onClick={() => setMode('client')}>Client view</ModeButton>
        <ModeButton active={mode === 'am'} onClick={() => setMode('am')}>AM view</ModeButton>
      </div>
    </div>
  )
}

function ModeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
        active ? 'bg-accent-dark text-cream' : 'text-ink-3 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function Banner({ onDismiss }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-2 bg-subtle border-b border-hairline-soft flex-shrink-0">
      <p className="text-[12px] text-ink-2">
        <span className="font-medium">Directional prototype</span> · simulated data · everything here is open to change.
      </p>
      <button onClick={onDismiss} className="text-ghost hover:text-ink transition-colors" aria-label="Dismiss notice">
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  )
}

/* ---------------- AM shell (v1 tooling, now secondary) ---------------- */
function AMShell({ active, onNav, askOpen, askContext, onCloseAsk, onReopenAsk, onOpenReport, onOpenAskSal, reportContext, onPhase2, role, setRole, onToast }) {
  const onAskPage = active === 'ask'
  const dockVisible = askOpen && !onAskPage
  return (
    <div className="flex h-full min-h-0">
      <Sidebar active={active} onNav={onNav} onPhase2={onPhase2} role={role} setRole={setRole} />
      <div className="flex-1 flex min-w-0">
        <main className="flex-1 min-w-0 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {active === 'portfolio' && (
              <Portfolio onOpenReport={onOpenReport} onOpenAskSal={onOpenAskSal} onToast={onToast} onPhase2={onPhase2} />
            )}
            {active === 'reports' && (
              <ReportApprovals initialReportId={reportContext} onOpenAskSal={onOpenAskSal} onToast={onToast} />
            )}
            {active === 'sources' && <DataSources onToast={onToast} />}
            {active === 'anomalies' && <Anomalies onOpenAskSal={onOpenAskSal} onToast={onToast} />}
            {active === 'signals' && <SignalsFeed onOpenAskSal={onOpenAskSal} onOpenClient={() => onNav('portfolio')} />}
            {active === 'ask' && <AskSal variant="full" scopedClientId={askContext} />}
          </div>
        </main>

        {/* Persistent right-rail chat, open by default on every tab. */}
        {dockVisible && <AskSal variant="dock" scopedClientId={askContext} onClose={onCloseAsk} onExpand={() => onNav('ask')} />}
        {!askOpen && !onAskPage && (
          <button
            onClick={onReopenAsk}
            className="hidden xl:flex flex-col items-center gap-2 w-10 flex-shrink-0 border-l border-hairline bg-muted hover:bg-accent/10 transition-colors py-4 text-ink-3 hover:text-ink"
            aria-label="Open Ask SAL"
            title="Ask SAL"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-eyebrow" style={{ writingMode: 'vertical-rl' }}>Ask SAL</span>
          </button>
        )}
      </div>
    </div>
  )
}

function Sidebar({ active, onNav, onPhase2, role, setRole }) {
  const { pendingCount } = useReports()
  const pending = pendingCount()
  const awaiting = BULK_SYNC.delegatedPending + BULK_SYNC.csvMissing
  const synced = BULK_SYNC.connected

  return (
    <aside className="w-[220px] h-full bg-muted border-r border-hairline flex flex-col flex-shrink-0 overflow-y-auto">
      <nav className="flex-1 py-4 flex flex-col gap-5">
        <NavGroup label="App">
          <NavItem label="Portfolio" icon={<LayoutDashboard size={16} aria-hidden="true" />} active={active === 'portfolio'} onClick={() => onNav('portfolio')} />
          <NavItem label="Reporting" icon={<ClipboardCheck size={16} aria-hidden="true" />} active={active === 'reports'} onClick={() => onNav('reports')} badge={pending || null} />
          <NavItem label="Genome" icon={<Database size={16} aria-hidden="true" />} active={active === 'sources'} onClick={() => onNav('sources')} />
        </NavGroup>

        <NavGroup label="Intelligence">
          <NavItem label="Insights" icon={<Lightbulb size={16} aria-hidden="true" />} active={active === 'anomalies'} onClick={() => onNav('anomalies')} />
          <NavItem label="Data Watchlist" icon={<AlertTriangle size={16} aria-hidden="true" />} active={active === 'signals'} onClick={() => onNav('signals')} />
        </NavGroup>

        <NavGroup label="SAL">
          <NavItem label="Ask SAL" icon={<Sparkles size={16} aria-hidden="true" />} active={active === 'ask'} onClick={() => onNav('ask')} />
        </NavGroup>

        <NavGroup label="Next">
          <button onClick={onPhase2} className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium text-ghost border-r-2 border-r-transparent hover:bg-accent/5 hover:text-ink-3 text-left transition-colors duration-150">
            <Lock size={14} className="flex-shrink-0" aria-hidden="true" />
            <span className="truncate flex-1">SAL Expands</span>
            <span className="text-[9px] font-semibold uppercase tracking-eyebrow opacity-70">Phase 2</span>
          </button>
        </NavGroup>
      </nav>

      <div className="px-4 pb-3">
        <button onClick={() => onNav('sources')} className="card p-3 w-full text-left hover:bg-subtle transition-colors" title="Open the Genome">
          <div className="flex items-center gap-1.5 eyebrow mb-2"><Database size={11} aria-hidden="true" /> Genome</div>
          <div className="text-xs text-ink-2">{synced} sources synced</div>
          <div className={`text-xs mt-1 ${awaiting > 0 ? 'text-amber-text font-medium' : 'text-ink-3'}`}>{awaiting} awaiting data</div>
        </button>
      </div>

      <RoleSwitcher role={role} setRole={setRole} />
      <div className="px-5 py-3 border-t border-hairline-soft">
        <p className="text-[10px] text-ghost font-mono">sal-dashboard · v0.1 prototype</p>
      </div>
    </aside>
  )
}

function NavGroup({ label, children }) {
  return (
    <div>
      <div className="px-5 mb-1 eyebrow">{label}</div>
      {children}
    </div>
  )
}

function NavItem({ label, icon, active, onClick, badge, ...rest }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-colors duration-150 border-r-2 text-left ${
        active ? 'bg-accent/30 text-accent-ink border-r-accent-dark' : 'text-ink-3 border-r-transparent hover:bg-accent/10 hover:text-ink'
      }`}
      {...rest}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate flex-1">{label}</span>
      {badge ? <span className="rounded-full bg-accent-dark text-cream text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center">{badge}</span> : null}
    </button>
  )
}

function RoleSwitcher({ role, setRole }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="px-3 py-2 border-t border-hairline-soft relative">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent/10 text-left transition-colors duration-150">
        <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-accent-ink">
          {role.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-ink truncate">{role.name}</div>
          <div className="text-[10px] text-ink-3 truncate">{role.title} · {scopeLabel(role)}</div>
        </div>
        <ChevronDown size={12} className="text-ghost flex-shrink-0" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-1 bg-card border border-hairline-strong rounded-xl shadow-elevated overflow-hidden z-30">
          <div className="px-3 py-2 eyebrow border-b border-hairline-soft">View as</div>
          {PEOPLE.map((p) => (
            <button
              key={p.id}
              onClick={() => { setRole(p); setOpen(false) }}
              aria-current={p.id === role.id}
              className={`w-full text-left px-3 py-2 hover:bg-accent/10 text-xs transition-colors duration-150 ${p.id === role.id ? 'bg-accent-pale text-ink' : 'text-ink'}`}
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-[10px] text-ink-3">{p.title} · {scopeLabel(p)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function scopeLabel(person) {
  const n = scopeCount(person)
  return n === null ? 'all accounts' : `${n} accounts`
}
