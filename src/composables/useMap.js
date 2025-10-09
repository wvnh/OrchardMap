// src/composables/useMap.js
import { ref, computed, onUnmounted } from 'vue'

/**
 * useMap Composable
 * 
 * Composable voor Leaflet map state management.
 * Beheert map instance, zoom, center en layers.
 * 
 * @returns {Object} - Bevat map state en control functies
 */
export function useMap() {
  // State
  const map = ref(null)
  const center = ref([51.5074, -0.1278]) // Default: London
  const zoom = ref(13)
  const bounds = ref(null)
  const markers = ref([])
  const currentLayer = ref('street') // 'street', 'satellite', 'terrain'
  const isLoading = ref(false)
  const error = ref(null)

  // Layer configurations
  const layers = {
    street: {
      name: 'Straat',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      name: 'Satelliet',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri'
    },
    terrain: {
      name: 'Terrein',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
    }
  }

  // Computed
  const currentLayerConfig = computed(() => layers[currentLayer.value])
  const hasMarkers = computed(() => markers.value.length > 0)
  
  /**
   * Initialiseer de map
   * 
   * @param {Object} mapInstance - Leaflet map instance
   */
  const initMap = (mapInstance) => {
    map.value = mapInstance
    console.log('Map geïnitialiseerd')
  }

  /**
   * Set map center
   * 
   * @param {Array<number>} coords - [latitude, longitude]
   * @param {number} newZoom - Optioneel zoom niveau
   */
  const setCenter = (coords, newZoom = null) => {
    center.value = coords
    
    if (newZoom !== null) {
      zoom.value = newZoom
    }
    
    if (map.value) {
      map.value.setView(coords, newZoom || zoom.value)
    }
  }

  /**
   * Set zoom level
   * 
   * @param {number} newZoom - Zoom niveau
   */
  const setZoom = (newZoom) => {
    zoom.value = newZoom
    
    if (map.value) {
      map.value.setZoom(newZoom)
    }
  }

  /**
   * Zoom in
   */
  const zoomIn = () => {
    if (map.value) {
      map.value.zoomIn()
      zoom.value = map.value.getZoom()
    }
  }

  /**
   * Zoom out
   */
  const zoomOut = () => {
    if (map.value) {
      map.value.zoomOut()
      zoom.value = map.value.getZoom()
    }
  }

  /**
   * Fit bounds to show all markers
   */
  const fitBounds = () => {
    if (!map.value || markers.value.length === 0) return
    
    const latLngs = markers.value.map(marker => marker.position)
    
    if (latLngs.length === 1) {
      // Single marker: center on it
      setCenter(latLngs[0], 15)
    } else {
      // Multiple markers: fit bounds
      const bounds = L.latLngBounds(latLngs)
      map.value.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  /**
   * Switch map layer
   * 
   * @param {string} layerType - 'street', 'satellite', of 'terrain'
   */
  const switchLayer = (layerType) => {
    if (!layers[layerType]) {
      console.error(`Onbekend layer type: ${layerType}`)
      return
    }
    
    currentLayer.value = layerType
    console.log(`Switched to ${layerType} layer`)
  }

  /**
   * Voeg een marker toe
   * 
   * @param {Object} marker - Marker object met position en data
   * @returns {string} - Marker ID
   */
  const addMarker = (marker) => {
    const id = marker.id || `marker_${Date.now()}_${Math.random()}`
    
    markers.value.push({
      id,
      position: marker.position,
      title: marker.title || '',
      description: marker.description || '',
      icon: marker.icon || 'default',
      data: marker.data || {}
    })
    
    return id
  }

  /**
   * Verwijder een marker
   * 
   * @param {string} id - Marker ID
   */
  const removeMarker = (id) => {
    const index = markers.value.findIndex(m => m.id === id)
    if (index !== -1) {
      markers.value.splice(index, 1)
    }
  }

  /**
   * Verwijder alle markers
   */
  const clearMarkers = () => {
    markers.value = []
  }

  /**
   * Update marker position
   * 
   * @param {string} id - Marker ID
   * @param {Array<number>} position - Nieuwe positie [lat, lng]
   */
  const updateMarkerPosition = (id, position) => {
    const marker = markers.value.find(m => m.id === id)
    if (marker) {
      marker.position = position
    }
  }

  /**
   * Voeg meerdere markers toe (bijv. voor trees in een orchard)
   * 
   * @param {Array<Object>} markerArray - Array van marker objects
   */
  const addMarkers = (markerArray) => {
    markerArray.forEach(marker => addMarker(marker))
  }

  /**
   * Zoom naar een specifieke boomgaard
   * 
   * @param {Object} orchard - Orchard object met boundary
   */
  const zoomToOrchard = (orchard) => {
    if (!map.value) return
    
    if (orchard.boundary?.coordinates) {
      // Parse GeoJSON boundary
      const coords = orchard.boundary.coordinates[0]
      const latLngs = coords.map(coord => [coord[1], coord[0]]) // GeoJSON is [lng, lat]
      
      const bounds = L.latLngBounds(latLngs)
      map.value.fitBounds(bounds, { padding: [50, 50] })
    } else if (orchard.center_latitude && orchard.center_longitude) {
      // Fallback naar center coordinaten
      setCenter([orchard.center_latitude, orchard.center_longitude], 15)
    }
  }

  /**
   * Export huidige view als image
   * 
   * @returns {Promise<string>} - Data URL van map screenshot
   */
  const exportMapAsImage = async () => {
    if (!map.value) {
      throw new Error('Map niet geïnitialiseerd')
    }

    try {
      // Deze functie vereist een extra library zoals 'leaflet-simple-map-screenshoter'
      // Voor nu return een placeholder
      console.warn('Map export vereist extra library voor productie gebruik')
      return null
    } catch (err) {
      error.value = `Fout bij exporteren map: ${err.message}`
      throw err
    }
  }

  /**
   * Convert screen coordinates naar map coordinates
   * 
   * @param {number} x - Screen X coordinate
   * @param {number} y - Screen Y coordinate
   * @returns {Object} - {lat, lng}
   */
  const screenToMapCoords = (x, y) => {
    if (!map.value) return null
    
    const point = map.value.containerPointToLatLng([x, y])
    return {
      lat: point.lat,
      lng: point.lng
    }
  }

  /**
   * Convert map coordinates naar screen coordinates
   * 
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Object} - {x, y}
   */
  const mapToScreenCoords = (lat, lng) => {
    if (!map.value) return null
    
    const point = map.value.latLngToContainerPoint([lat, lng])
    return {
      x: point.x,
      y: point.y
    }
  }

  /**
   * Check of een punt binnen de huidige view is
   * 
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean}
   */
  const isInView = (lat, lng) => {
    if (!map.value) return false
    
    const bounds = map.value.getBounds()
    return bounds.contains([lat, lng])
  }

  /**
   * Cleanup bij unmount
   */
  onUnmounted(() => {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  })

  // Return public API
  return {
    // State
    map,
    center,
    zoom,
    bounds,
    markers,
    currentLayer,
    isLoading,
    error,
    
    // Configs
    layers,
    
    // Computed
    currentLayerConfig,
    hasMarkers,
    
    // Methods
    initMap,
    setCenter,
    setZoom,
    zoomIn,
    zoomOut,
    fitBounds,
    switchLayer,
    addMarker,
    removeMarker,
    clearMarkers,
    updateMarkerPosition,
    addMarkers,
    zoomToOrchard,
    exportMapAsImage,
    screenToMapCoords,
    mapToScreenCoords,
    isInView
  }
}
