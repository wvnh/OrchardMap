<template>
  <header class="app-header">
    <div class="app-header__container">
      <router-link to="/" class="app-header__logo">
        <span class="app-header__logo-icon">🌳</span>
        <span class="app-header__logo-text">OrchardMap</span>
      </router-link>

      <nav class="app-header__nav">
        <router-link to="/orchards" class="app-header__nav-link">
          Orchards
        </router-link>
      </nav>

      <div class="app-header__user">
        <div v-if="user" class="user-info">
          <span class="user-info__name">{{ userDisplayName }}</span>
          <PermissionBadge v-if="userRole" :orchard="{ owner_id: null }" />
          <button @click="handleLogout" class="btn btn--small btn--secondary">
            Logout
          </button>
        </div>
        <div v-else class="guest-info">
          <span class="guest-info__text">👁️ Guest Mode</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import PermissionBadge from './PermissionBadge.vue'

const router = useRouter()
const { user, userRole, logout } = useAuth()

const userDisplayName = computed(() => {
  if (!user.value) return 'Guest'
  return user.value.email?.split('@')[0] || 'User'
})

const handleLogout = async () => {
  try {
    await logout()
    router.push('/orchards')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.25rem;
  transition: color 0.2s;
}

.app-header__logo:hover {
  color: #2ecc71;
}

.app-header__logo-icon {
  font-size: 1.5rem;
}

.app-header__nav {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.app-header__nav-link {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.app-header__nav-link:hover {
  color: #2ecc71;
  background-color: #f8f9fa;
}

.app-header__nav-link.router-link-active {
  color: #2ecc71;
  background-color: #e8f8f5;
}

.app-header__user {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info__name {
  font-weight: 500;
  color: #2c3e50;
}

.guest-info__text {
  color: #95a5a6;
  font-size: 0.9rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn--small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn--secondary {
  background-color: #3498db;
  color: white;
}

.btn--secondary:hover {
  background-color: #2980b9;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .app-header__container {
    padding: 1rem;
    flex-wrap: wrap;
  }

  .app-header__logo-text {
    display: none;
  }

  .app-header__nav {
    order: 3;
    width: 100%;
    justify-content: center;
    padding-top: 0.5rem;
    border-top: 1px solid #eee;
  }

  .user-info {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .user-info__name {
    display: none;
  }
}
</style>
