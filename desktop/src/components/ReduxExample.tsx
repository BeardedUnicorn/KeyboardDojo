import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';

import {
  useAppRedux,
  useGamificationRedux,
  useCurriculumRedux,
  useSettingsRedux,
} from '@hooks/index';

import type { FC } from 'react';

const ReduxExample: FC = () => {
  // App state
  const {
    isLoading: appLoading,
    isOnline,
    showNotification,
  } = useAppRedux();

  // Gamification state
  const {
    level,
    hearts,
    currency,
    streak,
    addXp,
    useHearts: spendHearts,
  } = useGamificationRedux();

  // Curriculum state
  const {
    isLoading: curriculumLoading,
    loadCurriculumData,
  } = useCurriculumRedux();

  // Settings state
  const {
    theme,
    fontSize,
    changeTheme,
  } = useSettingsRedux();

  // Example actions
  const handleAddXP = () => {
    addXp(10, 'example', 'Example XP gain');
    showNotification({
      type: 'success',
      message: 'Earned 10 XP!',
      title: 'XP Gained',
    });
  };

  const handleUseHeart = () => {
    spendHearts(1, 'example');
    showNotification({
      type: 'info',
      message: 'Used 1 heart',
      title: 'Heart Used',
    });
  };

  const handleChangeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
    showNotification({
      type: 'info',
      message: `Theme changed to ${newTheme}`,
      title: 'Theme Changed',
    });
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Redux State Example
      </Typography>

      {(appLoading || curriculumLoading) && (
        <CircularProgress size={24} sx={{ mr: 2 }} />
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">App State</Typography>
        <Typography>Online: {isOnline ? 'Yes' : 'No'}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Gamification State</Typography>
        <Typography>Level: {level}</Typography>
        <Typography>Hearts: {hearts.current}/{hearts.max}</Typography>
        <Typography>Currency: {currency.balance}</Typography>
        <Typography>Current Streak: {streak.currentStreak}</Typography>
        <Box sx={{ mt: 1 }}>
          <Button variant="contained" onClick={handleAddXP} sx={{ mr: 1 }}>
            Add XP
          </Button>
          <Button variant="contained" onClick={handleUseHeart}>
            Use Heart
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Settings State</Typography>
        <Typography>Theme: {theme}</Typography>
        <Typography>Font Size: {fontSize}px</Typography>
        <Box sx={{ mt: 1 }}>
          <Button variant="contained" onClick={handleChangeTheme}>
            Toggle Theme
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6">Curriculum State</Typography>
        <Button variant="contained" onClick={loadCurriculumData}>
          Load Curriculum
        </Button>
      </Box>
    </Paper>
  );
};

export default ReduxExample;
