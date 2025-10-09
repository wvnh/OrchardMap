<template>
  <div class="map-page">
    <q-layout view="hHh lpR fFf">
      <!-- Header -->
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>
            <q-icon name="map" size="sm" class="q-mr-sm" />
            OrchardMap - GPS & Kaarten
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="menu"
            @click="showSettings = !showSettings"
          />
        </q-toolbar>
      </q-header>

      <!-- Settings Drawer -->
      <q-drawer
        v-model="showSettings"
        side="right"
        bordered
        :width="300"
      >
        <q-list>
          <q-item-label header>Instellingen</q-item-label>
          
          <q-item>
            <q-item-section>
              <q-item-label>GPS Nauwkeurigheid</q-item-label>
              <q-item-label caption>
                Hogere nauwkeurigheid gebruikt meer batterij
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-toggle
                v-model="highAccuracy"
                label="Hoge nauwkeurigheid"
                color="primary"
              />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section>
              <q-item-label>Kaart Opties</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-checkbox
                v-model="showTreeMarkers"
                label="Toon boom markers"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-checkbox
                v-model="showOrchardBoundaries"
                label="Toon boomgaard grenzen"
              />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section>
              <q-btn
                color="negative"
                label="Clear Trail"
                icon="delete"
                @click="clearTrail"
                :disable="trail.length === 0"
                outline
                class="full-width"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <!-- Main Content -->
      <q-page-container>
        <q-page>
          <div class="map-container">
            <OrchardMapView
              :orchards="filteredOrchards"
              :trees="filteredTrees"
              :initial-center="initialCenter"
              :initial-zoom="initialZoom"
              @tree-selected="onTreeSelected"
              @orchard-selected="onOrchardSelected"
            />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>

    <!-- Tree Details Dialog -->
    <q-dialog v-model="showTreeDetails" v-if="selectedTree">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Boom Details</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showTreeDetails = false" />
        </q-card-section>

        <q-card-section>
          <TreeMarker
            :tree="selectedTree"
            :species-name="selectedTree.species?.variety_name || 'Onbekend'"
            :distance="calculateDistanceToTree(selectedTree)"
            :can-edit="canEditTree"
            @navigate="navigateToTree"
            @edit="editTree"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Orchard Details Dialog -->
    <q-dialog v-model="showOrchardDetails" v-if="selectedOrchard">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedOrchard.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showOrchardDetails = false" />
        </q-card-section>

        <q-card-section>
          <div class="orchard-info">
            <p v-if="selectedOrchard.description">
              {{ selectedOrchard.description }}
            </p>
            <div class="info-grid">
              <div class="info-item">
                <q-icon name="place" size="sm" />
                <span>{{ selectedOrchard.location }}</span>
              </div>
              <div class="info-item" v-if="selectedOrchard.area_hectares">
                <q-icon name="landscape" size="sm" />
                <span>{{ selectedOrchard.area_hectares }} hectare</span>
              </div>
              <div class="info-item">
                <q-icon name="park" size="sm" />
                <span>{{ getTreeCount(selectedOrchard.id) }} bomen</span>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Sluiten" color="primary" @click="showOrchardDetails = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import OrchardMapView from '../components/OrchardMapView.vue'
import TreeMarker from '../components/TreeMarker.vue'
import { useGeolocation } from '../composables/useGeolocation'
import { supabase } from '../config/supabase'

// State
const orchards = ref([])
const trees = ref([])
const showSettings = ref(false)
const showTreeDetails = ref(false)
const showOrchardDetails = ref(false)
const selectedTree = ref(null)
const selectedOrchard = ref(null)
const highAccuracy = ref(false)
const showTreeMarkers = ref(true)
const showOrchardBoundaries = ref(true)
const isLoading = ref(false)
const error = ref(null)

// Initial map position (Netherlands center)
const initialCenter = ref([52.1326, 5.2913])
const initialZoom = ref(7)

// Geolocation composable (for distance calculation)
const {
  currentPosition,
  trail,
  calculateDistance,
  clearTrail: clearGPSTrail
} = useGeolocation()

// Computed
const filteredOrchards = computed(() => {
  if (!showOrchardBoundaries.value) return []
  return orchards.value
})

const filteredTrees = computed(() => {
  if (!showTreeMarkers.value) return []
  return trees.value
})

const canEditTree = computed(() => {
  // TODO: Check user permissions
  return false
})

// Methods
const loadOrchards = async () => {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await supabase
      .from('orchards')
      .select('*')
      .eq('is_public', true)
    
    if (fetchError) throw fetchError
    
    orchards.value = data || []
    
    // If user has location, center on nearest orchard
    if (currentPosition.value && orchards.value.length > 0) {
      const nearest = findNearestOrchard()
      if (nearest) {
        initialCenter.value = [nearest.center_latitude, nearest.center_longitude]
        initialZoom.value = 13
      }
    }
  } catch (err) {
    error.value = `Fout bij laden boomgaarden: ${err.message}`
    console.error('Load orchards error:', err)
  } finally {
    isLoading.value = false
  }
}

const loadTrees = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('orchard_trees')
      .select(`
        *,
        species:tree_species(*)
      `)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
    
    if (fetchError) throw fetchError
    
    trees.value = data || []
  } catch (err) {
    error.value = `Fout bij laden bomen: ${err.message}`
    console.error('Load trees error:', err)
  }
}

const findNearestOrchard = () => {
  if (!currentPosition.value || orchards.value.length === 0) return null
  
  let nearest = null
  let minDistance = Infinity
  
  for (const orchard of orchards.value) {
    if (orchard.center_latitude && orchard.center_longitude) {
      const distance = calculateDistance(
        currentPosition.value.latitude,
        currentPosition.value.longitude,
        orchard.center_latitude,
        orchard.center_longitude
      )
      
      if (distance < minDistance) {
        minDistance = distance
        nearest = orchard
      }
    }
  }
  
  return nearest
}

const calculateDistanceToTree = (tree) => {
  if (!currentPosition.value || !tree.latitude || !tree.longitude) {
    return null
  }
  
  return calculateDistance(
    currentPosition.value.latitude,
    currentPosition.value.longitude,
    tree.latitude,
    tree.longitude
  )
}

const getTreeCount = (orchardId) => {
  return trees.value.filter(tree => tree.orchard_id === orchardId).length
}

const onTreeSelected = (tree) => {
  selectedTree.value = tree
  showTreeDetails.value = true
}

const onOrchardSelected = (orchard) => {
  selectedOrchard.value = orchard
  showOrchardDetails.value = true
}

const navigateToTree = (tree) => {
  if (!tree.latitude || !tree.longitude) return
  
  // Open in Google Maps or Apple Maps
  const url = `https://www.google.com/maps/dir/?api=1&destination=${tree.latitude},${tree.longitude}`
  window.open(url, '_blank')
}

const editTree = (tree) => {
  // TODO: Implement tree editing
  console.log('Edit tree:', tree)
}

const clearTrail = () => {
  clearGPSTrail()
}

// Lifecycle
onMounted(async () => {
  await loadOrchards()
  await loadTrees()
})
</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100vh;
}

.map-container {
  width: 100%;
  height: calc(100vh - 50px);
}

.orchard-info {
  padding: 8px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .q-icon {
  color: #666;
}

.info-item span {
  font-size: 14px;
  color: #1a1a1a;
}
</style>
