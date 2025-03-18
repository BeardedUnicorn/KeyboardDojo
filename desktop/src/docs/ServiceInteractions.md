# Service Interactions Documentation

This document outlines the service architecture, interactions, and dependencies in the Keyboard Dojo application.

## Service Architecture Overview

The application follows a service-oriented architecture with the following key principles:

1. **Singleton Pattern**: Most services are implemented as singletons to ensure a single source of truth.
2. **Initialization Flow**: Services have a consistent initialization pattern with async initialization methods.
3. **Event-Based Communication**: Services communicate through events and callbacks to maintain loose coupling.
4. **Hooks as Service Interfaces**: React hooks are used as interfaces to services for components.

## Core Services

### User Progress Service

**File**: `src/services/userProgressService`  
**Hook**: `useUserProgress`

The User Progress Service is the central service that tracks user progress, including:
- Completed lessons and modules
- XP and level progression
- Streak days
- Hearts (lives) management
- Currency balance

**Dependencies**:
- Local Storage (for persistence)

**Consumed by**:
- XP Service
- Currency Service
- Hearts Service
- Streak Service
- Various UI components

### Gamification Service

**File**: `src/services/gamificationService`  
**Hook**: `useGamification`

The Gamification Service consolidates functionality from multiple gamification-related services:
- XP management
- Currency management
- Hearts management

**Dependencies**:
- User Progress Service

**Consumed by**:
- UI components that need access to multiple gamification features

### Theme Service

**File**: `src/contexts/ThemeContextx`  
**Hook**: `useThemeContext`

Manages the application theme (light/dark mode) and provides theme-related utilities.

**Dependencies**:
- Local Storage (for persistence)
- System preferences

**Consumed by**:
- All themed components

### Subscription Service

**File**: `src/services/subscriptionService`  
**Hook**: `useSubscription`

Manages user subscription status and features.

**Dependencies**:
- API Service (for subscription validation)
- Local Storage (for caching)

**Consumed by**:
- Premium feature gates
- Subscription UI

### Achievements Service

**File**: `src/services/achievementsService`  
**Hook**: `useAchievements`

Tracks user achievements and provides achievement-related functionality.

**Dependencies**:
- User Progress Service
- Local Storage (for persistence)

**Consumed by**:
- Achievement UI components
- Gamification features

### Update Service

**File**: `src/services/updateService`

Manages application updates, including checking for updates, downloading, and installation.

**Dependencies**:
- Tauri API
- Logger Service

**Consumed by**:
- Update Notification component

### Logger Service

**File**: `src/services/loggerService`  
**Hook**: `useLogger`

Provides centralized logging functionality with different log levels and Sentry integration.

**Dependencies**:
- Sentry (for error tracking)

**Consumed by**:
- All services and components that need logging

## Service Interaction Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Theme Service  │     │ Logger Service  │     │ Update Service  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        UI Components                            │
└─────────────────────────────────────────────────────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         │                       │                       │
┌────────┴────────┐     ┌────────┴────────┐     ┌────────┴────────┐
│ User Progress   │     │  Subscription   │     │  Achievements   │
│    Service      │◄────┤    Service      │     │    Service      │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Gamification Service                        │
└─────────────────────────────────────────────────────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         │                       │                       │
┌────────┴────────┐     ┌────────┴────────┐     ┌────────┴────────┐
│   XP Service    │     │ Currency Service│     │  Hearts Service │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Data Flow

1. **User Actions** → **UI Components** → **Service Methods**
2. **Services** → **Update State** → **Persist Changes** → **Emit Events**
3. **Service Events** → **Other Services** → **UI Updates**

## Best Practices for Using Services

1. **Always use hooks**: Access services through their respective hooks rather than importing the service directly.
2. **Handle loading states**: Services may have async initialization, so handle loading states appropriately.
3. **Error handling**: Use try/catch blocks when calling service methods that may fail.
4. **Avoid circular dependencies**: Be careful not to create circular dependencies between services.
5. **Memoize values and callbacks**: When using service values or methods in components, use useMemo and useCallback to prevent unnecessary re-renders.

## Example: Awarding XP to a User

```typescript
// In a component
import { useGamificationRedux } from '../hooks/useGamificationRedux';

const MyComponent = () => {
  const { addXP } = useGamificationRedux();
  
  const handleCompletedTask = () => {
    // Award XP for completing a task
    addXP(50, 'task_completed', 'Completed a difficult task');
    
    // This will:
    // 1. Call the XP service to add XP
    // 2. Update the User Progress service with the new XP total
    // 3. Potentially trigger a level up
    // 4. Persist the changes to storage
    // 5. Update the UI to reflect the changes
  };
  
  return (
    <Button onClick={handleCompletedTask}>Complete Task</Button>
  );
};
``` 
