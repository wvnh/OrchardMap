# 🗺️ GPS Integration & Mapping System

## Overzicht

Deze module biedt complete GPS tracking en kaart functionaliteit voor OrchardMap, met ondersteuning voor offline gebruik tijdens veldwerk.

## 🌟 Features

### GPS Tracking
- ✅ Real-time GPS locatie tracking
- ✅ Battery-efficient modes (high/low accuracy)
- ✅ Accuracy indicator met visuele feedback
- ✅ GPS trail recording tijdens veldwerk
- ✅ Automatic error handling en permission management

### Kaart Functionaliteit
- ✅ Leaflet.js integratie met Vue 3
- ✅ Multiple layer types (Street, Satellite, Terrain)
- ✅ Touch-friendly controls voor mobile
- ✅ Zoom naar specifieke boomgaard
- ✅ Tree markers met popup info
- ✅ Orchard boundaries met GeoJSON
- ✅ Current location marker met accuracy circle

### Offline Capabilities
- ✅ Map tile caching met IndexedDB
- ✅ Batch downloading voor boomgaard gebieden
- ✅ Progress tracking tijdens download
- ✅ Cache management (clear, size check)
- ✅ Werkt volledig offline na caching

### Data Export
- ✅ GeoJSON export voor GPS trails
- ✅ GPX export voor GPS trails
- ✅ Compatibel met standaard GIS tools

## 📁 Structuur

```
src/
├── composables/
│   ├── useGeolocation.js      # GPS tracking composable
│   ├── useMap.js               # Leaflet map management
│   └── useOfflineMap.js        # Offline tile caching
├── components/
│   ├── MapView.vue             # Presentational map component
│   ├── TreeMarker.vue          # Tree marker popup component
│   └── OrchardMapView.vue      # Container component
└── pages/
    └── MapPage.vue             # Example usage page
```

## 🚀 Gebruik

### Basis Setup

```vue
<template>
  <OrchardMapView
    :orchards="orchards"
    :trees="trees"
    :initial-center="[52.1326, 5.2913]"
    :initial-zoom="13"
    @tree-selected="handleTreeSelected"
    @orchard-selected="handleOrchardSelected"
  />
</template>

<script setup>
import OrchardMapView from '@/components/OrchardMapView.vue'
import { ref } from 'vue'

const orchards = ref([])
const trees = ref([])

const handleTreeSelected = (tree) => {
  console.log('Selected tree:', tree)
}

const handleOrchardSelected = (orchard) => {
  console.log('Selected orchard:', orchard)
}
</script>
```

### GPS Tracking

```javascript
import { useGeolocation } from '@/composables/useGeolocation'

const {
  currentPosition,
  accuracy,
  isTracking,
  startTracking,
  stopTracking,
  getCurrentPosition
} = useGeolocation()

// Start tracking met hoge nauwkeurigheid
startTracking(true)

// Stop tracking
stopTracking()

// Eenmalig positie opvragen
await getCurrentPosition()
```

### Trail Recording

```javascript
const {
  trail,
  isRecordingTrail,
  startTrailRecording,
  stopTrailRecording,
  exportTrailAsGeoJSON,
  exportTrailAsGPX
} = useGeolocation()

// Start recording
startTrailRecording()

// Stop recording
stopTrailRecording()

// Export als GeoJSON
const geojson = exportTrailAsGeoJSON()
console.log(geojson)

// Export als GPX
const gpx = exportTrailAsGPX()
console.log(gpx)
```

### Offline Map Caching

```javascript
import { useOfflineMap } from '@/composables/useOfflineMap'

const {
  isCaching,
  cachePercentage,
  cacheOrchardArea,
  clearCache,
  getCacheSize
} = useOfflineMap()

// Cache een boomgaard gebied
await cacheOrchardArea(
  orchard.boundary, 
  [13, 14, 15] // zoom levels
)

// Check cache grootte
const size = await getCacheSize()
console.log(`Cache size: ${formatCacheSize(size)}`)

// Clear cache
await clearCache()
```

### Map Management

```javascript
import { useMap } from '@/composables/useMap'

const {
  center,
  zoom,
  markers,
  currentLayer,
  setCenter,
  setZoom,
  addMarker,
  switchLayer,
  zoomToOrchard,
  fitBounds
} = useMap()

// Center op specifieke locatie
setCenter([52.1326, 5.2913], 15)

// Voeg marker toe
addMarker({
  position: [52.1326, 5.2913],
  title: 'Mijn Boom',
  description: 'Een mooie appelboom'
})

// Switch naar satelliet view
switchLayer('satellite')

// Zoom naar boomgaard
zoomToOrchard(orchard)

// Fit alle markers in view
fitBounds()
```

## 🔧 Configuratie

### Map Layers

De volgende layer types zijn beschikbaar:

- **street**: OpenStreetMap standaard kaart
- **satellite**: Esri World Imagery satelliet view
- **terrain**: OpenTopoMap terrein kaart

### GPS Opties

```javascript
// Battery-efficient mode (default)
startTracking(false)

// High accuracy mode (meer batterij gebruik)
startTracking(true)
```

### Offline Caching

Standaard zoom levels voor caching: `[13, 14, 15]`
- Zoom 13: Overzicht niveau
- Zoom 14: Detail niveau
- Zoom 15: Hoge detail niveau

Geschatte grootte: 5-15 MB per boomgaard

## 📱 Mobile Optimalisatie

### Touch Controls
- Touch-friendly zoom controls
- Pinch-to-zoom support
- Pan support met momentum
- Responsive design

### Battery Efficiency
- Low power GPS mode (30s cache)
- High accuracy mode on-demand
- Automatic tracking stop bij inactiviteit

### Offline First
- Cached tiles blijven beschikbaar
- Graceful degradation zonder internet
- Sync wanneer connectie beschikbaar

## 🔐 Permissions

De app vraagt om de volgende permissions:

1. **Geolocation**: Voor GPS tracking
   - Wordt gevraagd bij eerste gebruik
   - Kan in browser settings worden beheerd

2. **Storage**: Voor offline map caching
   - IndexedDB wordt automatisch gebruikt
   - Geen expliciete permission nodig

## 📊 Data Formats

### GeoJSON Trail Export

```json
{
  "type": "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [[lng, lat, 0], ...]
  },
  "properties": {
    "timestamps": [...],
    "accuracies": [...],
    "recordedAt": "2024-01-01T12:00:00Z",
    "pointCount": 100
  }
}
```

### GPX Trail Export

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OrchardMap">
  <trk>
    <name>OrchardMap Trail</name>
    <trkseg>
      <trkpt lat="52.1326" lon="5.2913">
        <time>2024-01-01T12:00:00Z</time>
        <hdop>5.0</hdop>
      </trkpt>
    </trkseg>
  </trk>
</gpx>
```

## 🐛 Troubleshooting

### GPS werkt niet
1. Check browser permissions
2. Controleer of HTTPS is ingeschakeld (vereist voor geolocation)
3. Test op een apparaat met GPS hardware

### Kaart laadt niet
1. Check internet connectie
2. Controleer Leaflet CSS is geladen
3. Verify tile server is bereikbaar

### Offline caching werkt niet
1. Check browser support voor IndexedDB
2. Controleer beschikbare storage space
3. Test in incognito mode (sommige browsers blokkeren storage)

## 🔮 Toekomstige Features

- [ ] Route planning tussen bomen
- [ ] Heatmap voor boom distributie
- [ ] Clustering voor grote aantallen markers
- [ ] Custom map tiles upload
- [ ] Offline area selection met bounding box
- [ ] Background tile sync
- [ ] Export naar KML format
- [ ] Import van GPS tracks
- [ ] Real-time collaborative editing
- [ ] Augmented Reality navigation

## 📚 Dependencies

- `leaflet`: ^1.9.4 - Open-source mapping library
- `vue3-leaflet`: ^1.0.50 - Vue 3 components voor Leaflet
- `localforage`: ^1.10.0 - IndexedDB wrapper voor offline storage

## 🤝 Contributing

Bij het toevoegen van nieuwe map features:
1. Volg het Container/Presenter patroon
2. Gebruik composables voor logica
3. Test op mobile devices
4. Documenteer nieuwe features in deze README

## 📄 License

Zie hoofdproject LICENSE file.
