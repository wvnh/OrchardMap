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
        <Line :data="chartData" :options="chartOptions" />
      </div>

      <div v-else class="text-center q-pa-xl text-grey-6">
        Geen plantdata beschikbaar
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Registreer Chart.js componenten
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

/**
 * PlantingTrendsChart Component
 * 
 * Presentational component voor planting trends line chart.
 * Alle data wordt via props ontvangen (Presenter pattern).
 */
const props = defineProps({
  title: {
    type: String,
    default: 'Planting Trends'
  },
  trends: {
    type: Array,
    required: true,
    // Formaat: [{ year: Number, count: Number }]
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['export'])

// Chart data formatting
const chartData = computed(() => {
  if (!props.trends || props.trends.length === 0) {
    return null
  }

  return {
    labels: props.trends.map(item => item.year.toString()),
    datasets: [{
      label: 'Geplante Bomen',
      data: props.trends.map(item => item.count),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#667eea',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${context.parsed.y} bomen`
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
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
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
