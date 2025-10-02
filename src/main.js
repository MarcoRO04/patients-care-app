import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'


const app = createApp(App)
let emitter = mitt()
app.config.globalProperties.emitter = emitter
app.use(router)

// emitter.on('login_process', () => {
//     localStorage.setItem('login', 'true')
// })
app.mount('#app')
