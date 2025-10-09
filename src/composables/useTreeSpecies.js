// src/composables/useTreeSpecies.js
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase.js'

/**
 * useTreeSpecies Composable
 * 
 * Manages tree species data for selection in orchards.
 * Only shows validated species for use in production orchards.
 * 
 * @returns {Object} - Tree species state and methods
 */
export function useTreeSpecies() {
  const species = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch all validated tree species
   */
  const fetchSpecies = async (validatedOnly = true) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('tree_species')
        .select('*')
        .order('variety_name', { ascending: true })

      if (validatedOnly) {
        query = query.eq('is_validated', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      species.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching tree species:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single species by ID
   */
  const fetchSpeciesById = async (speciesId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('tree_species')
        .select('*')
        .eq('id', speciesId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching species:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Search species by name or fruit type
   */
  const searchSpecies = computed(() => {
    return (searchTerm) => {
      if (!searchTerm) return species.value
      
      const term = searchTerm.toLowerCase()
      return species.value.filter(s => 
        s.variety_name?.toLowerCase().includes(term) ||
        s.fruit_type?.toLowerCase().includes(term) ||
        s.synonyms?.some(syn => syn.toLowerCase().includes(term))
      )
    }
  })

  /**
   * Filter species by fruit type
   */
  const filterByFruitType = computed(() => {
    return (fruitType) => {
      if (!fruitType) return species.value
      return species.value.filter(s => s.fruit_type === fruitType)
    }
  })

  /**
   * Get unique fruit types for filtering
   */
  const uniqueFruitTypes = computed(() => {
    const types = new Set(species.value.map(s => s.fruit_type).filter(Boolean))
    return Array.from(types).sort()
  })

  /**
   * Format species for dropdown/select component
   */
  const speciesOptions = computed(() => {
    return species.value.map(s => ({
      value: s.id,
      label: `${s.variety_name} (${s.fruit_type || 'Unknown'})`,
      species: s
    }))
  })

  /**
   * Get species grouped by fruit type
   */
  const speciesGroupedByType = computed(() => {
    const grouped = {}
    
    species.value.forEach(s => {
      const type = s.fruit_type || 'Other'
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(s)
    })

    return grouped
  })

  return {
    species,
    loading,
    error,
    fetchSpecies,
    fetchSpeciesById,
    searchSpecies,
    filterByFruitType,
    uniqueFruitTypes,
    speciesOptions,
    speciesGroupedByType
  }
}
