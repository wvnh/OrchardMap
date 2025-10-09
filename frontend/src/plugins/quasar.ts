// src/plugins/quasar.ts
import { Quasar, Notify, Dialog, Loading } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

export default {
  install(app: any) {
    app.use(Quasar, {
      plugins: {
        Notify,
        Dialog,
        Loading
      },
      config: {
        notify: {
          position: 'top',
          timeout: 2500,
          textColor: 'white',
          actions: [{ icon: 'close', color: 'white' }]
        },
        loading: {
          // Loading plugin options
        }
      }
    })
  }
}
