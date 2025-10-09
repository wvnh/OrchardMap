<template>
  <div class="tree-marker-popup">
    <!-- Header with tree identifier -->
    <div class="popup-header">
      <q-icon name="park" size="24px" color="green" />
      <h4>{{ tree.tree_code || 'Boom #' + tree.id }}</h4>
    </div>

    <!-- Basic Info -->
    <div class="popup-section">
      <div class="info-row">
        <span class="label">Soort:</span>
        <span class="value">{{ speciesName }}</span>
      </div>
      <div v-if="tree.planting_year" class="info-row">
        <span class="label">Plantjaar:</span>
        <span class="value">{{ tree.planting_year }}</span>
      </div>
      <div v-if="age" class="info-row">
        <span class="label">Leeftijd:</span>
        <span class="value">{{ age }} jaar</span>
      </div>
    </div>

    <!-- Health Status -->
    <div v-if="tree.health_status || tree.condition_rating" class="popup-section">
      <div v-if="tree.health_status" class="info-row">
        <span class="label">Gezondheid:</span>
        <q-badge :color="healthColor">{{ tree.health_status }}</q-badge>
      </div>
      <div v-if="tree.condition_rating" class="info-row">
        <span class="label">Conditie:</span>
        <q-rating 
          :model-value="tree.condition_rating" 
          size="sm" 
          color="amber"
          readonly
        />
      </div>
    </div>

    <!-- Location Info -->
    <div class="popup-section">
      <div class="info-row">
        <span class="label">Locatie:</span>
        <span class="value coordinates">
          {{ formatCoordinate(tree.latitude, 'lat') }}, 
          {{ formatCoordinate(tree.longitude, 'lng') }}
        </span>
      </div>
      <div v-if="distance !== null" class="info-row">
        <span class="label">Afstand:</span>
        <span class="value">{{ formatDistance(distance) }}</span>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="tree.notes" class="popup-section">
      <div class="info-row">
        <span class="label">Notities:</span>
        <p class="notes">{{ tree.notes }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="popup-actions">
      <q-btn
        size="sm"
        color="primary"
        label="Details"
        icon="info"
        @click="$emit('view-details', tree)"
        flat
        dense
      />
      <q-btn
        v-if="showNavigate && tree.latitude && tree.longitude"
        size="sm"
        color="positive"
        label="Navigeer"
        icon="near_me"
        @click="$emit('navigate', tree)"
        flat
        dense
      />
      <q-btn
        v-if="canEdit"
        size="sm"
        color="secondary"
        label="Bewerk"
        icon="edit"
        @click="$emit('edit', tree)"
        flat
        dense
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  tree: {
    type: Object,
    required: true
  },
  speciesName: {
    type: String,
    default: 'Onbekend'
  },
  distance: {
    type: Number,
    default: null
  },
  showNavigate: {
    type: Boolean,
    default: true
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['view-details', 'navigate', 'edit'])

// Computed
const age = computed(() => {
  if (!props.tree.planting_year) return null
  const currentYear = new Date().getFullYear()
  return currentYear - props.tree.planting_year
})

const healthColor = computed(() => {
  const status = props.tree.health_status?.toLowerCase()
  switch(status) {
    case 'excellent':
    case 'uitstekend':
      return 'green'
    case 'good':
    case 'goed':
      return 'light-green'
    case 'fair':
    case 'redelijk':
      return 'orange'
    case 'poor':
    case 'slecht':
      return 'red'
    case 'critical':
    case 'kritiek':
      return 'deep-orange'
    default:
      return 'grey'
  }
})

// Methods
const formatCoordinate = (value, type) => {
  if (!value) return 'N/A'
  const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  return `${Math.abs(value).toFixed(6)}° ${direction}`
}

const formatDistance = (meters) => {
  if (meters === null || meters === undefined) return 'N/A'
  
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  } else {
    return `${(meters / 1000).toFixed(2)}km`
  }
}
</script>

<style scoped>
.tree-marker-popup {
  min-width: 250px;
  max-width: 350px;
  font-family: inherit;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.popup-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.popup-section {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  gap: 8px;
}

.info-row .label {
  font-weight: 500;
  color: #666;
  font-size: 13px;
  flex-shrink: 0;
}

.info-row .value {
  color: #1a1a1a;
  font-size: 13px;
  text-align: right;
}

.info-row .coordinates {
  font-family: monospace;
  font-size: 11px;
}

.notes {
  margin: 4px 0 0 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.popup-actions {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  flex-wrap: wrap;
}

.popup-actions .q-btn {
  flex: 1;
  min-width: fit-content;
}
</style>
