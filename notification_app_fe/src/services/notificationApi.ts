/**
 * Notification API communication layer
 * Just fetches data from the backend and logs what happens
 * 
 * If the API goes down, we return empty arrays - app should handle that gracefully
 */

import { Log, LogUtils } from "../../../";
import { Notification } from "../types/notification";

const API_BASE_URL = "http://20.207.122.201/evaluation-service";
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/notifications`;

/**
 * Fetch all notifications
 * Returns empty array if anything goes wrong - let the UI handle it
 */
export async function fetchNotifications(): Promise<Notification[]> {
  try {
    await LogUtils.debug("service", "fetching notifications from API");

    const response = await fetch(NOTIFICATIONS_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await LogUtils.error("service", `API returned ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Check if the response looks right
    if (!data.notifications || !Array.isArray(data.notifications)) {
      await LogUtils.warn("service", "API response looks weird, missing notifications array");
      return [];
    }

    const notifications: Notification[] = data.notifications;
    await LogUtils.info("service", `got ${notifications.length} notifications`);

    return notifications;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown error";
    await LogUtils.error("service", `fetch failed: ${msg}`, error instanceof Error ? error : undefined);
    return [];
  }
}

/**
 * Fetch a single notification by ID
 * 
 * @param id - Notification ID
 * @returns Notification object or null if not found
 */
export async function fetchNotificationById(
  id: string
): Promise<Notification | null> {
  try {
    await LogUtils.debug(
      "service",
      `Fetching notification with ID: ${id}`
    );

    const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await LogUtils.warn(
        "service",
        `Notification ${id} not found - Status: ${response.status}`
      );
      return null;
    }

    const data = await response.json();
    const notification: Notification = data;

    await LogUtils.info(
      "service",
      `Successfully fetched notification: ${id} | Type: ${notification.Type}`
    );

    return notification;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error(
      "service",
      `Failed to fetch notification ${id}: ${errorMsg}`,
      error instanceof Error ? error : undefined
    );
    return null;
  }
}

/**
 * Filter and search notifications by type or message content
 * 
 * @param notifications - Array of notifications to filter
 * @param searchTerm - Optional search term to filter messages
 * @param type - Optional notification type filter
 * @returns Filtered notifications
 */
export async function searchNotifications(
  notifications: Notification[],
  searchTerm?: string,
  type?: string
): Promise<Notification[]> {
  try {
    await LogUtils.debug(
      "service",
      `Searching notifications | SearchTerm: ${searchTerm || "none"}, Type: ${
        type || "all"
      }`
    );

    let filtered = notifications;

    if (type) {
      filtered = filtered.filter((n) => n.Type === type);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((n) =>
        n.Message.toLowerCase().includes(term)
      );
    }

    await LogUtils.info(
      "service",
      `Search completed | Input: ${notifications.length}, Output: ${filtered.length}`
    );

    return filtered;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error(
      "service",
      `Search operation failed: ${errorMsg}`,
      error instanceof Error ? error : undefined
    );
    return [];
  }
}

export default {
  fetchNotifications,
  fetchNotificationById,
  searchNotifications,
};
