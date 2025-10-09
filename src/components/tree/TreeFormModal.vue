<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit Tree' : 'Add New Tree' }}</h2>
        <button @click="handleClose" class="modal-close" aria-label="Close">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Species Selection -->
        <SpeciesSelector
          v-model="formData.tree_species_id"
          label="Tree Species"
          :required="true"
          @select="handleSpeciesSelect"
        />

        <!-- Position -->
        <div class="form-row">
          <div class="form-group">
            <label for="row-number" class="form-label">
              Row Number <span class="required">*</span>
            </label>
            <input
              id="row-number"
              v-model.number="formData.row_number"
              type="number"
              min="1"
              class="form-input"
              placeholder="e.g., 1"
              required
            />
          </div>
          <div class="form-group">
            <label for="column-number" class="form-label">
              Column Number <span class="required">*</span>
            </label>
            <input
              id="column-number"
              v-model.number="formData.column_number"
              type="number"
              min="1"
              class="form-input"
              placeholder="e.g., 1"
              required
            />
          </div>
        </div>

        <!-- GPS Coordinates (Optional) -->
        <div class="form-row">
          <div class="form-group">
            <label for="tree-latitude" class="form-label">
              Latitude (Optional)
            </label>
            <input
              id="tree-latitude"
              v-model.number="formData.latitude"
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              class="form-input"
              placeholder="e.g., 51.505"
            />
          </div>
          <div class="form-group">
            <label for="tree-longitude" class="form-label">
              Longitude (Optional)
            </label>
            <input
              id="tree-longitude"
              v-model.number="formData.longitude"
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              class="form-input"
              placeholder="e.g., -0.09"
            />
          </div>
        </div>

        <button
          type="button"
          @click="getCurrentLocation"
          class="btn btn--secondary btn--small"
          :disabled="gettingLocation"
        >
          {{ gettingLocation ? '📍 Getting location...' : '📍 Use My Location' }}
        </button>

        <!-- Planted Date -->
        <div class="form-group">
          <label for="planted-date" class="form-label">
            Planted Date
          </label>
          <input
            id="planted-date"
            v-model="formData.planted_date"
            type="date"
            class="form-input"
          />
        </div>

        <!-- Status Fields -->
        <div class="form-row">
          <div class="form-group">
            <label for="condition" class="form-label">
              Condition
            </label>
            <select id="condition" v-model="formData.condition" class="form-input">
              <option value="planted">Planted</option>
              <option value="not_productive">Not Productive</option>
              <option value="productive">Productive</option>
              <option value="dormant">Dormant</option>
            </select>
          </div>
          <div class="form-group">
            <label for="health-status" class="form-label">
              Health Status
            </label>
            <select id="health-status" v-model="formData.health_status" class="form-input">
              <option value="healthy">Healthy</option>
              <option value="less_healthy">Less Healthy</option>
              <option value="sick">Sick</option>
              <option value="quarantine">Quarantine</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="bloom-status" class="form-label">
              Bloom Status
            </label>
            <select id="bloom-status" v-model="formData.bloom_status" class="form-input">
              <option value="dormant">Dormant</option>
              <option value="blooming">Blooming</option>
              <option value="fruiting">Fruiting</option>
              <option value="ripe">Ripe</option>
              <option value="harvested">Harvested</option>
            </select>
          </div>
          <div class="form-group">
            <label for="maintenance-status" class="form-label">
              Maintenance Status
            </label>
            <select id="maintenance-status" v-model="formData.maintenance_status" class="form-input">
              <option value="none">None</option>
              <option value="scheduled_pruning">Scheduled Pruning</option>
              <option value="scheduled_removal">Scheduled Removal</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label for="tree-notes" class="form-label">
            Notes
          </label>
          <textarea
            id="tree-notes"
            v-model="formData.notes"
            class="form-textarea"
            rows="3"
            placeholder="Any additional notes about this tree..."
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            type="button"
            @click="handleClose"
            class="btn btn--secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn--primary"
            :disabled="!isFormValid"
          >
            {{ isEditing ? '💾 Update' : '➕ Add Tree' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SpeciesSelector from '../common/SpeciesSelector.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  tree: {
    type: Object,
    default: null
  },
  orchardId: {
    type: String,
    required: true
  },
  suggestedPosition: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.tree)
const gettingLocation = ref(false)

const formData = ref({
  orchard_id: props.orchardId,
  tree_species_id: null,
  row_number: 1,
  column_number: 1,
  latitude: null,
  longitude: null,
  planted_date: '',
  condition: 'planted',
  health_status: 'healthy',
  maintenance_status: 'none',
  bloom_status: 'dormant',
  notes: ''
})

// Watch for tree prop changes
watch(() => props.tree, (newTree) => {
  if (newTree) {
    formData.value = {
      orchard_id: newTree.orchard_id,
      tree_species_id: newTree.tree_species_id,
      row_number: newTree.row_number,
      column_number: newTree.column_number,
      latitude: newTree.latitude,
      longitude: newTree.longitude,
      planted_date: newTree.planted_date || '',
      condition: newTree.condition || 'planted',
      health_status: newTree.health_status || 'healthy',
      maintenance_status: newTree.maintenance_status || 'none',
      bloom_status: newTree.bloom_status || 'dormant',
      notes: newTree.notes || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for suggested position
watch(() => props.suggestedPosition, (position) => {
  if (position && !props.tree) {
    formData.value.row_number = position.row
    formData.value.column_number = position.col
  }
}, { immediate: true })

const isFormValid = computed(() => {
  return formData.value.tree_species_id &&
         formData.value.row_number > 0 &&
         formData.value.column_number > 0
})

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  gettingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.latitude = position.coords.latitude
      formData.value.longitude = position.coords.longitude
      gettingLocation.value = false
    },
    (error) => {
      alert(`Failed to get location: ${error.message}`)
      gettingLocation.value = false
    }
  )
}

const handleSpeciesSelect = (species) => {
  // Species selected, could do additional logic here
  console.log('Selected species:', species)
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  // Clean up the data before sending
  const dataToSend = { ...formData.value }
  
  // Convert empty strings to null for optional fields
  if (!dataToSend.planted_date) dataToSend.planted_date = null
  if (!dataToSend.latitude) dataToSend.latitude = null
  if (!dataToSend.longitude) dataToSend.longitude = null
  if (!dataToSend.notes) dataToSend.notes = null
  
  emit('save', dataToSend)
}

const handleClose = () => {
  emit('close')
}

const resetForm = () => {
  formData.value = {
    orchard_id: props.orchardId,
    tree_species_id: null,
    row_number: props.suggestedPosition?.row || 1,
    column_number: props.suggestedPosition?.col || 1,
    latitude: null,
    longitude: null,
    planted_date: '',
    condition: 'planted',
    health_status: 'healthy',
    maintenance_status: 'none',
    bloom_status: 'dormant',
    notes: ''
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #95a5a6;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn--primary {
  background-color: #2ecc71;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: #27ae60;
}

.btn--secondary {
  background-color: #3498db;
  color: white;
}

.btn--secondary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.modal-actions .btn {
  flex: 1;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
