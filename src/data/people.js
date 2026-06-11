// Who's "logged in" for the AM-side view. Drives account-level access scoping:
// partners see the whole roster; account directors see only their book.
// All simulated, wired to the "View as" switcher in the sidebar.

export const PEOPLE = [
  { id: 'steven', name: 'Steven Seghers', title: 'Partner', scope: 'all' },
  { id: 'randy', name: 'Randy Stuck', title: 'Partner', scope: 'all' },
  {
    id: 'tracey',
    name: 'Tracey McRae',
    title: 'Account Director',
    scope: ['salamander', 'resorts-world', 'curator', 'aqua-aston', 'marcus-pfister'],
  },
  {
    id: 'rocio',
    name: 'Rocio Woods',
    title: 'Account Director',
    scope: ['timbers', 'balboa-bay', 'alila-ventana', 'the-guild', 'mauna-kea', 'sony'],
  },
]

export const getPerson = (id) => PEOPLE.find((p) => p.id === id)

// True if a person can see a given client's account.
export const personSeesClient = (person, clientId) =>
  !person || person.scope === 'all' || person.scope.includes(clientId)

// Count of accounts a person manages (null = full roster).
export const scopeCount = (person) => (person?.scope === 'all' ? null : person?.scope?.length ?? 0)

// The account director who owns a given account (single source of truth for the
// "Account Manager" shown across the app). Derived from the directors' books.
const DIRECTORS = PEOPLE.filter((p) => p.scope !== 'all')
export const managerForClient = (clientId) => {
  const d = DIRECTORS.find((p) => p.scope.includes(clientId))
  if (!d) return null
  return { id: d.id, name: d.name, initials: d.name.split(' ').map((w) => w[0]).join('').slice(0, 2) }
}
