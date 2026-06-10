// Two-letter monogram tile for a hotel client. Used in tables and Ask SAL.

export default function ClientAvatar({ name, size = 28 }) {
  const initials = name
    .split(/[ &-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div
      className="flex-shrink-0 rounded-md bg-muted border border-hairline-soft flex items-center justify-center font-semibold text-ink-2"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
