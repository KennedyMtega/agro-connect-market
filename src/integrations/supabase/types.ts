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
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_verification_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          new_status: Database["public"]["Enums"]["verification_status"] | null
          notes: string | null
          previous_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          seller_profile_id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["verification_status"] | null
          notes?: string | null
          previous_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          seller_profile_id: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["verification_status"] | null
          notes?: string | null
          previous_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          seller_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_verification_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_verification_logs_seller_profile_id_fkey"
            columns: ["seller_profile_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      crops: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          harvest_date: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          is_organic: boolean | null
          location_lat: number | null
          location_lng: number | null
          min_order_quantity: number | null
          name: string
          price_per_unit: number
          quantity_available: number
          seller_id: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_organic?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          min_order_quantity?: number | null
          name: string
          price_per_unit: number
          quantity_available?: number
          seller_id: string
          unit?: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_organic?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          min_order_quantity?: number | null
          name?: string
          price_per_unit?: number
          quantity_available?: number
          seller_id?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "crop_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crops_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_tracking: {
        Row: {
          created_at: string | null
          current_address: string | null
          current_lat: number | null
          current_lng: number | null
          current_status: Database["public"]["Enums"]["order_status"]
          driver_name: string | null
          driver_phone: string | null
          estimated_arrival: string | null
          id: string
          order_id: string
          status_history: Json | null
          updated_at: string | null
          vehicle_info: Json | null
        }
        Insert: {
          created_at?: string | null
          current_address?: string | null
          current_lat?: number | null
          current_lng?: number | null
          current_status: Database["public"]["Enums"]["order_status"]
          driver_name?: string | null
          driver_phone?: string | null
          estimated_arrival?: string | null
          id?: string
          order_id: string
          status_history?: Json | null
          updated_at?: string | null
          vehicle_info?: Json | null
        }
        Update: {
          created_at?: string | null
          current_address?: string | null
          current_lat?: number | null
          current_lng?: number | null
          current_status?: Database["public"]["Enums"]["order_status"]
          driver_name?: string | null
          driver_phone?: string | null
          estimated_arrival?: string | null
          id?: string
          order_id?: string
          status_history?: Json | null
          updated_at?: string | null
          vehicle_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          crop_id: string | null
          id: string
          order_id: string | null
          price_per_unit: number
          quantity: number
          total_price: number
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          order_id?: string | null
          price_per_unit: number
          quantity: number
          total_price: number
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          order_id?: string | null
          price_per_unit?: number
          quantity?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          delivery_address: string
          delivery_fee: number | null
          delivery_lat: number
          delivery_lng: number
          estimated_delivery: string | null
          id: string
          notes: string | null
          payment_status: string | null
          phone_number: string
          seller_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          delivery_address: string
          delivery_fee?: number | null
          delivery_lat: number
          delivery_lng: number
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          phone_number: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          delivery_address?: string
          delivery_fee?: number | null
          delivery_lat?: number
          delivery_lng?: number
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          phone_number?: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_onboarded: boolean | null
          is_phone_verified: boolean | null
          location_lat: number | null
          location_lng: number | null
          phone_number: string
          region: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          is_onboarded?: boolean | null
          is_phone_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone_number: string
          region?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_onboarded?: boolean | null
          is_phone_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone_number?: string
          region?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      review_helpful: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          order_id: string
          photos: string[] | null
          rating: number
          seller_id: string
          seller_response: string | null
          seller_response_date: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          order_id: string
          photos?: string[] | null
          rating: number
          seller_id: string
          seller_response?: string | null
          seller_response_date?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          order_id?: string
          photos?: string[] | null
          rating?: number
          seller_id?: string
          seller_response?: string | null
          seller_response_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          average_rating: number | null
          business_description: string | null
          business_name: string
          business_registration_number: string | null
          created_at: string | null
          delivery_radius_km: number | null
          has_whatsapp: boolean | null
          id: string
          is_active: boolean | null
          phone_number: string
          store_location: string
          store_location_lat: number
          store_location_lng: number
          tax_identification_number: string | null
          total_ratings: number | null
          updated_at: string | null
          user_id: string
          verification_documents: Json | null
          verification_notes: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          whatsapp_number: string | null
        }
        Insert: {
          average_rating?: number | null
          business_description?: string | null
          business_name: string
          business_registration_number?: string | null
          created_at?: string | null
          delivery_radius_km?: number | null
          has_whatsapp?: boolean | null
          id?: string
          is_active?: boolean | null
          phone_number: string
          store_location: string
          store_location_lat: number
          store_location_lng: number
          tax_identification_number?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          user_id: string
          verification_documents?: Json | null
          verification_notes?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          whatsapp_number?: string | null
        }
        Update: {
          average_rating?: number | null
          business_description?: string | null
          business_name?: string
          business_registration_number?: string | null
          created_at?: string | null
          delivery_radius_km?: number | null
          has_whatsapp?: boolean | null
          id?: string
          is_active?: boolean | null
          phone_number?: string
          store_location?: string
          store_location_lat?: number
          store_location_lng?: number
          tax_identification_number?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          user_id?: string
          verification_documents?: Json | null
          verification_notes?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          whatsapp_number?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_review_order: {
        Args: { _order_id: string; _user_id: string }
        Returns: boolean
      }
      get_admin_dashboard_stats: { Args: never; Returns: Json }
      get_featured_crops: {
        Args: never
        Returns: {
          business_name: string
          description: string
          id: string
          images: string[]
          name: string
          price_per_unit: number
          quantity_available: number
          seller_id: string
          store_location: string
          unit: string
        }[]
      }
      get_seller_reviews: {
        Args: { _limit?: number; _offset?: number; _seller_id: string }
        Returns: {
          buyer_avatar: string
          buyer_name: string
          comment: string
          created_at: string
          helpful_count: number
          id: string
          is_verified_purchase: boolean
          order_id: string
          photos: string[]
          rating: number
          seller_response: string
          seller_response_date: string
        }[]
      }
      get_user_seller_id: { Args: { _user_id: string }; Returns: string }
      get_verified_sellers_by_ids: {
        Args: { seller_ids: string[] }
        Returns: {
          average_rating: number
          business_description: string
          business_name: string
          delivery_radius_km: number
          has_whatsapp: boolean
          id: string
          store_location: string
          store_location_lat: number
          store_location_lng: number
          total_ratings: number
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }[]
      }
      get_verified_sellers_public: {
        Args: never
        Returns: {
          average_rating: number
          business_description: string
          business_name: string
          delivery_radius_km: number
          has_whatsapp: boolean
          id: string
          store_location: string
          store_location_lat: number
          store_location_lng: number
          total_ratings: number
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_verified_sellers_public: {
        Args: { search_query: string }
        Returns: {
          average_rating: number
          business_description: string
          business_name: string
          delivery_radius_km: number
          has_whatsapp: boolean
          id: string
          store_location: string
          store_location_lat: number
          store_location_lng: number
          total_ratings: number
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      notification_type: "order_update" | "delivery" | "payment" | "general"
      order_status:
        | "pending"
        | "confirmed"
        | "in_transit"
        | "delivered"
        | "cancelled"
      user_type: "buyer" | "seller"
      verification_status: "pending" | "verified" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      notification_type: ["order_update", "delivery", "payment", "general"],
      order_status: [
        "pending",
        "confirmed",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      user_type: ["buyer", "seller"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
