/**
 * Notification API Service
 * 
 * Handles all API communication for fetching and searching notifications.
 * Implements graceful error handling by returning empty arrays on failure.
 */

import { LogUtils } from "../../../logging_middleware";
import { Notification } from "../types/notification";

const API_BASE_URL = "http://20.207.122.201/evaluation-service";
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/notifications`;

/**
 * Fetch all notifications from the backend API
 * @returns Promise resolving to array of notifications, or empty array on failure
 */
export async function fetchNotifications(): Promise<Notification[]> {
  try {
    await LogUtils.debug("service", "Fetching notifications from API");

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

    // Validate response structure
    if (!data.notifications || !Array.isArray(data.notifications)) {
      await LogUtils.warn("service", "API response missing notifications array");
      return [];
    }

    const notifications: Notification[] = data.notifications;
    await LogUtils.info("service", `Retrieved ${notifications.length} notifications`);

    return notifications;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error("service", `Fetch failed: ${msg}`, error instanceof Error ? error : undefined);
    return [];
  }
}

/**
 * Fetch a single notification by its ID
 * @param id - Unique identifier of the notification
 * @returns Promise resolving to notification object or null if not found
 */
export async function fetchNotificationById(
  id: string
): Promise<Notification | null> {
  try {
    await LogUtils.debug("service", `Fetching notification ID: ${id}`);

    const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await LogUtils.warn("service", `Notification ${id} not found (Status: ${response.status})");
      return null;
    }

    const data = await response.json();
    const notification: Notification = data;

    await LogUtils.info("service", `Fetched notification ${id} (Type: ${notification.Type})");

    return notification;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error("service", `Failed to fetch notification ${id}: ${errorMsg}`, error instanceof Error ? error : undefined);
    return null;
  }
}

/**
 * Filter and search notifications by type and/or message content
 * @param notifications - Array of notifications to filter
 * @param searchTerm - Optional search term to filter messages (case-insensitive)
 * @param type - Optional notification type to filter by
 * @returns Promise resolving to filtered array of notifications
 */
export async function searchNotifications(
  notifications: Notification[],
  searchTerm?: string,
  type?: string
): Promise<Notification[]> {
  try {
    await LogUtils.debug("service", `Searching notifications (Term: ${searchTerm || "none"}, Type: ${type || "all"})");

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

    await LogUtils.info("service", `Search completed: ${notifications.length} → ${filtered.length} notifications`);

    return filtered;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error("service", `Search failed: ${errorMsg}`, error instanceof Error ? error : undefined);
    return [];
  }
}

export default {
  fetchNotifications,
  fetchNotificationById,
  searchNotifications,
};
