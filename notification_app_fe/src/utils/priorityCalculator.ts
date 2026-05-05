/**
 * Priority Calculation Utility
 * 
 * Provides functions for calculating and sorting notification priorities.
 * All operations are logged via the logging middleware for monitoring and debugging.
 */

import { LogUtils } from "../../../logging_middleware";
import {
  Notification,
  PrioritizedNotification,
  sortByPriority,
  calculatePriorityScore,
} from "../types/notification";

/**
 * Process and sort notifications by priority score
 * @param notifications - Array of notifications to prioritize
 * @param limit - Maximum number of top notifications to return (default: 10)
 * @returns Promise resolving to top notifications sorted by priority score (descending)
 */
export async function getTopPriorityNotifications(
  notifications: Notification[],
  limit: number = 10
): Promise<PrioritizedNotification[]> {
  try {
    await LogUtils.debug("handler", `Starting priority calculation for ${notifications.length} notifications`);

    // Sort notifications by priority score
    const prioritized = sortByPriority(notifications, limit);

    // Log calculation summary
    const summary = {
      totalInput: notifications.length,
      topNotifications: prioritized.length,
      topScore: prioritized[0]?.priorityScore || 0,
      bottomScore: prioritized[prioritized.length - 1]?.priorityScore || 0,
    };

    await LogUtils.info("handler", `Priority calculation completed: ${summary.totalInput} → ${summary.topNotifications} notifications (Score range: ${summary.topScore}-${summary.bottomScore})`);

    return prioritized;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error("handler", `Priority calculation failed: ${errorMsg}`, error instanceof Error ? error : undefined);
    return [];
  }
}

/**
 * Get detailed priority breakdown for a single notification
 * @param notification - Notification to analyze
 * @returns Promise resolving to detailed priority breakdown or null on failure
 */
export async function getPriorityBreakdown(notification: Notification) {
  try {
    const { score, weight, recency } = calculatePriorityScore(notification);

    const breakdown = {
      notificationId: notification.ID,
      type: notification.Type,
      timestamp: notification.Timestamp,
      weight,
      recencyScore: recency,
      finalPriorityScore: score,
      weightPercentage: "70%",
      recencyPercentage: "30%",
    };

    await LogUtils.debug("handler", `Priority breakdown for ${notification.ID}: Type=${notification.Type}, Weight=${weight}, Recency=${recency}, Score=${score}`);

    return breakdown;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error("handler", `Priority breakdown failed: ${errorMsg}`, error instanceof Error ? error : undefined);
    return null;
  }
}

/**
 * Group notifications by type with priority ranking
 * @param notifications - Array of notifications to group
 * @returns Promise resolving to notifications grouped by type, each sorted by priority
 */
export async function getNotificationsByType(notifications: Notification[]): Promise<
  Record<string, PrioritizedNotification[]>
> {
  try {
    await LogUtils.debug("handler", `Grouping ${notifications.length} notifications by type`);

    const grouped: Record<string, PrioritizedNotification[]> = {};

    // Group notifications by type
    for (const notification of notifications) {
      if (!grouped[notification.Type]) {
        grouped[notification.Type] = [];
      }
      const { score, weight, recency } = calculatePriorityScore(notification);
      grouped[notification.Type].push({
        ...notification,
        priorityScore: score,
        weight,
        recencyScore: recency,
      });
    }

    // Sort each group by priority score
    for (const type in grouped) {
      grouped[type].sort((a, b) => b.priorityScore - a.priorityScore);
    }

    const summary = Object.entries(grouped)
      .map(([type, items]) => `${type}: ${items.length}`)
      .join(", ");

    await LogUtils.info("handler", `Grouping completed: ${summary}`);

    return grouped;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    await LogUtils.error("handler", `Grouping failed: ${errorMsg}`, error instanceof Error ? error : undefined);
    return {};
  }
}

export default {
  getTopPriorityNotifications,
  getPriorityBreakdown,
  getNotificationsByType,
};
