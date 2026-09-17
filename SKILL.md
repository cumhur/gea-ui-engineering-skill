---
name: gea-ui-engineering
description: Build, refactor, debug, optimize, and review ultra-light reactive web UIs with Gea (the @geajs/core ecosystem). Use for Gea/Vite/JSX projects, browser UI, SSR and hydration, routing, accessible headless UI, mobile UI, DOM animations, converting React/Vue/vanilla interactions to Gea, bundle-size work, and performance diagnosis. Do not use Gea as a backend framework; use it only for browser-facing UI, with @geajs/ssr when server-rendered HTML is needed.
---

# Gea UI Engineering

## Mission

Use Gea as a **compiler-first, browser UI framework**, not as a general backend runtime. Prefer ordinary JavaScript/TypeScript, compile-time JSX, proxy-based stores, direct DOM ownership, and surgical updates. Keep the shipped code proportional to the features actually used.

Gea is especially appropriate for interactive websites, dashboards, product interfaces, animation-heavy UI, embedded widgets, mobile-style web interfaces, and applications where bundle size and update cost matter. It does not replace a Node/Python/Go backend, database, job worker, or API layer. The backend may serve data and SSR HTML; Gea runs the interactive client layer.

## Workflow

1. **Inspect before coding.** Identify the existing stack, package manager, entry point, Vite configuration, TypeScript settings, rendering mode, browser support, and current bundle/performance symptoms. Do not convert an entire app to Gea merely because Gea is small.
2. **Choose the rendering path.**
   - New Vite app: use `npm create gea@latest` and the official Vite plugin.
   - Existing Vite app: add the Gea plugin only after checking JSX ownership and coexistence constraints.
   - No-build page or small widget: use the browser runtime; use Babel only when runtime JSX is genuinely necessary.
   - SEO/first-paint/server-rendered app: use `@geajs/ssr`, then hydrate on the client.
   - Backend-only request: do not introduce Gea; return an API/server solution instead.
3. **Model state deliberately.** Put shared mutable state in a small `Store` class. Keep presentational pieces as pure function components; use class components for state and lifecycle. Use getters for computed values. Avoid duplicating derived state.
4. **Build the smallest correct UI.** Use Gea JSX (`class`, lowercase event attributes such as `click`/`input`/`change`), semantic HTML, stable keys/identifiers, and the least expensive DOM structure. Import optional router/UI/mobile/SSR features only when needed.
5. **Design motion separately from state.** Prefer CSS transitions/keyframes for declarative motion. Use `requestAnimationFrame` for continuous imperative motion, and keep animation state local or outside high-frequency global stores. Never cause layout thrashing by alternating reads and writes in a loop.
6. **Verify behavior and delivery.** Run typecheck, lint, tests, production build, and bundle-size inspection. Check hydration, keyboard operation, reduced-motion behavior, responsive layout, and cleanup after component disposal.
7. **Report trade-offs.** State what Gea improves, what remains backend-owned, which optional packages were added, and the measured before/after bundle or interaction result. Treat README benchmark numbers as indicative, not as a guarantee for every app.

## Non-negotiable Gea rules

- Use `@geajs/vite-plugin` for compiled JSX/reactivity. Do not assume ordinary Babel JSX alone provides Gea’s compile-time reactivity.
- In Vite JSX, use `class`, not React’s `className`; use lowercase native event attributes such as `click`, `input`, `change`, and `keydown`, not `onClick`.
- In a class component, keep the root structure compatible with Gea’s ownership model; the browser/manual-template path requires the root `id="${this.id}"`.
- Do not add React hooks, signals, dependency arrays, `setState`, `emit`, or `v-model` patterns unless integrating an external library that explicitly requires them.
- Do not manually attach one listener per element when delegated `events` or JSX event attributes can express the behavior.
- Do not perform side effects in function components. Put effects in lifecycle methods or explicit store/service methods.
- Unsubscribe every manual `store.observe()` subscription; store its remover in `GEA_OBSERVER_REMOVERS` or use the documented lifecycle cleanup mechanism.
- Never put secrets, database credentials, privileged operations, or backend-only code in a client bundle.
- Do not claim that Gea automatically optimizes arbitrary third-party animation libraries. Measure the library, import only required modules, and wrap it behind a cleanup-aware component boundary.

## Component and state selection

| Need | Preferred Gea design |
| --- | --- |
| Static/presentational markup | Pure function component |
| Local interactive behavior/lifecycle | Class component |
| Shared mutable state | One focused `Store` instance |
| Derived state | Getter on the store or component |
| Server data | API client/service + store; handle loading/error/empty states |
| Modal/menu/tooltip/accordion | `@geajs/ui` when its accessibility behavior is useful |
| Mobile navigation/gestures | `@geajs/mobile` only when needed |
| URL navigation | Tree-shakeable router APIs from `@geajs/core` |
| Server HTML/hydration | `@geajs/ssr` with per-request store isolation |
| Backend logic | Separate server framework/service |

## Performance and animation playbook

1. Measure first: production build, compressed JS/CSS, long tasks, layout/paint, interaction latency, and animation frame rate.
2. Keep hot state local. Do not update a global store at pointer/touch/scroll frequency unless multiple views truly need it.
3. Animate `transform` and `opacity` where possible. Avoid repeatedly changing layout properties such as `top`, `left`, `width`, and `height` during a frame loop.
4. Batch reads before writes, use `requestAnimationFrame`, cancel handles on dispose, and respect `prefers-reduced-motion: reduce`.
5. For large lists, minimize reactive dependencies, paginate/virtualize where appropriate, and avoid recreating large arrays or markup for unrelated changes.
6. Use `store.silent()` only when intentionally managing the corresponding DOM update yourself; document the invariant so the UI cannot silently become stale.
7. Lazy-load routes and heavy animation/editor/chart libraries. Confirm tree-shaking in the final bundle rather than trusting import syntax.

## Validation checklist

- `npm run build` succeeds in production mode.
- `npm run typecheck`/`tsc --noEmit` and lint pass when configured.
- No hydration mismatch or cross-request store leakage exists in SSR.
- Keyboard navigation, focus restoration, labels, semantics, and reduced motion work.
- Components dispose observers, timers, animation frames, and third-party instances.
- Network/API failures have visible loading, empty, retry, and error states.
- Bundle output is inspected in compressed form; benchmark claims are not copied without measurement.
- If converting from another framework, behavior and accessibility are tested before comparing size.

## Progressive references

Read only the reference needed for the task:

- [API and syntax](references/api-reference.md): stores, components, JSX, browser runtime, router, SSR, package boundaries, and migration traps.
- [Performance and animation](references/performance-and-animation.md): measurement, CSS/WAAPI/rAF decisions, high-frequency input, cleanup, and third-party libraries.
- [Recipes and diagnostics](references/recipes-and-diagnostics.md): complete patterns for app setup, stores, SSR, widgets, conversion, and failure diagnosis.
- [Templates](templates/): ready-to-use production scaffolds:
  - `templates/minimal-starter/`: Official Vite + TypeScript starter with Store, Component, and Vite plugin.
  - `templates/router-starter/`: Declarative client-side routing with `@geajs/core/router`.
  - `templates/zag-ui-dialog/`: Accessible modal dialog pattern with `@geajs/ui`.
  - `templates/mobile-starter/`: Hybrid mobile views and transitions with `@geajs/mobile`.

When Gea’s current repository/API differs from these references, inspect the installed package and official repository docs before changing code. Prefer source and type definitions over assumptions.

## Response contract for agents using this skill

When producing or modifying Gea code, explain briefly: (1) rendering mode, (2) state ownership, (3) animation strategy if relevant, (4) optional packages added and why, (5) verification performed, and (6) any backend boundary. Return runnable code rather than framework-agnostic pseudocode unless the user explicitly asks for a design only.

Source of truth used to design this skill: https://github.com/dashersw/gea and its `docs/` directory. Gea is MIT-licensed; verify the installed version before relying on version-specific APIs.

---
