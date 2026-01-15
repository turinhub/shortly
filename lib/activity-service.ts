import { create, findAll, findById, deleteById, count } from './db-helpers'
import type { Activity, ActivityFormData, ActivityWithLink } from './types'

/**
 * Create a new activity record
 */
export async function createActivity(data: ActivityFormData): Promise<Activity> {
  return create<Activity>('activity', {
    link_id: data.link_id,
    ip: data.ip,
    fingerprint: data.fingerprint || null,
    device: data.device || null,
    origin: data.origin || null,
  })
}

/**
 * Get activity by ID
 */
export async function getActivityById(id: string): Promise<Activity | null> {
  return findById<Activity>('activity', id)
}

/**
 * Get all activities
 */
export async function getActivities(options?: {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'ASC' | 'DESC'
}): Promise<Activity[]> {
  const { limit = 100, offset = 0, orderBy = 'clicked_at', orderDirection = 'DESC' } = options || {}
  return findAll<Activity>('activity', { limit, offset, orderBy, orderDirection })
}

/**
 * Get activities by link ID with pagination
 */
export async function getActivitiesByLinkId(
  linkId: string,
  options?: {
    limit?: number
    offset?: number
  },
): Promise<Activity[]> {
  const { query } = await import('./db')
  const { limit = 50, offset = 0 } = options || {}

  const result = await query<Activity>(
    `SELECT * FROM activity WHERE link_id = $1 ORDER BY clicked_at DESC LIMIT $2 OFFSET $3`,
    [linkId, limit, offset],
  )

  return result.rows
}

/**
 * Get activities by link ID with link info
 */
export async function getActivitiesByLinkIdWithLink(
  linkId: string,
  options?: {
    limit?: number
    offset?: number
  },
): Promise<ActivityWithLink[]> {
  const { query } = await import('./db')
  const { limit = 50, offset = 0 } = options || {}

  const result = await query<ActivityWithLink>(
    `SELECT a.*, l.short_link as link_short_link, l.title as link_title
     FROM activity a
     LEFT JOIN link l ON a.link_id = l.id
     WHERE a.link_id = $1
     ORDER BY a.clicked_at DESC
     LIMIT $2 OFFSET $3`,
    [linkId, limit, offset],
  )

  return result.rows
}

/**
 * Get activities count by link ID
 */
export async function getActivitiesCountByLinkId(linkId: string): Promise<number> {
  return count('activity', { link_id: linkId })
}

/**
 * Get total activities count
 */
export async function getActivitiesCount(): Promise<number> {
  return count('activity')
}

/**
 * Delete an activity by ID
 */
export async function deleteActivity(id: string): Promise<boolean> {
  return deleteById('activity', id)
}

/**
 * Delete all activities by link ID
 */
export async function deleteActivitiesByLinkId(linkId: string): Promise<number> {
  const { query } = await import('./db')
  const result = await query(`DELETE FROM activity WHERE link_id = $1`, [linkId])
  return result.rowCount || 0
}

/**
 * Get activities with pagination and filters
 */
export async function getActivitiesWithFilters(options?: {
  linkId?: string
  limit?: number
  offset?: number
  device?: string
  fingerprint?: string
  startDate?: Date
  endDate?: Date
}): Promise<{ activities: Activity[]; total: number }> {
  const { query } = await import('./db')
  const { linkId, limit = 50, offset = 0, device, fingerprint, startDate, endDate } = options || {}

  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1

  if (linkId) {
    conditions.push(`a.link_id = $${paramIndex++}`)
    params.push(linkId)
  }

  if (device) {
    conditions.push(`a.device = $${paramIndex++}`)
    params.push(device)
  }

  if (fingerprint) {
    conditions.push(`a.fingerprint = $${paramIndex++}`)
    params.push(fingerprint)
  }

  if (startDate) {
    conditions.push(`a.clicked_at >= $${paramIndex++}`)
    params.push(startDate.toISOString())
  }

  if (endDate) {
    conditions.push(`a.clicked_at <= $${paramIndex++}`)
    params.push(endDate.toISOString())
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // Get total count
  const countResult = await query(`SELECT COUNT(*) as count FROM activity a ${whereClause}`, params)
  const total = parseInt(countResult.rows[0].count, 10)

  // Get activities
  params.push(limit, offset)
  const activitiesResult = await query<Activity>(
    `SELECT * FROM activity a ${whereClause} ORDER BY clicked_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    params,
  )

  return {
    activities: activitiesResult.rows,
    total,
  }
}

/**
 * Get analytics data for a link
 */
export async function getLinkAnalytics(linkId: string): Promise<{
  totalClicks: number
  uniqueVisitors: number
  deviceBreakdown: Record<string, number>
  originBreakdown: Record<string, number>
  dailyClicks: Array<{ date: string; clicks: number }>
}> {
  const { query } = await import('./db')

  // Get total clicks
  const totalClicks = await getActivitiesCountByLinkId(linkId)

  // Get unique visitors (by fingerprint)
  const uniqueResult = await query<{ count: string }>(
    `SELECT COUNT(DISTINCT fingerprint) as count FROM activity WHERE link_id = $1 AND fingerprint IS NOT NULL`,
    [linkId],
  )
  const uniqueVisitors = parseInt(uniqueResult.rows[0].count, 10)

  // Get device breakdown
  const deviceResult = await query<{ device: string; count: string }>(
    `SELECT device, COUNT(*) as count FROM activity WHERE link_id = $1 GROUP BY device`,
    [linkId],
  )
  const deviceBreakdown: Record<string, number> = {}
  deviceResult.rows.forEach((row: { device: string | null; count: string }) => {
    deviceBreakdown[row.device || 'unknown'] = parseInt(row.count, 10)
  })

  // Get origin breakdown
  const originResult = await query<{ origin: string; count: string }>(
    `SELECT origin, COUNT(*) as count FROM activity WHERE link_id = $1 GROUP BY origin`,
    [linkId],
  )
  const originBreakdown: Record<string, number> = {}
  originResult.rows.forEach((row: { origin: string | null; count: string }) => {
    originBreakdown[row.origin || 'direct'] = parseInt(row.count, 10)
  })

  // Get daily clicks for last 30 days
  const dailyResult = await query<{ date: string; clicks: string }>(
    `SELECT DATE(clicked_at) as date, COUNT(*) as clicks
     FROM activity
     WHERE link_id = $1
       AND clicked_at >= CURRENT_DATE - INTERVAL '30 days'
     GROUP BY DATE(clicked_at)
     ORDER BY date`,
    [linkId],
  )
  const dailyClicks = dailyResult.rows.map((row: { date: string; clicks: string }) => ({
    date: row.date,
    clicks: parseInt(row.clicks, 10),
  }))

  return {
    totalClicks,
    uniqueVisitors,
    deviceBreakdown,
    originBreakdown,
    dailyClicks,
  }
}

/**
 * Get click trend data for the last 7 days (always returns all 7 days)
 */
export async function getClickTrends(
  linkId: string,
): Promise<Array<{ date: string; clicks: number }>> {
  const { query } = await import('./db')

  // Generate the last 7 days (from 6 days ago to today, in ascending order)
  const last7Days: Array<{ date: string; clicks: number }> = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    last7Days.unshift({ date: monthDay, clicks: 0 }) // Use unshift to add at beginning
  }

  // Get actual click data from database
  const result = await query<{ date: string; clicks: string }>(
    `SELECT
       TO_CHAR(clicked_at, 'MM-DD') as date,
       COUNT(*) as clicks
     FROM activity
     WHERE link_id = $1
       AND clicked_at >= CURRENT_DATE - INTERVAL '7 days'
     GROUP BY TO_CHAR(clicked_at, 'MM-DD'), DATE(clicked_at)
     ORDER BY DATE(clicked_at)`,
    [linkId],
  )

  // Create a map of actual data
  const actualData = new Map<string, number>()
  result.rows.forEach((row) => {
    actualData.set(row.date, parseInt(row.clicks, 10))
  })

  // Merge: fill in actual data, keep 0 for days without data
  return last7Days.map((day) => ({
    date: day.date,
    clicks: actualData.get(day.date) || 0,
  }))
}

/**
 * Get device distribution data
 */
export async function getDeviceDistribution(
  linkId: string,
): Promise<Array<{ name: string; value: number }>> {
  const { query } = await import('./db')

  const result = await query<{ device: string; count: string }>(
    `SELECT device, COUNT(*) as count
     FROM activity
     WHERE link_id = $1
     GROUP BY device`,
    [linkId],
  )

  const total = result.rows.reduce((sum, row) => sum + parseInt(row.count, 10), 0)

  return result.rows.map((row) => ({
    name: row.device || 'unknown',
    value: total > 0 ? Math.round((parseInt(row.count, 10) / total) * 100) : 0,
  }))
}

/**
 * Get referrer distribution data
 */
export async function getReferrerDistribution(
  linkId: string,
): Promise<Array<{ source: string; clicks: number; percentage: number }>> {
  const { query } = await import('./db')

  const result = await query<{ origin: string; count: string }>(
    `SELECT origin, COUNT(*) as count
     FROM activity
     WHERE link_id = $1
     GROUP BY origin
     ORDER BY count DESC`,
    [linkId],
  )

  const total = result.rows.reduce((sum, row) => sum + parseInt(row.count, 10), 0)

  return result.rows.map((row) => ({
    source: row.origin || '直接访问',
    clicks: parseInt(row.count, 10),
    percentage: total > 0 ? Math.round((parseInt(row.count, 10) / total) * 100) : 0,
  }))
}
