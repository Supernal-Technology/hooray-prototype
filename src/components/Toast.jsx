import { CheckCircle2, X } from 'lucide-react'

// Bottom-right stack, dark ink background, accent icon, ~4s auto-dismiss (spec §5).
export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-ink text-cream rounded-card shadow-elevated p-4 flex items-start gap-3 animate-slide-up"
        >
          <div className="w-7 h-7 rounded-full bg-accent-dark/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={16} className="text-accent" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{toast.title}</div>
            {toast.body && <div className="text-xs text-cream/70 mt-1 leading-relaxed">{toast.body}</div>}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-cream/50 hover:text-cream transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
