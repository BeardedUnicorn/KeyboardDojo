import { configureStore } from '@reduxjs/toolkit';
import lessonsReducer from '../features/lessons/lessonsSlice';
import authReducer from '../features/auth/authSlice';
import progressReducer from '../features/progress/progressSlice';
import subscriptionReducer from '../features/subscription/subscriptionSlice';

export const store = configureStore({
  reducer: {
    lessons: lessonsReducer,
    auth: authReducer,
    progress: progressReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 