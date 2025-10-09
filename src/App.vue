<template>
  <div id="app">
    <AppHeader />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/common/AppHeader.vue'
import { useAuth } from './composables/useAuth.js'

// Initialize auth on app mount
const { user } = useAuth()

onMounted(() => {
  console.log('App mounted, user:', user.value?.email || 'Guest')
})
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  color: #2c3e50;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}

/* Utility classes */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive utilities */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}
</style>
