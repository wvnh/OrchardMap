<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit Orchard' : 'Create New Orchard' }}</h2>
        <button @click="handleClose" class="modal-close" aria-label="Close">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Name -->
        <div class="form-group">
          <label for="orchard-name" class="form-label">
            Orchard Name <span class="required">*</span>
          </label>
          <input
            id="orchard-name"
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="e.g., Apple Grove Orchard"
            required
          />
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="orchard-description" class="form-label">
            Description
          </label>
          <textarea
            id="orchard-description"
            v-model="formData.description"
            class="form-textarea"
            rows="3"
            placeholder="Describe your orchard..."
          ></textarea>
        </div>

        <!-- Location Name -->
        <div class="form-group">
          <label for="location-name" class="form-label">
            Location Name
          </label>
          <input
            id="location-name"
            v-model="formData.location_name"
            type="text"
            class="form-input"
            placeholder="e.g., Springfield, IL"
          />
        </div>

        <!-- GPS Coordinates -->
        <div class="form-row">
          <div class="form-group">
            <label for="latitude" class="form-label">
              Latitude <span class="required">*</span>
            </label>
            <input
              id="latitude"
              v-model.number="formData.latitude"
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              class="form-input"
              placeholder="e.g., 51.505"
              required
            />
          </div>
          <div class="form-group">
            <label for="longitude" class="form-label">
              Longitude <span class="required">*</span>
            </label>
            <input
              id="longitude"
              v-model.number="formData.longitude"
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              class="form-input"
              placeholder="e.g., -0.09"
              required
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

        <!-- Visibility -->
        <div class="form-group">
          <label class="form-checkbox">
            <input
              v-model="formData.is_public"
              type="checkbox"
            />
            <span class="form-checkbox-label">
              <span class="form-checkbox-icon">{{ formData.is_public ? '🌍' : '🔒' }}</span>
              Make this orchard public
            </span>
          </label>
          <p class="form-help">
            Public orchards can be viewed by anyone. Private orchards are only visible to you and users you grant access to.
          </p>
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
            {{ isEditing ? '💾 Update' : '➕ Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  orchard: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.orchard)
const gettingLocation = ref(false)

const formData = ref({
  name: '',
  description: '',
  location_name: '',
  latitude: 0,
  longitude: 0,
  is_public: false
})

// Watch for orchard prop changes
watch(() => props.orchard, (newOrchard) => {
  if (newOrchard) {
    formData.value = {
      name: newOrchard.name,
      description: newOrchard.description || '',
      location_name: newOrchard.location_name || '',
      latitude: newOrchard.latitude,
      longitude: newOrchard.longitude,
      is_public: newOrchard.is_public
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' &&
         formData.value.latitude >= -90 &&
         formData.value.latitude <= 90 &&
         formData.value.longitude >= -180 &&
         formData.value.longitude <= 180
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

const handleSubmit = () => {
  if (!isFormValid.value) return
  emit('save', { ...formData.value })
}

const handleClose = () => {
  emit('close')
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    location_name: '',
    latitude: 0,
    longitude: 0,
    is_public: false
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
  max-width: 600px;
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
  margin-bottom: 1rem;
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

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.form-checkbox:hover {
  background-color: #f8f9fa;
}

.form-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #2c3e50;
}

.form-checkbox-icon {
  font-size: 1.2rem;
}

.form-help {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #7f8c8d;
  line-height: 1.4;
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
