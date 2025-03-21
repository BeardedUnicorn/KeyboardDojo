import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Card, Typography, CircularProgress, Alert, Grid, Divider } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the proper TypeScript interfaces for our Redux state
interface RootState {
  user: UserState;
  userProgress: UserProgressState;
  gamification: GamificationState;
  subscription: SubscriptionState;
  settings: SettingsState;
  ui: UIState;
}

interface UserState {
  isAuthenticated: boolean;
  username: string;
  email: string;
  photoURL?: string;
  isLoading?: boolean;
  error?: string | null;
}

interface UserProgressState {
  level: number;
  xp: number;
  totalLessonsCompleted: number;
  streakDays: number;
  lastActive: string;
  progress: Array<any>;
  isLoading?: boolean;
  error?: string | null;
}

interface GamificationState {
  level: number;
  xp: number;
  totalXp: number;
  nextLevelXP?: number;
  currentStreak: number;
  maxStreak: number;
  balance: number;
  hearts?: {
    current: number;
    max: number;
    refillTime: number;
  };
  achievements?: Array<any>;
  currentTier: string;
  isLoading?: boolean;
  error?: string | null;
}

interface SubscriptionState {
  hasPremium: boolean;
  expiryDate: string;
  currentTier: string;
  isLoading?: boolean;
  error?: string | null;
}

interface SettingsState {
  theme: string;
  mode: string;
  keyboardLayout?: string;
  fontSize?: string;
  notifications?: {
    achievements: boolean;
    levelUp: boolean;
    streaks: boolean;
    updates: boolean;
  };
}

interface UIState {
  theme: string;
  mode: string;
  sidebar: {
    open: boolean;
  };
}

/**
 * Example component that demonstrates Redux integration in Storybook
 */
const ReduxExample = () => {
  // Get dispatch function from Redux
  const dispatch = useDispatch();
  
  // Select data from different slices of the Redux store with proper typing
  const user = useSelector((state: RootState) => state.user);
  const userProgress = useSelector((state: RootState) => state.userProgress);
  const gamification = useSelector((state: RootState) => state.gamification);
  const subscription = useSelector((state: RootState) => state.subscription);
  const settings = useSelector((state: RootState) => state.settings);
  
  // Example of dispatching actions to the Redux store
  const handleIncreaseXP = () => {
    dispatch({
      type: 'gamification/increaseXP',
      payload: 100
    });
    
    // In a real application, this would trigger a reducer that updates the state
    console.log('Increased XP by 100 (mocked action)');
  };
  
  const handleCompleteLesson = () => {
    dispatch({
      type: 'userProgress/completeLesson',
      payload: {
        lessonId: 'lesson-123',
        trackId: 'ide',
        moduleId: 'selection'
      }
    });
    
    // In a real application, this would trigger a reducer that updates the state
    console.log('Completed lesson (mocked action)');
  };
  
  const handleUnlockAchievement = () => {
    dispatch({
      type: 'gamification/unlockAchievement',
      payload: {
        achievementId: 'shortcut_master'
      }
    });
    
    // In a real application, this would trigger a reducer that updates the state
    console.log('Unlocked achievement (mocked action)');
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Redux Store Integration Example</Typography>
      
      <Grid container spacing={3}>
        {/* User State */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>User State</Typography>
            {user.isLoading ? (
              <CircularProgress size={24} />
            ) : user.error ? (
              <Alert severity="error">{user.error}</Alert>
            ) : (
              <Box>
                <Typography variant="body1">
                  <strong>Username:</strong> {user.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Authenticated:</strong> {user.isAuthenticated ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
        
        {/* User Progress State */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>User Progress</Typography>
            {userProgress.isLoading ? (
              <CircularProgress size={24} />
            ) : userProgress.error ? (
              <Alert severity="error">{userProgress.error}</Alert>
            ) : (
              <Box>
                <Typography variant="body1">
                  <strong>Level:</strong> {userProgress.level}
                </Typography>
                <Typography variant="body1">
                  <strong>XP:</strong> {userProgress.xp}
                </Typography>
                <Typography variant="body1">
                  <strong>Completed Lessons:</strong> {userProgress.totalLessonsCompleted}
                </Typography>
                <Typography variant="body1">
                  <strong>Streak:</strong> {userProgress.streakDays} days
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
        
        {/* Gamification State */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Gamification State</Typography>
            {gamification.isLoading ? (
              <CircularProgress size={24} />
            ) : gamification.error ? (
              <Alert severity="error">{gamification.error}</Alert>
            ) : (
              <Box>
                <Typography variant="body1">
                  <strong>Current Streak:</strong> {gamification.currentStreak} days
                </Typography>
                <Typography variant="body1">
                  <strong>Max Streak:</strong> {gamification.maxStreak} days
                </Typography>
                <Typography variant="body1">
                  <strong>Hearts:</strong> {gamification.hearts?.current}/{gamification.hearts?.max}
                </Typography>
                <Typography variant="body1">
                  <strong>Currency Balance:</strong> {gamification.balance} coins
                </Typography>
                <Typography variant="body1">
                  <strong>Achievements:</strong> {gamification.achievements?.length} total
                </Typography>
                <Typography variant="body1">
                  <strong>Current Tier:</strong> {gamification.currentTier}
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
        
        {/* Subscription State */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Subscription State</Typography>
            {subscription.isLoading ? (
              <CircularProgress size={24} />
            ) : subscription.error ? (
              <Alert severity="error">{subscription.error}</Alert>
            ) : (
              <Box>
                <Typography variant="body1">
                  <strong>Premium:</strong> {subscription.hasPremium ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body1">
                  <strong>Tier:</strong> {subscription.currentTier}
                </Typography>
                <Typography variant="body1">
                  <strong>Expiry Date:</strong> {subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h5" gutterBottom>Redux Actions Example</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        These actions are mocked for demonstration purposes. In a real application, they would update the Redux store state.
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleIncreaseXP}
        >
          Earn 100 XP
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleCompleteLesson}
        >
          Complete Lesson
        </Button>
        
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleUnlockAchievement}
        >
          Unlock Achievement
        </Button>
      </Box>
    </Box>
  );
};

// Create mock slices and initial state for the store
const createMockStore = (storeType = 'default') => {
  // Default user state
  const defaultUserState: UserState = {
    isAuthenticated: true,
    username: 'keyboardninja',
    email: 'user@example.com',
    photoURL: 'https://via.placeholder.com/150',
    isLoading: false,
    error: null
  };

  // Default user progress state
  const defaultUserProgressState: UserProgressState = {
    level: 5,
    xp: 2500,
    totalLessonsCompleted: 15,
    streakDays: 7,
    lastActive: new Date().toISOString(),
    progress: [],
    isLoading: false,
    error: null
  };

  // Default gamification state
  const defaultGamificationState: GamificationState = {
    level: 5,
    xp: 2500,
    totalXp: 2500,
    nextLevelXP: 3000,
    currentStreak: 7,
    maxStreak: 10,
    balance: 250,
    hearts: {
      current: 4,
      max: 5,
      refillTime: Date.now() + 3600000
    },
    achievements: [],
    currentTier: 'Beginner',
    isLoading: false,
    error: null
  };

  // Default subscription state
  const defaultSubscriptionState: SubscriptionState = {
    hasPremium: false,
    expiryDate: '',
    currentTier: 'Free',
    isLoading: false,
    error: null
  };

  // Default settings state
  const defaultSettingsState: SettingsState = {
    theme: 'system',
    mode: 'light',
    keyboardLayout: 'qwerty',
    fontSize: 'medium',
    notifications: {
      achievements: true,
      levelUp: true,
      streaks: true,
      updates: true
    }
  };

  // Default UI state
  const defaultUIState: UIState = {
    theme: 'system',
    mode: 'light',
    sidebar: {
      open: false
    }
  };

  // Modify state based on store type
  let userState = { ...defaultUserState };
  let userProgressState = { ...defaultUserProgressState };
  let gamificationState = { ...defaultGamificationState };
  let subscriptionState = { ...defaultSubscriptionState };
  
  switch (storeType) {
    case 'beginner':
      userProgressState.level = 2;
      userProgressState.xp = 500;
      userProgressState.totalLessonsCompleted = 5;
      userProgressState.streakDays = 3;
      gamificationState.level = 2;
      gamificationState.xp = 500;
      gamificationState.totalXp = 500;
      gamificationState.currentTier = 'Beginner';
      gamificationState.balance = 50;
      break;
      
    case 'intermediate':
      userProgressState.level = 10;
      userProgressState.xp = 7500;
      userProgressState.totalLessonsCompleted = 35;
      userProgressState.streakDays = 14;
      gamificationState.level = 10;
      gamificationState.xp = 7500;
      gamificationState.totalXp = 7500;
      gamificationState.currentTier = 'Intermediate';
      gamificationState.balance = 750;
      subscriptionState.hasPremium = true;
      subscriptionState.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      subscriptionState.currentTier = 'Premium';
      break;
      
    case 'advanced':
      userProgressState.level = 25;
      userProgressState.xp = 30000;
      userProgressState.totalLessonsCompleted = 120;
      userProgressState.streakDays = 60;
      gamificationState.level = 25;
      gamificationState.xp = 30000;
      gamificationState.totalXp = 30000;
      gamificationState.currentTier = 'Advanced';
      gamificationState.balance = 2500;
      subscriptionState.hasPremium = true;
      subscriptionState.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      subscriptionState.currentTier = 'Premium Plus';
      break;
      
    case 'loading':
      userState.isLoading = true;
      userProgressState.isLoading = true;
      gamificationState.isLoading = true;
      subscriptionState.isLoading = true;
      break;
      
    case 'error':
      userState.error = 'Failed to load user data';
      userProgressState.error = 'Failed to load progress data';
      gamificationState.error = 'Failed to load gamification data';
      subscriptionState.error = 'Failed to verify subscription';
      break;
  }

  // Create slices
  const userSlice = createSlice({
    name: 'user',
    initialState: userState,
    reducers: {}
  });

  const userProgressSlice = createSlice({
    name: 'userProgress',
    initialState: userProgressState,
    reducers: {}
  });

  const gamificationSlice = createSlice({
    name: 'gamification',
    initialState: gamificationState,
    reducers: {}
  });

  const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: subscriptionState,
    reducers: {}
  });

  const settingsSlice = createSlice({
    name: 'settings',
    initialState: defaultSettingsState,
    reducers: {}
  });

  const uiSlice = createSlice({
    name: 'ui',
    initialState: defaultUIState,
    reducers: {}
  });

  // Create and return the store
  return configureStore({
    reducer: {
      user: userSlice.reducer,
      userProgress: userProgressSlice.reducer,
      gamification: gamificationSlice.reducer,
      subscription: subscriptionSlice.reducer,
      settings: settingsSlice.reducer,
      ui: uiSlice.reducer
    }
  });
};

// StoryWrapper to provide Redux store context
interface StoryWrapperProps {
  storeName?: string;
  children: React.ReactNode;
}

const StoryWrapper: React.FC<StoryWrapperProps> = ({ storeName = 'default', children }) => {
  const store = createMockStore(storeName);
  return <Provider store={store}>{children}</Provider>;
};

const meta: Meta<typeof ReduxExample> = {
  title: 'Examples/ReduxExample',
  component: ReduxExample,
  parameters: {
    docs: {
      description: {
        component: 'Demonstrates how to use Redux with Storybook, including selecting from state and dispatching actions.',
      },
    },
  },
  // Make sure all different store states will be shown in docs
  argTypes: {
    storeType: {
      control: {
        type: 'select',
        options: ['default', 'beginner', 'intermediate', 'advanced', 'loading', 'error'],
      },
      defaultValue: 'default',
      description: 'Type of Redux store to use',
      table: {
        category: 'Redux',
        defaultValue: { summary: 'default' },
      }
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReduxExample>;

// Default story using the default store
export const Default: Story = {
  parameters: {
    storeName: 'default',
  },
  render: () => (
    <StoryWrapper storeName="default">
      <ReduxExample />
    </StoryWrapper>
  ),
};

// Story using beginner user profile store
export const BeginnerProfile: Story = {
  parameters: {
    storeName: 'beginner',
    docs: {
      description: {
        story: 'Shows Redux state for a beginner user with minimal progress.',
      },
    },
  },
  render: () => (
    <StoryWrapper storeName="beginner">
      <ReduxExample />
    </StoryWrapper>
  ),
};

// Story using intermediate user profile store
export const IntermediateProfile: Story = {
  parameters: {
    storeName: 'intermediate',
    docs: {
      description: {
        story: 'Shows Redux state for an intermediate user with moderate progress.',
      },
    },
  },
  render: () => (
    <StoryWrapper storeName="intermediate">
      <ReduxExample />
    </StoryWrapper>
  ),
};

// Story using advanced user profile store
export const AdvancedProfile: Story = {
  parameters: {
    storeName: 'advanced',
    docs: {
      description: {
        story: 'Shows Redux state for an advanced user with substantial progress.',
      },
    },
  },
  render: () => (
    <StoryWrapper storeName="advanced">
      <ReduxExample />
    </StoryWrapper>
  ),
};

// Story showing loading states
export const LoadingStates: Story = {
  parameters: {
    storeName: 'loading',
    docs: {
      description: {
        story: 'Demonstrates how loading states are handled in the UI when data is being fetched.',
      },
    },
  },
  render: () => (
    <StoryWrapper storeName="loading">
      <ReduxExample />
    </StoryWrapper>
  ),
};

// Story showing error states
export const ErrorStates: Story = {
  parameters: {
    storeName: 'error',
    docs: {
      description: {
        story: 'Demonstrates how error states are handled in the UI when API requests fail.',
      },
    },
  },
  render: () => (
    <StoryWrapper storeName="error">
      <ReduxExample />
    </StoryWrapper>
  ),
}; 