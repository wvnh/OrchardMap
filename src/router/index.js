// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

// Import views
import OrchardListView from '../views/OrchardListView.vue'
import OrchardDetailView from '../views/OrchardDetailView.vue'

const routes = [
  {
    path: '/',
    redirect: '/orchards'
  },
  {
    path: '/orchards',
    name: 'orchard-list',
    component: OrchardListView,
    meta: {
      title: 'Orchards'
    }
  },
  {
    path: '/orchards/:id',
    name: 'orchard-detail',
    component: OrchardDetailView,
    meta: {
      title: 'Orchard Details'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to set page titles
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - OrchardMap` : 'OrchardMap'
  
  next()
})

export default router
