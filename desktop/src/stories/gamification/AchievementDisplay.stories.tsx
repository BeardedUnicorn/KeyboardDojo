import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Divider, 
  Button, 
  Grid, 
  useTheme,
  Snackbar
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Celebration as CelebrationIcon
} from '@mui/icons-material';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import AchievementBadge from '@/components/gamification/achievements/AchievementBadge';
import AchievementsList from '@/components/gamification/achievements/AchievementsList';
import AchievementNotification from '@/components/gamification/achievements/AchievementNotification';
import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { AchievementRarity } from '@/types/achievements/AchievementRarity';

// Mock Achievement Data
const mockAchievements = [
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 10-day streak',
    category: AchievementCategory.STREAKS,
    xpReward: 250,
    rarity: AchievementRarity.UNCOMMON,
    secret: false,
    icon: 'LocalFireDepartment',
    condition: {
      type: 'daily_streak',
      target: 10,
    },
  },
  {
    id: 'beginner_typist',
    title: 'Beginner Typist',
    description: 'Complete the typing basics lesson',
    category: AchievementCategory.LESSONS,
    xpReward: 100,
    rarity: AchievementRarity.COMMON,
    secret: false,
    icon: 'Keyboard',
    condition: {
      type: 'lessons_completed',
      target: 1,
      specific: 'typing_basics',
    },
  },
  {
    id: 'shortcut_wizard',
    title: 'Shortcut Wizard',
    description: 'Master 25 keyboard shortcuts',
    category: AchievementCategory.SHORTCUTS,
    xpReward: 500,
    rarity: AchievementRarity.RARE,
    secret: false,
    icon: 'Speed',
    condition: {
      type: 'shortcuts_mastered',
      target: 25,
    },
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Get 100% on a challenge',
    category: AchievementCategory.MASTERY,
    xpReward: 350,
    rarity: AchievementRarity.UNCOMMON,
    secret: false,
    icon: 'Star',
    condition: {
      type: 'perfect_score',
      target: 1,
    },
  },
  {
    id: 'keyboard_ninja',
    title: 'Keyboard Ninja',
    description: 'Complete all expert-level challenges',
    category: AchievementCategory.MASTERY,
    xpReward: 1000,
    rarity: AchievementRarity.EPIC,
    secret: false,
    icon: 'EmojiEvents',
    condition: {
      type: 'expert_challenges_completed',
      target: 5,
    },
  },
  {
    id: 'secret_combo',
    title: 'Secret Combination',
    description: 'Discover the hidden shortcut combination',
    category: AchievementCategory.SHORTCUTS,
    xpReward: 750,
    rarity: AchievementRarity.RARE,
    secret: true,
    icon: 'Lock',
    condition: {
      type: 'secret_shortcut',
      target: 1,
    },
  },
];

// Full user progress data with achievements
const mockUserData = {
  userId: 'user123',
  name: 'John Doe',
  avatar: 'https://mui.com/static/images/avatar/1.jpg',
  level: 8,
  xp: 2500,
  totalXp: 5000,
  gems: 350,
  achievements: {
    unlocked: [
      {
        ...mockAchievements[0],
        unlocked: true,
        dateUnlocked: '2023-11-15T10:30:00Z',
      },
      {
        ...mockAchievements[1],
        unlocked: true,
        dateUnlocked: '2023-11-10T14:25:00Z',
      },
      {
        ...mockAchievements[3],
        unlocked: true,
        dateUnlocked: '2023-11-18T09:15:00Z',
      },
    ],
    progress: [
      {
        ...mockAchievements[2],
        unlocked: false,
        progress: 16,
        total: 25,
      },
      {
        ...mockAchievements[4],
        unlocked: false,
        progress: 2,
        total: 5,
      },
    ],
    secret: [
      {
        ...mockAchievements[5],
        unlocked: false,
      },
    ],
  },
  stats: {
    lessonsCompleted: 12,
    shortcutsMastered: 16,
    perfectScores: 3,
    streakDays: 10,
    timeSpent: 15000, // in seconds
  },
};

// Create a mock Redux store with achievement data
const createMockStore = () => {
  return configureStore({
    reducer: {
      achievements: (state = {
        achievements: mockUserData.achievements,
        isLoading: false,
        error: null
      }) => state,
      gamification: (state = {
        userAchievements: mockUserData.achievements
      }) => state
    }
  });
};

interface AchievementDisplayStoryProps {
  showUnlockNotification?: boolean;
  viewMode?: 'grid' | 'list';
  filterCategory?: string;
  showSecrets?: boolean;
  showProgress?: boolean;
}

const AchievementDisplayStory: React.FC<AchievementDisplayStoryProps> = ({
  showUnlockNotification = false,
  viewMode = 'grid',
  filterCategory = 'all',
  showSecrets = true,
  showProgress = true,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(showUnlockNotification);
  const [showingAchievement, setShowingAchievement] = useState(mockAchievements[2]);

  // Create store
  const store = createMockStore();

  // Tab handling
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Notification handling
  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const handleShowNotification = (achievement: any) => {
    setShowingAchievement(achievement);
    setNotificationOpen(true);
  };

  // Filter achievements based on tab
  const getFilteredAchievements = () => {
    switch (activeTab) {
      case 0: // All
        return [
          ...mockUserData.achievements.unlocked,
          ...(showProgress ? mockUserData.achievements.progress : []),
          ...(showSecrets ? mockUserData.achievements.secret : []),
        ];
      case 1: // Unlocked
        return mockUserData.achievements.unlocked;
      case 2: // In Progress
        return mockUserData.achievements.progress;
      case 3: // Secret
        return showSecrets ? mockUserData.achievements.secret : [];
      default:
        return [];
    }
  };

  // Filter by category if specified
  const filteredAchievements = filterCategory === 'all'
    ? getFilteredAchievements()
    : getFilteredAchievements().filter(a => a.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <Provider store={store}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrophyIcon sx={{ fontSize: 32, mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h4">
              Achievements
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph color="text.secondary">
            Track your progress and unlock achievements as you master keyboard skills.
          </Typography>
          
          {/* Tab navigation */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label={`All (${mockUserData.achievements.unlocked.length + mockUserData.achievements.progress.length + (showSecrets ? mockUserData.achievements.secret.length : 0)})`} />
            <Tab label={`Unlocked (${mockUserData.achievements.unlocked.length})`} />
            <Tab label={`In Progress (${mockUserData.achievements.progress.length})`} />
            {showSecrets && <Tab label={`Secret (${mockUserData.achievements.secret.length})`} />}
          </Tabs>
          
          <Divider sx={{ mb: 4 }} />
          
          {/* View toggle for grid/list */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant={viewMode === 'grid' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => {}}
              sx={{ mr: 1 }}
            >
              Grid View
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => {}}
            >
              List View
            </Button>
          </Box>
          
          {/* Achievements display */}
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredAchievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <AchievementBadge
                    achievement={achievement}
                    showProgress={showProgress && 'progress' in achievement}
                    onClick={() => handleShowNotification(achievement)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <AchievementsList
              achievements={filteredAchievements}
              showProgress={showProgress}
              onAchievementClick={handleShowNotification}
            />
          )}
          
          {/* Achievement unlock notification */}
          <Snackbar
            open={notificationOpen}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <div>
              <AchievementNotification
                achievement={showingAchievement}
                onClose={handleCloseNotification}
              />
            </div>
          </Snackbar>
        </Paper>
      </Container>
    </Provider>
  );
};

// Storybook configuration
const meta = {
  title: 'Gamification/AchievementDisplay',
  component: AchievementDisplayStory,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The AchievementDisplay component provides a comprehensive UI for viewing, filtering, and interacting with achievements. It combines AchievementBadge, AchievementsList, and AchievementNotification components to create a cohesive achievement system.',
      },
    },
  },
  argTypes: {
    showUnlockNotification: {
      control: 'boolean',
      description: 'Whether to show an achievement unlock notification on load',
    },
    viewMode: {
      control: 'radio',
      options: ['grid', 'list'],
      description: 'Display achievements in grid or list format',
    },
    filterCategory: {
      control: 'select',
      options: ['all', 'streaks', 'lessons', 'shortcuts', 'mastery', 'general'],
      description: 'Filter achievements by category',
    },
    showSecrets: {
      control: 'boolean',
      description: 'Whether to show secret achievements',
    },
    showProgress: {
      control: 'boolean',
      description: 'Whether to show achievement progress',
    },
  },
} satisfies Meta<typeof AchievementDisplayStory>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default view showing all achievements in a grid
export const DefaultGrid: Story = {
  args: {
    showUnlockNotification: false,
    viewMode: 'grid',
    filterCategory: 'all',
    showSecrets: true,
    showProgress: true,
  },
};

// List view of achievements
export const ListView: Story = {
  args: {
    showUnlockNotification: false,
    viewMode: 'list',
    filterCategory: 'all',
    showSecrets: true,
    showProgress: true,
  },
};

// Show only shortcut-related achievements
export const ShortcutsOnly: Story = {
  args: {
    showUnlockNotification: false,
    viewMode: 'grid',
    filterCategory: 'shortcuts',
    showSecrets: true,
    showProgress: true,
  },
};

// With achievement notification displayed
export const WithNotification: Story = {
  args: {
    showUnlockNotification: true,
    viewMode: 'grid',
    filterCategory: 'all',
    showSecrets: true,
    showProgress: true,
  },
};

// Hide secret achievements
export const NoSecrets: Story = {
  args: {
    showUnlockNotification: false,
    viewMode: 'grid',
    filterCategory: 'all',
    showSecrets: false,
    showProgress: true,
  },
}; 