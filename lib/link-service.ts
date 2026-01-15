import { create, findAll, findById, update, deleteById, findOne, count } from './db-helpers'
import type { Link, LinkFormData } from './types'

/**
 * Generate a random short code
 */
export function generateShortCode(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Get all links
 */
export async function getLinks(options?: {
  limit?: number
  offset?: number
  status?: 'active' | 'frozen'
}): Promise<Link[]> {
  const { limit = 100, offset = 0, status } = options || {}

  if (status) {
    const { query } = await import('./db')
    const result = await query<Link>(
      `SELECT * FROM link WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [status, limit, offset],
    )
    return result.rows
  }

  return findAll<Link>('link', { limit, offset, orderBy: 'created_at', orderDirection: 'DESC' })
}

/**
 * Get link by ID
 */
export async function getLinkById(id: string): Promise<Link | null> {
  return findById<Link>('link', id)
}

/**
 * Get link by short code
 */
export async function getLinkByShortLink(shortLink: string): Promise<Link | null> {
  const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 's.zxd.ai'
  const fullShortLink = shortLink.startsWith(domain) ? shortLink : `${domain}/s/${shortLink}`

  const link = await findOne<Link>('link', { short_link: fullShortLink })

  // Fallback: try legacy format (without /s/) if not found and input wasn't a full URL
  if (!link && !shortLink.startsWith(domain)) {
    const legacyShortLink = `${domain}/${shortLink}`
    return findOne<Link>('link', { short_link: legacyShortLink })
  }

  return link
}

/**
 * Create a new link
 */
export async function createLink(data: LinkFormData): Promise<Link> {
  const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 's.zxd.ai'

  // Generate short code if not provided
  let shortCode = data.short_link
  if (!shortCode) {
    shortCode = generateShortCode()

    // Ensure uniqueness
    let attempts = 0
    while ((await getLinkByShortLink(shortCode)) && attempts < 10) {
      shortCode = generateShortCode()
      attempts++
    }
  }

  const shortLink = `${domain}/s/${shortCode}`

  return create<Link>('link', {
    user_id: data.user_id,
    long_link: data.long_link,
    short_link: shortLink,
    title: data.title || null,
    description: data.description || null,
    tags: data.tags || null,
    status: 'active',
  })
}

/**
 * Update a link
 */
export async function updateLink(id: string, data: Partial<LinkFormData>): Promise<Link> {
  const updateData: Record<string, any> = {}

  if (data.long_link !== undefined) updateData.long_link = data.long_link
  if (data.title !== undefined) updateData.title = data.title || null
  if (data.description !== undefined) updateData.description = data.description || null
  if (data.tags !== undefined) updateData.tags = data.tags || null

  // Handle short_link update
  if (data.short_link !== undefined) {
    const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 's.zxd.ai'
    updateData.short_link = `${domain}/s/${data.short_link}`
  }

  return update<Link>('link', id, updateData)
}

/**
 * Update link status
 */
export async function updateLinkStatus(id: string, status: 'active' | 'frozen'): Promise<Link> {
  return update<Link>('link', id, { status })
}

/**
 * Delete a link
 */
export async function deleteLink(id: string): Promise<boolean> {
  return deleteById('link', id)
}

/**
 * Get link click count
 */
export async function getLinkClicks(linkId: string): Promise<number> {
  const { count } = await import('./db-helpers')
  return count('activity', { link_id: linkId })
}

/**
 * Get links with click counts
 */
export async function getLinksWithStats(): Promise<Array<Link & { clicks: number }>> {
  const { query } = await import('./db')
  const result = await query(`
    SELECT l.*,
           COALESCE(COUNT(a.id), 0) as clicks
    FROM link l
    LEFT JOIN activity a ON l.id = a.link_id
    GROUP BY l.id
    ORDER BY l.created_at DESC
  `)

  return result.rows
}

/**
 * Get total links count
 */
export async function getLinksCount(): Promise<number> {
  return count('link')
}

/**
 * Get total clicks count
 */
export async function getTotalClicks(): Promise<number> {
  const { query } = await import('./db')
  const result = await query('SELECT COUNT(*) as count FROM activity')
  return parseInt(result.rows[0].count, 10)
}

/**
 * Record link activity
 */
export async function recordActivity(
  linkId: string,
  data: {
    ip: string
    fingerprint?: string
    device?: string
    origin?: string
  },
): Promise<any> {
  const { create } = await import('./db-helpers')
  return create('activity', {
    link_id: linkId,
    ip: data.ip,
    fingerprint: data.fingerprint || null,
    device: data.device || null,
    origin: data.origin || null,
  })
}
