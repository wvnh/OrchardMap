// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

// Haal de environment variables op via Vite/Vue
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_KEY

// Initialiseer de Supabase client
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key not defined in environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// We zullen deze client gebruiken in al onze Composables.