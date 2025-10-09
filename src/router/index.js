// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Import views
const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard voor authenticatie
router.beforeEach((to, from, next) => {
  const { user } = useAuth()
  
  if (to.meta.requiresAuth && !user.value) {
    // Redirect naar login als authenticatie vereist is
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && user.value) {
    // Redirect naar dashboard als gebruiker al is ingelogd
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
