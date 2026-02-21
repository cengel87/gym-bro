import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env.local and fill in your values.'
  )
}

// Use untyped client to avoid PostgrestVersion mismatch with manually-written types.
// All query results are explicitly cast to the correct Row types in hooks/pages.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Convenience type helpers
export type DbRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type DbInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type DbUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
export type DbView<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row']
