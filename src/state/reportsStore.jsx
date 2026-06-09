// Single source of truth for report lifecycle state (spec §6.1).
// Portfolio table, client drawer, Approvals queue, and the report bar all read
// from here, so any transition (sign-off, send-back, edit) updates them at once.
//
// [SIM] There is no backend in this demo. Sign-off does not really write to
// Monday.com or send email; send-back resolves on a timer instead of a real AI
// job. The UX (states, attribution, success-gated toasts) is faithful to spec.

import { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react'
import { REPORTS, reportForClient } from '../data/reports'

const ReportsContext = createContext(null)

function buildInitial() {
  return Object.fromEntries(
    REPORTS.map((r) => [
      r.id,
      {
        status: r.status,
        revisionInFlight: false,
        sawRevision: false,
        edits: {}, // platformId -> edited read text
        editedBy: null,
        sendBackNote: null,
        signedOff: r.signedOffAt ? { by: 'Hooray', at: r.signedOffAt } : null,
        deliveredAt: r.deliveredAt || null,
      },
    ])
  )
}

export function ReportsProvider({ currentUser, onToast, children }) {
  const [states, setStates] = useState(buildInitial)
  const timers = useRef({})

  const patch = useCallback((id, next) => {
    setStates((s) => ({ ...s, [id]: { ...s[id], ...next } }))
  }, [])

  // Sign off & deliver. [SIM] real app would await Monday.com + email success
  // before flipping; on failure it would error-toast and NOT flip.
  const signOff = useCallback(
    (report) => {
      const now = new Date().toISOString()
      patch(report.id, {
        status: 'delivered',
        signedOff: { by: currentUser.name, at: now },
        deliveredAt: now,
      })
      onToast({
        title: 'Delivered',
        body: 'Status written to the Monday.com tracking board and email sent to the client AM.',
      })
    },
    [currentUser, onToast, patch]
  )

  // Send back to SAL with notes. [SIM] resolves after ~6s; real app resolves
  // when the AI revision job completes.
  const sendBack = useCallback(
    (report, note) => {
      patch(report.id, {
        status: 'drafting',
        revisionInFlight: true,
        sendBackNote: note,
        sawRevision: false,
      })
      onToast({
        title: 'Sent back to SAL with your notes',
        body: 'Revision in progress.',
      })
      clearTimeout(timers.current[report.id])
      timers.current[report.id] = setTimeout(() => {
        patch(report.id, { status: 'ready_for_review', revisionInFlight: false, sawRevision: true })
        onToast({
          title: 'SAL revised the report based on your notes',
          body: 'Ready for review.',
        })
      }, 6000)
    },
    [onToast, patch]
  )

  // Save inline edits to AI platform reads. [SIM] local only; real app versions it.
  const saveEdits = useCallback(
    (report, edits) => {
      patch(report.id, { edits, editedBy: currentUser.name })
      onToast({ title: 'Edits saved to the draft' })
    },
    [currentUser, onToast, patch]
  )

  const value = useMemo(
    () => ({
      states,
      getState: (id) => states[id],
      signOff,
      sendBack,
      saveEdits,
      // Live status for a client's report this period (null if no report).
      statusForClient: (clientId, period) => {
        const rep = reportForClient(clientId, period)
        return rep ? states[rep.id]?.status ?? null : null
      },
      stateForClient: (clientId, period) => {
        const rep = reportForClient(clientId, period)
        return rep ? states[rep.id] ?? null : null
      },
      // Count of reports still needing AM attention (queue badge).
      pendingCount: () =>
        Object.values(states).filter((s) =>
          ['ready_for_review', 'in_review', 'drafting'].includes(s.status)
        ).length,
    }),
    [states, signOff, sendBack, saveEdits]
  )

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
}

export function useReports() {
  const ctx = useContext(ReportsContext)
  if (!ctx) throw new Error('useReports must be used within ReportsProvider')
  return ctx
}
