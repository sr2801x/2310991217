/**
 * Logging Middleware
 * 
 * Centralized logging system for the notification system.
 * All application logs should use this middleware instead of console.log.
 * Logs are sent to the backend logging service for monitoring and debugging.
 * 
 * Endpoint: http://28.207.122.201/evaluation-service/logs
 */

// Log severity levels and stack types
export type Stack = "frontend" | "backend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

// Frontend package identifiers for log categorization
export type FrontendPackage = 
  | "api"       // API calls and data fetching
  | "component" // React component stuff
  | "hook"      // Custom hooks
  | "page"      // Page-level components
  | "state"     // State management
  | "style"     // CSS/styling
  | "handler"   // Event handlers and such
  | "repository" // Data access
  | "service"   // Business logic
  | "auth"      // Auth stuff
  | "config"    // Configuration
  | "middleware" // Middleware
  | "utils";    // Helper functions

export interface LogRequest {
  stack: Stack;
  level: LogLevel;
  package: FrontendPackage;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

/**
 * Main logging function - sends log entries to the backend service
 * @param stack - Application stack ("frontend" or "backend")
 * @param level - Log severity level
 * @param packageName - Package/component generating the log
 * @param message - Log message content
 * @returns Promise resolving to log response or null on failure
 * 
 * Note: This is async due to network requests. For debug logs, consider
 * not awaiting to avoid blocking. For errors, await to ensure logging completes.
 */
export async function Log(
  stack: Stack,
  level: LogLevel,
  packageName: FrontendPackage,
  message: string
): Promise<LogResponse | null> {
  try {
    const logRequest: LogRequest = {
      stack,
      level,
      package: packageName,
      message,
    };

    const response = await fetch("http://28.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logRequest),
    });

    if (!response.ok) {
      // Logging service unavailable - silently continue
      return null;
    }

    return await response.json();
  } catch (error) {
    // Network or parsing error - silently continue to avoid app disruption
    return null;
  }
}

/**
 * Format log messages with consistent structure
 * @param operation - Operation being performed
 * @param action - Specific action taken
 * @param context - Optional context data as key-value pairs
 * @returns Formatted log message string
 */
export function formatLogMessage(
  operation: string,
  action: string,
  context?: Record<string, any>
): string {
  let msg = `${operation}: ${action}`;
  if (context) {
    msg += ` | ${JSON.stringify(context)}`;
  }
  return msg;
}

/**
 * Shorthand logging utilities for common use cases
 * Provides convenient methods for each log level
 */
export const LogUtils = {
  /** Log error messages */
  error: (packageName: FrontendPackage, message: string, error?: Error) => {
    const fullMessage = error ? `${message} | Error: ${error.message}` : message;
    return Log("frontend", "error", packageName, fullMessage);
  },

  /** Log warning messages */
  warn: (packageName: FrontendPackage, message: string) => {
    return Log("frontend", "warn", packageName, message);
  },

  /** Log informational messages */
  info: (packageName: FrontendPackage, message: string) => {
    return Log("frontend", "info", packageName, message);
  },

  /** Log debug messages */
  debug: (packageName: FrontendPackage, message: string) => {
    return Log("frontend", "debug", packageName, message);
  },

  /** Log fatal error messages */
  fatal: (packageName: FrontendPackage, message: string) => {
    return Log("frontend", "fatal", packageName, message);
  },
};

export default Log;
