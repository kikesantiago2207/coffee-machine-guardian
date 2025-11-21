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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          related_id: string | null
          resolved: boolean
          resolved_at: string | null
          severity: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          related_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          severity: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          related_id?: string | null
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      machines: {
        Row: {
          created_at: string
          id: string
          installation_date: string
          location: string | null
          model: string
          name: string
          notes: string | null
          serial_number: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          installation_date: string
          location?: string | null
          model: string
          name?: string
          notes?: string | null
          serial_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          installation_date?: string
          location?: string | null
          model?: string
          name?: string
          notes?: string | null
          serial_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_parts: {
        Row: {
          created_at: string
          id: string
          maintenance_id: string
          part_id: string
          quantity_used: number
        }
        Insert: {
          created_at?: string
          id?: string
          maintenance_id: string
          part_id: string
          quantity_used: number
        }
        Update: {
          created_at?: string
          id?: string
          maintenance_id?: string
          part_id?: string
          quantity_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_parts_maintenance_id_fkey"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "maintenance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          actions_taken: string | null
          cost: number | null
          created_at: string
          date: string
          description: string
          duration_minutes: number | null
          end_time: string | null
          failure_type: string | null
          id: string
          machine_id: string
          notes: string | null
          start_time: string | null
          status: string
          technician: string
          type: string
          updated_at: string
        }
        Insert: {
          actions_taken?: string | null
          cost?: number | null
          created_at?: string
          date?: string
          description: string
          duration_minutes?: number | null
          end_time?: string | null
          failure_type?: string | null
          id?: string
          machine_id: string
          notes?: string | null
          start_time?: string | null
          status?: string
          technician: string
          type: string
          updated_at?: string
        }
        Update: {
          actions_taken?: string | null
          cost?: number | null
          created_at?: string
          date?: string
          description?: string
          duration_minutes?: number | null
          end_time?: string | null
          failure_type?: string | null
          id?: string
          machine_id?: string
          notes?: string | null
          start_time?: string | null
          status?: string
          technician?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          created_at: string
          current_stock: number
          description: string | null
          id: string
          location: string | null
          machine_id: string
          name: string
          notes: string | null
          part_number: string
          reorder_point: number
          unit_cost: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_stock?: number
          description?: string | null
          id?: string
          location?: string | null
          machine_id: string
          name: string
          notes?: string | null
          part_number: string
          reorder_point?: number
          unit_cost?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_stock?: number
          description?: string | null
          id?: string
          location?: string | null
          machine_id?: string
          name?: string
          notes?: string | null
          part_number?: string
          reorder_point?: number
          unit_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parts_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      preventive_schedules: {
        Row: {
          active: boolean
          assigned_to: string | null
          created_at: string
          description: string | null
          estimated_duration_minutes: number | null
          frequency_days: number
          id: string
          last_performed: string | null
          machine_id: string
          next_due: string
          task_name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          frequency_days: number
          id?: string
          last_performed?: string | null
          machine_id: string
          next_due: string
          task_name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          frequency_days?: number
          id?: string
          last_performed?: string | null
          machine_id?: string
          next_due?: string
          task_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preventive_schedules_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery: string | null
          created_at: string
          expected_delivery: string | null
          id: string
          notes: string | null
          order_date: string
          part_id: string
          quantity: number
          status: string
          total_cost: number
          unit_cost: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          part_id: string
          quantity: number
          status?: string
          total_cost: number
          unit_cost: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          part_id?: string
          quantity?: number
          status?: string
          total_cost?: number
          unit_cost?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_readings: {
        Row: {
          created_at: string
          id: string
          machine_id: string
          sensor_type: string
          status: string
          threshold_max: number | null
          threshold_min: number | null
          timestamp: string
          unit: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          machine_id: string
          sensor_type: string
          status?: string
          threshold_max?: number | null
          threshold_min?: number | null
          timestamp?: string
          unit: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          machine_id?: string
          sensor_type?: string
          status?: string
          threshold_max?: number | null
          threshold_min?: number | null
          timestamp?: string
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          active: boolean
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
