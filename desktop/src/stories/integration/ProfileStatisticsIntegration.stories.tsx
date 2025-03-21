import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Box, Grid, Paper, Typography, Divider, useTheme } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import UserProfileCard from '@/components/profile/UserProfileCard';
import StatisticsDashboard from '@/components/statistics/StatisticsDashboard';
import CurriculumProgressChart from '@/components/statistics/CurriculumProgressChart';
import PracticeHeatmap from '@/components/statistics/PracticeHeatmap';
import { AchievementBadge, AchievementsList } from '@/components/gamification/achievements';
import { IAchievement } from '@/types/achievements/IAchievement';
import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { AchievementRarity } from '@/types/achievements/AchievementRarity';
import type { IAchievementProgress } from '@/types/achievements/IAchievementProgress';

// Create mock achievements data
const mockAchievements: IAchievement[] = [
  {
    id: 'shortcut_master',
    title: 'Shortcut Master',
    description: 'Mastered 50 keyboard shortcuts',
    icon: 'keyboard',
    rarity: AchievementRarity.RARE,
    category: AchievementCategory.SHORTCUTS,
    xpReward: 100,
    condition: {
      type: 'shortcuts_mastered',
      target: 50,
    },
    secret: false
  },
  {
    id: 'consistent_learner',
    title: 'Consistent Learner',
    description: 'Maintained a 7-day practice streak',
    icon: 'calendar_today',
    rarity: AchievementRarity.UNCOMMON,
    category: AchievementCategory.STREAKS,
    xpReward: 50,
    condition: {
      type: 'maintain_streak',
      target: 7,
    },
    secret: false
  },
  {
    id: 'productivity_booster',
    title: 'Productivity Booster',
    description: 'Completed all IDE Efficiency lessons',
    icon: 'rocket_launch',
    rarity: AchievementRarity.EPIC,
    category: AchievementCategory.LESSONS,
    xpReward: 200,
    condition: {
      type: 'complete_track',
      target: 1,
      trackId: 'ide_efficiency',
    },
    secret: false
  }
];

// Keep track of which achievements are completed for our UI
const completedAchievementIds = ['shortcut_master', 'consistent_learner'];

// Create achievement progress objects for the completedAchievements prop
const achievementProgressList: IAchievementProgress[] = [
  {
    achievement: mockAchievements[0], // shortcut_master
    progress: 1,
    completed: true,
    unlockedAt: new Date().toISOString()
  },
  {
    achievement: mockAchievements[1], // consistent_learner
    progress: 1,
    completed: true,
    unlockedAt: new Date().toISOString()
  },
  {
    achievement: mockAchievements[2], // productivity_booster
    progress: 0.8,
    completed: false
  }
];

// Create mock track progress data
const mockTrackProgress = [
  {
    trackId: 'fundamentals',
    trackName: 'Keyboard Fundamentals',
    progress: 1.0,
    modules: [
      { moduleId: 'basics', moduleName: 'Basics', progress: 1.0 },
      { moduleId: 'navigation', moduleName: 'Navigation', progress: 1.0 }
    ]
  },
  {
    trackId: 'ide',
    trackName: 'IDE Efficiency',
    progress: 0.75,
    modules: [
      { moduleId: 'editing', moduleName: 'Editing', progress: 1.0 },
      { moduleId: 'selection', moduleName: 'Selection', progress: 0.8 },
      { moduleId: 'refactoring', moduleName: 'Refactoring', progress: 0.6 },
      { moduleId: 'debugging', moduleName: 'Debugging', progress: 0.5 }
    ]
  },
  {
    trackId: 'advanced',
    trackName: 'Advanced Techniques',
    progress: 0.3,
    modules: [
      { moduleId: 'macros', moduleName: 'Macros', progress: 0.5 },
      { moduleId: 'automation', moduleName: 'Automation', progress: 0.3 },
      { moduleId: 'customization', moduleName: 'Customization', progress: 0.1 }
    ]
  }
];

// Generate practice data for the heatmap
const generatePracticeData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // More activity in recent weeks, with some streaks and gaps
    let intensity = 0;
    
    if (i < 14) {
      // Last 2 weeks: high activity
      intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
    } else if (i < 30) {
      // Last month: medium activity
      intensity = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0;
    } else if (i < 90) {
      // Last 3 months: lower activity
      intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
    } else {
      // Older: sparse activity
      intensity = Math.random() > 0.9 ? 1 : 0;
    }
    
    if (intensity > 0) {
      data.push({
        date: date.toISOString().split('T')[0],
        count: intensity
      });
    }
  }
  
  return data;
};

// Create a comprehensive mock store for Redux
const mockStore = configureStore({
  reducer: (state = {
    user: {
      isAuthenticated: true,
      username: 'Keyboard Master',
      email: 'master@example.com',
      photoURL: 'https://mui.com/static/images/avatar/4.jpg',
      isLoading: false,
    },
    userProgress: {
      level: 7,
      xp: 3250,
      totalLessonsCompleted: 48,
      streakDays: 14,
      lastActive: new Date().toISOString(),
      progress: mockTrackProgress,
      isLoading: false,
    },
    gamification: {
      level: 7,
      xp: {
        totalXP: 3250,
        currentLevelXP: 750,
        nextLevelXP: 1000,
      },
      currency: {
        balance: 750,
      },
      hearts: {
        current: 5,
        max: 5,
        nextRegeneration: new Date().getTime() + 3600000,
      },
      streak: {
        currentStreak: 14,
        longestStreak: 21,
        lastPracticeDate: new Date().toISOString().split('T')[0],
        freezesAvailable: 2,
      },
      achievements: mockAchievements,
      achievementProgress: achievementProgressList,
      practiceData: generatePracticeData(),
      isLoading: false,
    },
  }) => state,
});

// Setup global mock hooks for component fallbacks
if (typeof window !== 'undefined') {
  window.useUserProgressRedux = () => ({
    progress: {
      level: 7,
      xp: 3250,
      totalLessonsCompleted: 48,
      streakDays: 14,
      lastActive: new Date().toISOString(),
      progress: mockTrackProgress,
    },
    isLoading: false,
  });
  
  window.useXP = () => ({
    level: 7,
    totalXP: 3250,
    currentLevelXP: 750,
    nextLevelXP: 1000,
    progress: 0.75,
    levelTitle: 'Keyboard Master',
    xpHistory: generatePracticeData().map(d => ({ date: d.date, amount: d.count * 25 })),
    levelHistory: [],
  });
  
  // Add mock practice data hook if needed
  window.useGamificationRedux = () => ({
    gamification: {
      practiceData: generatePracticeData(),
      achievements: mockAchievements,
      achievementProgress: achievementProgressList,
      level: 7,
      xp: {
        totalXP: 3250,
        currentLevelXP: 750,
        nextLevelXP: 1000,
      },
    },
    isLoading: false,
  });
  
  window.useAchievementsRedux = () => ({
    achievements: mockAchievements,
    completedAchievements: achievementProgressList.filter(ap => ap.completed),
    isLoading: false,
  });
}

// Integration view showing user profile and statistics dashboard
const ProfileDashboardTemplate = () => {
  const theme = useTheme();
  
  return (
    <Grid container spacing={3}>
      {/* Left Column: Profile and Achievements */}
      <Grid item xs={12} md={4} lg={3}>
        <Box sx={{ mb: 3 }}>
          <UserProfileCard 
            username="Keyboard Master"
            email="master@example.com"
            avatarUrl="https://mui.com/static/images/avatar/4.jpg"
            onEditProfile={() => console.log('Edit profile clicked')}
          />
        </Box>
        
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'background.default', 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>Recent Achievements</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mb: 2 }}>
            {mockAchievements
              .filter(a => completedAchievementIds.includes(a.id))
              .slice(0, 2)
              .map(achievement => (
                <Box key={achievement.id} sx={{ m: 1 }}>
                  <AchievementBadge 
                    achievement={achievement}
                    completed={true}
                    showRarity
                    size="large"
                  />
                </Box>
              ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>Progress</Typography>
          <AchievementsList 
            achievements={mockAchievements}
            completedAchievements={achievementProgressList.filter(ap => ap.completed)}
            showProgress={true}
            showRarity={true}
            showDescription={true}
            size="small"
            showSecret={false}
          />
        </Paper>
      </Grid>
      
      {/* Right Column: Statistics and Progress */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            bgcolor: 'background.default', 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>Your Progress Dashboard</Typography>
          <StatisticsDashboard showDetailedStats={true} />
        </Paper>
        
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                height: '100%',
                bgcolor: 'background.default', 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>Curriculum Progress</Typography>
              <CurriculumProgressChart />
            </Paper>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                height: '100%', 
                bgcolor: 'background.default', 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>Practice Activity</Typography>
              <PracticeHeatmap />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

// Mobile focused view
const MobileProfileTemplate = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ maxWidth: '480px', mx: 'auto' }}>
      <UserProfileCard 
        username="Keyboard Master"
        email="master@example.com"
        avatarUrl="https://mui.com/static/images/avatar/4.jpg"
        onEditProfile={() => console.log('Edit profile clicked')}
      />
      
      <Box sx={{ mt: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'background.default', 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>Key Statistics</Typography>
          <StatisticsDashboard showDetailedStats={false} />
        </Paper>
        
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'background.default', 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>Recent Achievements</Typography>
          <AchievementsList 
            achievements={mockAchievements}
            completedAchievements={achievementProgressList.filter(ap => ap.completed)}
            showProgress={true}
            showRarity={false}
            showDescription={true}
            size="small"
            showSecret={false}
          />
        </Paper>
        
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'background.default', 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>Practice Activity</Typography>
          <PracticeHeatmap />
        </Paper>
      </Box>
    </Box>
  );
};

const meta: Meta = {
  title: 'Integration/ProfileStatisticsIntegration',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstrates how the UserProfileCard integrates with statistics components to provide a complete user dashboard experience.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Story />
          </Box>
        </BrowserRouter>
      </Provider>
    ),
  ],
};

export default meta;

export const DesktopDashboard = {
  render: () => <ProfileDashboardTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive dashboard view showing how the user profile integrates with statistics components.',
      },
    },
  },
};

export const MobileDashboard = {
  render: () => <MobileProfileTemplate />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'A mobile-optimized view of the profile statistics integration.',
      },
    },
  },
}; 