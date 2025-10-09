// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog } from 'quasar'

// Import Quasar styles
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import App component and router
import App from './App.vue'
import router from './router/index.js'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Use Quasar with plugins
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog
  },
  config: {
    notify: {
      position: 'top',
      timeout: 3000
    }
  }
})

// Use Pinia and Router
app.use(pinia)
app.use(router)

// Mount app
app.mount('#app')
