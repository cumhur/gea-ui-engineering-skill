# Gea Performance and Animation

## Decision tree

1. **Simple state transition** such as hover, expand/collapse, fade, slide: use CSS transitions/keyframes.
2. **Timeline or keyframe control** requiring JavaScript but not per-frame application logic: use Web Animations API and retain the returned `Animation` for cancellation.
3. **Canvas/physics/custom interpolation**: use `requestAnimationFrame`, read layout once, calculate, then write transforms/opacity. Cancel on disposal.
4. **Third-party animation library**: import the smallest entry point, instantiate in `onAfterRender`/documented lifecycle, and destroy in `dispose`. Do not store library instances in a reactive store.
5. **Scroll/pointer/touch interaction**: sample input with one rAF loop, keep the latest event, and avoid publishing every event into global reactive state.

## Frame-safe pattern

```ts
export default class Draggable extends Component {
  private frame = 0
  private x = 0
  private pendingX = 0

  onAfterRender() {
    const onPointerMove = (event: PointerEvent) => {
      this.pendingX = event.clientX
      if (!this.frame) {
        this.frame = requestAnimationFrame(() => {
          this.frame = 0
          this.x = this.pendingX
          this.el.style.transform = `translate3d(${this.x}px, 0, 0)`
        })
      }
    }
    this.el.addEventListener('pointermove', onPointerMove)
    this.cleanup = () => this.el.removeEventListener('pointermove', onPointerMove)
  }

  private cleanup = () => {}

  dispose() {
    if (this.frame) cancelAnimationFrame(this.frame)
    this.cleanup()
    super.dispose()
  }
}
```

Adapt lifecycle names and cleanup details to the installed version. Prefer CSS class toggles for state transitions instead of repeatedly mutating inline styles through reactivity.

## Avoiding reactive hot-path costs

- Keep pointer coordinates, drag offsets, scroll positions, and animation progress out of shared stores unless another component needs them.
- Do not rebuild large mapped JSX collections for a small visual change.
- Do not call layout reads (`getBoundingClientRect`, `offsetWidth`, computed style) after a write in the same loop; batch reads first.
- Prefer `transform: translate3d(...)`, `opacity`, and compositor-friendly properties.
- Use `contain`, `content-visibility`, and virtualization only after measuring and confirming browser support requirements.
- Use `store.silent()` only with a matching manual DOM update and a test that protects the invariant.

## Reduced motion and accessibility

Provide a CSS fallback and reduced-motion override:

```css
.card { transition: transform 180ms ease, opacity 180ms ease; }
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; animation: none; }
}
```

Do not hide focus indicators, trap focus incorrectly, or use motion as the only meaning of a state change. Menus/dialogs/tooltips should use `@geajs/ui` or an equivalent accessible implementation rather than a visually convincing but keyboard-inaccessible custom animation.

## Measuring the result

Compare production builds, not dev output. Record raw and gzip/brotli JS/CSS, initial load, interaction latency, long tasks, layout shifts, and animation frame rate. Use browser Performance tools or project tooling where available. For bundle work, inspect the generated assets and dependency graph to verify tree-shaking and lazy loading.

A smaller bundle is not automatically faster if it causes extra layout work, network waterfalls, hydration mismatch recovery, or inaccessible interaction. Report the trade-off.

## Library wrapper contract

Wrap an animation library behind a component/service that:

- accepts semantic inputs rather than exposing the library everywhere;
- creates the instance after the element exists;
- keeps the instance non-reactive;
- supports reduced motion;
- cancels or destroys it on disposal;
- lazy-loads the library when the interaction is not above-the-fold;
- has a fallback when the library fails or is unavailable.
