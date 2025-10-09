<template>
  <q-page class="dashboard-page q-pa-md">
    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 q-ma-none">📊 Analytics Dashboard</h4>
        <p class="text-subtitle2 text-grey-7 q-ma-none q-mt-xs">
          Overzicht van boomgaard statistieken en data visualisatie
        </p>
      </div>
      
      <q-btn
        color="primary"
        icon="refresh"
        label="Ververs Data"
        @click="refreshData"
        :loading="loading"
      />
    </div>

    <!-- Error Message -->
    <q-banner v-if="error" class="bg-negative text-white q-mb-md" rounded>
      <template v-slot:avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
    </q-banner>

    <!-- Key Metrics -->
    <div class="q-mb-lg">
      <KeyMetricsCard
        title="Key Metrics"
        :metrics="formattedMetrics"
      />
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Species Distribution -->
      <div class="chart-item">
        <SpeciesDistributionChart
          title="Species Distributie"
          :distribution="speciesDistribution"
          :loading="loading"
          @export="exportSpeciesData"
        />
      </div>

      <!-- Health Status -->
      <div class="chart-item">
        <HealthStatusChart
          title="Gezondheids Status"
          :distribution="healthDistribution"
          :loading="loading"
          @export="exportHealthData"
        />
      </div>

      <!-- Planting Trends -->
      <div class="chart-item full-width">
        <PlantingTrendsChart
          title="Planting Trends Over Tijd"
          :trends="plantingTrends"
          :loading="loading"
          @export="exportTrendsData"
        />
      </div>
    </div>

    <!-- Export All Button -->
    <div class="row justify-center q-mt-lg">
      <q-btn
        outline
        color="primary"
        icon="download"
        label="Export Alle Data (CSV)"
        @click="exportAllData"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAnalytics } from '../composables/useAnalytics.js'
import KeyMetricsCard from '../components/analytics/KeyMetricsCard.vue'
import SpeciesDistributionChart from '../components/analytics/SpeciesDistributionChart.vue'
import HealthStatusChart from '../components/analytics/HealthStatusChart.vue'
import PlantingTrendsChart from '../components/analytics/PlantingTrendsChart.vue'
import { useQuasar } from 'quasar'

/**
 * DashboardPage Component (View/Container)
 * 
 * View component die analytics data laadt en doorgeeft aan presentational components.
 * Bevat de controller logica (data fetching) en state management.
 */

const $q = useQuasar()

// Use analytics composable
const {
  loading,
  error,
  keyMetrics,
  speciesDistribution,
  healthDistribution,
  plantingTrends,
  loadAnalyticsData,
  downloadCSV
} = useAnalytics()

// Format metrics for KeyMetricsCard component
const formattedMetrics = computed(() => [
  {
    label: 'Totaal Boomgaarden',
    value: keyMetrics.value.totalOrchards,
    icon: 'park'
  },
  {
    label: 'Totaal Bomen',
    value: keyMetrics.value.totalTrees,
    icon: 'nature'
  },
  {
    label: 'Boomsoorten',
    value: keyMetrics.value.totalSpecies,
    icon: 'local_florist'
  },
  {
    label: 'Publieke Boomgaarden',
    value: keyMetrics.value.publicOrchards,
    icon: 'public'
  },
  {
    label: 'Gezonde Bomen',
    value: keyMetrics.value.healthyTrees,
    icon: 'favorite'
  },
  {
    label: 'Gem. Bomen/Boomgaard',
    value: keyMetrics.value.avgTreesPerOrchard,
    icon: 'analytics'
  }
])

// Refresh data
const refreshData = async () => {
  await loadAnalyticsData()
  
  $q.notify({
    type: 'positive',
    message: 'Data succesvol ververst',
    position: 'top'
  })
}

// Export functions
const exportSpeciesData = () => {
  downloadCSV('species', 'species-distribution.csv')
  showExportNotification('Species distributie')
}

const exportHealthData = () => {
  downloadCSV('health', 'health-status.csv')
  showExportNotification('Gezondheids status')
}

const exportTrendsData = () => {
  downloadCSV('trends', 'planting-trends.csv')
  showExportNotification('Planting trends')
}

const exportAllData = () => {
  downloadCSV('species', 'species-distribution.csv')
  downloadCSV('health', 'health-status.csv')
  downloadCSV('trends', 'planting-trends.csv')
  downloadCSV('metrics', 'key-metrics.csv')
  
  $q.notify({
    type: 'positive',
    message: 'Alle data geëxporteerd naar CSV',
    position: 'top',
    timeout: 3000
  })
}

const showExportNotification = (dataType) => {
  $q.notify({
    type: 'positive',
    message: `${dataType} geëxporteerd naar CSV`,
    position: 'top'
  })
}

// Load data on mount
onMounted(() => {
  loadAnalyticsData()
})
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-item.full-width {
  grid-column: 1 / -1;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-item.full-width {
    grid-column: 1;
  }
}

@media (max-width: 600px) {
  .dashboard-page {
    padding: 0.5rem;
  }
  
  .text-h4 {
    font-size: 1.5rem;
  }
}
</style>
