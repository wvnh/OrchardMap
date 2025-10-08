// src/composables/useData.js
import { ref, reactive } from 'vue'
import { supabase } from '../config/supabase.js'
import { useAuth } from './useAuth.js'

// Singleton state - gedeeld tussen alle instanties van useData
let isInitialized = false
const orchards = ref([])
const treeSpecies = ref([])
const loading = reactive({
  orchards: false,
  treeSpecies: false
})
const error = reactive({
  orchards: null,
  treeSpecies: null
})

/**
 * useData Composable
 * 
 * Centrale composable voor alle Supabase CRUD-interacties voor de primaire tabellen.
 * Beheert data voor orchards, trees en treeSpecies met RLS-ondersteuning.
 * 
 * @returns {Object} - Bevat state (orchards, treeSpecies, loading, error) en data functies
 */
export function useData() {
  const { user } = useAuth()

  /**
   * Haal alle boomgaarden van de ingelogde gebruiker op
   * Respecteert RLS-regels (alleen eigen data)
   * 
   * @returns {Promise<Array>} - Lijst met boomgaarden
   * @throws {Error} - Als fetch mislukt
   */
  const fetchOwnerOrchards = async () => {
    loading.orchards = true
    error.orchards = null

    try {
      if (!user.value) {
        throw new Error('Gebruiker is niet ingelogd')
      }

      // Supabase RLS filtert automatisch op owner_id via auth.uid()
      const { data, error: fetchError } = await supabase
        .from('orchards')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      orchards.value = data || []
      return orchards.value
    } catch (err) {
      console.error('Fout bij ophalen boomgaarden:', err.message)
      error.orchards = err.message
      throw err
    } finally {
      loading.orchards = false
    }
  }

  /**
   * Voeg een nieuwe boomgaard toe
   * RLS zorgt ervoor dat owner_id automatisch wordt ingesteld
   * 
   * @param {Object} data - Boomgaard data (name, location, etc.)
   * @returns {Promise<Object>} - Nieuw aangemaakte boomgaard
   * @throws {Error} - Als creatie mislukt
   */
  const createOrchard = async (data) => {
    loading.orchards = true
    error.orchards = null

    try {
      if (!user.value) {
        throw new Error('Gebruiker is niet ingelogd')
      }

      // Valideer required fields
      if (!data.name) {
        throw new Error('Naam van boomgaard is verplicht')
      }

      const { data: newOrchard, error: createError } = await supabase
        .from('orchards')
        .insert([data])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      // Voeg nieuwe boomgaard toe aan lokale state
      orchards.value = [newOrchard, ...orchards.value]
      
      return newOrchard
    } catch (err) {
      console.error('Fout bij aanmaken boomgaard:', err.message)
      error.orchards = err.message
      throw err
    } finally {
      loading.orchards = false
    }
  }

  /**
   * Haal de volledige lijst met boomsoorten op
   * Dit is publieke data, beschikbaar voor iedereen
   * 
   * @returns {Promise<Array>} - Lijst met boomsoorten
   * @throws {Error} - Als fetch mislukt
   */
  const fetchAllTreeSpecies = async () => {
    loading.treeSpecies = true
    error.treeSpecies = null

    try {
      const { data, error: fetchError } = await supabase
        .from('treeSpecies')
        .select('*')
        .order('name', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      treeSpecies.value = data || []
      return treeSpecies.value
    } catch (err) {
      console.error('Fout bij ophalen boomsoorten:', err.message)
      error.treeSpecies = err.message
      throw err
    } finally {
      loading.treeSpecies = false
    }
  }

  /**
   * Initialiseer de composable
   * Wordt slechts één keer uitgevoerd (singleton pattern)
   */
  const initializeData = () => {
    if (isInitialized) {
      return
    }

    // Log initialisatie voor debugging
    console.log('useData composable geïnitialiseerd')

    isInitialized = true
  }

  // Initialiseer bij eerste gebruik
  initializeData()

  // Return public API
  return {
    // State
    orchards,
    treeSpecies,
    loading,
    error,

    // Functions
    fetchOwnerOrchards,
    createOrchard,
    fetchAllTreeSpecies
  }
}
