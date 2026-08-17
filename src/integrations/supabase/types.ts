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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      house_models: {
        Row: {
          area_sqm: number
          base_price: number
          bathrooms: number
          bedrooms: number
          code: string
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          install_days: number
          is_published: boolean
          length_m: number
          materials: string | null
          name: string
          production_days: number
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
          usages: string[]
          width_m: number
        }
        Insert: {
          area_sqm?: number
          base_price?: number
          bathrooms?: number
          bedrooms?: number
          code: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          install_days?: number
          is_published?: boolean
          length_m?: number
          materials?: string | null
          name: string
          production_days?: number
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          usages?: string[]
          width_m?: number
        }
        Update: {
          area_sqm?: number
          base_price?: number
          bathrooms?: number
          bedrooms?: number
          code?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          install_days?: number
          is_published?: boolean
          length_m?: number
          materials?: string | null
          name?: string
          production_days?: number
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          usages?: string[]
          width_m?: number
        }
        Relationships: []
      }
      house_options: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          sort_order?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          attachments: string[]
          budget: string | null
          created_at: string
          email: string | null
          estimated_price: number | null
          full_name: string
          id: string
          install_date: string | null
          line_id: string | null
          message: string | null
          model_id: string | null
          model_name: string | null
          phone: string
          province: string | null
          quantity: number
          selected_options: string[]
          status: string
          updated_at: string
        }
        Insert: {
          attachments?: string[]
          budget?: string | null
          created_at?: string
          email?: string | null
          estimated_price?: number | null
          full_name: string
          id?: string
          install_date?: string | null
          line_id?: string | null
          message?: string | null
          model_id?: string | null
          model_name?: string | null
          phone: string
          province?: string | null
          quantity?: number
          selected_options?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          attachments?: string[]
          budget?: string | null
          created_at?: string
          email?: string | null
          estimated_price?: number | null
          full_name?: string
          id?: string
          install_date?: string | null
          line_id?: string | null
          message?: string | null
          model_id?: string | null
          model_name?: string | null
          phone?: string
          province?: string | null
          quantity?: number
          selected_options?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "house_models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          model_id: string
          sort_order: number
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          model_id: string
          sort_order?: number
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          model_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_images_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "house_models"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          created_at: string
          id: string
          image_url: string | null
          install_time: string | null
          model_name: string | null
          province: string | null
          size_text: string | null
          sort_order: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string | null
          install_time?: string | null
          model_name?: string | null
          province?: string | null
          size_text?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string | null
          install_time?: string | null
          model_name?: string | null
          province?: string | null
          size_text?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string
          customer_name: string
          id: string
          model_name: string | null
          province: string | null
          rating: number
          sort_order: number
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string
          customer_name: string
          id?: string
          model_name?: string | null
          province?: string | null
          rating?: number
          sort_order?: number
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string
          customer_name?: string
          id?: string
          model_name?: string | null
          province?: string | null
          rating?: number
          sort_order?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
