'use server';

import { revalidatePath } from 'next/cache';
import {
  createLink,
  updateLink,
  updateLinkStatus,
  deleteLink,
  getLinks,
  getLinkById,
  getLinkClicks,
  getLinksWithStats,
  getLinksCount,
  getTotalClicks,
} from './link-service';
import type { LinkFormData } from './types';

/**
 * Get stats (total links and total clicks)
 */
export async function getStatsAction() {
  try {
    const [linksCount, clicksCount] = await Promise.all([
      getLinksCount(),
      getTotalClicks(),
    ]);
    return {
      success: true,
      data: {
        linksCount,
        clicksCount,
      },
    };
  } catch (error) {
    console.error('Failed to get stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats',
      data: {
        linksCount: 0,
        clicksCount: 0,
      },
    };
  }
}

/**
 * Create a new link
 */
export async function createAction(data: LinkFormData) {
  try {
    const link = await createLink(data);
    revalidatePath('/dashboard');
    return { success: true, data: link };
  } catch (error) {
    console.error('Failed to create link:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create link',
    };
  }
}

/**
 * Get all links with stats
 */
export async function getLinksAction() {
  try {
    const links = await getLinksWithStats();
    return { success: true, data: links };
  } catch (error) {
    console.error('Failed to get links:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get links',
      data: [],
    };
  }
}

/**
 * Get a single link by ID
 */
export async function getLinkAction(id: string) {
  try {
    const link = await getLinkById(id);
    if (!link) {
      return { success: false, error: 'Link not found' };
    }
    return { success: true, data: link };
  } catch (error) {
    console.error('Failed to get link:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get link',
    };
  }
}

/**
 * Update a link
 */
export async function updateLinkAction(id: string, data: Partial<LinkFormData>) {
  try {
    const link = await updateLink(id, data);
    revalidatePath('/dashboard');
    revalidatePath(`/links/${id}`);
    return { success: true, data: link };
  } catch (error) {
    console.error('Failed to update link:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update link',
    };
  }
}

/**
 * Update link status
 */
export async function updateLinkStatusAction(id: string, status: 'active' | 'frozen') {
  try {
    const link = await updateLinkStatus(id, status);
    revalidatePath('/dashboard');
    revalidatePath(`/links/${id}`);
    return { success: true, data: link };
  } catch (error) {
    console.error('Failed to update link status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update link status',
    };
  }
}

/**
 * Delete a link
 */
export async function deleteLinkAction(id: string) {
  try {
    await deleteLink(id);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete link:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete link',
    };
  }
}

/**
 * Get link clicks
 */
export async function getLinkClicksAction(id: string) {
  try {
    const clicks = await getLinkClicks(id);
    return { success: true, data: clicks };
  } catch (error) {
    console.error('Failed to get link clicks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get link clicks',
      data: 0,
    };
  }
}
