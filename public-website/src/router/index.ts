import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/About.vue'),
  },
  {
    path: '/programs',
    name: 'Programs',
    component: () => import('@/pages/Programs.vue'),
  },
  {
    path: '/programs/:slug',
    name: 'ProgramDetail',
    component: () => import('@/pages/ProgramDetail.vue'),
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/pages/Blog.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('@/pages/BlogPost.vue'),
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('@/pages/Resources.vue'),
  },
  {
    path: '/partners',
    name: 'Partners',
    component: () => import('@/pages/Partners.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/Contact.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
