# Gea Recipes and Diagnostics

## Minimal project recipe

Use the official scaffold for a new app. Keep the first screen small, then add one feature at a time. Confirm the Vite plugin is active before diagnosing missing updates. A component that renders but does not react is often being processed as ordinary JSX or is using a runtime/manual path without `observe()`.

## API-backed dashboard

Keep fetch logic in a service and store only the UI-facing state:

```ts
class DashboardStore extends Store {
  status: 'idle' | 'loading' | 'ready' | 'error' = 'idle'
  rows: Row[] = []
  error = ''

  async load() {
    this.status = 'loading'
    try {
      const response = await fetch('/api/rows')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      this.rows = await response.json()
      this.status = 'ready'
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error'
      this.status = 'error'
    }
  }
}
```

The API, authentication, database, validation, and authorization remain backend responsibilities. Never put private credentials into the store or browser bundle.

## SSR and hydration recipe

Use `@geajs/ssr` only when server HTML, SEO, first paint, or streaming justifies the added complexity. Create a fresh store/context for each request, render from that state, serialize only validated public data, then hydrate with the same shape. If the client must intentionally differ, defer that difference until after hydration. Test two simultaneous requests to detect state leakage.

## Widget inside an existing site

For a small embedded widget, prefer a dedicated mount element and a narrow store. Avoid loading the router, mobile package, or SSR runtime. If the host site cannot run Vite, use the browser runtime and manual template path; document the required runtime scripts and root id. Keep CSS scoped to the widget and expose a destroy function.

## Converting React/Vue UI

1. Freeze behavior with screenshots or interaction tests.
2. Separate backend/API code from UI code.
3. Convert state to a focused store; convert derived values to getters.
4. Convert presentational components to pure functions and stateful/lifecycle components to classes.
5. Translate JSX names and events (`class`, `click`, `input`, `change`).
6. Replace effect/listener code with lifecycle + cleanup.
7. Replace animation-library usage with CSS/WAAPI/rAF where suitable.
8. Build and compare accessibility, behavior, and compressed assets. Do not claim a successful migration based on a compiling build alone.

## Diagnosis table

| Symptom | Likely cause | Investigation |
| --- | --- | --- |
| JSX syntax error | Vite plugin/config or file extension | Check plugin order, `.tsx`, and package versions |
| UI does not update | Not compiled by Gea, stale copied value, or manual path lacks observer | Inspect build output and use `observe()` only for manual templates |
| Event never fires | React event spelling, missing ownership/root id, or overlay intercept | Use Gea lowercase event syntax and inspect DOM ownership |
| Everything rerenders | Broad observer, large derived collection, or store update too high in tree | Narrow state/observers and measure DOM work |
| Memory leak | Observer, timer, rAF, or library instance not cleaned | Add disposal cleanup and repeat mount/unmount test |
| Hydration mismatch | Different server/client state or browser-only value in SSR render | Serialize equivalent state; defer browser reads |
| Bundle unexpectedly large | Accidental package-wide import or dependency not tree-shaken | Inspect production assets and use named/lazy imports |
| Animation stutters | Layout reads/writes, reactive per-frame updates, heavy paint | Move to transform/opacity, CSS/WAAPI/rAF; profile frames |
| Backend request in UI fails | Missing loading/error/auth/CORS handling | Inspect network response and keep server policy server-side |

## Definition of done

A Gea feature is complete when it has a correct production build, type/lint/test coverage appropriate to risk, accessible keyboard and reduced-motion behavior, explicit loading/error/empty states for remote data, cleanup after disposal, and a measured performance/bundle result when optimization was part of the request.
