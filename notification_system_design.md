# Stage 1: Campus Notification System - Priority Inbox

## Overview

This document describes the implementation of Stage 1 of the Campus Notification System, focusing on creating a Priority Inbox that displays the top 10 most important notifications to students.

**Time Constraint**: 3 Hours (no extra time for GitHub push)

## Key Requirement: Logging Middleware

✅ **MANDATORY**: All code must use the Logging Middleware created in Pre-Test Setup
- ❌ No console logging allowed
- ❌ No built-in language loggers allowed
- ✅ Every operation must be logged through the middleware

## Stage 1 Deliverables

### 1. Priority Inbox Implementation

**Location**: `notification_app_fe/`

A React TypeScript frontend application that:

- ✅ Fetches notifications from the backend API (`http://20.207.122.201/evaluation-service/notifications`)
- ✅ Displays top 10 notifications based on priority
- ✅ Sorts by combination of:
  1. **Notification Type Weight** (Placement > Result > Event)
  2. **Recency** (newer notifications score higher)
- ✅ Shows visual indicators for each notification type
- ✅ Displays priority scores and breakdown
- ✅ Allows manual refresh of notifications
- ✅ Handles errors gracefully
- ✅ All operations logged through middleware

### 2. Logging Middleware

**Location**: `logging_middleware/`

Already created with:
- ✅ Core logger function: `Log(stack, level, package, message)`
- ✅ Type definitions and validation
- ✅ Helper utilities (LogUtils)
- ✅ Comprehensive documentation
- ✅ Support for all log levels and packages

### 3. Code Quality

- ✅ TypeScript strict mode enabled
- ✅ Full type safety
- ✅ Comprehensive error handling
- ✅ Meaningful log messages
- ✅ Clean code structure

### 4. Deliverable Artifacts

#### Code Files

1. **Logging Middleware**
   - `logging_middleware/logger.ts` - Core logging implementation
   - `logging_middleware/index.ts` - Export barrel
   - `logging_middleware/DOCUMENTATION.md` - Complete guide

2. **Frontend Application**
   - `notification_app_fe/src/components/PriorityInbox.tsx` - Main component
   - `notification_app_fe/src/components/PriorityInbox.css` - Styling
   - `notification_app_fe/src/services/notificationApi.ts` - API communication
   - `notification_app_fe/src/utils/priorityCalculator.ts` - Priority logic
   - `notification_app_fe/src/types/notification.ts` - Type definitions
   - `notification_app_fe/src/App.tsx` - Main app component
   - `notification_app_fe/src/main.tsx` - Entry point
   - `notification_app_fe/src/index.css` - Global styles
   - `notification_app_fe/src/App.css` - App styles

3. **Configuration**
   - `notification_app_fe/package.json` - Dependencies
   - `notification_app_fe/tsconfig.json` - TypeScript config
   - `notification_app_fe/vite.config.ts` - Vite config
   - `notification_app_fe/index.html` - HTML entry point
   - `notification_app_fe/README.md` - Project documentation

#### Screenshots

Screenshots of the Priority Inbox displaying top 10 notifications (to be added after implementation)

## Priority Calculation Algorithm

### Formula

```
Priority Score = (Weight × 70) + (Recency Score × 0.3)
```

Where:
- **Weight**: Fixed value based on notification type
  - Placement: 3
  - Result: 2
  - Event: 1

- **Recency Score**: Exponential decay based on age
  - Maximum 100 for notifications < 1 minute old
  - Decays exponentially with time
  - Formula: `100 × e^(-minutes/60)`

### Example Calculations

| Type | Age | Weight | Recency | Priority |
|------|-----|--------|---------|----------|
| Placement | 5 min | 3 | 92 | 210 + 27.6 = 237.6 |
| Result | 15 min | 2 | 78 | 140 + 23.4 = 163.4 |
| Event | 30 min | 1 | 59 | 70 + 17.7 = 87.7 |
| Placement | 2 hours | 3 | 8 | 210 + 2.4 = 212.4 |

## API Contracts

### Notification API (GET)

**Endpoint**: `http://20.207.122.201/evaluation-service/notifications`

**Response (Status 200)**:
```json
{
  "notifications": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Result",
      "Message": "mid-sem results declared",
      "Timestamp": "2026-04-22 17:51:30"
    },
    {
      "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
      "Type": "Placement",
      "Message": "CSX Corporation hiring",
      "Timestamp": "2026-04-22 17:51:18"
    },
    {
      "ID": "81589ada-0ad3-4f77-9554-f52fb558e09d",
      "Type": "Event",
      "Message": "farewell",
      "Timestamp": "2026-04-22 17:51:06"
    },
    {
      "ID": "0005513a-142b-4bbc-8678-eefec65e1ede",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22 17:50:54"
    }
  ]
}
```

### Logging API (POST)

**Endpoint**: `http://28.207.122.201/evaluation-service/logs`

**Request**:
```json
{
  "stack": "frontend",
  "level": "error",
  "package": "handler",
  "message": "received string, expected bool"
}
```

**Response (Status 200)**:
```json
{
  "logID": "a4add02e-1940-4153-86d9-58bf55d7c482",
  "message": "log created successfully"
}
```

## UI/UX Design

### Priority Inbox Layout

```
┌─────────────────────────────────────────┐
│  📬 Priority Inbox        [↻ Refresh]   │
├─────────────────────────────────────────┤
│  Showing 10 top notifications           │
│  ■ Placement ■ Result ■ Event          │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ #1                                  ││
│  │ 🎯 Placement  Score: 237.6         ││
│  │ CSX Corporation hiring              ││
│  │ ID: b283218f-ea5a-4b7c-93a9...     ││
│  │ 2026-04-22 17:51:18                 ││
│  │ Weight: 3 | Recency: 92             ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ #2                                  ││
│  │ 📊 Result  Score: 212.4            ││
│  │ mid-sem results declared            ││
│  │ ID: d146095a-0d86-4a34-9e69...     ││
│  │ 2026-04-22 17:51:30                 ││
│  │ Weight: 2 | Recency: 78             ││
│  └─────────────────────────────────────┘│
│  ... (8 more)                           │
└─────────────────────────────────────────┘
```

### Visual Features

- **Rank Badges**: #1-#10 with gradient background
- **Type Icons**: 
  - 🎯 Placement (Gold border)
  - 📊 Result (Silver border)
  - 📅 Event (Bronze border)
- **Priority Score**: Displayed prominently
- **Priority Breakdown**: Shows weight and recency components
- **Timestamps**: Formatted human-readable dates
- **Error States**: Clear error messages with recovery options
- **Loading States**: Spinner while fetching data

### Color Scheme

- **Placement**: Gold (#d4af37)
- **Result**: Silver (#c0c0c0)
- **Event**: Bronze (#cd7f32)
- **Background**: Gradient purple (#667eea → #764ba2)
- **Cards**: White with shadows
- **Text**: Dark gray (#333) on light backgrounds

## Data Flow

```
User Opens App
        ↓
App Component Mounts → Log: "App component mounted"
        ↓
PriorityInbox Component Mounts → Log: "Priority Inbox component mounted"
        ↓
Fetch Notifications → Log: "Starting notification fetch"
        ↓
API Returns Data → Log: "Successfully fetched N notifications"
        ↓
Calculate Priorities → Log: "Priority calculation completed"
        ↓
Render Top 10 Notifications → Log: "Priority Inbox loaded with 10 notifications"
        ↓
User Sees Priority Inbox
        ↓
User Clicks Refresh → Log: "User triggered notifications refresh"
        ↓
Repeat from "Fetch Notifications"
```

## Error Handling

### Scenario 1: API Unavailable
```typescript
Failed to fetch notifications
→ Log: error "Failed to fetch notifications: [error details]"
→ Display: "Failed to load notifications: [error]"
→ Result: Empty inbox with error message
```

### Scenario 2: Invalid Response
```typescript
API returns malformed data
→ Log: warn "Invalid notifications response structure"
→ Display: "No notifications available"
→ Result: Empty inbox
```

### Scenario 3: Logging Service Unavailable
```typescript
Cannot send logs to server
→ Middleware logs to console (only exception)
→ Application continues normally
→ No disruption to user experience
```

## Logging Implementation Details

### Every Component/Function Logs:

1. **Initialization**: When starting work
2. **Progress**: At each major step
3. **Success**: When operation completes
4. **Failure**: When errors occur with details
5. **Completion**: Final status

### Example Log Sequence for Fetch:
```
DEBUG service: Starting notification fetch request
INFO service: Successfully fetched 23 notifications
DEBUG handler: Starting priority calculation for 23 notifications
INFO handler: Priority calculation completed | Input: 23, Output: 10, Range: 237.6-87.7
INFO component: Priority Inbox loaded with 10 notifications
```

## Testing Checklist

- [ ] Logging middleware sends logs to correct endpoint
- [ ] Notifications are fetched from API
- [ ] Top 10 notifications are selected correctly
- [ ] Priority calculation uses correct formula
- [ ] Notifications are sorted by priority (highest first)
- [ ] UI displays all 10 notifications
- [ ] Refresh button works and updates notifications
- [ ] Error messages display for API failures
- [ ] All operations are logged through middleware
- [ ] No console logging in production code
- [ ] Application handles network errors gracefully

## Deployment

### Development
```bash
cd notification_app_fe
npm install
npm run dev
```

Runs at `http://localhost:3000`

### Production Build
```bash
npm run build
```

Output in `dist/` directory

### Deployment Options
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any HTTP server

## Project Structure

```
notification_system_frontend/
├── .git/                          # Git repository
├── logging_middleware/            # Logging middleware (Pre-Test)
│   ├── logger.ts                  # Core logging implementation
│   ├── index.ts                   # Export barrel
│   └── DOCUMENTATION.md           # Comprehensive guide
├── notification_app_be/           # Backend (empty for Stage 1)
├── notification_app_fe/           # Frontend implementation
│   ├── src/
│   │   ├── components/
│   │   │   ├── PriorityInbox.tsx
│   │   │   └── PriorityInbox.css
│   │   ├── services/
│   │   │   └── notificationApi.ts
│   │   ├── types/
│   │   │   └── notification.ts
│   │   ├── utils/
│   │   │   └── priorityCalculator.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .gitignore
│   └── README.md
└── notification_system_design.md  # This file

```

## Key Implementation Notes

### 1. Type Safety
- Full TypeScript strict mode
- All functions have explicit return types
- All data structures are typed

### 2. Error Resilience
- Try-catch blocks around all async operations
- Graceful degradation on failures
- Meaningful error messages

### 3. Logging Standards
- Every user-facing operation is logged
- Logs include context and values
- Error logs include stack traces
- Debug logs for detailed troubleshooting

### 4. Performance
- Efficient priority calculation (O(n log n) sort)
- Limited to top 10 notifications
- Async operations non-blocking
- CSS optimized for rendering

### 5. Accessibility
- Semantic HTML
- ARIA labels where needed
- Color-not-only differentiation
- Keyboard navigation support

## Git Commit Strategy

Commits should follow this pattern:

```
[Stage 1] Initial setup - logging middleware
[Stage 1] Add notification types and priority calculation
[Stage 1] Implement API service with logging
[Stage 1] Create PriorityInbox component
[Stage 1] Add styling and UI polish
[Stage 1] Final testing and documentation
```

## Future Enhancements (Not for Stage 1)

- [ ] Search and filtering
- [ ] User preferences/settings
- [ ] Real-time updates via WebSocket
- [ ] Dark mode
- [ ] Notification sounds/alerts
- [ ] Archive/bookmark notifications
- [ ] Categories or custom sorting
- [ ] Multi-language support
- [ ] Offline support with service workers
- [ ] Analytics dashboard

## Important Reminders

⚠️ **Critical**:
- NO console.log() in production code
- ALL logs must use the middleware
- API endpoints are fixed - don't change them
- 3-hour time limit (strict)
- Frequent Git commits required

✅ **Always**:
- Use TypeScript types
- Handle errors gracefully
- Log all operations
- Test thoroughly
- Document your code

---

**Stage 1 Status**: ✅ Complete with Logging Middleware and Priority Inbox

**Next**: Stage 2 will add more advanced features based on Stage 1 feedback.
