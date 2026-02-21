// Auto-generated types from Supabase schema
// Run: supabase gen types typescript --local > src/types/database.types.ts
// This is a manually maintained version until the CLI is run

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: string
          name: string
          aliases: string[]
          primary_muscles: string[]
          secondary_muscles: string[]
          equipment: string
          movement_pattern: string
          force_type: string | null
          mechanics: string | null
          supports_bodyweight: boolean
          supports_incline: boolean
          supports_grip: boolean
          supports_stance: boolean
          default_rep_range: string | null
          default_sets: number
          tags: string[]
          created_at: string
          is_custom: boolean
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          aliases?: string[]
          primary_muscles?: string[]
          secondary_muscles?: string[]
          equipment: string
          movement_pattern: string
          force_type?: string | null
          mechanics?: string | null
          supports_bodyweight?: boolean
          supports_incline?: boolean
          supports_grip?: boolean
          supports_stance?: boolean
          default_rep_range?: string | null
          default_sets?: number
          tags?: string[]
          created_at?: string
          is_custom?: boolean
          created_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>
      }
      programs: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          days_per_week: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          days_per_week?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['programs']['Insert']>
      }
      templates: {
        Row: {
          id: string
          user_id: string
          program_id: string | null
          name: string
          description: string | null
          day_of_week: number | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id?: string | null
          name: string
          description?: string | null
          day_of_week?: number | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['templates']['Insert']>
      }
      template_exercises: {
        Row: {
          id: string
          template_id: string
          exercise_id: string
          sort_order: number
          target_sets: number
          min_reps: number
          max_reps: number
          rest_seconds: number
          variant_key: Json
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          exercise_id: string
          sort_order?: number
          target_sets?: number
          min_reps?: number
          max_reps?: number
          rest_seconds?: number
          variant_key?: Json
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['template_exercises']['Insert']>
      }
      workout_sessions: {
        Row: {
          id: string
          user_id: string
          template_id: string | null
          name: string | null
          started_at: string
          finished_at: string | null
          duration_seconds: number | null
          bodyweight_kg: number | null
          notes: string | null
          perceived_effort: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id?: string | null
          name?: string | null
          started_at?: string
          finished_at?: string | null
          bodyweight_kg?: number | null
          notes?: string | null
          perceived_effort?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['workout_sessions']['Insert']>
      }
      workout_exercises: {
        Row: {
          id: string
          session_id: string
          exercise_id: string
          template_exercise_id: string | null
          sort_order: number
          variant_key: Json
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          exercise_id: string
          template_exercise_id?: string | null
          sort_order?: number
          variant_key?: Json
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['workout_exercises']['Insert']>
      }
      sets: {
        Row: {
          id: string
          workout_exercise_id: string
          set_number: number
          set_type: string
          external_load_kg: number | null
          bodyweight_kg: number | null
          added_load_kg: number | null
          effective_load_kg: number | null
          reps_target: number | null
          reps_completed: number | null
          rpe: number | null
          is_completed: boolean
          completed_at: string | null
          rest_seconds_taken: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_exercise_id: string
          set_number: number
          set_type?: string
          external_load_kg?: number | null
          bodyweight_kg?: number | null
          added_load_kg?: number | null
          reps_target?: number | null
          reps_completed?: number | null
          rpe?: number | null
          is_completed?: boolean
          completed_at?: string | null
          rest_seconds_taken?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['sets']['Insert']>
      }
      bodyweight_entries: {
        Row: {
          id: string
          user_id: string
          weight_kg: number
          measured_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight_kg: number
          measured_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['bodyweight_entries']['Insert']>
      }
      user_settings: {
        Row: {
          user_id: string
          unit_system: 'kg' | 'lbs'
          theme: 'light' | 'dark' | 'system'
          aggressiveness: number
          default_rest_seconds: number
          plateau_threshold: number
          auto_deload_enabled: boolean
          deload_scale_pct: number
          rest_timer_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          unit_system?: 'kg' | 'lbs'
          theme?: 'light' | 'dark' | 'system'
          aggressiveness?: number
          default_rest_seconds?: number
          plateau_threshold?: number
          auto_deload_enabled?: boolean
          deload_scale_pct?: number
          rest_timer_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_settings']['Insert']>
      }
      user_exercise_preferences: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          load_increment_kg: number | null
          min_reps_override: number | null
          max_reps_override: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          load_increment_kg?: number | null
          min_reps_override?: number | null
          max_reps_override?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_exercise_preferences']['Insert']>
      }
    }
    Views: {
      v_weekly_volume: {
        Row: {
          user_id: string
          exercise_id: string
          movement_pattern: string
          primary_muscles: string[]
          week_start: string
          total_volume_kg: number
          working_set_count: number
        }
      }
      mv_exercise_1rm: {
        Row: {
          user_id: string
          exercise_id: string
          variant_key: Json
          session_date: string
          estimated_1rm_kg: number
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
