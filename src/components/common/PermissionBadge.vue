<template>
  <div class="permission-badge" :class="`permission-badge--${badgeType}`">
    <span class="permission-badge__icon">{{ badgeIcon }}</span>
    <span class="permission-badge__text">{{ badgeText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '../../composables/useAuth.js'

const props = defineProps({
  orchard: {
    type: Object,
    required: true
  }
})

const { user, userRole } = useAuth()

const badgeType = computed(() => {
  if (!user.value) return 'guest'
  if (userRole.value === 'admin') return 'admin'
  if (props.orchard.owner_id === user.value.id) return 'owner'
  
  // Check permissions
  const permission = props.orchard.orchard_permissions?.find(p => p.user_id === user.value.id)
  if (permission) {
    if (permission.role === 'orchard_manager') return 'manager'
    if (permission.role === 'orchard_worker') return 'worker'
    return 'user'
  }
  
  return props.orchard.is_public ? 'public' : 'no-access'
})

const badgeIcon = computed(() => {
  const icons = {
    admin: '👑',
    owner: '🔑',
    manager: '👨‍💼',
    worker: '👷',
    user: '👤',
    public: '🌍',
    guest: '👁️',
    'no-access': '🔒'
  }
  return icons[badgeType.value] || '❓'
})

const badgeText = computed(() => {
  const texts = {
    admin: 'Admin',
    owner: 'Owner',
    manager: 'Manager',
    worker: 'Worker',
    user: 'Viewer',
    public: 'Public',
    guest: 'Guest',
    'no-access': 'No Access'
  }
  return texts[badgeType.value] || 'Unknown'
})
</script>

<style scoped>
.permission-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.permission-badge__icon {
  font-size: 0.875rem;
}

.permission-badge--admin {
  background-color: #9b59b6;
  color: white;
}

.permission-badge--owner {
  background-color: #2ecc71;
  color: white;
}

.permission-badge--manager {
  background-color: #3498db;
  color: white;
}

.permission-badge--worker {
  background-color: #f39c12;
  color: white;
}

.permission-badge--user {
  background-color: #95a5a6;
  color: white;
}

.permission-badge--public {
  background-color: #1abc9c;
  color: white;
}

.permission-badge--guest {
  background-color: #bdc3c7;
  color: #2c3e50;
}

.permission-badge--no-access {
  background-color: #e74c3c;
  color: white;
}
</style>
