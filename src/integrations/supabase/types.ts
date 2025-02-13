export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          contact_name: string
          contact_phone: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_name: string
          contact_phone: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      frames: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          image_url: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      gift_card_designs: {
        Row: {
          created_at: string
          frame_style: string | null
          gift_id: string | null
          id: string
          page: Database["public"]["Enums"]["card_page_type"]
          sticker_positions: Json | null
          template_id: string | null
          text_content: Json | null
          video_frame_url: string | null
        }
        Insert: {
          created_at?: string
          frame_style?: string | null
          gift_id?: string | null
          id?: string
          page: Database["public"]["Enums"]["card_page_type"]
          sticker_positions?: Json | null
          template_id?: string | null
          text_content?: Json | null
          video_frame_url?: string | null
        }
        Update: {
          created_at?: string
          frame_style?: string | null
          gift_id?: string | null
          id?: string
          page?: Database["public"]["Enums"]["card_page_type"]
          sticker_positions?: Json | null
          template_id?: string | null
          text_content?: Json | null
          video_frame_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_designs_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_card_templates: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
          theme: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          name: string
          theme: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      gift_memories: {
        Row: {
          caption: string
          created_at: string
          date: string
          gift_id: string | null
          id: string
          image_url: string | null
        }
        Insert: {
          caption: string
          created_at?: string
          date?: string
          gift_id?: string | null
          id?: string
          image_url?: string | null
        }
        Update: {
          caption?: string
          created_at?: string
          date?: string
          gift_id?: string | null
          id?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_memories_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          amount: number
          created_at: string
          id: string
          message_video_url: string | null
          recipient_phone: string | null
          sender_id: string | null
          theme: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          message_video_url?: string | null
          recipient_phone?: string | null
          sender_id?: string | null
          theme: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          message_video_url?: string | null
          recipient_phone?: string | null
          sender_id?: string | null
          theme?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gifts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          gift_id: string | null
          id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          gift_id?: string | null
          id?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          gift_id?: string | null
          id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          last_verification_attempt: string | null
          phone_number: string | null
          phone_verified: boolean | null
          updated_at: string
          username: string | null
          verification_attempts: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          last_verification_attempt?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          username?: string | null
          verification_attempts?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          last_verification_attempt?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          updated_at?: string
          username?: string | null
          verification_attempts?: number | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
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
      card_page_type: "front" | "inside_left" | "inside_right" | "back"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
