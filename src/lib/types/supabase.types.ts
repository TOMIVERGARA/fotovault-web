export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      brand: {
        Row: {
          active: boolean | null
          created_at: string
          filmstock_amount: number | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          filmstock_amount?: number | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          filmstock_amount?: number | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      dev_detail: {
        Row: {
          created_at: string
          id: string
          lab_id: string | null
          notes: string | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lab_id?: string | null
          notes?: string | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lab_id?: string | null
          notes?: string | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_detail_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "lab"
            referencedColumns: ["id"]
          },
        ]
      }
      filmstock: {
        Row: {
          active: boolean | null
          brand: string
          created_at: string
          filmtype: string
          format: string
          id: string
          iso: number | null
          logo_url: string | null
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          brand: string
          created_at?: string
          filmtype: string
          format: string
          id?: string
          iso?: number | null
          logo_url?: string | null
          name: string
          user_id?: string
        }
        Update: {
          active?: boolean | null
          brand?: string
          created_at?: string
          filmtype?: string
          format?: string
          id?: string
          iso?: number | null
          logo_url?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "filmstock_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmstock_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "filmstock_with_details"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "filmstock_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "roll_with_filmstock_details"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "filmstock_filmtype_fkey"
            columns: ["filmtype"]
            isOneToOne: false
            referencedRelation: "filmstock_with_details"
            referencedColumns: ["filmtype_id"]
          },
          {
            foreignKeyName: "filmstock_filmtype_fkey"
            columns: ["filmtype"]
            isOneToOne: false
            referencedRelation: "filmtype"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmstock_filmtype_fkey"
            columns: ["filmtype"]
            isOneToOne: false
            referencedRelation: "roll_with_filmstock_details"
            referencedColumns: ["filmtype_id"]
          },
          {
            foreignKeyName: "filmstock_format_fkey"
            columns: ["format"]
            isOneToOne: false
            referencedRelation: "filmstock_with_details"
            referencedColumns: ["format_id"]
          },
          {
            foreignKeyName: "filmstock_format_fkey"
            columns: ["format"]
            isOneToOne: false
            referencedRelation: "format"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmstock_format_fkey"
            columns: ["format"]
            isOneToOne: false
            referencedRelation: "roll_with_filmstock_details"
            referencedColumns: ["format_id"]
          },
        ]
      }
      filmtype: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      format: {
        Row: {
          active: boolean | null
          created_at: string
          height: number
          id: string
          name: string
          user_id: string | null
          width: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          height: number
          id?: string
          name: string
          user_id?: string | null
          width: number
        }
        Update: {
          active?: boolean | null
          created_at?: string
          height?: number
          id?: string
          name?: string
          user_id?: string | null
          width?: number
        }
        Relationships: []
      }
      lab: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      lab_filmtype: {
        Row: {
          created_at: string
          filmtype_id: string
          id: string
          lab_id: string
        }
        Insert: {
          created_at?: string
          filmtype_id: string
          id?: string
          lab_id: string
        }
        Update: {
          created_at?: string
          filmtype_id?: string
          id?: string
          lab_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_filmtype_filmtype_id_fkey"
            columns: ["filmtype_id"]
            isOneToOne: false
            referencedRelation: "filmstock_with_details"
            referencedColumns: ["filmtype_id"]
          },
          {
            foreignKeyName: "lab_filmtype_filmtype_id_fkey"
            columns: ["filmtype_id"]
            isOneToOne: false
            referencedRelation: "filmtype"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_filmtype_filmtype_id_fkey"
            columns: ["filmtype_id"]
            isOneToOne: false
            referencedRelation: "roll_with_filmstock_details"
            referencedColumns: ["filmtype_id"]
          },
          {
            foreignKeyName: "lab_filmtype_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "lab"
            referencedColumns: ["id"]
          },
        ]
      }
      photo: {
        Row: {
          created_at: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_cover_img: boolean | null
          last_modified: number | null
          name: string | null
          preview_name: string | null
          roll: string | null
          stars: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_cover_img?: boolean | null
          last_modified?: number | null
          name?: string | null
          preview_name?: string | null
          roll?: string | null
          stars?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_cover_img?: boolean | null
          last_modified?: number | null
          name?: string | null
          preview_name?: string | null
          roll?: string | null
          stars?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_roll_fkey"
            columns: ["roll"]
            isOneToOne: false
            referencedRelation: "roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_roll_fkey"
            columns: ["roll"]
            isOneToOne: false
            referencedRelation: "roll_with_filmstock_details"
            referencedColumns: ["id"]
          },
        ]
      }
      roll: {
        Row: {
          cover_img_url: string | null
          created_at: string
          description: string | null
          dev_detail: string | null
          filmstock: string | null
          id: string
          name: string
          scan_detail: string | null
          storage_container_name: string
          user_id: string | null
        }
        Insert: {
          cover_img_url?: string | null
          created_at?: string
          description?: string | null
          dev_detail?: string | null
          filmstock?: string | null
          id?: string
          name: string
          scan_detail?: string | null
          storage_container_name: string
          user_id?: string | null
        }
        Update: {
          cover_img_url?: string | null
          created_at?: string
          description?: string | null
          dev_detail?: string | null
          filmstock?: string | null
          id?: string
          name?: string
          scan_detail?: string | null
          storage_container_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roll_dev_detail_fkey"
            columns: ["dev_detail"]
            isOneToOne: false
            referencedRelation: "dev_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roll_filmstock_fkey"
            columns: ["filmstock"]
            isOneToOne: false
            referencedRelation: "filmstock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roll_filmstock_fkey"
            columns: ["filmstock"]
            isOneToOne: false
            referencedRelation: "filmstock_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roll_filmstock_fkey"
            columns: ["filmstock"]
            isOneToOne: false
            referencedRelation: "roll_with_filmstock_details"
            referencedColumns: ["filmstock_id"]
          },
          {
            foreignKeyName: "roll_scan_detail_fkey"
            columns: ["scan_detail"]
            isOneToOne: false
            referencedRelation: "scan_detail"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_detail: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          scanner_id: string | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          scanner_id?: string | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          scanner_id?: string | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_detail_scanner_id_fkey"
            columns: ["scanner_id"]
            isOneToOne: false
            referencedRelation: "scanner"
            referencedColumns: ["id"]
          },
        ]
      }
      scanner: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      filmstock_with_details: {
        Row: {
          active: boolean | null
          brand_id: string | null
          brand_name: string | null
          filmtype_id: string | null
          filmtype_name: string | null
          format_id: string | null
          format_name: string | null
          id: string | null
          iso: number | null
          logo_url: string | null
          name: string | null
          user_id: string | null
        }
        Relationships: []
      }
      roll_with_filmstock_details: {
        Row: {
          active: boolean | null
          brand_id: string | null
          brand_name: string | null
          created_at: string | null
          description: string | null
          filmstock_id: string | null
          filmstock_name: string | null
          filmtype_id: string | null
          filmtype_name: string | null
          format_id: string | null
          format_name: string | null
          id: string | null
          iso: number | null
          name: string | null
          storage_container_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_roll_with_cover: {
        Args: {
          p_roll_id: string
          p_roll_name: string
          p_description: string
          p_filmstock_id: string
          p_storage_container_name: string
          p_cover_image?: Json
          p_preview_name?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      iso_values: "25" | "50" | "100" | "200" | "400" | "800" | "1600" | "3200"
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
