'use server'

import { revalidatePath } from 'next/cache'
import {
  createLink,
  updateLink,
  updateLinkStatus,
  deleteLink,
  getLinkById,
  getLinkClicks,
  getLinksWithStats,
  getLinksCount,
  getTotalClicks,
} from './link-service'
import {
  createActivity,
  getActivityById,
  getActivities,
  getActivitiesByLinkId,
  getActivitiesByLinkIdWithLink,
  getActivitiesCountByLinkId,
  getActivitiesCount,
  deleteActivity,
  deleteActivitiesByLinkId,
  getActivitiesWithFilters,
  getLinkAnalytics,
} from './activity-service'
import type { LinkFormData, ActivityFormData } from './types'

/**
 * Get stats (total links and total clicks)
 */
export async function getStatsAction() {
  try {
    const [linksCount, clicksCount] = await Promise.all([getLinksCount(), getTotalClicks()])
    return {
      success: true,
      data: {
        linksCount,
        clicksCount,
      },
    }
  } catch (error) {
    console.error('Failed to get stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats',
      data: {
        linksCount: 0,
        clicksCount: 0,
      },
    }
  }
}

/**
 * Create a new link
 */
export async function createAction(data: LinkFormData) {
  try {
    const link = await createLink(data)
    revalidatePath('/dashboard')
    return { success: true, data: link }
  } catch (error) {
    console.error('Failed to create link:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create link',
    }
  }
}

/**
 * Get all links with stats
 */
export async function getLinksAction() {
  try {
    const links = await getLinksWithStats()
    return { success: true, data: links }
  } catch (error) {
    console.error('Failed to get links:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get links',
      data: [],
    }
  }
}

/**
 * Get a single link by ID
 */
export async function getLinkAction(id: string) {
  try {
    const link = await getLinkById(id)
    if (!link) {
      return { success: false, error: 'Link not found' }
    }
    return { success: true, data: link }
  } catch (error) {
    console.error('Failed to get link:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get link',
    }
  }
}

/**
 * Update a link
 */
export async function updateLinkAction(id: string, data: Partial<LinkFormData>) {
  try {
    const link = await updateLink(id, data)
    revalidatePath('/dashboard')
    revalidatePath(`/links/${id}`)
    return { success: true, data: link }
  } catch (error) {
    console.error('Failed to update link:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update link',
    }
  }
}

/**
 * Update link status
 */
export async function updateLinkStatusAction(id: string, status: 'active' | 'frozen') {
  try {
    const link = await updateLinkStatus(id, status)
    revalidatePath('/dashboard')
    revalidatePath(`/links/${id}`)
    return { success: true, data: link }
  } catch (error) {
    console.error('Failed to update link status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update link status',
    }
  }
}

/**
 * Delete a link
 */
export async function deleteLinkAction(id: string) {
  try {
    await deleteLink(id)
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete link:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete link',
    }
  }
}

/**
 * Get link clicks
 */
export async function getLinkClicksAction(id: string) {
  try {
    const clicks = await getLinkClicks(id)
    return { success: true, data: clicks }
  } catch (error) {
    console.error('Failed to get link clicks:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get link clicks',
      data: 0,
    }
  }
}

// ============ Activity Actions ============

/**
 * Create a new activity record
 */
export async function createActivityAction(data: ActivityFormData) {
  try {
    const activity = await createActivity(data)
    return { success: true, data: activity }
  } catch (error) {
    console.error('Failed to create activity:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create activity',
    }
  }
}

/**
 * Get all activities
 */
export async function getActivitiesAction(options?: { limit?: number; offset?: number }) {
  try {
    const activities = await getActivities(options)
    return { success: true, data: activities }
  } catch (error) {
    console.error('Failed to get activities:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get activities',
      data: [],
    }
  }
}

/**
 * Get activities by link ID
 */
export async function getActivitiesByLinkIdAction(
  linkId: string,
  options?: {
    limit?: number
    offset?: number
  },
) {
  try {
    const activities = await getActivitiesByLinkId(linkId, options)
    return { success: true, data: activities }
  } catch (error) {
    console.error('Failed to get activities by link ID:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get activities',
      data: [],
    }
  }
}

/**
 * Get activities by link ID with link info
 */
export async function getActivitiesByLinkIdWithLinkAction(
  linkId: string,
  options?: {
    limit?: number
    offset?: number
  },
) {
  try {
    const activities = await getActivitiesByLinkIdWithLink(linkId, options)
    return { success: true, data: activities }
  } catch (error) {
    console.error('Failed to get activities with link info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get activities',
      data: [],
    }
  }
}

/**
 * Get activity by ID
 */
export async function getActivityAction(id: string) {
  try {
    const activity = await getActivityById(id)
    if (!activity) {
      return { success: false, error: 'Activity not found' }
    }
    return { success: true, data: activity }
  } catch (error) {
    console.error('Failed to get activity:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get activity',
    }
  }
}

/**
 * Get activities count by link ID
 */
export async function getActivitiesCountByLinkIdAction(linkId: string) {
  try {
    const count = await getActivitiesCountByLinkId(linkId)
    return { success: true, data: count }
  } catch (error) {
    console.error('Failed to get activities count:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get activities count',
      data: 0,
    }
  }
}

/**
 * Get total activities count
 */
export async function getActivitiesCountAction() {
  try {
    const count = await getActivitiesCount()
    return { success: true, data: count }
  } catch (error) {
    console.error('Failed to get activities count:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get activities count',
      data: 0,
    }
  }
}

/**
 * Delete an activity
 */
export async function deleteActivityAction(id: string) {
  try {
    const deleted = await deleteActivity(id)
    if (!deleted) {
      return { success: false, error: 'Activity not found' }
    }
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete activity:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete activity',
    }
  }
}

/**
 * Delete all activities by link ID
 */
export async function deleteActivitiesByLinkIdAction(linkId: string) {
  try {
    const count = await deleteActivitiesByLinkId(linkId)
    revalidatePath('/dashboard')
    revalidatePath(`/links/${linkId}`)
    return { success: true, data: count }
  } catch (error) {
    console.error('Failed to delete activities by link ID:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete activities',
      data: 0,
    }
  }
}

/**
 * Get activities with filters
 */
export async function getActivitiesWithFiltersAction(options?: {
  linkId?: string
  limit?: number
  offset?: number
  device?: string
  fingerprint?: string
  startDate?: Date
  endDate?: Date
}) {
  try {
    const result = await getActivitiesWithFilters(options)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to get activities with filters:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get activities',
      data: { activities: [], total: 0 },
    }
  }
}

/**
 * Get link analytics
 */
export async function getLinkAnalyticsAction(linkId: string) {
  try {
    const analytics = await getLinkAnalytics(linkId)
    return { success: true, data: analytics }
  } catch (error) {
    console.error('Failed to get link analytics:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get link analytics',
      data: {
        totalClicks: 0,
        uniqueVisitors: 0,
        deviceBreakdown: {},
        regionBreakdown: {},
        originBreakdown: {},
        dailyClicks: [],
      },
    }
  }
}
