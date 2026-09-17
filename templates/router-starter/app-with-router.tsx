import { Component } from '@geajs/core'
import { router, RouterView } from '@geajs/core/router'

// 1. Pages / Views
const HomeView = () => (
  <main class="page-container">
    <h1>Home</h1>
    <p>Welcome to ultra-light Gea router application.</p>
    <a click={(e: MouseEvent) => { e.preventDefault(); router.push('/about') }}>Go to About</a>
  </main>
)

const AboutView = () => (
  <main class="page-container">
    <h1>About</h1>
    <p>Compiled at build time. No virtual DOM.</p>
    <a click={(e: MouseEvent) => { e.preventDefault(); router.push('/') }}>Back Home</a>
  </main>
)

const NotFoundView = () => (
  <div class="error-page">
    <h1>404 - Not Found</h1>
    <a click={(e: MouseEvent) => { e.preventDefault(); router.replace('/') }}>Go Home</a>
  </div>
)

// 2. Route Definition Table
const routes = {
  '/': HomeView,
  '/about': AboutView,
  '*': NotFoundView
}

// 3. Root Application Shell
export default class App extends Component {
  template() {
    return (
      <div class="app-layout">
        <header>
          <nav>
            <a click={(e: MouseEvent) => { e.preventDefault(); router.push('/') }}>Home</a> |{' '}
            <a click={(e: MouseEvent) => { e.preventDefault(); router.push('/about') }}>About</a>
          </nav>
        </header>
        <RouterView routes={routes} />
      </div>
    )
  }
}
