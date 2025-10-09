<template>
  <div class="species-selector">
    <label v-if="label" class="species-selector__label">
      {{ label }}
      <span v-if="required" class="species-selector__required">*</span>
    </label>

    <div class="species-selector__search">
      <input
        v-model="searchTerm"
        type="text"
        :placeholder="placeholder"
        class="species-selector__input"
        @focus="showDropdown = true"
      />
      <span class="species-selector__icon">🔍</span>
    </div>

    <div 
      v-if="showDropdown && filteredSpecies.length > 0" 
      class="species-selector__dropdown"
      @click.stop
    >
      <div
        v-for="species in filteredSpecies"
        :key="species.id"
        class="species-selector__option"
        :class="{ 'species-selector__option--selected': isSelected(species.id) }"
        @click="selectSpecies(species)"
      >
        <div class="species-selector__option-main">
          <span class="species-selector__option-name">{{ species.variety_name }}</span>
          <span class="species-selector__option-type">{{ species.fruit_type }}</span>
        </div>
        <div v-if="species.synonyms && species.synonyms.length" class="species-selector__option-synonyms">
          Also: {{ species.synonyms.slice(0, 2).join(', ') }}{{ species.synonyms.length > 2 ? '...' : '' }}
        </div>
      </div>
    </div>

    <div 
      v-if="showDropdown && filteredSpecies.length === 0 && searchTerm"
      class="species-selector__no-results"
    >
      No species found matching "{{ searchTerm }}"
    </div>

    <div v-if="selectedSpecies" class="species-selector__selected">
      <div class="species-selector__selected-card">
        <div class="species-selector__selected-header">
          <div>
            <div class="species-selector__selected-name">{{ selectedSpecies.variety_name }}</div>
            <div class="species-selector__selected-type">{{ selectedSpecies.fruit_type }}</div>
          </div>
          <button
            v-if="clearable"
            @click="clearSelection"
            class="species-selector__clear"
            type="button"
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
        <div v-if="showDetails && selectedSpecies.origin_country" class="species-selector__selected-detail">
          Origin: {{ selectedSpecies.origin_country }}
        </div>
      </div>
    </div>

    <div v-if="error" class="species-selector__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useTreeSpecies } from '@/composables/useTreeSpecies.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: 'Select Tree Species'
  },
  placeholder: {
    type: String,
    default: 'Search species by name or fruit type...'
  },
  required: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  showDetails: {
    type: Boolean,
    default: true
  },
  filterFruitType: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const { species, loading, error, fetchSpecies } = useTreeSpecies()

const searchTerm = ref('')
const showDropdown = ref(false)
const selectedSpecies = ref(null)

// Fetch species on mount
onMounted(async () => {
  await fetchSpecies()
  
  // If there's an initial value, find and set the selected species
  if (props.modelValue) {
    selectedSpecies.value = species.value.find(s => s.id === props.modelValue)
  }
})

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.species-selector')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue && species.value.length) {
    selectedSpecies.value = species.value.find(s => s.id === newValue)
  } else if (!newValue) {
    selectedSpecies.value = null
  }
})

// Filter species based on search term and fruit type filter
const filteredSpecies = computed(() => {
  let filtered = species.value

  // Apply fruit type filter if provided
  if (props.filterFruitType) {
    filtered = filtered.filter(s => s.fruit_type === props.filterFruitType)
  }

  // Apply search filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.variety_name?.toLowerCase().includes(term) ||
      s.fruit_type?.toLowerCase().includes(term) ||
      s.synonyms?.some(syn => syn.toLowerCase().includes(term))
    )
  }

  // Limit results for performance
  return filtered.slice(0, 50)
})

const isSelected = (speciesId) => {
  return selectedSpecies.value?.id === speciesId
}

const selectSpecies = (species) => {
  selectedSpecies.value = species
  emit('update:modelValue', species.id)
  emit('select', species)
  showDropdown.value = false
  searchTerm.value = ''
}

const clearSelection = () => {
  selectedSpecies.value = null
  emit('update:modelValue', null)
  emit('select', null)
  searchTerm.value = ''
}
</script>

<style scoped>
.species-selector {
  position: relative;
  width: 100%;
}

.species-selector__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.species-selector__required {
  color: #e74c3c;
}

.species-selector__search {
  position: relative;
}

.species-selector__input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.species-selector__input:focus {
  outline: none;
  border-color: #3498db;
}

.species-selector__icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
  pointer-events: none;
}

.species-selector__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.species-selector__option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.species-selector__option:last-child {
  border-bottom: none;
}

.species-selector__option:hover {
  background-color: #f8f9fa;
}

.species-selector__option--selected {
  background-color: #e3f2fd;
}

.species-selector__option-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.species-selector__option-name {
  font-weight: 500;
  color: #2c3e50;
}

.species-selector__option-type {
  font-size: 0.85rem;
  color: #7f8c8d;
  background-color: #ecf0f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.species-selector__option-synonyms {
  font-size: 0.8rem;
  color: #95a5a6;
  font-style: italic;
}

.species-selector__no-results {
  padding: 1.5rem;
  text-align: center;
  color: #95a5a6;
  font-style: italic;
}

.species-selector__selected {
  margin-top: 0.75rem;
}

.species-selector__selected-card {
  background-color: #f8f9fa;
  border: 2px solid #2ecc71;
  border-radius: 6px;
  padding: 1rem;
}

.species-selector__selected-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.species-selector__selected-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.species-selector__selected-type {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.species-selector__selected-detail {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #555;
}

.species-selector__clear {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #95a5a6;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.species-selector__clear:hover {
  background-color: #e0e0e0;
  color: #2c3e50;
}

.species-selector__error {
  margin-top: 0.5rem;
  color: #e74c3c;
  font-size: 0.875rem;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .species-selector__dropdown {
    max-height: 200px;
  }

  .species-selector__option-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
