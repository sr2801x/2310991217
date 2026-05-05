# Campus Notification System - Frontend

A React TypeScript application that displays a priority inbox for campus notifications. The system fetches notifications from a backend API and intelligently prioritizes them based on type weight and recency.

## Features

- **Priority Inbox**: Displays top 10 notifications sorted by importance and recency
- **Smart Prioritization**: Combines notification type weight (Placement > Result > Event) with recency score
- **Logging Middleware**: Comprehensive logging system for all operations
- **Real-time Updates**: Fetch and refresh notifications from backend API
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe**: Full TypeScript implementation with strict typing

## Project Structure

```
notification_app_fe/
├── src/
│   ├── components/
│   │   ├── PriorityInbox.tsx      # Main inbox component
│   │   └── PriorityInbox.css      # Inbox styling
│   ├── services/
│   │   └── notificationApi.ts     # Backend API communication
│   ├── types/
│   │   └── notification.ts        # Type definitions & priority logic
│   ├── utils/
│   │   └── priorityCalculator.ts  # Priority calculation utilities
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts

../logging_middleware/
├── logger.ts                       # Core logging middleware
└── index.ts                        # Export barrel
```

## Logging Middleware

The logging middleware is the core of the application's observability. All logs must use this middleware - console logging is not allowed.

### Usage

```typescript
import { Log, LogUtils } from "../logging_middleware";

// Basic logging
await Log("frontend", "info", "component", "Notification loaded successfully");

// Using utilities
await LogUtils.info("service", "Fetching notifications");
await LogUtils.error("component", "Failed to load", error);
await LogUtils.debug("handler", "Priority calculation started");
await LogUtils.warn("api", "Slow API response detected");
```

### Log Levels

- `debug`: Detailed diagnostic information
- `info`: Operational information
- `warn`: Warning messages
- `error`: Error messages
- `fatal`: Critical failure

### Packages (Frontend)

- `api`: API communication
- `component`: React components
- `hook`: React hooks
- `page`: Page-level components
- `state`: State management
- `style`: Styling related
- `handler`: Event/request handlers
- `repository`: Data repositories
- `service`: Backend services
- `auth`: Authentication
- `config`: Configuration
- `middleware`: Middleware
- `utils`: Utility functions

## Priority Calculation

The system uses a weighted formula to calculate notification priority:

1. **Type Weight**: Determines base importance
   - Placement: 3 (highest)
   - Result: 2
   - Event: 1 (lowest)

2. **Recency Score**: Newer notifications score higher
   - Exponential decay based on time since notification
   - Max score of 100 for notifications < 1 minute old

3. **Final Score**: Combined metric
   - Formula: `(weight × 70) + (recency × 0.3)`
   - Weighted more heavily towards notification type

## API Endpoints

### Fetch All Notifications (GET)
```
http://20.207.122.201/evaluation-service/notifications
```

Response (Status 200):
```json
{
  "notifications": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Result",
      "Message": "mid-sem results declared",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

### Send Logs (POST)
```
http://28.207.122.201/evaluation-service/logs
```

Request:
```json
{
  "stack": "frontend",
  "level": "info",
  "package": "component",
  "message": "Priority Inbox loaded with 10 notifications"
}
```

Response (Status 200):
```json
{
  "logID": "a4add02e-1940-4153-86d9-58bf55d7c482",
  "message": "log created successfully"
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd notification_app_fe
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

```bash
npm run build
```

Output files will be in the `dist/` directory.

## How It Works

1. **Component Mount**: PriorityInbox component mounts and logs initialization
2. **Fetch Notifications**: Calls the notification API to get all notifications
3. **Calculate Priorities**: Uses priority calculator to score and rank notifications
4. **Display Top 10**: Renders the top 10 notifications with visual indicators
5. **Logging**: Every operation is logged through the middleware

## UI Features

- **Rank Badges**: Shows position #1-#10 for easy identification
- **Type Indicators**: Color-coded icons for notification type
  - 🎯 Placement (Gold border)
  - 📊 Result (Silver border)
  - 📅 Event (Bronze border)
- **Priority Score**: Displays calculated priority score
- **Priority Breakdown**: Shows weight and recency components
- **Timestamp**: Displays when notification was created
- **Refresh Button**: Allows manual refresh of notifications
- **Error Handling**: Graceful error messages for failed operations

## Development Notes

### Important: No Console Logging Allowed

All logging MUST go through the logging middleware. Using `console.log()`, `console.error()`, etc. is NOT allowed in production code. The middleware ensures all logs are sent to the central logging service for monitoring and debugging.

### Type Safety

The project uses strict TypeScript configuration. All types are defined and validated.

### Error Handling

All async operations include comprehensive error handling with detailed logging.

## Deployment

The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any HTTP server

## Future Enhancements

- Search and filter notifications
- Notification preferences/settings
- Real-time updates via WebSocket
- Dark mode
- Notification sounds/alerts
- Bookmark/archive notifications
