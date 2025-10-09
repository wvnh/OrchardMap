// src/composables/useAnalytics.js
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase.js'

/**
 * useAnalytics Composable
 * 
 * Centrale composable voor analytics en dashboard statistieken.
 * Haalt data op van Supabase en berekent key metrics.
 * 
 * @returns {Object} - Bevat statistics, charts data en functies voor data ophalen
 */
export function useAnalytics() {
  // Reactive state
  const loading = ref(false)
  const error = ref(null)
  const orchards = ref([])
  const trees = ref([])
  const species = ref([])

  /**
   * Computed: Key Metrics
   * Berekent de belangrijkste statistieken voor het dashboard
   */
  const keyMetrics = computed(() => {
    return {
      totalOrchards: orchards.value.length,
      totalTrees: trees.value.length,
      totalSpecies: species.value.length,
      publicOrchards: orchards.value.filter(o => o.is_public).length,
      healthyTrees: trees.value.filter(t => t.health_status === 'healthy').length,
      avgTreesPerOrchard: orchards.value.length > 0 
        ? Math.round(trees.value.length / orchards.value.length) 
        : 0
    }
  })

  /**
   * Computed: Species Distribution
   * Groepeert bomen per boomsoort voor chart weergave
   */
  const speciesDistribution = computed(() => {
    const distribution = {}
    
    trees.value.forEach(tree => {
      const speciesId = tree.tree_species_id
      if (!distribution[speciesId]) {
        const speciesInfo = species.value.find(s => s.id === speciesId)
        distribution[speciesId] = {
          name: speciesInfo?.variety_name || 'Unknown',
          count: 0,
          fruitType: speciesInfo?.fruit_type || 'Unknown'
        }
      }
      distribution[speciesId].count++
    })

    return Object.values(distribution).sort((a, b) => b.count - a.count)
  })

  /**
   * Computed: Health Status Distribution
   * Groepeert bomen per gezondheidsstatus
   */
  const healthDistribution = computed(() => {
    const distribution = {
      healthy: 0,
      fair: 0,
      poor: 0,
      diseased: 0,
      dead: 0
    }

    trees.value.forEach(tree => {
      if (distribution.hasOwnProperty(tree.health_status)) {
        distribution[tree.health_status]++
      }
    })

    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count
    }))
  })

  /**
   * Computed: Planting Trends
   * Groepeert bomen per plantjaar
   */
  const plantingTrends = computed(() => {
    const yearCounts = {}

    trees.value.forEach(tree => {
      if (tree.planted_date) {
        const year = new Date(tree.planted_date).getFullYear()
        yearCounts[year] = (yearCounts[year] || 0) + 1
      }
    })

    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year)
  })

  /**
   * Computed: Fruit Type Distribution
   * Groepeert species per fruit type
   */
  const fruitTypeDistribution = computed(() => {
    const distribution = {}

    species.value.forEach(s => {
      const fruitType = s.fruit_type || 'Unknown'
      distribution[fruitType] = (distribution[fruitType] || 0) + 1
    })

    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count
    }))
  })

  /**
   * Fetch Orchards Data
   * Haalt alle toegankelijke boomgaarden op
   */
  const fetchOrchards = async () => {
    try {
      const { data, error: orchardError } = await supabase
        .from('orchards')
        .select('id, name, is_public, owner_id, created_at')

      if (orchardError) throw orchardError

      orchards.value = data || []
    } catch (err) {
      console.error('Error fetching orchards:', err.message)
      throw err
    }
  }

  /**
   * Fetch Trees Data
   * Haalt alle bomen op met species informatie
   */
  const fetchTrees = async () => {
    try {
      const { data, error: treeError } = await supabase
        .from('orchard_trees')
        .select(`
          id,
          tree_species_id,
          planted_date,
          health_status,
          condition,
          orchard_id
        `)

      if (treeError) throw treeError

      trees.value = data || []
    } catch (err) {
      console.error('Error fetching trees:', err.message)
      throw err
    }
  }

  /**
   * Fetch Species Data
   * Haalt alle gevalideerde boomsoorten op
   */
  const fetchSpecies = async () => {
    try {
      const { data, error: speciesError } = await supabase
        .from('tree_species')
        .select('id, variety_name, fruit_type, is_validated')
        .eq('is_validated', true)

      if (speciesError) throw speciesError

      species.value = data || []
    } catch (err) {
      console.error('Error fetching species:', err.message)
      throw err
    }
  }

  /**
   * Load All Analytics Data
   * Haalt alle benodigde data op voor het dashboard
   */
  const loadAnalyticsData = async () => {
    loading.value = true
    error.value = null

    try {
      // Fetch all data in parallel voor betere performance
      await Promise.all([
        fetchOrchards(),
        fetchTrees(),
        fetchSpecies()
      ])
    } catch (err) {
      error.value = err.message
      console.error('Error loading analytics data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Export Data to CSV
   * Genereert een CSV string van de analytics data
   */
  const exportToCSV = (dataType = 'species') => {
    let csvContent = ''
    
    switch (dataType) {
      case 'species':
        csvContent = 'Species,Count,Fruit Type\n'
        speciesDistribution.value.forEach(item => {
          csvContent += `"${item.name}",${item.count},"${item.fruitType}"\n`
        })
        break
      
      case 'health':
        csvContent = 'Health Status,Count\n'
        healthDistribution.value.forEach(item => {
          csvContent += `"${item.status}",${item.count}\n`
        })
        break
      
      case 'trends':
        csvContent = 'Year,Trees Planted\n'
        plantingTrends.value.forEach(item => {
          csvContent += `${item.year},${item.count}\n`
        })
        break
      
      default:
        csvContent = 'Key Metric,Value\n'
        Object.entries(keyMetrics.value).forEach(([key, value]) => {
          csvContent += `"${key}",${value}\n`
        })
    }

    return csvContent
  }

  /**
   * Download CSV File
   * Triggert een download van de CSV data
   */
  const downloadCSV = (dataType = 'species', filename = 'analytics-data.csv') => {
    const csvContent = exportToCSV(dataType)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Return public API
  return {
    // State
    loading,
    error,
    orchards,
    trees,
    species,
    
    // Computed metrics
    keyMetrics,
    speciesDistribution,
    healthDistribution,
    plantingTrends,
    fruitTypeDistribution,
    
    // Functions
    loadAnalyticsData,
    fetchOrchards,
    fetchTrees,
    fetchSpecies,
    exportToCSV,
    downloadCSV
  }
}
