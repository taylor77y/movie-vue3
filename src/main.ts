import './assets/main.less'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import VConsole from 'vconsole'
import { createPinia } from 'pinia'
import { VueClipboard } from '@lxf2513/vue3-clipboard';
// 只在开发环境加载 vconsole
if (import.meta.env.MODE === 'development') {
  import('vconsole').then(({ default: VConsole }) => {
    try {
      new VConsole()
    } catch(e) {
      console.warn('vConsole init error', e)
    }
  })
}


const pinia = createPinia()
const app = createApp(App)
document.body.setAttribute('data-theme', 'dark');
app.use(pinia)
app.use(VueClipboard);
app.use(router)
app.use(Vant)
app.mount('#app')
