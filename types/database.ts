/**
 * Supabase 데이터베이스 타입.
 *
 * `supabase gen types typescript` 와 동일한 구조로 작성했다.
 * CLI 생성은 access token(secret key)이 필요한데, 이 프로젝트는
 * publishable key만 사용하므로 supabase/migrations/*.sql 을 기준으로 직접 작성한다.
 *
 * ⚠️ 스키마를 변경하면 이 파일도 함께 갱신한다.
 *    변경 전 `npm run db:check` 로 마이그레이션을 검증할 것.
 *
 * 출처: supabase/migrations/0001_init.sql
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ===== CHECK 제약조건에 대응하는 유니온 =====
export type ProjectCategory = 'vue-nuxt' | 'astro' | 'react' | 'publisher'
export type ArchiveDocType = '증명서' | '포트폴리오' | '기타'
export type SkillCategory = 'language' | 'framework' | 'tool' | 'design'

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string | null
          summary: string | null
          category: ProjectCategory
          period_start: string
          /** null = 진행중 */
          period_end: string | null
          content: string | null
          thumbnail_path: string | null
          repo_url: string | null
          live_url: string | null
          tags: string[]
          role: string | null
          sort_order: number
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          subtitle?: string | null
          summary?: string | null
          category: ProjectCategory
          period_start: string
          period_end?: string | null
          content?: string | null
          thumbnail_path?: string | null
          repo_url?: string | null
          live_url?: string | null
          tags?: string[]
          role?: string | null
          sort_order?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          summary?: string | null
          category?: ProjectCategory
          period_start?: string
          period_end?: string | null
          content?: string | null
          thumbnail_path?: string | null
          repo_url?: string | null
          live_url?: string | null
          tags?: string[]
          role?: string | null
          sort_order?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      archives: {
        Row: {
          id: string
          title: string
          doc_type: ArchiveDocType
          issuer: string | null
          issued_on: string | null
          file_path: string
          /** PDF 1페이지 캡처 이미지 */
          thumbnail_path: string | null
          description: string | null
          sort_order: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          doc_type: ArchiveDocType
          issuer?: string | null
          issued_on?: string | null
          file_path: string
          thumbnail_path?: string | null
          description?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          doc_type?: ArchiveDocType
          issuer?: string | null
          issued_on?: string | null
          file_path?: string
          thumbnail_path?: string | null
          description?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Relationships: []
      }

      careers: {
        Row: {
          id: string
          company: string
          position: string
          period_start: string
          /** null = 재직중 */
          period_end: string | null
          description: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          company: string
          position: string
          period_start: string
          period_end?: string | null
          description?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          company?: string
          position?: string
          period_start?: string
          period_end?: string | null
          description?: string | null
          sort_order?: number
        }
        Relationships: []
      }

      skills: {
        Row: {
          id: string
          name: string
          category: SkillCategory
          /** 1~5 */
          level: number
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          category: SkillCategory
          level: number
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          category?: SkillCategory
          level?: number
          sort_order?: number
        }
        Relationships: []
      }

      /** 단일 row (id = 1 고정) */
      profile: {
        Row: {
          id: number
          name: string
          headline: string | null
          bio: string | null
          email: string | null
          github_url: string | null
          blog_url: string | null
          resume_path: string | null
          avatar_path: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          headline?: string | null
          bio?: string | null
          email?: string | null
          github_url?: string | null
          blog_url?: string | null
          resume_path?: string | null
          avatar_path?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          headline?: string | null
          bio?: string | null
          email?: string | null
          github_url?: string | null
          blog_url?: string | null
          resume_path?: string | null
          avatar_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }

      /** 방문 로그 — /admin 대시보드 차트의 데이터 소스 */
      page_views: {
        Row: {
          id: number
          path: string
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: number
          path: string
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          path?: string
          referrer?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ===== 사용 편의 별칭 =====
type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update']

export type Project = Tables<'projects'>
export type Archive = Tables<'archives'>
export type Career = Tables<'careers'>
export type Skill = Tables<'skills'>
export type Profile = Tables<'profile'>
export type PageView = Tables<'page_views'>
