import { Component } from '@geajs/core'
import { View, ViewManager, NavigationBar, TabBar } from '@geajs/mobile'

class DetailView extends View {
  template() {
    return (
      <div class="view-content">
        <NavigationBar title="Details" showBackButton onBack={() => ViewManager.pop()} />
        <div class="padding-16">
          <h2>Detail Screen</h2>
          <p>Native-feeling slide transition with touch back gesture support.</p>
        </div>
      </div>
    )
  }
}

export default class MobileRootView extends View {
  template() {
    return (
      <div class="mobile-viewport">
        <NavigationBar title="Gea Mobile" />
        <div class="view-body">
          <p>Ultra-light iOS/Android style hybrid web application.</p>
          <button class="primary-btn" click={() => ViewManager.push(new DetailView())}>
            Push Detail Screen
          </button>
        </div>
        <TabBar activeTab="home" />
      </div>
    )
  }
}
