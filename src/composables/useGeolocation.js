// src/composables/useGeolocation.js
import { ref, computed, onUnmounted } from 'vue'

/**
 * useGeolocation Composable
 * 
 * Composable voor GPS tracking met battery-efficient optimalisaties.
 * Beheert de huidige locatie, nauwkeurigheid en tracking status.
 * 
 * @returns {Object} - Bevat location state, tracking functies en error handling
 */
export function useGeolocation() {
  // State
  const currentPosition = ref(null)
  const accuracy = ref(null)
  const heading = ref(null)
  const speed = ref(null)
  const isTracking = ref(false)
  const error = ref(null)
  const watchId = ref(null)
  
  // Trail recording
  const trail = ref([])
  const isRecordingTrail = ref(false)

  // Computed properties
  const hasLocation = computed(() => currentPosition.value !== null)
  const latitude = computed(() => currentPosition.value?.latitude ?? null)
  const longitude = computed(() => currentPosition.value?.longitude ?? null)
  
  // Convert accuracy to quality indicator
  const accuracyLevel = computed(() => {
    if (!accuracy.value) return 'unknown'
    if (accuracy.value < 5) return 'excellent'
    if (accuracy.value < 10) return 'good'
    if (accuracy.value < 20) return 'fair'
    return 'poor'
  })

  /**
   * Geolocation opties voor battery-efficient tracking
   */
  const getGeolocationOptions = (highAccuracy = false) => ({
    enableHighAccuracy: highAccuracy,
    timeout: 10000,
    maximumAge: highAccuracy ? 0 : 30000 // Cache voor 30 seconden in low-power mode
  })

  /**
   * Success callback voor geolocation
   */
  const handleSuccess = (position) => {
    currentPosition.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp
    }
    
    accuracy.value = position.coords.accuracy
    heading.value = position.coords.heading
    speed.value = position.coords.speed
    error.value = null

    // Voeg toe aan trail als recording actief is
    if (isRecordingTrail.value) {
      trail.value.push({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
        accuracy: position.coords.accuracy
      })
    }
  }

  /**
   * Error callback voor geolocation
   */
  const handleError = (err) => {
    let errorMessage = 'Onbekende fout bij GPS tracking'
    
    switch(err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'GPS toegang geweigerd. Geef de applicatie toestemming om uw locatie te gebruiken.'
        break
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Locatie informatie niet beschikbaar. Controleer of GPS is ingeschakeld.'
        break
      case err.TIMEOUT:
        errorMessage = 'GPS request timeout. Probeer het opnieuw.'
        break
    }
    
    error.value = errorMessage
    console.error('Geolocation error:', err)
  }

  /**
   * Start GPS tracking
   * 
   * @param {boolean} highAccuracy - Gebruik hoge nauwkeurigheid (meer batterij gebruik)
   * @returns {boolean} - Success status
   */
  const startTracking = (highAccuracy = false) => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation wordt niet ondersteund door deze browser'
      return false
    }

    if (isTracking.value) {
      console.warn('GPS tracking is al actief')
      return true
    }

    const options = getGeolocationOptions(highAccuracy)
    
    watchId.value = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )
    
    isTracking.value = true
    return true
  }

  /**
   * Stop GPS tracking
   */
  const stopTracking = () => {
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
    
    isTracking.value = false
  }

  /**
   * Vraag eenmalig de huidige locatie op
   * 
   * @param {boolean} highAccuracy - Gebruik hoge nauwkeurigheid
   * @returns {Promise<Object>} - Position object
   */
  const getCurrentPosition = (highAccuracy = false) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocation wordt niet ondersteund door deze browser')
        error.value = err.message
        reject(err)
        return
      }

      const options = getGeolocationOptions(highAccuracy)
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSuccess(position)
          resolve(position)
        },
        (err) => {
          handleError(err)
          reject(err)
        },
        options
      )
    })
  }

  /**
   * Start trail recording
   */
  const startTrailRecording = () => {
    trail.value = []
    isRecordingTrail.value = true
    
    // Start tracking als het nog niet actief is
    if (!isTracking.value) {
      startTracking(true) // Gebruik hoge nauwkeurigheid voor trail recording
    }
  }

  /**
   * Stop trail recording
   */
  const stopTrailRecording = () => {
    isRecordingTrail.value = false
  }

  /**
   * Clear trail
   */
  const clearTrail = () => {
    trail.value = []
  }

  /**
   * Export trail als GeoJSON
   * 
   * @returns {Object} - GeoJSON LineString feature
   */
  const exportTrailAsGeoJSON = () => {
    if (trail.value.length === 0) {
      return null
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: trail.value.map(point => [
          point.longitude,
          point.latitude,
          0 // altitude (niet beschikbaar in meeste browsers)
        ])
      },
      properties: {
        timestamps: trail.value.map(point => point.timestamp),
        accuracies: trail.value.map(point => point.accuracy),
        recordedAt: new Date().toISOString(),
        pointCount: trail.value.length
      }
    }
  }

  /**
   * Export trail als GPX
   * 
   * @returns {string} - GPX XML string
   */
  const exportTrailAsGPX = () => {
    if (trail.value.length === 0) {
      return null
    }

    const trackPoints = trail.value.map(point => {
      const date = new Date(point.timestamp).toISOString()
      return `    <trkpt lat="${point.latitude}" lon="${point.longitude}">
      <time>${date}</time>
      <hdop>${point.accuracy}</hdop>
    </trkpt>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OrchardMap"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <trk>
    <name>OrchardMap Trail</name>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`
  }

  /**
   * Bereken afstand tussen twee GPS coordinaten (Haversine formula)
   * 
   * @param {number} lat1 - Latitude punt 1
   * @param {number} lon1 - Longitude punt 1
   * @param {number} lat2 - Latitude punt 2
   * @param {number} lon2 - Longitude punt 2
   * @returns {number} - Afstand in meters
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3 // Aarde straal in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // in meters
  }

  /**
   * Stop tracking bij component unmount
   */
  onUnmounted(() => {
    stopTracking()
  })

  // Return public API
  return {
    // State
    currentPosition,
    accuracy,
    heading,
    speed,
    isTracking,
    error,
    trail,
    isRecordingTrail,
    
    // Computed
    hasLocation,
    latitude,
    longitude,
    accuracyLevel,
    
    // Methods
    startTracking,
    stopTracking,
    getCurrentPosition,
    startTrailRecording,
    stopTrailRecording,
    clearTrail,
    exportTrailAsGeoJSON,
    exportTrailAsGPX,
    calculateDistance
  }
}
