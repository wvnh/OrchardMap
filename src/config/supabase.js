// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

// Supabase configuratie met environment variable fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

// Valideer configuratie
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key not defined.")
}

// Initialiseer de Supabase client met auth configuratie
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'orchardmap-auth-token',
  }
})

// We zullen deze client gebruiken in al onze Composables.