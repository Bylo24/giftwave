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
          is_favorite: boolean | null
          last_gift_sent: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_name: string
          contact_phone: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          last_gift_sent?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          last_gift_sent?: string | null
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
      gift_designs: {
        Row: {
          card_bg_color: string | null
          created_at: string
          dispute_status: string | null
          editing_session_id: string | null
          editing_user_id: string | null
          front_card_pattern: string | null
          front_card_stickers: Json | null
          id: string
          last_edited_at: string | null
          last_webhook_event_id: string | null
          memories: Json | null
          message_video_url: string | null
          paid_at: string | null
          payment_failure_reason: string | null
          payment_status: string | null
          platform_fee: number | null
          refund_status: string | null
          screen_bg_color: string | null
          selected_amount: number | null
          status: string | null
          stripe_session_id: string | null
          theme: string | null
          token: string | null
          user_id: string | null
        }
        Insert: {
          card_bg_color?: string | null
          created_at?: string
          dispute_status?: string | null
          editing_session_id?: string | null
          editing_user_id?: string | null
          front_card_pattern?: string | null
          front_card_stickers?: Json | null
          id?: string
          last_edited_at?: string | null
          last_webhook_event_id?: string | null
          memories?: Json | null
          message_video_url?: string | null
          paid_at?: string | null
          payment_failure_reason?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          refund_status?: string | null
          screen_bg_color?: string | null
          selected_amount?: number | null
          status?: string | null
          stripe_session_id?: string | null
          theme?: string | null
          token?: string | null
          user_id?: string | null
        }
        Update: {
          card_bg_color?: string | null
          created_at?: string
          dispute_status?: string | null
          editing_session_id?: string | null
          editing_user_id?: string | null
          front_card_pattern?: string | null
          front_card_stickers?: Json | null
          id?: string
          last_edited_at?: string | null
          last_webhook_event_id?: string | null
          memories?: Json | null
          message_video_url?: string | null
          paid_at?: string | null
          payment_failure_reason?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          refund_status?: string | null
          screen_bg_color?: string | null
          selected_amount?: number | null
          status?: string | null
          stripe_session_id?: string | null
          theme?: string | null
          token?: string | null
          user_id?: string | null
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
          collected_at: string | null
          collection_status: string | null
          collector_id: string | null
          created_at: string
          id: string
          message_video_url: string | null
          payment_intent_id: string | null
          payment_status: string | null
          platform_fee: number | null
          recipient_phone: string | null
          redemption_date: string | null
          sender_id: string | null
          status: string
          stripe_session_id: string | null
          theme: string
          token: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          collected_at?: string | null
          collection_status?: string | null
          collector_id?: string | null
          created_at?: string
          id?: string
          message_video_url?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          recipient_phone?: string | null
          redemption_date?: string | null
          sender_id?: string | null
          status?: string
          stripe_session_id?: string | null
          theme: string
          token?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          collected_at?: string | null
          collection_status?: string | null
          collector_id?: string | null
          created_at?: string
          id?: string
          message_video_url?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          recipient_phone?: string | null
          redemption_date?: string | null
          sender_id?: string | null
          status?: string
          stripe_session_id?: string | null
          theme?: string
          token?: string | null
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
      payment_events: {
        Row: {
          amount: number | null
          created_at: string
          event_type: string
          fee_amount: number | null
          gift_design_id: string | null
          id: string
          metadata: Json | null
          processed_at: string
          status: Database["public"]["Enums"]["payment_event_status"]
          stripe_event_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          event_type: string
          fee_amount?: number | null
          gift_design_id?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string
          status: Database["public"]["Enums"]["payment_event_status"]
          stripe_event_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          event_type?: string
          fee_amount?: number | null
          gift_design_id?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string
          status?: Database["public"]["Enums"]["payment_event_status"]
          stripe_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_gift_design_id_fkey"
            columns: ["gift_design_id"]
            isOneToOne: false
            referencedRelation: "gift_designs"
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
          stripe_connect_account_id: string | null
          stripe_connect_account_status: string | null
          updated_at: string
          username: string | null
          verification_attempts: number | null
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          last_verification_attempt?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          stripe_connect_account_id?: string | null
          stripe_connect_account_status?: string | null
          updated_at?: string
          username?: string | null
          verification_attempts?: number | null
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          last_verification_attempt?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          stripe_connect_account_id?: string | null
          stripe_connect_account_status?: string | null
          updated_at?: string
          username?: string | null
          verification_attempts?: number | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      recipient_verifications: {
        Row: {
          attempts: number | null
          created_at: string
          expires_at: string
          gift_id: string
          id: string
          phone_number: string
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          expires_at: string
          gift_id: string
          id?: string
          phone_number: string
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string
          expires_at?: string
          gift_id?: string
          id?: string
          phone_number?: string
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipient_verifications_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_connect_accounts: {
        Row: {
          account_id: string
          account_status: string
          account_type: string
          created_at: string
          id: string
          instant_payouts_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          account_status?: string
          account_type: string
          created_at?: string
          id?: string
          instant_payouts_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          account_status?: string
          account_type?: string
          created_at?: string
          id?: string
          instant_payouts_enabled?: boolean | null
          updated_at?: string
          user_id?: string
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
      withdrawals: {
        Row: {
          amount: number
          bank_details: Json | null
          created_at: string
          error_message: string | null
          estimated_arrival: string | null
          id: string
          instant_payout: boolean | null
          method: string | null
          status: string | null
          stripe_payout_id: string | null
          stripe_transfer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          created_at?: string
          error_message?: string | null
          estimated_arrival?: string | null
          id?: string
          instant_payout?: boolean | null
          method?: string | null
          status?: string | null
          stripe_payout_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          created_at?: string
          error_message?: string | null
          estimated_arrival?: string | null
          id?: string
          instant_payout?: boolean | null
          method?: string | null
          status?: string | null
          stripe_payout_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_gift_drafts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      card_page_type: "front" | "inside_left" | "inside_right" | "back"
      payment_event_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "refunded"
        | "disputed"
        | "expired"
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
