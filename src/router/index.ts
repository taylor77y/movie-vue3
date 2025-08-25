import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'  // ✅ 使用 type-only import

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'), // Tabbar 布局
    children: [
      { path: '', name: 'HomeView', component: () => import('@/views/HomeView.vue'),meta: { keepAlive: true }  },
      { path: 'category', name: 'CategoryView', component: () => import('@/views/CategoryView.vue') },
      { path: 'publish', name: 'PublishView', component: () => import('@/views/PublishView.vue') },
      { path: 'collengt', name: 'CollengtView', component: () => import('@/views/CollengtView.vue') },
      { path: 'my', name: 'MyView', component: () => import('@/views/MyView.vue')  },
    ]
  },
  {
    path: '/videoinfo',
    name: 'VideoInfo',
    component: () => import('@/views/VideoInfo/index.vue'),
    meta: { showTabbar: false } , // 不显示 Tabbar
      props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
      props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
  {
    path: '/vip',
    name: 'Vip',
    component: () => import('@/views/Vip/index.vue'),
    meta: { showTabbar: false } , // 不显示 Tabbar
      props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
   {
    path: '/pay',
    name: 'Pay',
    component: () => import('@/views/Pay/index.vue'),
    meta: { showTabbar: false } , // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
  {
    path: '/cateInfo',
    name: 'CateInfo',
    component: () => import('@/views/CateInfo/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
      props: route => ({ key: route.fullPath }) // 强制重新渲染r
  },
    {
    path: '/sreinfo',
    name: 'SreachInfo',
    component: () => import('@/views/Sreach/info.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
      props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
    {
    path: '/sreach',
    name: 'Sreach',
    component: () => import('@/views/Sreach/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
    {
    path: '/centersetting',
    name: 'Centersetting',
    component: () => import('@/views/Centersetting/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
   {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
  {
    path: '/setpaw',
    name: 'Setpaw',
    component: () => import('@/views/Info/setpaw.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
  {
    path: '/setinfo',
    name: 'Setinfo',
    component: () => import('@/views/Info/setinfo.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
  {
    path: '/share',
    name: 'Share',
    component: () => import('@/views/Share/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
   {
    path: '/feed',
    name: 'Feed',
    component: () => import('@/views/Feedback/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
    {
    path: '/codelist',
    name: 'Codelist',
    component: () => import('@/views/Codelist/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
   {
    path: '/taglist',
    name: 'Taglist',
    component: () => import('@/views/Taglist/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
   {
    path: '/agent',
    name: 'Agent',
    component: () => import('@/views/Agent/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
 
    {
    path: '/tx',
    name: 'Ordertx',
    component: () => import('@/views/Order/tixian.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
    {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order/index.vue'),
    meta: { showTabbar: false }, // 不显示 Tabbar
    props: route => ({ key: route.fullPath }) // 强制重新渲染
  },
 
 
 
  
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
