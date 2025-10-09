# Analytics Dashboard - Usage Examples

Dit document bevat praktische voorbeelden voor het gebruik van het Analytics Dashboard in OrchardMap.

## Quick Start

### 1. Basis Dashboard Integratie

```vue
<!-- src/App.vue of main router view -->
<template>
  <router-view />
</template>

<script setup>
import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/views/DashboardPage.vue'

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  }
]
</script>
```

### 2. Navigatie Menu Item

```vue
<!-- Navigation Component -->
<template>
  <q-list>
    <q-item clickable @click="$router.push('/dashboard')">
      <q-item-section avatar>
        <q-icon name="analytics" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Dashboard</q-item-label>
        <q-item-label caption>Analytics & Statistieken</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
```

## Advanced Usage

### Custom Analytics View

Je kunt je eigen analytics view maken met de composable:

```vue
<template>
  <div class="custom-analytics">
    <h2>Mijn Custom Analytics</h2>
    
    <!-- Loading State -->
    <div v-if="loading">
      <q-spinner size="50px" />
      <p>Data laden...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <!-- Success State -->
    <div v-else>
      <!-- Key Metrics -->
      <div class="metrics">
        <div class="metric">
          <h3>{{ keyMetrics.totalOrchards }}</h3>
          <p>Boomgaarden</p>
        </div>
        <div class="metric">
          <h3>{{ keyMetrics.totalTrees }}</h3>
          <p>Bomen</p>
        </div>
      </div>
      
      <!-- Custom Chart -->
      <SpeciesDistributionChart
        :distribution="speciesDistribution"
        :loading="false"
        @export="handleExport"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import SpeciesDistributionChart from '@/components/analytics/SpeciesDistributionChart.vue'

const {
  loading,
  error,
  keyMetrics,
  speciesDistribution,
  loadAnalyticsData,
  downloadCSV
} = useAnalytics()

const handleExport = () => {
  downloadCSV('species', 'my-export.csv')
}

onMounted(async () => {
  await loadAnalyticsData()
})
</script>
```

### Filtered Analytics (Per Orchard)

```vue
<script setup>
import { computed } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const props = defineProps({
  orchardId: {
    type: String,
    required: true
  }
})

const { trees, species, loadAnalyticsData } = useAnalytics()

// Filter trees voor specifieke boomgaard
const orchardTrees = computed(() => {
  return trees.value.filter(t => t.orchard_id === props.orchardId)
})

// Bereken metrics voor deze boomgaard
const orchardMetrics = computed(() => {
  return {
    totalTrees: orchardTrees.value.length,
    healthyTrees: orchardTrees.value.filter(t => t.health_status === 'healthy').length,
    uniqueSpecies: new Set(orchardTrees.value.map(t => t.tree_species_id)).size
  }
})

onMounted(async () => {
  await loadAnalyticsData()
})
</script>

<template>
  <div>
    <h3>Analytics voor Boomgaard {{ orchardId }}</h3>
    <p>Totaal bomen: {{ orchardMetrics.totalTrees }}</p>
    <p>Gezonde bomen: {{ orchardMetrics.healthyTrees }}</p>
    <p>Unieke soorten: {{ orchardMetrics.uniqueSpecies }}</p>
  </div>
</template>
```

### Real-time Updates met Supabase

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { supabase } from '@/config/supabase'

const { loadAnalyticsData } = useAnalytics()

let subscription = null

onMounted(async () => {
  // Initial load
  await loadAnalyticsData()
  
  // Subscribe to real-time updates
  subscription = supabase
    .channel('analytics-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orchard_trees' },
      async (payload) => {
        console.log('Tree data changed:', payload)
        // Reload analytics data
        await loadAnalyticsData()
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>
```

### Export with Custom Filename

```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { downloadCSV } = useAnalytics()

const exportWithDate = (dataType) => {
  const date = new Date().toISOString().split('T')[0]
  const filename = `${dataType}-${date}.csv`
  downloadCSV(dataType, filename)
}

// Usage
exportWithDate('species') // -> species-2024-10-09.csv
</script>
```

### Standalone Chart Usage

Je kunt de chart components ook standalone gebruiken:

```vue
<template>
  <div>
    <KeyMetricsCard
      title="Mijn Metrics"
      :metrics="myMetrics"
    />
    
    <SpeciesDistributionChart
      title="Top 5 Species"
      :distribution="top5Species"
      :loading="false"
      @export="handleExport"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KeyMetricsCard from '@/components/analytics/KeyMetricsCard.vue'
import SpeciesDistributionChart from '@/components/analytics/SpeciesDistributionChart.vue'

const myMetrics = ref([
  { label: 'Metric 1', value: 100, icon: 'star' },
  { label: 'Metric 2', value: 200, icon: 'favorite' }
])

const top5Species = ref([
  { name: 'Jonagold', count: 45, fruitType: 'Appel' },
  { name: 'Cox Orange', count: 32, fruitType: 'Appel' },
  { name: 'Elstar', count: 28, fruitType: 'Appel' },
  { name: 'Conference', count: 25, fruitType: 'Peer' },
  { name: 'Granny Smith', count: 20, fruitType: 'Appel' }
])

const handleExport = () => {
  console.log('Export clicked')
}
</script>
```

## Integration with Existing Features

### Dashboard + Auth Integration

```vue
<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAnalytics } from '@/composables/useAnalytics'

const { user, userRole } = useAuth()
const { loadAnalyticsData, orchards } = useAnalytics()

// Filter orchards based on user role
const accessibleOrchards = computed(() => {
  if (userRole.value === 'admin') {
    return orchards.value
  }
  
  // For regular users, show only their orchards
  return orchards.value.filter(o => 
    o.is_public || o.owner_id === user.value?.id
  )
})

onMounted(async () => {
  if (user.value) {
    await loadAnalyticsData()
  }
})
</script>
```

### Dashboard in Layout

```vue
<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>OrchardMap</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>
        
        <q-item clickable to="/dashboard">
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        
        <q-item clickable to="/orchards">
          <q-item-section avatar>
            <q-icon name="park" />
          </q-item-section>
          <q-item-section>Boomgaarden</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

## Testing Examples

### Component Testing (Vitest)

```javascript
// tests/components/KeyMetricsCard.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KeyMetricsCard from '@/components/analytics/KeyMetricsCard.vue'

describe('KeyMetricsCard', () => {
  it('renders metrics correctly', () => {
    const metrics = [
      { label: 'Test Metric', value: 42, icon: 'star' }
    ]
    
    const wrapper = mount(KeyMetricsCard, {
      props: { metrics, title: 'Test Title' }
    })
    
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('Test Metric')
  })
})
```

### Composable Testing

```javascript
// tests/composables/useAnalytics.test.js
import { describe, it, expect, vi } from 'vitest'
import { useAnalytics } from '@/composables/useAnalytics'

// Mock Supabase
vi.mock('@/config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}))

describe('useAnalytics', () => {
  it('calculates key metrics correctly', async () => {
    const { keyMetrics, loadAnalyticsData } = useAnalytics()
    
    await loadAnalyticsData()
    
    expect(keyMetrics.value).toBeDefined()
    expect(keyMetrics.value.totalOrchards).toBeGreaterThanOrEqual(0)
  })
  
  it('generates CSV correctly', () => {
    const { exportToCSV } = useAnalytics()
    
    const csv = exportToCSV('metrics')
    
    expect(csv).toContain('Key Metric,Value')
  })
})
```

## Performance Tips

### 1. Lazy Loading

```javascript
// router/index.js
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    // Lazy load dashboard voor betere initial load performance
    component: () => import('@/views/DashboardPage.vue')
  }
]
```

### 2. Debounced Refresh

```vue
<script setup>
import { ref } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useDebounceFn } from '@vueuse/core'

const { loadAnalyticsData } = useAnalytics()

// Debounce refresh om te voorkomen dat data te vaak wordt geladen
const debouncedRefresh = useDebounceFn(async () => {
  await loadAnalyticsData()
}, 1000)
</script>
```

### 3. Cached Data

```javascript
// Store analytics data in localStorage voor offline access
const cacheAnalyticsData = (data) => {
  localStorage.setItem('analytics-cache', JSON.stringify({
    data,
    timestamp: Date.now()
  }))
}

const getCachedData = () => {
  const cached = localStorage.getItem('analytics-cache')
  if (!cached) return null
  
  const { data, timestamp } = JSON.parse(cached)
  const age = Date.now() - timestamp
  
  // Cache is 5 minuten geldig
  if (age < 5 * 60 * 1000) {
    return data
  }
  
  return null
}
```

## Troubleshooting

### Charts niet zichtbaar
```javascript
// Zorg ervoor dat Chart.js correct is geregistreerd
import { Chart as ChartJS } from 'chart.js'
ChartJS.register(/* alle benodigde elementen */)
```

### Data wordt niet geladen
```javascript
// Check RLS policies in Supabase
// Gebruiker moet toegang hebben tot de tabellen
const { data, error } = await supabase
  .from('orchards')
  .select('*')

if (error) {
  console.error('RLS error:', error)
}
```

### Export werkt niet
```javascript
// Check browser permissions
// Sommige browsers blokkeren automatische downloads
// Voeg user interaction toe (button click)
```

## Resources

- [Chart.js Documentation](https://www.chartjs.org/)
- [vue-chartjs Documentation](https://vue-chartjs.org/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Quasar Components](https://quasar.dev/vue-components/)
