// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase.js'

// Singleton state - gedeeld tussen alle instanties van useAuth
let isInitialized = false
const user = ref(null)

/**
 * useAuth Composable
 * 
 * Centrale composable voor authenticatie met Supabase.
 * Beheert de gebruikersstatus en biedt login/logout functionaliteit.
 * 
 * @returns {Object} - Bevat user (ref), userRole (computed), login en logout functies
 */
export function useAuth() {
  // Computed property voor de gebruikersrol
  // Haalt de rol uit user metadata of claims
  const userRole = computed(() => {
    if (!user.value) return null
    
    // Probeer rol uit user_metadata te halen
    if (user.value.user_metadata?.role) {
      return user.value.user_metadata.role
    }
    
    // Probeer rol uit app_metadata te halen
    if (user.value.app_metadata?.role) {
      return user.value.app_metadata.role
    }
    
    // Standaard rol voor ingelogde gebruikers zonder specifieke rol
    return 'Owner'
  })

  /**
   * Login functie
   * Logt een gebruiker in met email en wachtwoord
   * 
   * @param {string} email - Email van de gebruiker
   * @param {string} password - Wachtwoord van de gebruiker
   * @returns {Promise<Object>} - Supabase auth response
   * @throws {Error} - Als login mislukt
   */
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      // User wordt automatisch bijgewerkt via onAuthStateChange
      return data
    } catch (error) {
      console.error('Login error:', error.message)
      throw error
    }
  }

  /**
   * Register functie
   * Registreert een nieuwe gebruiker met email en wachtwoord
   * 
   * @param {string} email - Email van de gebruiker
   * @param {string} password - Wachtwoord van de gebruiker
   * @param {Object} metadata - Extra gebruikersgegevens (first_name, last_name, etc.)
   * @returns {Promise<Object>} - Supabase auth response
   * @throws {Error} - Als registratie mislukt
   */
  const register = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        throw error
      }

      // User wordt automatisch bijgewerkt via onAuthStateChange
      return data
    } catch (error) {
      console.error('Register error:', error.message)
      throw error
    }
  }

  /**
   * Logout functie
   * Logt de huidige gebruiker uit
   * 
   * @returns {Promise<void>}
   * @throws {Error} - Als logout mislukt
   */
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // User wordt automatisch bijgewerkt via onAuthStateChange
    } catch (error) {
      console.error('Logout error:', error.message)
      throw error
    }
  }

  /**
   * Initialiseer auth state listener
   * Wordt slechts één keer uitgevoerd (singleton pattern)
   */
  const initializeAuth = async () => {
    if (isInitialized) {
      return
    }

    // Haal huidige sessie op bij eerste load
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user ?? null
    } catch (error) {
      console.error('Error getting session:', error.message)
      user.value = null
    }

    // Luister naar auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
      
      // Log auth events voor debugging
      console.log('Auth state changed:', event, user.value?.email || 'No user')
    })

    isInitialized = true
  }

  // Initialiseer bij eerste gebruik
  initializeAuth()

  /**
   * Check of gebruiker is ingelogd
   * 
   * @returns {boolean} - True als gebruiker is ingelogd
   */
  const isAuthenticated = computed(() => !!user.value)

  // Return public API
  return {
    user,
    userRole,
    isAuthenticated,
    login,
    register,
    logout
  }
}
