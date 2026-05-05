# Quick Reference Guide - Logging Middleware & Priority Inbox

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd notification_app_fe
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## 📝 Logging Quick Reference

### Basic Usage
```typescript
import { Log, LogUtils } from "../logging_middleware";

// Simple logging
await Log("frontend", "info", "component", "Component loaded");

// Using utilities
await LogUtils.info("service", "Fetching data");
await LogUtils.error("component", "Failed to load", error);
```

### Log Levels (Use These)
- `debug` - Detailed trace information
- `info` - General operational info
- `warn` - Warning conditions
- `error` - Error conditions
- `fatal` - Critical failures

### Frontend Packages (Use These)
```
api, component, hook, page, state, style, handler, 
repository, service, auth, config, middleware, utils
```

## 📊 File Structure Cheat Sheet

```
logging_middleware/
├── logger.ts          ← Core logging function
├── index.ts           ← Exports
└── DOCUMENTATION.md   ← Full guide

notification_app_fe/
├── src/
│   ├── components/    ← React components
│   ├── services/      ← API communication
│   ├── types/         ← TypeScript interfaces
│   ├── utils/         ← Helper functions
│   └── App.tsx        ← Main component
├── index.html         ← Entry HTML
├── vite.config.ts     ← Build config
└── package.json       ← Dependencies
```

## 🎯 Priority Calculation

```
Priority = (Weight × 70) + (Recency × 0.3)

Weights:
- Placement: 3
- Result: 2
- Event: 1

Recency (0-100):
- 0 min old: 100
- 5 min old: 92
- 30 min old: 59
- 1 hour old: 30
```

## 🔗 API Endpoints

### Get Notifications (GET)
```
http://20.207.122.201/evaluation-service/notifications
```

Response:
```json
{
  "notifications": [
    {
      "ID": "...",
      "Type": "Placement|Result|Event",
      "Message": "...",
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
  "level": "info|warn|error|debug|fatal",
  "package": "component|service|api|handler|...",
  "message": "description of what happened"
}
```

Response:
```json
{
  "logID": "unique-id",
  "message": "log created successfully"
}
```

## ⚠️ Common Mistakes to Avoid

❌ **Don't**:
```typescript
console.log("Something happened");  // Use logging middleware!
Log("frontend", "debug", "BADPACKAGE", "message");  // Invalid package
```

✅ **Do**:
```typescript
await LogUtils.info("component", "Something happened");
await Log("frontend", "debug", "component", "message");
```

## 🧪 Testing the Setup

### Test Logging
```typescript
import { Log } from "./logging_middleware";

async function test() {
  const result = await Log(
    "frontend",
    "info",
    "component",
    "This is a test"
  );
  console.log(result);  // Should show: { logID: "...", message: "..." }
}
```

### Test API
```typescript
async function testAPI() {
  const response = await fetch(
    "http://20.207.122.201/evaluation-service/notifications"
  );
  const data = await response.json();
  console.log(data.notifications.length);  // Should show: > 0
}
```

## 📦 Important Files

| File | Purpose | Lines |
|------|---------|-------|
| `logger.ts` | Core logging | 250+ |
| `PriorityInbox.tsx` | Main component | 420+ |
| `notificationApi.ts` | API calls | 150+ |
| `priorityCalculator.ts` | Priority logic | 180+ |
| `notification.ts` | Types | 120+ |

## 🎨 UI Colors

| Type | Color | Hex |
|------|-------|-----|
| Placement | Gold | #d4af37 |
| Result | Silver | #c0c0c0 |
| Event | Bronze | #cd7f32 |
| Background | Purple Gradient | #667eea → #764ba2 |

## 💾 Save & Commit Strategy

```bash
# Stage changes
git add .

# Commit with message
git commit -m "[Stage 1] Describe what you did"

# Push to GitHub
git push origin main
```

## 🐛 Debugging Tips

### Check Logs
Look at browser console (Network tab shows log posts)

### Check API Response
```typescript
const res = await fetch("http://20.207.122.201/evaluation-service/notifications");
console.log(await res.json());
```

### Enable TypeScript Checking
```bash
npm run type-check
```

### Build Check
```bash
npm run build
```

## 📚 Documentation Links

1. **Logging Middleware**: See `logging_middleware/DOCUMENTATION.md`
2. **Frontend App**: See `notification_app_fe/README.md`
3. **System Design**: See `notification_system_design.md`
4. **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

## 🔑 Key Commands

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Production build
npm run preview      # Preview build

# Quality
npm run lint         # Check code style
npm run type-check   # TypeScript checking

# Utilities
npm install          # Install dependencies
```

## 🎯 What Gets Logged

### Component Mount
```
INFO component: PriorityInbox component mounted
```

### API Fetch
```
DEBUG service: Starting notification fetch request
INFO service: Successfully fetched 23 notifications
```

### Priority Calculation
```
DEBUG handler: Starting priority calculation for 23 notifications
INFO handler: Priority calculation completed | Input: 23, Output: 10, Range: 237.6-87.7
```

### Error
```
ERROR service: Failed to fetch notifications: Network error
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (full layout)
- **Mobile**: ≤ 768px (stacked layout)
- **Cards**: Full width on mobile, limited on desktop

## ⏰ Time Reference

- Dev server startup: ~2 seconds
- Build time: ~10 seconds
- API fetch: ~500ms typical
- Priority calculation: <50ms for 100 items

## 🆘 Troubleshooting

### Issue: Logs not appearing
**Solution**: Check network tab - POST to logging endpoint should show 200 status

### Issue: No notifications shown
**Solution**: Check that API returns data - verify endpoint is correct

### Issue: Build fails
**Solution**: Run `npm install` and check TypeScript errors with `npm run type-check`

### Issue: Styling broken
**Solution**: Check CSS file is loaded - look at Network tab in DevTools

---

**Reference**: For more details, see the comprehensive documentation files in the project.
