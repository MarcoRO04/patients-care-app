import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'


const app = createApp(App)
let emitter = mitt()
app.config.globalProperties.emitter = emitter
app.use(router)
app.mount('#app')
