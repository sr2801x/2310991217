/**
 * Logging Middleware - Main Export
 * 
 * This module exports the centralized logging functionality for the notification system frontend.
 */

export {
  Log,
  LogUtils,
  formatLogMessage,
  type Stack,
  type LogLevel,
  type FrontendPackage,
  type LogRequest,
  type LogResponse,
} from "./logger";

import Log from "./logger";

export default Log;
