import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import quasarPlugin from './plugins/quasar'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(quasarPlugin)

app.mount('#app')
