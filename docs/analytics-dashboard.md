# Analytics Dashboard Documentation

## Overzicht

Het Analytics Dashboard biedt uitgebreide statistieken en data visualisatie voor OrchardMap. Het dashboard toont real-time insights over boomgaarden, bomen en boomsoorten.

## Architectuur

Het Analytics Dashboard volgt de **Container/Presenter** architectuur van OrchardMap:

### Composable (Data Layer)
- **`useAnalytics.js`**: Centrale composable voor data fetching en berekeningen
  - Haalt data op van Supabase (orchards, trees, species)
  - Berekent key metrics en statistieken
  - Biedt export functionaliteit naar CSV

### View Component (Container)
- **`DashboardPage.vue`**: Main dashboard view component
  - Gebruikt `useAnalytics` composable voor data
  - Beheert state en loading states
  - Geeft data door aan presentational components

### Presentational Components
Alle presentational components zijn "dom" en ontvangen alle data via props:

- **`KeyMetricsCard.vue`**: Toont key metrics in card layout
- **`SpeciesDistributionChart.vue`**: Pie chart voor species distributie
- **`HealthStatusChart.vue`**: Bar chart voor boom gezondheid
- **`PlantingTrendsChart.vue`**: Line chart voor planttrends over tijd

## Features

### 📊 Key Metrics
Het dashboard toont de volgende metrics:
- Totaal aantal boomgaarden
- Totaal aantal bomen
- Aantal verschillende boomsoorten
- Aantal publieke boomgaarden
- Aantal gezonde bomen
- Gemiddeld aantal bomen per boomgaard

### 📈 Visualisaties

#### Species Distributie (Pie Chart)
- Toont verdeling van bomen per boomsoort
- Interactieve tooltips met percentages
- Kleurgecodeerd voor duidelijkheid

#### Gezondheids Status (Bar Chart)
- Visualiseert boom gezondheid (healthy, fair, poor, diseased, dead)
- Kleurcodering: groen (gezond) tot grijs (dood)

#### Planting Trends (Line Chart)
- Toont aantal geplante bomen per jaar
- Helpt bij het identificeren van groei patronen

### 💾 Export Functionaliteit

Het dashboard biedt CSV export voor:
- Species distributie data
- Gezondheids status data
- Planting trends data
- Key metrics data
- "Export All" voor complete dataset

Export formaat:
```csv
Species,Count,Fruit Type
"Jonagold",45,"Appel"
"Cox Orange Pippin",32,"Appel"
```

### 📱 Mobile Responsive

Het dashboard is volledig responsive:
- **Desktop**: 2-column grid layout voor charts
- **Tablet**: Adaptive grid layout
- **Mobile**: Single column layout met touch-friendly controls

Breakpoints:
- < 600px: Mobile layout (2-column metrics, single column charts)
- < 768px: Tablet layout (single column charts)
- \> 768px: Desktop layout (multi-column grid)

## Gebruik

### Basic Usage

```vue
<template>
  <DashboardPage />
</template>

<script setup>
import DashboardPage from '@/views/DashboardPage.vue'
</script>
```

### Gebruik van useAnalytics Composable

```javascript
import { useAnalytics } from '@/composables/useAnalytics.js'

const {
  loading,
  error,
  keyMetrics,
  speciesDistribution,
  loadAnalyticsData,
  downloadCSV
} = useAnalytics()

// Load data
await loadAnalyticsData()

// Export to CSV
downloadCSV('species', 'my-export.csv')
```

### Custom Chart Component

```vue
<template>
  <SpeciesDistributionChart
    title="Mijn Custom Titel"
    :distribution="myData"
    :loading="isLoading"
    @export="handleExport"
  />
</template>

<script setup>
import SpeciesDistributionChart from '@/components/analytics/SpeciesDistributionChart.vue'

const myData = [
  { name: 'Appel', count: 50, fruitType: 'Appel' },
  { name: 'Peer', count: 30, fruitType: 'Peer' }
]
</script>
```

## Dependencies

Het Analytics Dashboard gebruikt de volgende libraries:

- **Chart.js** (^4.x): Core charting library
- **vue-chartjs** (^5.x): Vue 3 wrapper voor Chart.js
- **Quasar Framework**: UI components (QCard, QBtn, etc.)

Installation:
```bash
npm install chart.js vue-chartjs
```

## Performance

### Optimalisaties
- Parallel data fetching met `Promise.all()`
- Computed properties voor reactive calculations
- Lazy loading van chart libraries
- Efficient re-rendering met Vue 3 reactivity

### Best Practices
- Data wordt gecached in composable state
- Charts re-renderen alleen bij data wijzigingen
- CSV export gebeurt client-side (geen server belasting)

## Security

Het dashboard respecteert Row Level Security (RLS):
- Gebruikers zien alleen data waar ze toegang toe hebben
- Publieke boomgaarden zijn zichtbaar voor iedereen
- Private data is alleen toegankelijk voor geautoriseerde gebruikers

## Toekomstige Uitbreidingen

Mogelijke features voor toekomstige versies:
- [ ] Real-time updates met Supabase Realtime
- [ ] Meer chart types (heatmaps, scatter plots)
- [ ] PDF export functionaliteit
- [ ] Custom date range filters
- [ ] Comparative analysis (orchard vs orchard)
- [ ] Export naar Excel met formatting
- [ ] Dashboard widgets customization
- [ ] Offline data caching voor mobile

## Troubleshooting

### Charts worden niet geladen
- Controleer of Chart.js correct is geïnstalleerd
- Verificeer dat data correct wordt doorgegeven als props
- Check browser console voor errors

### Export werkt niet
- Controleer browser permissions voor downloads
- Verificeer dat data beschikbaar is voordat export wordt getriggerd

### Performance issues met grote datasets
- Overweeg pagination voor zeer grote datasets
- Implementeer virtuele scrolling voor lange lijsten
- Cache berekeningen in computed properties

## Code Style

Het dashboard volgt de OrchardMap code standaarden:
- ✅ Vue 3 Composition API met `<script setup>`
- ✅ Container/Presenter pattern
- ✅ Nederlandse comments en documentatie
- ✅ Quasar components voor UI
- ✅ Tailwind CSS voor styling
- ✅ ES6+ syntax (arrow functions, const/let)

## Testing

### Manual Testing Checklist
- [ ] Dashboard laadt zonder errors
- [ ] Key metrics tonen correcte waarden
- [ ] Charts renderen met data
- [ ] Export functionaliteit werkt
- [ ] Responsive design op mobile/tablet/desktop
- [ ] Refresh knop werkt correct
- [ ] Error handling toont user-friendly berichten

### Test Data
Gebruik de seed data in `supabase/seed.sql` voor testing:
```bash
supabase db reset
node test-setup.js
```

## Referenties

- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [vue-chartjs Documentation](https://vue-chartjs.org/)
- [Quasar Framework](https://quasar.dev/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
