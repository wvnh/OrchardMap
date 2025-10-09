<template>
  <q-card class="chart-card" flat bordered>
    <q-card-section>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">{{ title }}</div>
        <q-btn
          flat
          dense
          icon="download"
          color="primary"
          @click="$emit('export')"
        >
          <q-tooltip>Export naar CSV</q-tooltip>
        </q-btn>
      </div>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="chartData && chartData.labels.length > 0" class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <div v-else class="text-center q-pa-xl text-grey-6">
        Geen data beschikbaar
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Registreer Chart.js componenten
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

/**
 * HealthStatusChart Component
 * 
 * Presentational component voor health status bar chart.
 * Alle data wordt via props ontvangen (Presenter pattern).
 */
const props = defineProps({
  title: {
    type: String,
    default: 'Gezondheids Status'
  },
  distribution: {
    type: Array,
    required: true,
    // Formaat: [{ status: String, count: Number }]
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['export'])

// Status labels mapping
const statusLabels = {
  healthy: 'Gezond',
  fair: 'Redelijk',
  poor: 'Slecht',
  diseased: 'Ziek',
  dead: 'Dood'
}

// Status colors mapping
const statusColors = {
  healthy: '#4CAF50',
  fair: '#FFC107',
  poor: '#FF9800',
  diseased: '#F44336',
  dead: '#9E9E9E'
}

// Chart data formatting
const chartData = computed(() => {
  if (!props.distribution || props.distribution.length === 0) {
    return null
  }

  return {
    labels: props.distribution.map(item => statusLabels[item.status] || item.status),
    datasets: [{
      label: 'Aantal Bomen',
      data: props.distribution.map(item => item.count),
      backgroundColor: props.distribution.map(item => statusColors[item.status] || '#607D8B'),
      borderWidth: 0,
      borderRadius: 4
    }]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed.y
          return `${context.dataset.label}: ${value}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}
</script>

<style scoped>
.chart-card {
  min-height: 350px;
}

.chart-container {
  position: relative;
  height: 300px;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .chart-container {
    height: 250px;
  }
}
</style>
