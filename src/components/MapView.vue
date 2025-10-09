<template>
  <div class="map-container">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      v-model:center="center"
      :use-global-leaflet="false"
      @ready="onMapReady"
      class="leaflet-map"
      :class="{ 'touch-friendly': touchFriendly }"
    >
      <!-- Tile Layer -->
      <l-tile-layer
        :url="tileUrl"
        :attribution="attribution"
        :max-zoom="maxZoom"
        :min-zoom="minZoom"
      />

      <!-- Current Position Marker -->
      <l-marker
        v-if="showCurrentPosition && currentPosition"
        :lat-lng="currentPosition"
        :icon="currentPositionIcon"
      >
        <l-popup>
          <div class="popup-content">
            <h4>Uw Locatie</h4>
            <p v-if="accuracy">Nauwkeurigheid: {{ accuracy }}m</p>
          </div>
        </l-popup>
      </l-marker>

      <!-- Accuracy Circle -->
      <l-circle
        v-if="showCurrentPosition && currentPosition && accuracy"
        :lat-lng="currentPosition"
        :radius="accuracy"
        :color="accuracyColor"
        :fill-color="accuracyColor"
        :fill-opacity="0.1"
      />

      <!-- Custom Markers -->
      <l-marker
        v-for="marker in markers"
        :key="marker.id"
        :lat-lng="marker.position"
        @click="$emit('marker-click', marker)"
      >
        <l-icon
          v-if="marker.icon"
          :icon-url="marker.icon"
          :icon-size="[32, 32]"
          :icon-anchor="[16, 32]"
        />
        <l-popup v-if="marker.title || marker.description">
          <div class="popup-content">
            <h4 v-if="marker.title">{{ marker.title }}</h4>
            <p v-if="marker.description">{{ marker.description }}</p>
          </div>
        </l-popup>
      </l-marker>

      <!-- Orchard Boundaries -->
      <l-geo-json
        v-for="boundary in boundaries"
        :key="boundary.id"
        :geojson="boundary.geojson"
        :options="boundary.options"
        @click="$emit('boundary-click', boundary)"
      />

      <!-- Trail Recording -->
      <l-polyline
        v-if="trail && trail.length > 0"
        :lat-lngs="trail"
        :color="trailColor"
        :weight="3"
        :opacity="0.7"
      />

      <!-- Map Controls -->
      <l-control-zoom v-if="!hideZoomControls" position="topleft" />
      <l-control-scale v-if="showScale" position="bottomleft" :imperial="false" :metric="true" />
    </l-map>

    <!-- Custom Controls Overlay -->
    <div v-if="showCustomControls" class="map-controls-overlay">
      <!-- Layer Switcher -->
      <div class="control-group layer-switcher">
        <q-btn-group>
          <q-btn
            v-for="layer in availableLayers"
            :key="layer.value"
            :label="layer.label"
            :color="currentLayer === layer.value ? 'primary' : 'white'"
            :text-color="currentLayer === layer.value ? 'white' : 'dark'"
            @click="$emit('layer-change', layer.value)"
            dense
          />
        </q-btn-group>
      </div>

      <!-- Location Control -->
      <div v-if="showLocationControl" class="control-group location-control">
        <q-btn
          round
          :color="isTracking ? 'positive' : 'primary'"
          :icon="isTracking ? 'my_location' : 'location_searching'"
          @click="$emit('toggle-location')"
          :loading="isLocating"
        >
          <q-tooltip>
            {{ isTracking ? 'Stop GPS tracking' : 'Start GPS tracking' }}
          </q-tooltip>
        </q-btn>
      </div>

      <!-- Trail Recording Control -->
      <div v-if="showTrailControl" class="control-group trail-control">
        <q-btn
          round
          :color="isRecordingTrail ? 'negative' : 'primary'"
          :icon="isRecordingTrail ? 'stop_circle' : 'route'"
          @click="$emit('toggle-trail-recording')"
        >
          <q-tooltip>
            {{ isRecordingTrail ? 'Stop trail recording' : 'Start trail recording' }}
          </q-tooltip>
        </q-btn>
      </div>

      <!-- Fit Bounds Control -->
      <div v-if="showFitBoundsControl && markers.length > 0" class="control-group fit-bounds-control">
        <q-btn
          round
          color="primary"
          icon="center_focus_strong"
          @click="$emit('fit-bounds')"
        >
          <q-tooltip>Toon alle markers</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="map-loading-overlay">
      <q-spinner color="primary" size="50px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LCircle, LPolyline, LGeoJson, LIcon, LControlZoom, LControlScale } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Props
const props = defineProps({
  center: {
    type: Array,
    default: () => [51.5074, -0.1278]
  },
  zoom: {
    type: Number,
    default: 13
  },
  tileUrl: {
    type: String,
    default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  attribution: {
    type: String,
    default: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  maxZoom: {
    type: Number,
    default: 19
  },
  minZoom: {
    type: Number,
    default: 1
  },
  markers: {
    type: Array,
    default: () => []
  },
  boundaries: {
    type: Array,
    default: () => []
  },
  currentPosition: {
    type: Array,
    default: null
  },
  accuracy: {
    type: Number,
    default: null
  },
  showCurrentPosition: {
    type: Boolean,
    default: false
  },
  trail: {
    type: Array,
    default: () => []
  },
  trailColor: {
    type: String,
    default: '#3388ff'
  },
  currentLayer: {
    type: String,
    default: 'street'
  },
  availableLayers: {
    type: Array,
    default: () => [
      { label: 'Straat', value: 'street' },
      { label: 'Satelliet', value: 'satellite' },
      { label: 'Terrein', value: 'terrain' }
    ]
  },
  isTracking: {
    type: Boolean,
    default: false
  },
  isRecordingTrail: {
    type: Boolean,
    default: false
  },
  isLocating: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  showCustomControls: {
    type: Boolean,
    default: true
  },
  showLocationControl: {
    type: Boolean,
    default: true
  },
  showTrailControl: {
    type: Boolean,
    default: true
  },
  showFitBoundsControl: {
    type: Boolean,
    default: true
  },
  hideZoomControls: {
    type: Boolean,
    default: false
  },
  showScale: {
    type: Boolean,
    default: true
  },
  touchFriendly: {
    type: Boolean,
    default: true
  }
})

// Emits
defineEmits([
  'map-ready',
  'marker-click',
  'boundary-click',
  'layer-change',
  'toggle-location',
  'toggle-trail-recording',
  'fit-bounds'
])

// Local state
const map = ref(null)

// Computed
const accuracyColor = computed(() => {
  if (!props.accuracy) return '#3388ff'
  if (props.accuracy < 10) return '#00ff00'
  if (props.accuracy < 20) return '#ffaa00'
  return '#ff0000'
})

const currentPositionIcon = computed(() => {
  return L.divIcon({
    html: '<div class="current-position-marker"></div>',
    className: 'current-position-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
})

// Methods
const onMapReady = (mapInstance) => {
  map.value = mapInstance
  emit('map-ready', mapInstance)
}

// Watch for prop changes
watch(() => props.center, (newCenter) => {
  if (map.value && newCenter) {
    map.value.setView(newCenter, props.zoom)
  }
})

watch(() => props.zoom, (newZoom) => {
  if (map.value && newZoom) {
    map.value.setZoom(newZoom)
  }
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  z-index: 0;
}

.leaflet-map.touch-friendly {
  touch-action: pan-x pan-y;
}

.map-controls-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-group {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 4px;
}

.layer-switcher {
  padding: 0;
}

.popup-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.popup-content p {
  margin: 4px 0;
  font-size: 14px;
}

.map-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* Current Position Marker Styling */
:deep(.current-position-marker) {
  width: 20px;
  height: 20px;
  background: #3388ff;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(51, 136, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(51, 136, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(51, 136, 255, 0);
  }
}

/* Touch-friendly adjustments for mobile */
@media (max-width: 768px) {
  .map-controls-overlay {
    right: 5px;
    top: 5px;
    gap: 5px;
  }
  
  .control-group {
    padding: 2px;
  }
}

/* Ensure proper touch handling */
:deep(.leaflet-container) {
  font-family: inherit;
}

:deep(.leaflet-popup-content) {
  margin: 10px;
}
</style>
