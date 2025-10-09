<template>
  <q-card class="key-metrics-card" flat bordered>
    <q-card-section>
      <div class="text-h6 q-mb-md">{{ title }}</div>
      
      <div class="metrics-grid">
        <div 
          v-for="metric in metrics" 
          :key="metric.label"
          class="metric-item"
        >
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-label">{{ metric.label }}</div>
          <q-icon 
            v-if="metric.icon" 
            :name="metric.icon" 
            size="24px"
            class="metric-icon"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
/**
 * KeyMetricsCard Component
 * 
 * Presentational component voor het weergeven van key metrics.
 * Alle data wordt via props ontvangen (Presenter pattern).
 */
defineProps({
  title: {
    type: String,
    default: 'Key Metrics'
  },
  metrics: {
    type: Array,
    required: true,
    // Formaat: [{ label: String, value: Number, icon?: String }]
  }
})
</script>

<style scoped>
.key-metrics-card {
  min-height: 200px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.metric-item {
  position: relative;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  text-align: center;
  transition: transform 0.2s ease;
}

.metric-item:hover {
  transform: translateY(-4px);
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0.3;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .metric-value {
    font-size: 1.5rem;
  }
  
  .metric-label {
    font-size: 0.75rem;
  }
}
</style>
