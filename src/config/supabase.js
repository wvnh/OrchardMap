// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

// Environment-aware Supabase configuration
// In production, use environment variables from .env file
// In development, fall back to local Supabase instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key not defined. Please check your environment variables.")
}

// Log environment info (only in development)
if (import.meta.env.DEV) {
    console.log('🔧 Supabase Configuration:', {
        url: supabaseUrl,
        environment: import.meta.env.MODE,
    })
}

// Initialize Supabase client with configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
})

// Export configuration for use in other modules
export const config = {
    url: supabaseUrl,
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
}