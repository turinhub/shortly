/**
 * Link table type definition
 */
export interface Link {
  id: string
  user_id: string
  long_link: string
  short_link: string
  title: string | null
  description: string | null
  tags: string[] | null
  status: 'active' | 'frozen'
  created_at: Date
  updated_at: Date
}

/**
 * Activity table type definition
 */
export interface Activity {
  id: string
  ip: string
  device: string | null
  region: string | null
  origin: string | null
  clicked_at: Date
}

/**
 * Link form data type
 */
export interface LinkFormData {
  user_id: string
  long_link: string
  title?: string
  description?: string
  tags?: string[]
  short_link?: string
}

/**
 * Link with stats type (for display)
 */
export interface LinkWithStats extends Link {
  clicks: number
}
