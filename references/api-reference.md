# Gea API and Syntax Reference

Use this file when writing or reviewing Gea code. Confirm version-specific details against the installed package and official docs.

## Installation and build

```bash
npm create gea@latest my-app
cd my-app
npm install
npm run dev
npm run build
```

The normal path is Vite + TypeScript/JSX + `@geajs/vite-plugin`. The core package is `@geajs/core`; optional packages include `@geajs/ui`, `@geajs/mobile`, `@geajs/ssr`, and router APIs exposed from the core package.

## Store pattern

```ts
import { Store } from '@geajs/core'

class TodoStore extends Store {
  todos: { id: string; text: string; done: boolean }[] = []
  filter: 'all' | 'active' | 'completed' = 'all'

  get visibleTodos() {
    if (this.filter === 'active') return this.todos.filter(todo => !todo.done)
    if (this.filter === 'completed') return this.todos.filter(todo => todo.done)
    return this.todos
  }

  add(text: string) {
    const value = text.trim()
    if (value) this.todos.push({ id: crypto.randomUUID(), text: value, done: false })
  }

  toggle(id: string) {
    const todo = this.todos.find(item => item.id === id)
    if (todo) todo.done = !todo.done
  }
}

export default new TodoStore()
```

Store instances are deeply proxied. Direct assignment, nested mutation, and common array methods are tracked and batched. `observe(path, handler)` returns an unsubscribe function. Use `silent(fn)` only when manually updating the DOM or batching an operation whose UI update is explicitly controlled.

## Compiled JSX class component

```tsx
import { Component } from '@geajs/core'
import todos from './todo-store'

export default class TodoList extends Component {
  declare props: { title?: string }

  template({ title = 'Todos' }: this['props']) {
    return (
      <section aria-labelledby="todo-title">
        <h1 id="todo-title">{title}</h1>
        <form submit={this.addFromForm}>
          <label for="new-todo">New todo</label>
          <input id="new-todo" name="text" />
          <button type="submit">Add</button>
        </form>
        <ul>
          {todos.visibleTodos.map(todo => (
            <li data-id={todo.id}>
              <label>
                <input type="checkbox" checked={todo.done} change={() => todos.toggle(todo.id)} />
                <span>{todo.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  addFromForm = (event: SubmitEvent) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const data = new FormData(form)
    todos.add(String(data.get('text') ?? ''))
    form.reset()
  }
}
```

Mount with:

```ts
import App from './app'
new App().render(document.getElementById('app')!)
```

Use Gea JSX conventions: `class`, `for`, lowercase event attributes (`click`, `input`, `change`, `submit`, `keydown`). Do not translate React’s `className`/`htmlFor`/`onClick` patterns into Gea unchanged.

## Function components

Use pure functions for presentational pieces:

```tsx
export function Badge({ label, tone }: { label: string; tone: 'info' | 'danger' }) {
  return <span class={`badge badge-${tone}`}>{label}</span>
}
```

Do not perform subscriptions, timers, DOM mutation, or network side effects inside the function body. Move those responsibilities to a class component, store, or service.

## Manual browser/runtime path

For no-build pages, load the Gea runtime from the chosen package version and use class components with a template that returns HTML. The manual path requires the root element to include `id="${this.id}"` so event delegation can find ownership. Use `this.$()`/`this.$$()` for scoped queries and `get events()` for delegated events.

```js
class Counter extends Component {
  template() {
    return `<div id="${this.id}"><span class="value">${store.count}</span><button class="inc">+</button></div>`
  }

  get events() {
    return { click: { '.inc': () => store.count++ } }
  }
}
```

Manual `store.observe(path, handler)` subscriptions must be removed on disposal. Prefer compiled JSX for production applications; use the browser path for small widgets, prototypes, or environments that cannot run a build step.

## Router and optional packages

Import router APIs from `@geajs/core` only when routing is required. Router code is intended to be tree-shaken when unused. Use `@geajs/ui` for accessible headless primitives, `@geajs/mobile` for mobile view/navigation/gesture primitives, and `@geajs/ssr` for server rendering and hydration. Do not import an entire package when a documented subpath or named import can preserve tree-shaking.

## SSR boundaries

SSR must isolate mutable stores per request. Never export one mutable singleton store from a server module if requests can share its state. Create request-scoped state, render the server output, serialize only safe data, and hydrate with equivalent initial state. Test loading/error/empty states and hydration mismatch warnings.

## Common migration traps

| Source habit | Gea correction |
| --- | --- |
| React `useState`/`setState` | Store fields and direct mutation |
| React `onClick` | `click` |
| React `className` | `class` |
| React effect in render/function body | Lifecycle/service with cleanup |
| Vue `ref`/`reactive` | Store fields/proxy state |
| Vue `emit`/`v-model` | JavaScript props/callbacks or shared proxy, based on ownership |
| Manual listener per row | Delegation or JSX event attribute |
| Full list rerender on every pointer move | Local transient state + rAF/CSS/WAAPI |
| Backend logic in component | API/service boundary |
