import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { useLogger } from '@/services';
import { useAppSelector } from '@/store';
import { AchievementCategory } from '@/types/achievements/AchievementCategory';
import { selectAchievements, selectCompletedAchievements } from '@store/slices';

import { storageService } from '../../../shared/src/utils';
import { LevelProgressBar, StreakDisplay } from '../components';
import { AchievementBadge } from '../components/gamification/achievements';
import { selectXp, selectLevel, selectStreakDays } from '../store/slices/userProgressSlice';

import type { ReactNode , SyntheticEvent } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  practiceCount: number;
  totalTime: number;
  averageWpm: number;
  highestWpm: number;
  averageAccuracy: number;
  level: number;
  experience: number;
  nextLevelExperience: number;
}

const defaultProfile: UserProfile = {
  name: 'Keyboard Ninja',
  email: 'user@example.com',
  joinDate: new Date().toISOString(),
  practiceCount: 42,
  totalTime: 3600 * 8, // 8 hours in seconds
  averageWpm: 65,
  highestWpm: 85,
  averageAccuracy: 96.5,
  level: 5,
  experience: 2500,
  nextLevelExperience: 3000,
};

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'achievements' ? 2 : 0;

  const [tabValue, setTabValue] = useState(initialTab);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  const xp = useAppSelector(selectXp);
  const level = useAppSelector(selectLevel);
  const streakDays = useAppSelector(selectStreakDays);
  const achievements = useAppSelector(selectAchievements);
  const completedAchievements = useAppSelector(selectCompletedAchievements);
  const logger = useLogger('ProfilePage');

  useEffect(() => {
    logger.component('mount');

    const loadProfile = async () => {
      try {
        setIsLoading(true);

        // Load profile data
        const savedProfile = await storageService.getItem<UserProfile>('profile');
        if (savedProfile) {
          setProfile(savedProfile);
        }
      } catch (error) {
        logger.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      logger.component('unmount');
    };
  }, []);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format seconds to hours and minutes
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Update achievement filtering
  const achievementStats = {
    total: completedAchievements.length,
    lessons: completedAchievements.filter((a) => a.achievement.category === AchievementCategory.LESSONS).length,
    shortcuts: completedAchievements.filter((a) => a.achievement.category === AchievementCategory.SHORTCUTS).length,
    streaks: completedAchievements.filter((a) => a.achievement.category === AchievementCategory.STREAKS).length,
    mastery: completedAchievements.filter((a) => a.achievement.category === AchievementCategory.MASTERY).length,
  };

  // Update the category comparisons
  const recentLessonAchievements = completedAchievements
    .filter((a) => a.achievement.category === AchievementCategory.LESSONS)
    .slice(0, 3);

  const recentStreakAchievements = completedAchievements
    .filter((a) => a.achievement.category === AchievementCategory.STREAKS)
    .slice(0, 3);

  // Update achievement filtering
  const practiceAchievements = achievements.filter(
    (a) => a.category === AchievementCategory.LESSONS,
  );

  const streakAchievements = achievements.filter(
    (a) => a.category === AchievementCategory.STREAKS,
  );

  // Achievements tab
  const renderAchievementsTab = () => {
    const filteredAchievements = achievements.filter((a) =>
      a.category === (tabValue === 0 ? AchievementCategory.LESSONS : AchievementCategory.STREAKS),
    );

    // Calculate achievement statistics
    const totalAchievements = filteredAchievements.length;
    const totalCompleted = completedAchievements.length;
    const percentComplete = totalAchievements > 0 ? (totalCompleted / totalAchievements) * 100 : 0;

    // Calculate next milestone
    const milestones = [5, 10, 25, 50, 100];
    let nextMilestone = totalAchievements;
    let milestoneProgress = 100;

    for (const milestone of milestones) {
      if (totalCompleted < milestone) {
        nextMilestone = milestone;
        milestoneProgress = (totalCompleted / milestone) * 100;
        break;
      }
    }

    // Get rarest achievements (legendary, epic, rare)
    const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
    const rarestAchievements = [...completedAchievements]
      .sort((a, b) => {
        const rarityA = rarityOrder.indexOf(a.achievement.rarity || 'common');
        const rarityB = rarityOrder.indexOf(b.achievement.rarity || 'common');
        return rarityA - rarityB;
      })
      .slice(0, 3);

    // Get most recent achievements
    const recentAchievements = [...completedAchievements]
      .sort((a, b) => {
        const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
        const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Your Achievements
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" paragraph>
            You've unlocked {totalCompleted} achievements. Keep practicing to unlock more!
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1, minWidth: 100 }}>
              Progress:
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={percentComplete}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="body2" sx={{ ml: 1, minWidth: 70 }}>
              {totalCompleted}/{totalAchievements}
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Next Achievement Milestone: {nextMilestone} Achievements
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={milestoneProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {totalCompleted}/{nextMilestone}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {nextMilestone - totalCompleted} more to go!
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Lessons
              </Typography>
              <Typography variant="h5" fontWeight="medium">
                {completedAchievements.filter((a) => a.achievement.category === AchievementCategory.LESSONS).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                achievements
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Streaks
              </Typography>
              <Typography variant="h5" fontWeight="medium">
                {completedAchievements.filter((a) => a.achievement.category === AchievementCategory.STREAKS).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                achievements
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Mastery
              </Typography>
              <Typography variant="h5" fontWeight="medium">
                {completedAchievements.filter((a) => a.achievement.category === AchievementCategory.MASTERY).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                achievements
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total XP from Achievements
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {completedAchievements.reduce((sum, a) => sum + (a.achievement.xpReward || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                XP earned
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/achievements')}
          >
            View All Achievements
          </Button>

          {rarestAchievements.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              You've unlocked {completedAchievements.filter((a) => a.achievement.rarity === 'legendary').length} legendary achievements!
            </Typography>
          )}
        </Box>

        {rarestAchievements.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Your Rarest Achievements
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {rarestAchievements.map(({ achievement }) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card sx={{
                    borderTop: '4px solid',
                    borderColor: 'primary.main',
                    boxShadow: 2,
                  }}>
                    <CardContent>
                      <AchievementBadge
                        achievement={achievement}
                        showDescription
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Typography variant="h6" gutterBottom>
          Recent Achievements
        </Typography>

        <Grid container spacing={2}>
          {recentLessonAchievements.map(({ achievement }) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card>
                <CardContent>
                  <AchievementBadge
                    achievement={achievement}
                    showDescription
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}

          {recentStreakAchievements.map(({ achievement }) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card>
                <CardContent>
                  <AchievementBadge
                    achievement={achievement}
                    showDescription
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}

          {completedAchievements.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                You haven't unlocked any achievements yet. Start practicing to earn some!
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontSize: 40,
            }}
          >
            {profile.name.charAt(0)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">{profile.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {new Date(profile.joinDate).toLocaleDateString()}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <LevelProgressBar compact />
            </Box>
          </Box>

          <Box>
            <StreakDisplay compact />
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<PersonIcon />} label="ProfilePage" />
          <Tab icon={<BarChartIcon />} label="Statistics" />
          <Tab icon={<EmojiEventsIcon />} label="Achievements" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={profile.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={profile.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Member Since"
                        secondary={new Date(profile.joinDate).toLocaleDateString()}
                      />
                    </ListItem>
                  </List>

                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Edit ProfilePage
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SpeedIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Average Speed"
                        secondary={`${profile.averageWpm} WPM`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Average Accuracy"
                        secondary={`${profile.averageAccuracy}%`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Total Practice Time"
                        secondary={formatTime(profile.totalTime)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Typing Performance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Average Speed
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4" color="primary" mr={2}>
                        {profile.averageWpm}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Words Per Minute
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Highest Speed
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4" color="secondary" mr={2}>
                        {profile.highestWpm}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Words Per Minute
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Average Accuracy
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="h4"
                        color={profile.averageAccuracy > 95 ? 'success.main' : 'warning.main'}
                        mr={2}
                      >
                        {profile.averageAccuracy}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Practice Activity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Total Practice Sessions
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {profile.practiceCount}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Total Practice Time
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {formatTime(profile.totalTime)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderAchievementsTab()}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
