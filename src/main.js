import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
import { store } from '@/store/index.js'


const app = createApp(App)
let emitter = mitt()
app.config.globalProperties.emitter = emitter
app.use(router)
app.use(store)
app.mount('#app')

