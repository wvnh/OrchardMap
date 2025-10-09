// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

// Lokale Supabase ontwikkelomgeving
const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

// Initialiseer de Supabase client
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key not defined.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// We zullen deze client gebruiken in al onze Composables.