<template>
  <div 
    class="orchard-card" 
    @click="$emit('click')"
    :class="{ 'orchard-card--clickable': clickable }"
  >
    <div class="orchard-card__header">
      <h3 class="orchard-card__title">{{ orchard.name }}</h3>
      <PermissionBadge 
        v-if="showPermissionBadge"
        :orchard="orchard" 
      />
    </div>

    <div class="orchard-card__location">
      <span class="orchard-card__icon">📍</span>
      <span>{{ orchard.location_name || 'Location not specified' }}</span>
    </div>

    <p v-if="orchard.description" class="orchard-card__description">
      {{ truncateDescription(orchard.description) }}
    </p>

    <div class="orchard-card__meta">
      <div class="orchard-card__meta-item">
        <span class="orchard-card__icon">🌳</span>
        <span>{{ treeCount }} trees</span>
      </div>
      <div class="orchard-card__meta-item">
        <span class="orchard-card__icon">{{ orchard.is_public ? '🌍' : '🔒' }}</span>
        <span>{{ orchard.is_public ? 'Public' : 'Private' }}</span>
      </div>
    </div>

    <div v-if="showOwner" class="orchard-card__owner">
      Owner: {{ ownerName }}
    </div>

    <div v-if="showActions" class="orchard-card__actions">
      <button
        v-if="canEdit"
        @click.stop="$emit('edit', orchard)"
        class="orchard-card__action-btn orchard-card__action-btn--edit"
      >
        ✏️ Edit
      </button>
      <button
        v-if="canDelete"
        @click.stop="$emit('delete', orchard)"
        class="orchard-card__action-btn orchard-card__action-btn--delete"
      >
        🗑️ Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PermissionBadge from '../common/PermissionBadge.vue'

const props = defineProps({
  orchard: {
    type: Object,
    required: true
  },
  treeCount: {
    type: Number,
    default: 0
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  },
  showOwner: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showPermissionBadge: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: true
  },
  maxDescriptionLength: {
    type: Number,
    default: 100
  }
})

defineEmits(['click', 'edit', 'delete'])

const ownerName = computed(() => {
  if (!props.orchard.owner) return 'Unknown'
  return `${props.orchard.owner.first_name} ${props.orchard.owner.last_name}`
})

const truncateDescription = (text) => {
  if (!text) return ''
  if (text.length <= props.maxDescriptionLength) return text
  return text.substring(0, props.maxDescriptionLength) + '...'
}
</script>

<style scoped>
.orchard-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.orchard-card--clickable {
  cursor: pointer;
}

.orchard-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.orchard-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.orchard-card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
}

.orchard-card__location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.orchard-card__icon {
  font-size: 1rem;
}

.orchard-card__description {
  color: #555;
  margin: 0.75rem 0;
  line-height: 1.5;
  font-size: 0.9rem;
}

.orchard-card__meta {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
}

.orchard-card__meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.orchard-card__owner {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
}

.orchard-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
}

.orchard-card__action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.orchard-card__action-btn--edit {
  background-color: #3498db;
  color: white;
}

.orchard-card__action-btn--edit:hover {
  background-color: #2980b9;
}

.orchard-card__action-btn--delete {
  background-color: #e74c3c;
  color: white;
}

.orchard-card__action-btn--delete:hover {
  background-color: #c0392b;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .orchard-card {
    padding: 1rem;
  }

  .orchard-card__title {
    font-size: 1.1rem;
  }

  .orchard-card__meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .orchard-card__actions {
    flex-direction: column;
  }

  .orchard-card__action-btn {
    width: 100%;
  }
}
</style>
