// src/composables/useOfflineMap.js
import { ref, computed } from 'vue'
import localforage from 'localforage'

/**
 * useOfflineMap Composable
 * 
 * Composable voor offline map tile caching met IndexedDB.
 * Ondersteunt het downloaden en beheren van map tiles voor offline gebruik.
 * 
 * @returns {Object} - Bevat cache state en management functies
 */
export function useOfflineMap() {
  // State
  const isCaching = ref(false)
  const cacheProgress = ref(0)
  const cachedTileCount = ref(0)
  const totalTilesToCache = ref(0)
  const error = ref(null)

  // Computed
  const cachePercentage = computed(() => {
    if (totalTilesToCache.value === 0) return 0
    return Math.round((cachedTileCount.value / totalTilesToCache.value) * 100)
  })

  // Initialize localforage for tile storage
  const tileStore = localforage.createInstance({
    name: 'OrchardMap',
    storeName: 'mapTiles'
  })

  /**
   * Genereer tile URLs voor een specifiek gebied en zoom niveau
   * 
   * @param {number} minLat - Minimum latitude
   * @param {number} maxLat - Maximum latitude
   * @param {number} minLng - Minimum longitude
   * @param {number} maxLng - Maximum longitude
   * @param {number} zoom - Zoom niveau
   * @returns {Array} - Array van tile URLs
   */
  const generateTileUrls = (minLat, maxLat, minLng, maxLng, zoom) => {
    const tiles = []
    
    // Convert lat/lng to tile coordinates
    const lat2tile = (lat, zoom) => {
      return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 
        1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
    }
    
    const lng2tile = (lng, zoom) => {
      return Math.floor((lng + 180) / 360 * Math.pow(2, zoom))
    }

    const minX = lng2tile(minLng, zoom)
    const maxX = lng2tile(maxLng, zoom)
    const minY = lat2tile(maxLat, zoom) // Note: Y is inverted
    const maxY = lat2tile(minLat, zoom)

    // Generate tile URLs
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        tiles.push({
          url: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
          key: `tile_${zoom}_${x}_${y}`
        })
      }
    }

    return tiles
  }

  /**
   * Download en cache een enkele tile
   * 
   * @param {string} url - Tile URL
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  const cacheTile = async (url, key) => {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      await tileStore.setItem(key, blob)
      
      return true
    } catch (err) {
      console.error(`Fout bij cachen van tile ${key}:`, err)
      return false
    }
  }

  /**
   * Cache tiles voor een specifiek gebied
   * 
   * @param {number} minLat - Minimum latitude
   * @param {number} maxLat - Maximum latitude
   * @param {number} minLng - Minimum longitude
   * @param {number} maxLng - Maximum longitude
   * @param {Array<number>} zoomLevels - Array van zoom niveaus
   * @returns {Promise<void>}
   */
  const cacheArea = async (minLat, maxLat, minLng, maxLng, zoomLevels = [13, 14, 15]) => {
    if (isCaching.value) {
      console.warn('Caching is al bezig')
      return
    }

    isCaching.value = true
    error.value = null
    cachedTileCount.value = 0

    try {
      // Genereer alle tiles voor alle zoom levels
      const allTiles = []
      for (const zoom of zoomLevels) {
        const tiles = generateTileUrls(minLat, maxLat, minLng, maxLng, zoom)
        allTiles.push(...tiles)
      }

      totalTilesToCache.value = allTiles.length
      
      console.log(`Start met cachen van ${allTiles.length} tiles...`)

      // Download tiles met rate limiting (max 2 concurrent requests)
      const batchSize = 2
      for (let i = 0; i < allTiles.length; i += batchSize) {
        const batch = allTiles.slice(i, i + batchSize)
        
        await Promise.all(
          batch.map(tile => cacheTile(tile.url, tile.key))
        )
        
        cachedTileCount.value += batch.length
        cacheProgress.value = cachedTileCount.value

        // Kleine delay tussen batches om server niet te overbelasten
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log(`Caching voltooid: ${cachedTileCount.value} tiles gecached`)
    } catch (err) {
      error.value = `Fout bij cachen: ${err.message}`
      console.error('Cache error:', err)
    } finally {
      isCaching.value = false
    }
  }

  /**
   * Haal een tile op uit de cache
   * 
   * @param {string} key - Cache key
   * @returns {Promise<Blob|null>} - Cached tile blob of null
   */
  const getCachedTile = async (key) => {
    try {
      return await tileStore.getItem(key)
    } catch (err) {
      console.error(`Fout bij ophalen cached tile ${key}:`, err)
      return null
    }
  }

  /**
   * Check of een tile gecached is
   * 
   * @param {number} zoom - Zoom niveau
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Promise<boolean>}
   */
  const isTileCached = async (zoom, x, y) => {
    const key = `tile_${zoom}_${x}_${y}`
    const tile = await getCachedTile(key)
    return tile !== null
  }

  /**
   * Verwijder alle gecachede tiles
   * 
   * @returns {Promise<void>}
   */
  const clearCache = async () => {
    try {
      await tileStore.clear()
      cachedTileCount.value = 0
      totalTilesToCache.value = 0
      cacheProgress.value = 0
      console.log('Cache gewist')
    } catch (err) {
      error.value = `Fout bij wissen cache: ${err.message}`
      console.error('Clear cache error:', err)
    }
  }

  /**
   * Bereken cache grootte
   * 
   * @returns {Promise<number>} - Cache grootte in bytes
   */
  const getCacheSize = async () => {
    try {
      let totalSize = 0
      const keys = await tileStore.keys()
      
      for (const key of keys) {
        const blob = await tileStore.getItem(key)
        if (blob) {
          totalSize += blob.size
        }
      }
      
      return totalSize
    } catch (err) {
      console.error('Fout bij berekenen cache grootte:', err)
      return 0
    }
  }

  /**
   * Format cache grootte naar leesbare string
   * 
   * @param {number} bytes - Grootte in bytes
   * @returns {string} - Geformatteerde string
   */
  const formatCacheSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Cache tiles voor een boomgaard boundary
   * 
   * @param {Object} boundary - GeoJSON boundary
   * @param {Array<number>} zoomLevels - Zoom niveaus
   * @returns {Promise<void>}
   */
  const cacheOrchardArea = async (boundary, zoomLevels = [13, 14, 15]) => {
    if (!boundary || !boundary.coordinates) {
      error.value = 'Ongeldige boundary data'
      return
    }

    // Bepaal bounding box van boundary
    let minLat = 90
    let maxLat = -90
    let minLng = 180
    let maxLng = -180

    const processCoordinates = (coords) => {
      for (const coord of coords) {
        if (Array.isArray(coord[0])) {
          processCoordinates(coord)
        } else {
          const [lng, lat] = coord
          minLat = Math.min(minLat, lat)
          maxLat = Math.max(maxLat, lat)
          minLng = Math.min(minLng, lng)
          maxLng = Math.max(maxLng, lng)
        }
      }
    }

    processCoordinates(boundary.coordinates)

    // Voeg kleine margin toe
    const margin = 0.005 // ~500m
    minLat -= margin
    maxLat += margin
    minLng -= margin
    maxLng += margin

    await cacheArea(minLat, maxLat, minLng, maxLng, zoomLevels)
  }

  // Return public API
  return {
    // State
    isCaching,
    cacheProgress,
    cachedTileCount,
    totalTilesToCache,
    error,
    
    // Computed
    cachePercentage,
    
    // Methods
    cacheArea,
    cacheOrchardArea,
    getCachedTile,
    isTileCached,
    clearCache,
    getCacheSize,
    formatCacheSize
  }
}
