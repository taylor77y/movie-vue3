import './assets/main.less'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vant,{Lazyload}from 'vant'
import 'vant/lib/index.css'
import VConsole from 'vconsole'

// 引入模块后自动生效
import '@vant/touch-emulator';
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
if (import.meta.env.MODE !== 'development') {
  // 覆盖常见的 console 方法
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  console.error = noop;
}

const pl = '/Image/pl.png';
const pinia = createPinia()
const app = createApp(App)
document.body.setAttribute('data-theme', 'dark');


app.use(pinia)
app.use(VueClipboard);
app.use(router)
app.use(Lazyload, {
  lazyComponent: true,
});
app.use(Vant)
router.isReady().then(() => {
  app.mount('#app')
})
