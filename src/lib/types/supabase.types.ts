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
            foreignKeyName: "filmstock_filmtype_fkey"
            columns: ["filmtype"]
            isOneToOne: false
            referencedRelation: "filmtype"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmstock_format_fkey"
            columns: ["format"]
            isOneToOne: false
            referencedRelation: "format"
            referencedColumns: ["id"]
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
            referencedRelation: "filmtype"
            referencedColumns: ["id"]
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
          id: string
          name: string | null
          roll_id: string | null
          stars: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          roll_id?: string | null
          stars?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          roll_id?: string | null
          stars?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "roll"
            referencedColumns: ["id"]
          },
        ]
      }
      roll: {
        Row: {
          created_at: string
          description: string | null
          dev_detail_id: string | null
          filmstock_id: string | null
          id: string
          name: string
          scan_detail_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          dev_detail_id?: string | null
          filmstock_id?: string | null
          id?: string
          name: string
          scan_detail_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          dev_detail_id?: string | null
          filmstock_id?: string | null
          id?: string
          name?: string
          scan_detail_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roll_dev_detail_id_fkey"
            columns: ["dev_detail_id"]
            isOneToOne: false
            referencedRelation: "dev_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roll_filmstock_id_fkey"
            columns: ["filmstock_id"]
            isOneToOne: false
            referencedRelation: "filmstock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roll_filmstock_id_fkey"
            columns: ["filmstock_id"]
            isOneToOne: false
            referencedRelation: "filmstock_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roll_scan_detail_id_fkey"
            columns: ["scan_detail_id"]
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
          filmtype_name: string | null
          format_name: string | null
          id: string | null
          iso: number | null
          logo_url: string | null
          name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
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
