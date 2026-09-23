import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// App Initialization
const app = createApp(App)

// Plugins Setup
app.use(createPinia())
app.use(router)

// Mount Application
app.mount('#app')
