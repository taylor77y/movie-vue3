import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// ✅ 常用页面直接 import（打包到主包，点了立马跳）
import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import PublishView from '@/views/PublishView.vue'
import CollengtView from '@/views/CollengtView.vue'
import MyView from '@/views/MyView.vue'
import VideoInfo from '@/views/VideoInfo/index.vue'
import History from '@/views/History/index.vue'
import Vip from '@/views/Vip/index.vue'
import Pay from '@/views/Pay/index.vue'

// 首先需在文件顶部引入所有对应的组件（路径需根据你的实际项目结构调整）
import CateInfo from '@/views/CateInfo/index.vue' // 假设CateInfo组件实际路径也在views下，与其他组件保持统一
import Sreinfo from '@/views/Sreinfo/index.vue'
import Sreach from '@/views/Sreach/index.vue'
import Centersetting from '@/views/Centersetting/index.vue'
import Login from '@/views/Login/index.vue'
import Setpaw from '@/views/Info/setpaw.vue'
import Setinfo from '@/views/Info/setinfo.vue'
import Share from '@/views/Share/index.vue'
import Feed from '@/views/Feedback/index.vue'
import Codelist from '@/views/Codelist/index.vue'
import Taglist from '@/views/Taglist/index.vue'
import Agent from '@/views/Agent/index.vue'
import Ordertx from '@/views/Order/tixian.vue'
import Order from '@/views/Order/index.vue'
import Sign from '@/views/Sign/index.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'HomeView', component: HomeView, meta: { keepAlive: true } },
      { path: 'category', name: 'CategoryView', component: CategoryView },
      { path: 'publish', name: 'PublishView', component: PublishView },
      { path: 'collengt', name: 'CollengtView', component: CollengtView },
      { path: 'mine', name: 'MyView', component: MyView }
    ]
  },
  { path: '/videoinfo', name: 'VideoInfo', component: VideoInfo, meta: { showTabbar: false } },
  { path: '/history', name: 'History', component: History, meta: { showTabbar: false } },
  { path: '/vip', name: 'Vip', component: Vip, meta: { showTabbar: false } },
  { path: '/pay', name: 'Pay', component: Pay, meta: { showTabbar: false } },
  { path: '/cateInfo', name: 'CateInfo', component: CateInfo, meta: { showTabbar: false } },

  // ✅ 次要页面继续懒加载
  { 
    path: '/cateInfo', 
    name: 'CateInfo', 
    component: CateInfo, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/sreinfo', 
    name: 'Sreinfo', 
    component: Sreinfo, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/sreach', 
    name: 'Sreach', 
    component: Sreach, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/centersetting', 
    name: 'Centersetting', 
    component: Centersetting, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/setpaw', 
    name: 'Setpaw', 
    component: Setpaw, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/setinfo', 
    name: 'Setinfo', 
    component: Setinfo, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/share', 
    name: 'Share', 
    component: Share, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/feed', 
    name: 'Feed', 
    component: Feed, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/codelist', 
    name: 'Codelist', 
    component: Codelist, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/taglist', 
    name: 'Taglist', 
    component: Taglist, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/agent', 
    name: 'Agent', 
    component: Agent, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/tx', 
    name: 'Ordertx', 
    component: Ordertx, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/order', 
    name: 'Order', 
    component: Order, 
    meta: { showTabbar: false } 
  },
  { 
    path: '/sign', 
    name: 'Sign', 
    component: Sign, 
    meta: { showTabbar: false } 
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
