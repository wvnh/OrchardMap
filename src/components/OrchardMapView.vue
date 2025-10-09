<template>
  <div class="orchard-map-view">
    <!-- Map View -->
    <MapView
      :center="center"
      :zoom="zoom"
      :tile-url="currentLayerConfig.url"
      :attribution="currentLayerConfig.attribution"
      :markers="mapMarkers"
      :boundaries="orchardBoundaries"
      :current-position="currentPositionArray"
      :accuracy="accuracy"
      :show-current-position="isTracking"
      :trail="trailCoordinates"
      :current-layer="currentLayer"
      :is-tracking="isTracking"
      :is-recording-trail="isRecordingTrail"
      :is-locating="isGettingLocation"
      :is-loading="isLoading"
      @map-ready="onMapReady"
      @marker-click="onMarkerClick"
      @boundary-click="onBoundaryClick"
      @layer-change="onLayerChange"
      @toggle-location="onToggleLocation"
      @toggle-trail-recording="onToggleTrailRecording"
      @fit-bounds="onFitBounds"
    />

    <!-- Accuracy Indicator -->
    <div v-if="isTracking" class="accuracy-indicator">
      <q-chip 
        :color="accuracyLevelColor" 
        text-color="white"
        icon="gps_fixed"
        size="sm"
      >
        {{ accuracyLevel }}: {{ accuracy?.toFixed(1) }}m
      </q-chip>
    </div>

    <!-- Trail Info -->
    <div v-if="isRecordingTrail" class="trail-info">
      <q-chip 
        color="negative" 
        text-color="white"
        icon="fiber_manual_record"
        size="sm"
        class="recording-chip"
      >
        Recording: {{ trail.length }} points
      </q-chip>
    </div>

    <!-- Offline Caching Panel -->
    <q-dialog v-model="showCachingDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Offline Kaart Caching</div>
        </q-card-section>

        <q-card-section>
          <div v-if="isCaching">
            <p>Map tiles aan het downloaden voor offline gebruik...</p>
            <q-linear-progress 
              :value="cachePercentage / 100" 
              color="primary" 
              class="q-mt-sm"
            />
            <p class="text-center q-mt-sm">{{ cachePercentage }}%</p>
          </div>
          <div v-else>
            <p>Download map tiles voor gebruik zonder internetverbinding.</p>
            <q-select
              v-model="selectedOrchardForCaching"
              :options="orchardOptions"
              label="Selecteer Boomgaard"
              emit-value
              map-options
              class="q-mb-md"
            />
            <p class="text-caption">
              Zoom niveaus: 13, 14, 15
              <br>
              Geschatte grootte: 5-15 MB per boomgaard
            </p>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            v-if="!isCaching"
            flat 
            label="Annuleren" 
            color="primary" 
            @click="showCachingDialog = false"
          />
          <q-btn 
            v-if="!isCaching"
            flat 
            label="Start Caching" 
            color="positive" 
            @click="startCaching"
            :disable="!selectedOrchardForCaching"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Trail Export Dialog -->
    <q-dialog v-model="showExportDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Export GPS Trail</div>
        </q-card-section>

        <q-card-section>
          <p>Export uw GPS trail in verschillende formaten:</p>
          <div class="export-options">
            <q-btn
              label="GeoJSON"
              icon="code"
              color="primary"
              @click="exportAsGeoJSON"
              class="q-mb-sm full-width"
            />
            <q-btn
              label="GPX"
              icon="map"
              color="secondary"
              @click="exportAsGPX"
              class="full-width"
            />
          </div>
          <p class="text-caption q-mt-md">
            Trail bevat {{ trail.length }} GPS punten
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Sluiten" color="primary" @click="showExportDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <q-btn
        v-if="trail.length > 0"
        round
        color="accent"
        icon="file_download"
        @click="showExportDialog = true"
      >
        <q-tooltip>Export GPS trail</q-tooltip>
      </q-btn>
      
      <q-btn
        round
        color="info"
        icon="cloud_download"
        @click="showCachingDialog = true"
      >
        <q-tooltip>Offline kaart caching</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MapView from './MapView.vue'
import { useGeolocation } from '../composables/useGeolocation'
import { useMap } from '../composables/useMap'
import { useOfflineMap } from '../composables/useOfflineMap'

// Props
const props = defineProps({
  orchards: {
    type: Array,
    default: () => []
  },
  trees: {
    type: Array,
    default: () => []
  },
  initialCenter: {
    type: Array,
    default: () => [51.5074, -0.1278]
  },
  initialZoom: {
    type: Number,
    default: 13
  }
})

// Emits
const emit = defineEmits(['tree-selected', 'orchard-selected'])

// Composables
const {
  currentPosition,
  accuracy,
  isTracking,
  trail,
  isRecordingTrail,
  accuracyLevel,
  startTracking,
  stopTracking,
  getCurrentPosition,
  startTrailRecording,
  stopTrailRecording,
  exportTrailAsGeoJSON,
  exportTrailAsGPX
} = useGeolocation()

const {
  center,
  zoom,
  currentLayer,
  currentLayerConfig,
  markers,
  initMap,
  setCenter,
  addMarkers,
  clearMarkers,
  zoomToOrchard,
  fitBounds,
  switchLayer
} = useMap()

const {
  isCaching,
  cachePercentage,
  cacheOrchardArea
} = useOfflineMap()

// Local state
const isLoading = ref(false)
const isGettingLocation = ref(false)
const showCachingDialog = ref(false)
const showExportDialog = ref(false)
const selectedOrchardForCaching = ref(null)

// Initialize center and zoom from props
center.value = props.initialCenter
zoom.value = props.initialZoom

// Computed
const currentPositionArray = computed(() => {
  if (!currentPosition.value) return null
  return [currentPosition.value.latitude, currentPosition.value.longitude]
})

const trailCoordinates = computed(() => {
  return trail.value.map(point => [point.latitude, point.longitude])
})

const mapMarkers = computed(() => {
  return props.trees
    .filter(tree => tree.latitude && tree.longitude)
    .map(tree => ({
      id: tree.id,
      position: [tree.latitude, tree.longitude],
      title: tree.tree_code || `Boom #${tree.id}`,
      description: tree.species?.variety_name || 'Onbekende soort',
      data: tree
    }))
})

const orchardBoundaries = computed(() => {
  return props.orchards
    .filter(orchard => orchard.boundary)
    .map(orchard => ({
      id: orchard.id,
      geojson: orchard.boundary,
      options: {
        style: {
          color: '#4CAF50',
          weight: 2,
          fillOpacity: 0.1
        }
      },
      data: orchard
    }))
})

const orchardOptions = computed(() => {
  return props.orchards.map(orchard => ({
    label: orchard.name,
    value: orchard.id
  }))
})

const accuracyLevelColor = computed(() => {
  switch(accuracyLevel.value) {
    case 'excellent': return 'green'
    case 'good': return 'light-green'
    case 'fair': return 'orange'
    case 'poor': return 'red'
    default: return 'grey'
  }
})

// Methods
const onMapReady = (mapInstance) => {
  initMap(mapInstance)
  
  // Update markers
  updateMarkers()
  
  // Fit bounds if we have markers
  if (mapMarkers.value.length > 0) {
    setTimeout(() => fitBounds(), 100)
  }
}

const onMarkerClick = (marker) => {
  emit('tree-selected', marker.data)
}

const onBoundaryClick = (boundary) => {
  emit('orchard-selected', boundary.data)
  zoomToOrchard(boundary.data)
}

const onLayerChange = (layerType) => {
  switchLayer(layerType)
}

const onToggleLocation = async () => {
  if (isTracking.value) {
    stopTracking()
  } else {
    isGettingLocation.value = true
    try {
      await getCurrentPosition(true)
      startTracking(true)
      
      // Center map on current position
      if (currentPositionArray.value) {
        setCenter(currentPositionArray.value, 15)
      }
    } catch (error) {
      console.error('Fout bij starten GPS:', error)
    } finally {
      isGettingLocation.value = false
    }
  }
}

const onToggleTrailRecording = () => {
  if (isRecordingTrail.value) {
    stopTrailRecording()
  } else {
    startTrailRecording()
  }
}

const onFitBounds = () => {
  fitBounds()
}

const updateMarkers = () => {
  clearMarkers()
  addMarkers(mapMarkers.value)
}

const startCaching = async () => {
  const orchard = props.orchards.find(o => o.id === selectedOrchardForCaching.value)
  if (!orchard || !orchard.boundary) {
    console.error('Geen boundary data voor deze boomgaard')
    return
  }

  await cacheOrchardArea(orchard.boundary)
}

const exportAsGeoJSON = () => {
  const geojson = exportTrailAsGeoJSON()
  if (!geojson) {
    console.error('Geen trail data om te exporteren')
    return
  }

  // Download as file
  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trail-${new Date().toISOString()}.geojson`
  a.click()
  URL.revokeObjectURL(url)
  
  showExportDialog.value = false
}

const exportAsGPX = () => {
  const gpx = exportTrailAsGPX()
  if (!gpx) {
    console.error('Geen trail data om te exporteren')
    return
  }

  // Download as file
  const blob = new Blob([gpx], { type: 'application/gpx+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trail-${new Date().toISOString()}.gpx`
  a.click()
  URL.revokeObjectURL(url)
  
  showExportDialog.value = false
}

// Watch for prop changes
watch(() => props.trees, () => {
  updateMarkers()
})

// Auto-start GPS tracking on mount (optional)
onMounted(() => {
  // Request location permission on mount
  // Uncomment to auto-start tracking:
  // onToggleLocation()
})
</script>

<style scoped>
.orchard-map-view {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.accuracy-indicator {
  position: absolute;
  top: 70px;
  right: 10px;
  z-index: 1001;
}

.trail-info {
  position: absolute;
  top: 110px;
  right: 10px;
  z-index: 1001;
}

.recording-chip {
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.action-buttons {
  position: absolute;
  bottom: 20px;
  right: 10px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .accuracy-indicator,
  .trail-info {
    right: 5px;
  }
  
  .action-buttons {
    bottom: 10px;
    right: 5px;
  }
}
</style>
