import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './providers/router'
import { registerServices } from './providers/services'

registerServices()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
