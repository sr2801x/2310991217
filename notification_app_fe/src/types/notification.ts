// Notification types supported by the system
export type NotificationType = "Placement" | "Event" | "Result";

// Raw notification structure from backend API
export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

// Notification with calculated priority scores
export interface PrioritizedNotification extends Notification {
  priorityScore: number;
  weight: number;
  recencyScore: number;
}

// Priority weights for each notification type
export const PRIORITY_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Calculate recency score based on notification timestamp
 * Uses exponential decay formula where newer notifications receive higher scores
 * @param timestamp - ISO timestamp string of the notification
 * @returns Recency score between 0 and 100
 */
export function calculateRecencyScore(timestamp: string): number {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffMs = now.getTime() - notificationTime.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  // Calculate exponential decay based on minutes elapsed
  const recencyScore = Math.max(0, 100 * Math.exp(-diffMinutes / 60));
  return Math.round(recencyScore * 100) / 100;
}

/**
 * Calculate overall priority score for a notification
 * Combines type weight (70%) and recency score (30%)
 * @param notification - Notification to calculate score for
 * @returns Object containing score, weight, and recency values
 */
export function calculatePriorityScore(
  notification: Notification
): { score: number; weight: number; recency: number } {
  const weight = PRIORITY_WEIGHTS[notification.Type];
  const recency = calculateRecencyScore(notification.Timestamp);

  // Calculate weighted score prioritizing notification type
  const score = weight * 70 + recency * 0.3;

  return {
    score: Math.round(score * 100) / 100,
    weight,
    recency: Math.round(recency),
  };
}

/**
 * Sort notifications by priority score and return top N results
 * @param notifications - Array of notifications to sort
 * @param limit - Maximum number of notifications to return
 * @returns Top N notifications sorted by priority score (descending)
 */
export function sortByPriority(
  notifications: Notification[],
  limit: number = 10
): PrioritizedNotification[] {
  return notifications
    .map((notification) => {
      const { score, weight, recency } = calculatePriorityScore(notification);
      return {
        ...notification,
        priorityScore: score,
        weight,
        recencyScore: recency,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, limit);
}
