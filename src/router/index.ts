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
import CateInfo from '@/views/CateInfo/index.vue'

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
  { path: '/sreinfo', name: 'Sreinfo', component: () => import('@/views/Sreinfo/index.vue'), meta: { showTabbar: false } },
  { path: '/sreach', name: 'Sreach', component: () => import('@/views/Sreach/index.vue'), meta: { showTabbar: false } },
  { path: '/centersetting', name: 'Centersetting', component: () => import('@/views/Centersetting/index.vue'), meta: { showTabbar: false } },
  { path: '/login', name: 'Login', component: () => import('@/views/Login/index.vue'), meta: { showTabbar: false } },
  { path: '/setpaw', name: 'Setpaw', component: () => import('@/views/Info/setpaw.vue'), meta: { showTabbar: false } },
  { path: '/setinfo', name: 'Setinfo', component: () => import('@/views/Info/setinfo.vue'), meta: { showTabbar: false } },
  { path: '/share', name: 'Share', component: () => import('@/views/Share/index.vue'), meta: { showTabbar: false } },
  { path: '/feed', name: 'Feed', component: () => import('@/views/Feedback/index.vue'), meta: { showTabbar: false } },
  { path: '/codelist', name: 'Codelist', component: () => import('@/views/Codelist/index.vue'), meta: { showTabbar: false } },
  { path: '/taglist', name: 'Taglist', component: () => import('@/views/Taglist/index.vue'), meta: { showTabbar: false } },
  { path: '/agent', name: 'Agent', component: () => import('@/views/Agent/index.vue'), meta: { showTabbar: false } },
  { path: '/tx', name: 'Ordertx', component: () => import('@/views/Order/tixian.vue'), meta: { showTabbar: false } },
  { path: '/order', name: 'Order', component: () => import('@/views/Order/index.vue'), meta: { showTabbar: false } },
  { path: '/sign', name: 'Sign', component: () => import('@/views/Sign/index.vue'), meta: { showTabbar: false } },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
