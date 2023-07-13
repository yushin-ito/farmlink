export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      chat: {
        Row: {
          authorId: string
          chatId: number
          communityId: number | null
          createdAt: string
          height: number | null
          imageUrl: string | null
          message: string | null
          talkId: number | null
          width: number | null
        }
        Insert: {
          authorId: string
          chatId?: number
          communityId?: number | null
          createdAt?: string
          height?: number | null
          imageUrl?: string | null
          message?: string | null
          talkId?: number | null
          width?: number | null
        }
        Update: {
          authorId?: string
          chatId?: number
          communityId?: number | null
          createdAt?: string
          height?: number | null
          imageUrl?: string | null
          message?: string | null
          talkId?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_authorId_fkey"
            columns: ["authorId"]
            referencedRelation: "user"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "chat_communityId_fkey"
            columns: ["communityId"]
            referencedRelation: "community"
            referencedColumns: ["communityId"]
          },
          {
            foreignKeyName: "chat_talkId_fkey"
            columns: ["talkId"]
            referencedRelation: "talk"
            referencedColumns: ["talkId"]
          }
        ]
      }
      community: {
        Row: {
          category: string
          color: string
          communityId: number
          createdAt: string
          description: string
          imageUrl: string | null
          name: string
          updatedAt: string
        }
        Insert: {
          category: string
          color: string
          communityId?: number
          createdAt?: string
          description: string
          imageUrl?: string | null
          name: string
          updatedAt?: string
        }
        Update: {
          category?: string
          color?: string
          communityId?: number
          createdAt?: string
          description?: string
          imageUrl?: string | null
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      device: {
        Row: {
          battery: string | null
          createdAt: string
          deviceId: string
          humidity: number | null
          imageUrl: string | null
          moisture: number | null
          temperture: number | null
          updatedAt: string
        }
        Insert: {
          battery?: string | null
          createdAt?: string
          deviceId: string
          humidity?: number | null
          imageUrl?: string | null
          moisture?: number | null
          temperture?: number | null
          updatedAt?: string
        }
        Update: {
          battery?: string | null
          createdAt?: string
          deviceId?: string
          humidity?: number | null
          imageUrl?: string | null
          moisture?: number | null
          temperture?: number | null
          updatedAt?: string
        }
        Relationships: []
      }
      farm: {
        Row: {
          createdAt: string
          description: string | null
          deviceId: string | null
          farmId: number
          imageUrls: string[] | null
          latitude: number | null
          longitude: number | null
          name: string | null
          ownerId: string | null
          privated: boolean | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          deviceId?: string | null
          farmId?: number
          imageUrls?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          ownerId?: string | null
          privated?: boolean | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          deviceId?: string | null
          farmId?: number
          imageUrls?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          ownerId?: string | null
          privated?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_deviceId_fkey"
            columns: ["deviceId"]
            referencedRelation: "device"
            referencedColumns: ["deviceId"]
          },
          {
            foreignKeyName: "farm_ownerId_fkey"
            columns: ["ownerId"]
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      like: {
        Row: {
          createdAt: string
          farmId: number | null
          likeId: number
          rentalId: number | null
          userId: string
        }
        Insert: {
          createdAt?: string
          farmId?: number | null
          likeId?: number
          rentalId?: number | null
          userId: string
        }
        Update: {
          createdAt?: string
          farmId?: number | null
          likeId?: number
          rentalId?: number | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "like_farmId_fkey"
            columns: ["farmId"]
            referencedRelation: "farm"
            referencedColumns: ["farmId"]
          },
          {
            foreignKeyName: "like_rentalId_fkey"
            columns: ["rentalId"]
            referencedRelation: "rental"
            referencedColumns: ["rentalId"]
          },
          {
            foreignKeyName: "like_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      rental: {
        Row: {
          area: string | null
          createdAt: string | null
          description: string
          equipment: string | null
          fee: string | null
          imageUrls: string[] | null
          latitude: number
          longitude: number
          name: string
          ownerId: string
          rentalId: number
          updateAt: string
        }
        Insert: {
          area?: string | null
          createdAt?: string | null
          description: string
          equipment?: string | null
          fee?: string | null
          imageUrls?: string[] | null
          latitude: number
          longitude: number
          name: string
          ownerId: string
          rentalId?: number
          updateAt?: string
        }
        Update: {
          area?: string | null
          createdAt?: string | null
          description?: string
          equipment?: string | null
          fee?: string | null
          imageUrls?: string[] | null
          latitude?: number
          longitude?: number
          name?: string
          ownerId?: string
          rentalId?: number
          updateAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_ownerId_fkey"
            columns: ["ownerId"]
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      talk: {
        Row: {
          createdAt: string
          lastMessage: string | null
          recieverId: string | null
          senderId: string | null
          talkId: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          lastMessage?: string | null
          recieverId?: string | null
          senderId?: string | null
          talkId?: number
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          lastMessage?: string | null
          recieverId?: string | null
          senderId?: string | null
          talkId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "talk_recieverId_fkey"
            columns: ["recieverId"]
            referencedRelation: "user"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "talk_senderId_fkey"
            columns: ["senderId"]
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      user: {
        Row: {
          avatarUrl: string | null
          color: string
          createdAt: string
          introduction: string | null
          name: string
          updatedAt: string
          userId: string
        }
        Insert: {
          avatarUrl?: string | null
          color?: string
          createdAt?: string
          introduction?: string | null
          name?: string
          updatedAt?: string
          userId: string
        }
        Update: {
          avatarUrl?: string | null
          color?: string
          createdAt?: string
          introduction?: string | null
          name?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
