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
        <Pie :data="chartData" :options="chartOptions" />
      </div>

      <div v-else class="text-center q-pa-xl text-grey-6">
        Geen data beschikbaar
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Registreer Chart.js componenten
ChartJS.register(ArcElement, Tooltip, Legend)

/**
 * SpeciesDistributionChart Component
 * 
 * Presentational component voor species distributie pie chart.
 * Alle data wordt via props ontvangen (Presenter pattern).
 */
const props = defineProps({
  title: {
    type: String,
    default: 'Species Distributie'
  },
  distribution: {
    type: Array,
    required: true,
    // Formaat: [{ name: String, count: Number }]
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['export'])

// Chart data formatting
const chartData = computed(() => {
  if (!props.distribution || props.distribution.length === 0) {
    return null
  }

  return {
    labels: props.distribution.map(item => item.name),
    datasets: [{
      data: props.distribution.map(item => item.count),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 15,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.parsed || 0
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        }
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
  max-height: 400px;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .chart-container {
    height: 250px;
  }
}
</style>
