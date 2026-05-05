/**
 * Priority Inbox Component
 * 
 * Displays the top 10 most important notifications sorted by priority.
 * Priority is calculated based on notification type weight and recency.
 * All operations are logged via the logging middleware.
 */

import React, { useState, useEffect } from "react";
import { LogUtils } from "../../../logging_middleware";
import * as notificationApi from "../services/notificationApi";
import priorityCalculator from "../utils/priorityCalculator";
import { PrioritizedNotification } from "../types/notification";
import  "./PriorityInbox.css";

export const PriorityInbox: React.FC = () => {
  const [notifications, setNotifications] = useState<PrioritizedNotification[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await LogUtils.info("component", "Priority Inbox component mounted");
        setLoading(true);

        // Fetch notifications from API
        const allNotifications = await notificationApi.fetchNotifications();

        if (allNotifications.length === 0) {
          await LogUtils.warn("component", "No notifications returned from API");
          setNotifications([]);
          setError("No notifications available");
          return;
        }

        // Calculate priority scores and retrieve top 10
        const topNotifications =
          await priorityCalculator.getTopPriorityNotifications(
            allNotifications,
            10
          );

        setNotifications(topNotifications);
        setError(null);

        await LogUtils.info("component", `Priority Inbox loaded with ${topNotifications.length} notifications`);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error occurred";
        await LogUtils.error("component", `Failed to load priority inbox: ${errorMsg}`, err instanceof Error ? err : undefined);
        setError(`Failed to load notifications: ${errorMsg}`);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleRefresh = async () => {
    await LogUtils.info("component", "User triggered refresh");
    setLoading(true);

    try {
      const allNotifications = await notificationApi.fetchNotifications();
      const topNotifications =
        await priorityCalculator.getTopPriorityNotifications(
          allNotifications,
          10
        );

      setNotifications(topNotifications);
      setError(null);

      await LogUtils.info("component", `Refresh completed: ${topNotifications.length} notifications`);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown error";
      await LogUtils.error("component", `Refresh failed: ${errorMsg}`, err instanceof Error ? err : undefined);
      setError(`Refresh failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTypeColor = (type: string): string => {
    switch (type) {
      case "Placement":
        return "#d4af37"; // Gold
      case "Result":
        return "#c0c0c0"; // Silver
      case "Event":
        return "#cd7f32"; // Bronze
      default:
        return "#999999";
    }
  };

  const getNotificationTypeLabel = (type: string): string => {
    switch (type) {
      case "Placement":
        return "🎯 Placement";
      case "Result":
        return "📊 Result";
      case "Event":
        return "📅 Event";
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="priority-inbox loading">
        <div className="spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="priority-inbox">
      <div className="inbox-header">
        <h1>📬 Priority Inbox</h1>
        <button className="refresh-btn" onClick={handleRefresh}>
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>No notifications at the moment</p>
        </div>
      ) : (
        <div className="notifications-list">
          <div className="list-stats">
            <span>Showing {notifications.length} top notifications</span>
            <span className="priority-legend">
              <span style={{ color: "#d4af37" }}>■</span> Placement
              <span style={{ color: "#c0c0c0" }}>■</span> Result
              <span style={{ color: "#cd7f32" }}>■</span> Event
            </span>
          </div>

          {notifications.map((notification, index) => (
            <div
              key={notification.ID}
              className="notification-card"
              style={{
                borderLeftColor: getNotificationTypeColor(notification.Type),
              }}
            >
              <div className="notification-rank">#{index + 1}</div>
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-type">
                    {getNotificationTypeLabel(notification.Type)}
                  </span>
                  <span className="notification-priority">
                    Score: {notification.priorityScore}
                  </span>
                </div>
                <p className="notification-message">{notification.Message}</p>
                <div className="notification-meta">
                  <span className="notification-id">ID: {notification.ID}</span>
                  <span className="notification-time">
                    {formatTimestamp(notification.Timestamp)}
                  </span>
                </div>
                <div className="notification-breakdown">
                  <span className="breakdown-item">
                    Weight: {notification.weight}
                  </span>
                  <span className="breakdown-item">
                    Recency: {notification.recencyScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityInbox;
