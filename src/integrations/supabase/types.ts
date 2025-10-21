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
      requests: {
        Row: {
          air_date_time: string
          booking_type: Database["public"]["Enums"]["booking_type"]
          compliance_tags: string | null
          created_at: string | null
          created_by: string
          guest_contact: string | null
          guest_name: string | null
          id: string
          inews_rundown_id: string | null
          ingest_not_done_reason: string | null
          ingest_status: string | null
          key_fill: Database["public"]["Enums"]["key_fill"] | null
          language: Database["public"]["Enums"]["language"]
          newsroom_ticket: string | null
          noc_acknowledged: boolean | null
          noc_assigned_resources: string | null
          noc_clarification: string | null
          noc_forward_to_ingest: Database["public"]["Enums"]["yes_no"] | null
          noc_required: Database["public"]["Enums"]["yes_no"]
          notes: string | null
          priority: Database["public"]["Enums"]["priority"]
          program_segment: string
          resources_needed: string | null
          return_path: Database["public"]["Enums"]["return_path"] | null
          rundown_position: string | null
          source_type: Database["public"]["Enums"]["source_type"] | null
          state: Database["public"]["Enums"]["workflow_state"]
          story_slug: string | null
          title: string
          updated_at: string | null
          vmix_input_number: string | null
        }
        Insert: {
          air_date_time: string
          booking_type: Database["public"]["Enums"]["booking_type"]
          compliance_tags?: string | null
          created_at?: string | null
          created_by: string
          guest_contact?: string | null
          guest_name?: string | null
          id?: string
          inews_rundown_id?: string | null
          ingest_not_done_reason?: string | null
          ingest_status?: string | null
          key_fill?: Database["public"]["Enums"]["key_fill"] | null
          language: Database["public"]["Enums"]["language"]
          newsroom_ticket?: string | null
          noc_acknowledged?: boolean | null
          noc_assigned_resources?: string | null
          noc_clarification?: string | null
          noc_forward_to_ingest?: Database["public"]["Enums"]["yes_no"] | null
          noc_required: Database["public"]["Enums"]["yes_no"]
          notes?: string | null
          priority?: Database["public"]["Enums"]["priority"]
          program_segment: string
          resources_needed?: string | null
          return_path?: Database["public"]["Enums"]["return_path"] | null
          rundown_position?: string | null
          source_type?: Database["public"]["Enums"]["source_type"] | null
          state?: Database["public"]["Enums"]["workflow_state"]
          story_slug?: string | null
          title: string
          updated_at?: string | null
          vmix_input_number?: string | null
        }
        Update: {
          air_date_time?: string
          booking_type?: Database["public"]["Enums"]["booking_type"]
          compliance_tags?: string | null
          created_at?: string | null
          created_by?: string
          guest_contact?: string | null
          guest_name?: string | null
          id?: string
          inews_rundown_id?: string | null
          ingest_not_done_reason?: string | null
          ingest_status?: string | null
          key_fill?: Database["public"]["Enums"]["key_fill"] | null
          language?: Database["public"]["Enums"]["language"]
          newsroom_ticket?: string | null
          noc_acknowledged?: boolean | null
          noc_assigned_resources?: string | null
          noc_clarification?: string | null
          noc_forward_to_ingest?: Database["public"]["Enums"]["yes_no"] | null
          noc_required?: Database["public"]["Enums"]["yes_no"]
          notes?: string | null
          priority?: Database["public"]["Enums"]["priority"]
          program_segment?: string
          resources_needed?: string | null
          return_path?: Database["public"]["Enums"]["return_path"] | null
          rundown_position?: string | null
          source_type?: Database["public"]["Enums"]["source_type"] | null
          state?: Database["public"]["Enums"]["workflow_state"]
          story_slug?: string | null
          title?: string
          updated_at?: string | null
          vmix_input_number?: string | null
        }
        Relationships: []
      }
      resource_allocations: {
        Row: {
          allocated_at: string | null
          allocated_by: string
          details: string
          id: string
          request_id: string
          resource_type: string
        }
        Insert: {
          allocated_at?: string | null
          allocated_by: string
          details: string
          id?: string
          request_id: string
          resource_type: string
        }
        Update: {
          allocated_at?: string | null
          allocated_by?: string
          details?: string
          id?: string
          request_id?: string
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_allocations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_transitions: {
        Row: {
          actor_id: string
          from_state: Database["public"]["Enums"]["workflow_state"] | null
          id: string
          notes: string | null
          request_id: string
          role: Database["public"]["Enums"]["app_role"]
          timestamp: string | null
          to_state: Database["public"]["Enums"]["workflow_state"]
        }
        Insert: {
          actor_id: string
          from_state?: Database["public"]["Enums"]["workflow_state"] | null
          id?: string
          notes?: string | null
          request_id: string
          role: Database["public"]["Enums"]["app_role"]
          timestamp?: string | null
          to_state: Database["public"]["Enums"]["workflow_state"]
        }
        Update: {
          actor_id?: string
          from_state?: Database["public"]["Enums"]["workflow_state"] | null
          id?: string
          notes?: string | null
          request_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          timestamp?: string | null
          to_state?: Database["public"]["Enums"]["workflow_state"]
        }
        Relationships: [
          {
            foreignKeyName: "workflow_transitions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "Booking" | "NOC" | "Ingest" | "Admin"
      booking_type: "Incoming Feed" | "Guest for iNEWS Rundown"
      key_fill: "None" | "Key" | "Fill"
      language: "English" | "Arabic"
      priority: "Normal" | "High" | "Urgent"
      return_path: "Enabled" | "Disabled"
      source_type: "vMix" | "SRT" | "Satellite"
      workflow_state:
        | "Draft"
        | "Submitted"
        | "With NOC"
        | "Clarification Requested"
        | "Resources Added"
        | "With Ingest"
        | "Completed"
        | "Not Done"
      yes_no: "Yes" | "No"
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
    Enums: {
      app_role: ["Booking", "NOC", "Ingest", "Admin"],
      booking_type: ["Incoming Feed", "Guest for iNEWS Rundown"],
      key_fill: ["None", "Key", "Fill"],
      language: ["English", "Arabic"],
      priority: ["Normal", "High", "Urgent"],
      return_path: ["Enabled", "Disabled"],
      source_type: ["vMix", "SRT", "Satellite"],
      workflow_state: [
        "Draft",
        "Submitted",
        "With NOC",
        "Clarification Requested",
        "Resources Added",
        "With Ingest",
        "Completed",
        "Not Done",
      ],
      yes_no: ["Yes", "No"],
    },
  },
} as const
