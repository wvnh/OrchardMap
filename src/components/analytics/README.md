# Analytics Components

Dit document beschrijft alle analytics components in de OrchardMap applicatie.

## Overzicht

De analytics components volgen het **Presenter Pattern**. Ze zijn "dom" en ontvangen alle data via props. Dit zorgt voor:
- ✅ Herbruikbaarheid
- ✅ Testbaarheid  
- ✅ Onderhoudbaarheid
- ✅ Scheiding van concerns

## Component Lijst

### KeyMetricsCard.vue

**Type:** Presentational Component

**Beschrijving:** Toont key metrics in een responsive card layout met gradient styling.

**Props:**
- `title` (String, default: 'Key Metrics') - Card titel
- `metrics` (Array, required) - Array van metrics om te tonen

**Metrics Format:**
```javascript
[
  {
    label: 'Totaal Bomen',
    value: 245,
    icon: 'nature' // Optioneel: Material icon naam
  }
]
```

**Voorbeeld:**
```vue
<KeyMetricsCard
  title="Boomgaard Statistics"
  :metrics="myMetrics"
/>
```

**Features:**
- Responsive grid layout (2 kolommen op mobile, auto-fit op desktop)
- Gradient background per metric
- Hover effecten
- Material icons support

---

### SpeciesDistributionChart.vue

**Type:** Presentational Component (Chart)

**Beschrijving:** Pie chart voor het visualiseren van species distributie.

**Props:**
- `title` (String, default: 'Species Distributie') - Chart titel
- `distribution` (Array, required) - Species data
- `loading` (Boolean, default: false) - Loading state

**Events:**
- `@export` - Geëmit wanneer export button wordt geklikt

**Distribution Format:**
```javascript
[
  {
    name: 'Jonagold',
    count: 45,
    fruitType: 'Appel' // Niet gebruikt in chart maar handig voor export
  }
]
```

**Voorbeeld:**
```vue
<SpeciesDistributionChart
  title="Top Species"
  :distribution="speciesData"
  :loading="isLoading"
  @export="handleExport"
/>
```

**Features:**
- Chart.js Pie chart integratie
- Interactieve tooltips met percentages
- Kleurrijke segments
- Legend rechts van de chart
- Export button met CSV download
- Loading spinner
- Empty state message

---

### HealthStatusChart.vue

**Type:** Presentational Component (Chart)

**Beschrijving:** Bar chart voor het visualiseren van boom gezondheid.

**Props:**
- `title` (String, default: 'Gezondheids Status') - Chart titel
- `distribution` (Array, required) - Health status data
- `loading` (Boolean, default: false) - Loading state

**Events:**
- `@export` - Geëmit wanneer export button wordt geklikt

**Distribution Format:**
```javascript
[
  {
    status: 'healthy',
    count: 198
  },
  {
    status: 'fair',
    count: 35
  }
]
```

**Status Types:**
- `healthy` - Gezond (groen)
- `fair` - Redelijk (oranje)
- `poor` - Slecht (donker oranje)
- `diseased` - Ziek (rood)
- `dead` - Dood (grijs)

**Voorbeeld:**
```vue
<HealthStatusChart
  title="Boom Gezondheid"
  :distribution="healthData"
  :loading="isLoading"
  @export="handleExport"
/>
```

**Features:**
- Chart.js Bar chart integratie
- Kleurgecodeerde bars per status
- Rounded corners
- Y-axis start bij 0
- Export button

---

### PlantingTrendsChart.vue

**Type:** Presentational Component (Chart)

**Beschrijving:** Line chart voor het visualiseren van planting trends over tijd.

**Props:**
- `title` (String, default: 'Planting Trends') - Chart titel
- `trends` (Array, required) - Planting data per jaar
- `loading` (Boolean, default: false) - Loading state

**Events:**
- `@export` - Geëmit wanneer export button wordt geklikt

**Trends Format:**
```javascript
[
  {
    year: 2020,
    count: 45
  },
  {
    year: 2021,
    count: 62
  }
]
```

**Voorbeeld:**
```vue
<PlantingTrendsChart
  title="Aanplant Historie"
  :trends="trendData"
  :loading="isLoading"
  @export="handleExport"
/>
```

**Features:**
- Chart.js Line chart integratie
- Gradient fill onder de lijn
- Smooth curves (tension: 0.4)
- Hover interactie
- Point highlighting
- Export button

---

## Algemene Features

Alle chart components delen deze features:

### 1. Responsive Design
- Mobile: Single column, kleinere charts
- Tablet: Adaptive layout
- Desktop: Multi-column grid

### 2. Loading States
```vue
<ComponentName :loading="true" />
```
Toont een spinner wanneer data wordt geladen.

### 3. Empty States
```vue
<ComponentName :distribution="[]" />
```
Toont een vriendelijk bericht wanneer geen data beschikbaar is.

### 4. Export Functionaliteit
```vue
<ComponentName @export="handleExport" />
```
Alle charts hebben een export button die een event emitted.

### 5. Styling
- Quasar QCard wrapper
- Scoped CSS voor isolatie
- Consistent met OrchardMap design system
- Material Design inspired

## Chart.js Configuratie

### Geregistreerde Elementen

**Voor Pie Charts:**
```javascript
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
```

**Voor Bar Charts:**
```javascript
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
```

**Voor Line Charts:**
```javascript
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
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
)
```

## Custom Chart Creation

Je kunt eenvoudig nieuwe chart components maken door bestaande te kopiëren:

```vue
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
        />
      </div>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="chartData" class="chart-container">
        <!-- Your Chart Component Here -->
        <YourChartType :data="chartData" :options="chartOptions" />
      </div>

      <div v-else class="text-center q-pa-xl text-grey-6">
        Geen data beschikbaar
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { YourChartType } from 'vue-chartjs'
import { Chart as ChartJS, /* ... */ } from 'chart.js'

ChartJS.register(/* required elements */)

const props = defineProps({
  title: String,
  data: Array,
  loading: Boolean
})

defineEmits(['export'])

const chartData = computed(() => {
  // Transform your data here
  return {
    labels: props.data.map(/* ... */),
    datasets: [/* ... */]
  }
})

const chartOptions = {
  // Chart.js options
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
</style>
```

## Best Practices

### 1. Prop Validation
Gebruik altijd prop validation voor robuuste components:
```javascript
defineProps({
  distribution: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => 
        item.hasOwnProperty('name') && 
        item.hasOwnProperty('count')
      )
    }
  }
})
```

### 2. Computed Properties
Gebruik computed voor data transformatie:
```javascript
const chartData = computed(() => {
  return transformData(props.distribution)
})
```

### 3. Error Boundaries
Check altijd of data bestaat voordat je het gebruikt:
```vue
<div v-if="chartData && chartData.labels.length > 0">
  <!-- Chart -->
</div>
```

### 4. Performance
- Gebruik `v-if` in plaats van `v-show` voor charts (ze hoeven niet gemount te blijven)
- Destructure props alleen als nodig
- Gebruik Chart.js responsive mode

## Testing

### Unit Test Voorbeeld

```javascript
import { mount } from '@vue/test-utils'
import SpeciesDistributionChart from '@/components/analytics/SpeciesDistributionChart.vue'

describe('SpeciesDistributionChart', () => {
  it('renders loading state', () => {
    const wrapper = mount(SpeciesDistributionChart, {
      props: {
        distribution: [],
        loading: true
      }
    })
    
    expect(wrapper.find('.q-spinner').exists()).toBe(true)
  })
  
  it('emits export event', async () => {
    const wrapper = mount(SpeciesDistributionChart, {
      props: {
        distribution: [{ name: 'Test', count: 5 }],
        loading: false
      }
    })
    
    await wrapper.find('button[icon="download"]').trigger('click')
    expect(wrapper.emitted('export')).toBeTruthy()
  })
})
```

## Troubleshooting

### Chart niet zichtbaar
- Controleer of Chart.js elementen zijn geregistreerd
- Controleer of data correct geformatteerd is
- Check browser console voor errors

### Empty state altijd zichtbaar
- Verify dat `distribution` prop correct data bevat
- Check computed property logic

### Export werkt niet
- Verify dat parent component de `@export` event afhandelt
- Check browser console permissions

## Resources

- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [vue-chartjs Guide](https://vue-chartjs.org/guide/)
- [Quasar QCard](https://quasar.dev/vue-components/card)
- [Vue Props Documentation](https://vuejs.org/guide/components/props.html)
