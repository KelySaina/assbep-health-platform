import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
      },
      {
        path: 'programs',
        name: 'ProgramsManager',
        component: () => import('@/pages/ProgramsManager.vue'),
      },
      {
        path: 'articles',
        name: 'ArticlesManager',
        component: () => import('@/pages/ArticlesManager.vue'),
      },
      {
        path: 'media',
        name: 'MediaManager',
        component: () => import('@/pages/MediaManager.vue'),
      },
      {
        path: 'resources',
        name: 'ResourcesManager',
        component: () => import('@/pages/ResourcesManager.vue'),
      },
      {
        path: 'partners',
        name: 'PartnersManager',
        component: () => import('@/pages/PartnersManager.vue'),
      },
      {
        path: 'users',
        name: 'UsersManager',
        component: () => import('@/pages/UsersManager.vue'),
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/pages/UserProfile.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/Settings.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
  } else if (to.meta.guest && token) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
