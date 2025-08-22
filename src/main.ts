import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import VConsole from 'vconsole'

// 只在开发环境加载 vconsole
if (import.meta.env.DEV) {
  new VConsole()
}

const app = createApp(App)
document.body.setAttribute('data-theme', 'dark');

app.use(router)
app.use(Vant)
app.mount('#app')
