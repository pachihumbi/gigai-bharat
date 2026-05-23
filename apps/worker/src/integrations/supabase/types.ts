export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          amount: number | null
          created_at: string
          id: string
          metadata: Json | null
          user_id: string | null
          worker_id: string | null
        }
        Insert: {
          action: string
          amount?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          worker_id?: string | null
        }
        Update: {
          action?: string
          amount?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      earnings_ledger: {
        Row: {
          amount_earned: number
          created_at: string
          date: string
          id: string
          source_platform: string
          worker_id: string
        }
        Insert: {
          amount_earned?: number
          created_at?: string
          date?: string
          id?: string
          source_platform?: string
          worker_id: string
        }
        Update: {
          amount_earned?: number
          created_at?: string
          date?: string
          id?: string
          source_platform?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_ledger_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_and_credit: {
        Row: {
          active_loan_amount: number
          gig_credit_score: number
          id: string
          updated_at: string
          wallet_balance: number
          worker_id: string
        }
        Insert: {
          active_loan_amount?: number
          gig_credit_score?: number
          id?: string
          updated_at?: string
          wallet_balance?: number
          worker_id: string
        }
        Update: {
          active_loan_amount?: number
          gig_credit_score?: number
          id?: string
          updated_at?: string
          wallet_balance?: number
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_and_credit_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      welfare_tracker: {
        Row: {
          active_working_days: number
          id: string
          is_eligible_for_state_benefits: boolean
          updated_at: string
          worker_id: string
        }
        Insert: {
          active_working_days?: number
          id?: string
          is_eligible_for_state_benefits?: boolean
          updated_at?: string
          worker_id: string
        }
        Update: {
          active_working_days?: number
          id?: string
          is_eligible_for_state_benefits?: boolean
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "welfare_tracker_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_profiles: {
        Row: {
          created_at: string
          home_address: string | null
          home_lat: number | null
          home_lng: number | null
          id: string
          name: string
          onboarded: boolean
          phone_number: string | null
          platforms: string[]
          user_id: string
          vehicle_type: string
        }
        Insert: {
          created_at?: string
          home_address?: string | null
          home_lat?: number | null
          home_lng?: number | null
          id?: string
          name?: string
          onboarded?: boolean
          phone_number?: string | null
          platforms?: string[]
          user_id: string
          vehicle_type?: string
        }
        Update: {
          created_at?: string
          home_address?: string | null
          home_lat?: number | null
          home_lng?: number | null
          id?: string
          name?: string
          onboarded?: boolean
          phone_number?: string | null
          platforms?: string[]
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_loan: {
        Args: { _amount: number; _worker_id: string }
        Returns: number
      }
      decrement_balance: {
        Args: { _amount: number; _worker_id: string }
        Returns: number
      }
      increment_balance: {
        Args: { _amount: number; _worker_id: string }
        Returns: number
      }
      increment_score: {
        Args: { _points: number; _worker_id: string }
        Returns: number
      }
      log_audit: {
        Args: {
          _action: string
          _amount?: number
          _metadata?: Json
          _worker_id: string
        }
        Returns: undefined
      }
      owns_worker: { Args: { _worker_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
