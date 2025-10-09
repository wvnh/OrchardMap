// src/main.js
import { createApp } from 'vue'
import { Quasar, Notify, Dialog } from 'quasar'
import router from './router'
import App from './App.vue'

// Import Quasar styles
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Tailwind CSS
import './styles/main.css'

const app = createApp(App)

// Configure Quasar
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

// Use Vue Router
app.use(router)

// Mount the app
app.mount('#app')
