// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'

/**
 * Auth Store - Pinia store voor authenticatie state
 * 
 * Centrale store voor authenticatie state management.
 * Gebruikt de useAuth composable en biedt een globale state interface.
 */
export const useAuthStore = defineStore('auth', () => {
  // Gebruik de bestaande useAuth composable
  const { user, userRole, isAuthenticated, login, register, logout } = useAuth()
  
  // Loading state voor async operaties
  const loading = ref(false)
  const error = ref(null)
  
  /**
   * Login actie met error handling en loading state
   * 
   * @param {string} email - Email van de gebruiker
   * @param {string} password - Wachtwoord van de gebruiker
   * @returns {Promise<boolean>} - True als login succesvol
   */
  const handleLogin = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      await login(email, password)
      return true
    } catch (err) {
      error.value = err.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Register actie met error handling en loading state
   * 
   * @param {string} email - Email van de gebruiker
   * @param {string} password - Wachtwoord van de gebruiker
   * @param {Object} metadata - Extra gebruikersgegevens
   * @returns {Promise<boolean>} - True als registratie succesvol
   */
  const handleRegister = async (email, password, metadata = {}) => {
    loading.value = true
    error.value = null
    
    try {
      await register(email, password, metadata)
      return true
    } catch (err) {
      error.value = err.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Logout actie met error handling en loading state
   * 
   * @returns {Promise<boolean>} - True als logout succesvol
   */
  const handleLogout = async () => {
    loading.value = true
    error.value = null
    
    try {
      await logout()
      return true
    } catch (err) {
      error.value = err.message || 'Logout failed'
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Clear error message
   */
  const clearError = () => {
    error.value = null
  }
  
  /**
   * Check of gebruiker een specifieke rol heeft
   * 
   * @param {string} role - Rol om te checken
   * @returns {boolean} - True als gebruiker de rol heeft
   */
  const hasRole = (role) => {
    return userRole.value === role
  }
  
  /**
   * Check of gebruiker een van de opgegeven rollen heeft
   * 
   * @param {Array<string>} roles - Array van rollen om te checken
   * @returns {boolean} - True als gebruiker een van de rollen heeft
   */
  const hasAnyRole = (roles) => {
    return roles.includes(userRole.value)
  }
  
  return {
    // State
    user,
    userRole,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    handleLogin,
    handleRegister,
    handleLogout,
    clearError,
    
    // Helpers
    hasRole,
    hasAnyRole
  }
})
