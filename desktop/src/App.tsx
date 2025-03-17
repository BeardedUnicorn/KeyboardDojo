import { CssBaseline, Box } from '@mui/material';
import MainLayout from './components/MainLayout';
import { UserProgressProvider } from './contexts/UserProgressContext';
import { AchievementsProvider } from './contexts/AchievementsContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes';

const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <UserProgressProvider>
        <AchievementsProvider>
          <SubscriptionProvider>
            <Box sx={{ position: 'relative' }}>
              <MainLayout>
                <AppRoutes />
              </MainLayout>
            </Box>
          </SubscriptionProvider>
        </AchievementsProvider>
      </UserProgressProvider>
    </ThemeProvider>
  );
};

export default App; 