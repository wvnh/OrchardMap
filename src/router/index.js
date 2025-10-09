// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

// Import views (lazy loading)
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const OrchardsView = () => import('../views/OrchardsView.vue')
const PublicOrchardsView = () => import('../views/PublicOrchardsView.vue')

/**
 * Route configuratie met role-based access control
 */
const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/public-orchards'
  },
  {
    path: '/public-orchards',
    name: 'public-orchards',
    component: PublicOrchardsView,
    meta: {
      title: 'Publieke Boomgaarden',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Inloggen',
      requiresAuth: false,
      hideForAuth: true // Verberg voor ingelogde gebruikers
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Registreren',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/orchards',
    name: 'orchards',
    component: OrchardsView,
    meta: {
      title: 'Mijn Boomgaarden',
      requiresAuth: true,
      roles: ['admin', 'orchard_manager', 'orchard_worker']
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Navigation guard voor authenticatie en autorisatie
 */
router.beforeEach(async (to, from, next) => {
  const { user, userRole } = useAuth()
  
  // Update document title
  document.title = to.meta.title ? `${to.meta.title} - OrchardMap` : 'OrchardMap'
  
  // Check of route authenticatie vereist
  const requiresAuth = to.meta.requiresAuth
  const hideForAuth = to.meta.hideForAuth
  const requiredRoles = to.meta.roles
  
  // Wacht even tot auth state is geladen
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Als route authenticatie vereist en gebruiker is niet ingelogd
  if (requiresAuth && !user.value) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Als route verborgen moet zijn voor ingelogde gebruikers
  if (hideForAuth && user.value) {
    next({ name: 'dashboard' })
    return
  }
  
  // Check role-based access
  if (requiredRoles && requiredRoles.length > 0) {
    const currentRole = userRole.value
    
    if (!currentRole || !requiredRoles.includes(currentRole)) {
      // Gebruiker heeft niet de juiste rol
      next({
        name: 'dashboard',
        query: { error: 'insufficient_permissions' }
      })
      return
    }
  }
  
  // Alles is OK, ga door naar de route
  next()
})

export default router
