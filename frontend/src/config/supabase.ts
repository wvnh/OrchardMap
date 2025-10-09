// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Get configuration from environment variables (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

// Initialiseer de Supabase client
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key not defined.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// We zullen deze client gebruiken in al onze Composables.