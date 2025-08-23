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
      { path: 'my', name: 'MyView', component: () => import('@/views/MyView.vue') },
    ]
  },
  {
    path: '/videoinfo',
    name: 'VideoInfo',
    component: () => import('@/views/VideoInfo/index.vue'),
    meta: { showTabbar: false } // 不显示 Tabbar
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
