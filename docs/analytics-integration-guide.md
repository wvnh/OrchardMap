# Analytics Dashboard - Integration Guide

## 🎯 Overzicht

Dit document beschrijft hoe je het Analytics Dashboard integreert in een bestaande of nieuwe Vue.js 3 applicatie.

## 📋 Prerequisites

Zorg dat je de volgende dependencies geïnstalleerd hebt:

```bash
npm install chart.js vue-chartjs
npm install quasar @quasar/extras  # Als nog niet geïnstalleerd
npm install vue-router             # Voor routing
```

## 🚀 Quick Start Integration

### Stap 1: Kopieer de Bestanden

Kopieer de volgende bestanden naar je Vue project:

```
src/
├── composables/
│   └── useAnalytics.js
├── components/
│   └── analytics/
│       ├── KeyMetricsCard.vue
│       ├── SpeciesDistributionChart.vue
│       ├── HealthStatusChart.vue
│       └── PlantingTrendsChart.vue
└── views/
    └── DashboardPage.vue
```

### Stap 2: Router Setup

Voeg de dashboard route toe aan je router:

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/views/DashboardPage.vue'

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { 
      requiresAuth: true,
      title: 'Analytics Dashboard'
    }
  },
  // ... andere routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### Stap 3: Quasar Plugin Setup (indien nodig)

Als je Quasar nog niet hebt geconfigureerd:

```javascript
// src/main.js
import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify
  }
})

app.use(router)
app.mount('#app')
```

### Stap 4: Navigatie Menu

Voeg een link naar het dashboard toe in je navigatie:

```vue
<!-- src/components/Navigation.vue -->
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/dashboard">
      <q-icon name="analytics" />
      Dashboard
    </router-link>
    <router-link to="/orchards">Boomgaarden</router-link>
  </nav>
</template>
```

### Stap 5: Test de Integratie

Start je development server en navigeer naar `/dashboard`:

```bash
npm run dev
```

## 🎨 Customization

### Theme Aanpassen

De dashboard kleuren kun je aanpassen via CSS variabelen:

```vue
<style>
:root {
  --dashboard-primary: #667eea;
  --dashboard-secondary: #764ba2;
}

.metric-item {
  background: linear-gradient(135deg, 
    var(--dashboard-primary) 0%, 
    var(--dashboard-secondary) 100%);
}
</style>
```

### Custom Metrics

Voeg je eigen metrics toe in de composable:

```javascript
// src/composables/useAnalytics.js
const keyMetrics = computed(() => {
  return {
    // Bestaande metrics...
    totalOrchards: orchards.value.length,
    
    // Custom metric
    oldestTree: computed(() => {
      const oldest = trees.value.reduce((min, tree) => {
        return tree.planted_date < min.planted_date ? tree : min
      })
      return new Date().getFullYear() - new Date(oldest.planted_date).getFullYear()
    })
  }
})
```

### Eigen Chart Toevoegen

Maak een nieuwe chart component:

```vue
<!-- src/components/analytics/FruitTypeChart.vue -->
<template>
  <q-card class="chart-card" flat bordered>
    <q-card-section>
      <div class="text-h6 q-mb-md">{{ title }}</div>
      
      <div v-if="chartData" class="chart-container">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  title: { type: String, default: 'Fruit Types' },
  distribution: { type: Array, required: true }
})

const chartData = computed(() => ({
  labels: props.distribution.map(d => d.type),
  datasets: [{
    data: props.distribution.map(d => d.count),
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true
}
</script>
```

Voeg het toe aan het dashboard:

```vue
<!-- src/views/DashboardPage.vue -->
<template>
  <div class="charts-grid">
    <!-- Bestaande charts... -->
    
    <FruitTypeChart
      title="Fruit Types"
      :distribution="fruitTypeDistribution"
    />
  </div>
</template>

<script setup>
import FruitTypeChart from '@/components/analytics/FruitTypeChart.vue'
// Import useAnalytics composable
const { fruitTypeDistribution } = useAnalytics()
</script>
```

## 🔐 Security & Permissions

### Auth Guard

Voeg een route guard toe om alleen ingelogde gebruikers toegang te geven:

```javascript
// src/router/index.js
import { useAuth } from '@/composables/useAuth'

router.beforeEach((to, from, next) => {
  const { user } = useAuth()
  
  if (to.meta.requiresAuth && !user.value) {
    next('/login')
  } else {
    next()
  }
})
```

### Role-based Access

Beperk toegang tot specifieke rollen:

```javascript
router.beforeEach((to, from, next) => {
  const { user, userRole } = useAuth()
  
  if (to.meta.requiresRole) {
    const allowedRoles = to.meta.requiresRole
    
    if (!allowedRoles.includes(userRole.value)) {
      next('/unauthorized')
      return
    }
  }
  
  next()
})

// Route definitie
{
  path: '/dashboard',
  component: DashboardPage,
  meta: {
    requiresAuth: true,
    requiresRole: ['admin', 'orchard_manager']
  }
}
```

## 📊 Data Fetching Strategies

### Option 1: On Mount (Current)

Data wordt geladen bij component mount:

```javascript
onMounted(async () => {
  await loadAnalyticsData()
})
```

### Option 2: Lazy Loading

Data wordt alleen geladen wanneer de gebruiker het dashboard opent:

```javascript
// Use router navigation guard
onBeforeRouteEnter((to, from, next) => {
  const { loadAnalyticsData } = useAnalytics()
  loadAnalyticsData().then(() => next())
})
```

### Option 3: Background Refresh

Data wordt automatisch ververst:

```javascript
import { useIntervalFn } from '@vueuse/core'

onMounted(() => {
  loadAnalyticsData()
  
  // Refresh elke 5 minuten
  useIntervalFn(() => {
    loadAnalyticsData()
  }, 5 * 60 * 1000)
})
```

### Option 4: Real-time Updates

Gebruik Supabase Realtime voor live updates:

```javascript
import { supabase } from '@/config/supabase'

onMounted(() => {
  loadAnalyticsData()
  
  const subscription = supabase
    .channel('analytics')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orchard_trees' },
      () => loadAnalyticsData()
    )
    .subscribe()
    
  onUnmounted(() => {
    supabase.removeChannel(subscription)
  })
})
```

## 🎨 Styling Options

### Option 1: Tailwind CSS

Als je Tailwind gebruikt in plaats van pure Quasar:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Voeg custom classes toe:

```vue
<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Components -->
    </div>
  </div>
</template>
```

### Option 2: Custom CSS

Maak een dedicated stylesheet:

```css
/* src/assets/styles/dashboard.css */
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
```

Import in je component:

```vue
<script setup>
import '@/assets/styles/dashboard.css'
</script>
```

## 🧪 Testing

### Unit Tests

```javascript
// tests/views/DashboardPage.test.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardPage from '@/views/DashboardPage.vue'

// Mock composable
vi.mock('@/composables/useAnalytics', () => ({
  useAnalytics: () => ({
    loading: ref(false),
    error: ref(null),
    keyMetrics: ref({
      totalOrchards: 10,
      totalTrees: 100
    }),
    loadAnalyticsData: vi.fn()
  })
}))

describe('DashboardPage', () => {
  it('renders key metrics', () => {
    const wrapper = mount(DashboardPage)
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('100')
  })
})
```

### E2E Tests (Cypress)

```javascript
// cypress/e2e/dashboard.cy.js
describe('Analytics Dashboard', () => {
  beforeEach(() => {
    cy.login() // Custom login command
    cy.visit('/dashboard')
  })
  
  it('loads dashboard successfully', () => {
    cy.contains('Analytics Dashboard')
    cy.get('.metric-card').should('have.length', 6)
  })
  
  it('exports data to CSV', () => {
    cy.contains('Export CSV').first().click()
    cy.readFile('cypress/downloads/species-distribution.csv')
      .should('exist')
  })
})
```

## 🐛 Common Issues

### Issue: Charts not rendering

**Oplossing:** Zorg dat Chart.js elementen correct geregistreerd zijn:

```javascript
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
```

### Issue: Data not loading

**Oplossing:** Check Supabase RLS policies en connectie:

```javascript
const { data, error } = await supabase.from('orchards').select('*')
console.log('Data:', data, 'Error:', error)
```

### Issue: Export not working

**Oplossing:** Check browser download permissions en gebruik user gesture:

```vue
<q-btn @click="downloadCSV('species', 'export.csv')">
  Export
</q-btn>
```

### Issue: Responsive layout broken

**Oplossing:** Check viewport meta tag in index.html:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 📚 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Vue Router](https://router.vuejs.org/)

## 🆘 Support

Voor vragen of problemen:
1. Check de documentatie in `docs/analytics-dashboard.md`
2. Bekijk de voorbeelden in `docs/analytics-usage-examples.md`
3. Raadpleeg de component API in `src/components/analytics/README.md`

## 🎉 Next Steps

Na integratie kun je:
1. Custom metrics toevoegen
2. Nieuwe chart types implementeren
3. Export naar PDF toevoegen
4. Real-time updates implementeren
5. Dashboard widgets customization toevoegen
6. Filtering en date range selection implementeren
