// src/composables/useTrees.js
import { ref } from 'vue'
import { supabase } from '../config/supabase.js'
import { useAuth } from './useAuth.js'

/**
 * useTrees Composable
 * 
 * Manages orchard tree data and CRUD operations.
 * Provides access to trees within orchards with proper permissions.
 * 
 * @returns {Object} - Tree state and methods
 */
export function useTrees() {
  const { user } = useAuth()
  
  const trees = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch trees for a specific orchard
   */
  const fetchTreesByOrchard = async (orchardId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('orchard_trees')
        .select(`
          *,
          tree_species:tree_species!orchard_trees_tree_species_id_fkey(*),
          created_by_user:users!orchard_trees_created_by_fkey(first_name, last_name)
        `)
        .eq('orchard_id', orchardId)
        .is('removed_date', null)
        .order('row_number', { ascending: true })
        .order('column_number', { ascending: true })

      if (fetchError) throw fetchError

      trees.value = data || []
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching trees:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single tree by ID
   */
  const fetchTreeById = async (treeId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('orchard_trees')
        .select(`
          *,
          tree_species:tree_species!orchard_trees_tree_species_id_fkey(*),
          orchard:orchards!orchard_trees_orchard_id_fkey(id, name, owner_id),
          created_by_user:users!orchard_trees_created_by_fkey(first_name, last_name)
        `)
        .eq('id', treeId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching tree:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new tree in an orchard
   */
  const createTree = async (treeData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('orchard_trees')
        .insert([{
          orchard_id: treeData.orchard_id,
          tree_species_id: treeData.tree_species_id,
          row_number: treeData.row_number,
          column_number: treeData.column_number,
          latitude: treeData.latitude,
          longitude: treeData.longitude,
          planted_date: treeData.planted_date,
          condition: treeData.condition || 'planted',
          health_status: treeData.health_status || 'healthy',
          maintenance_status: treeData.maintenance_status || 'none',
          bloom_status: treeData.bloom_status || 'dormant',
          notes: treeData.notes,
          created_by: user.value.id
        }])
        .select(`
          *,
          tree_species:tree_species!orchard_trees_tree_species_id_fkey(*)
        `)
        .single()

      if (createError) throw createError

      // Add to local state
      trees.value.push(data)
      
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error creating tree:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing tree
   */
  const updateTree = async (treeId, treeData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('orchard_trees')
        .update({
          tree_species_id: treeData.tree_species_id,
          row_number: treeData.row_number,
          column_number: treeData.column_number,
          latitude: treeData.latitude,
          longitude: treeData.longitude,
          planted_date: treeData.planted_date,
          condition: treeData.condition,
          health_status: treeData.health_status,
          maintenance_status: treeData.maintenance_status,
          bloom_status: treeData.bloom_status,
          notes: treeData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', treeId)
        .select(`
          *,
          tree_species:tree_species!orchard_trees_tree_species_id_fkey(*)
        `)
        .single()

      if (updateError) throw updateError

      // Update local state
      const index = trees.value.findIndex(t => t.id === treeId)
      if (index !== -1) {
        trees.value[index] = data
      }

      return data
    } catch (err) {
      error.value = err.message
      console.error('Error updating tree:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Mark tree as removed (soft delete)
   */
  const removeTree = async (treeId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('orchard_trees')
        .update({
          removed_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', treeId)
        .select()
        .single()

      if (updateError) throw updateError

      // Remove from local state
      trees.value = trees.value.filter(t => t.id !== treeId)

      return data
    } catch (err) {
      error.value = err.message
      console.error('Error removing tree:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete tree permanently (hard delete)
   */
  const deleteTree = async (treeId) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('orchard_trees')
        .delete()
        .eq('id', treeId)

      if (deleteError) throw deleteError

      // Remove from local state
      trees.value = trees.value.filter(t => t.id !== treeId)

      return true
    } catch (err) {
      error.value = err.message
      console.error('Error deleting tree:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get trees organized by grid position
   */
  const getTreeGrid = (treesData = null) => {
    const treesToOrganize = treesData || trees.value
    
    if (!treesToOrganize.length) return { rows: 0, cols: 0, grid: [] }

    const maxRow = Math.max(...treesToOrganize.map(t => t.row_number))
    const maxCol = Math.max(...treesToOrganize.map(t => t.column_number))

    const grid = Array(maxRow).fill(null).map(() => Array(maxCol).fill(null))

    treesToOrganize.forEach(tree => {
      const rowIdx = tree.row_number - 1
      const colIdx = tree.column_number - 1
      if (rowIdx >= 0 && colIdx >= 0) {
        grid[rowIdx][colIdx] = tree
      }
    })

    return { rows: maxRow, cols: maxCol, grid }
  }

  /**
   * Filter trees by condition
   */
  const filterByCondition = (condition) => {
    if (!condition) return trees.value
    return trees.value.filter(tree => tree.condition === condition)
  }

  /**
   * Filter trees by health status
   */
  const filterByHealth = (healthStatus) => {
    if (!healthStatus) return trees.value
    return trees.value.filter(tree => tree.health_status === healthStatus)
  }

  /**
   * Filter trees by bloom status
   */
  const filterByBloom = (bloomStatus) => {
    if (!bloomStatus) return trees.value
    return trees.value.filter(tree => tree.bloom_status === bloomStatus)
  }

  /**
   * Search trees by species name
   */
  const searchBySpecies = (searchTerm) => {
    if (!searchTerm) return trees.value
    
    const term = searchTerm.toLowerCase()
    return trees.value.filter(tree => 
      tree.tree_species?.variety_name?.toLowerCase().includes(term) ||
      tree.tree_species?.fruit_type?.toLowerCase().includes(term)
    )
  }

  return {
    trees,
    loading,
    error,
    fetchTreesByOrchard,
    fetchTreeById,
    createTree,
    updateTree,
    removeTree,
    deleteTree,
    getTreeGrid,
    filterByCondition,
    filterByHealth,
    filterByBloom,
    searchBySpecies
  }
}
