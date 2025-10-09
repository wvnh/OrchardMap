// src/composables/useOrchards.js
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase.js'
import { useAuth } from './useAuth.js'

/**
 * useOrchards Composable
 * 
 * Manages orchard data and CRUD operations with RLS compliance.
 * Provides filtered access based on user role and permissions.
 * 
 * @returns {Object} - Orchard state and methods
 */
export function useOrchards() {
  const { user, userRole } = useAuth()
  
  const orchards = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch orchards based on user role and permissions
   * - Admin: All orchards
   * - Orchard Manager: Own orchards
   * - Orchard Worker/Registered User: Orchards with permissions
   * - Guest: Public orchards only
   */
  const fetchOrchards = async () => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('orchards')
        .select(`
          *,
          owner:users!orchards_owner_id_fkey(id, first_name, last_name, email),
          orchard_permissions(role)
        `)
        .order('created_at', { ascending: false })

      // Guest users: only public orchards
      if (!user.value) {
        query = query.eq('is_public', true)
      }
      // RLS will handle access control for authenticated users

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      orchards.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching orchards:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single orchard by ID with full details
   */
  const fetchOrchardById = async (orchardId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('orchards')
        .select(`
          *,
          owner:users!orchards_owner_id_fkey(id, first_name, last_name, email),
          orchard_permissions(
            id,
            user_id,
            role,
            user:users(first_name, last_name, email)
          )
        `)
        .eq('id', orchardId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching orchard:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new orchard
   * Only available to Orchard Managers and Admins
   */
  const createOrchard = async (orchardData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('orchards')
        .insert([{
          name: orchardData.name,
          description: orchardData.description,
          location_name: orchardData.location_name,
          latitude: orchardData.latitude,
          longitude: orchardData.longitude,
          is_public: orchardData.is_public || false,
          owner_id: user.value.id
        }])
        .select()
        .single()

      if (createError) throw createError

      // Add to local state
      orchards.value.unshift(data)
      
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error creating orchard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing orchard
   * Only available to orchard owners
   */
  const updateOrchard = async (orchardId, orchardData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('orchards')
        .update({
          name: orchardData.name,
          description: orchardData.description,
          location_name: orchardData.location_name,
          latitude: orchardData.latitude,
          longitude: orchardData.longitude,
          is_public: orchardData.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', orchardId)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local state
      const index = orchards.value.findIndex(o => o.id === orchardId)
      if (index !== -1) {
        orchards.value[index] = data
      }

      return data
    } catch (err) {
      error.value = err.message
      console.error('Error updating orchard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an orchard
   * Only available to orchard owners
   */
  const deleteOrchard = async (orchardId) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('orchards')
        .delete()
        .eq('id', orchardId)

      if (deleteError) throw deleteError

      // Remove from local state
      orchards.value = orchards.value.filter(o => o.id !== orchardId)

      return true
    } catch (err) {
      error.value = err.message
      console.error('Error deleting orchard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if user can edit an orchard
   */
  const canEditOrchard = (orchard) => {
    if (!user.value) return false
    if (userRole.value === 'admin') return true
    return orchard.owner_id === user.value.id
  }

  /**
   * Check if user can delete an orchard
   */
  const canDeleteOrchard = (orchard) => {
    if (!user.value) return false
    if (userRole.value === 'admin') return true
    return orchard.owner_id === user.value.id
  }

  /**
   * Check if user can add trees to an orchard
   */
  const canAddTrees = (orchard) => {
    if (!user.value) return false
    if (userRole.value === 'admin') return true
    if (orchard.owner_id === user.value.id) return true
    
    // Check if user has worker or higher permission
    const permission = orchard.orchard_permissions?.find(p => p.user_id === user.value.id)
    return permission && ['orchard_manager', 'orchard_worker'].includes(permission.role)
  }

  /**
   * Search orchards by name or location
   */
  const searchOrchards = computed(() => {
    return (searchTerm) => {
      if (!searchTerm) return orchards.value
      
      const term = searchTerm.toLowerCase()
      return orchards.value.filter(orchard => 
        orchard.name.toLowerCase().includes(term) ||
        orchard.location_name?.toLowerCase().includes(term) ||
        orchard.description?.toLowerCase().includes(term)
      )
    }
  })

  /**
   * Filter orchards by visibility
   */
  const filterByVisibility = computed(() => {
    return (isPublic) => {
      if (isPublic === null || isPublic === undefined) return orchards.value
      return orchards.value.filter(orchard => orchard.is_public === isPublic)
    }
  })

  return {
    orchards,
    loading,
    error,
    fetchOrchards,
    fetchOrchardById,
    createOrchard,
    updateOrchard,
    deleteOrchard,
    canEditOrchard,
    canDeleteOrchard,
    canAddTrees,
    searchOrchards,
    filterByVisibility
  }
}
