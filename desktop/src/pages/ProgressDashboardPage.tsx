import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';

import CurriculumProgressChart from '../components/CurriculumProgressChart';
import MainLayout from '../components/MainLayout';
import PracticeHeatmap from '../components/PracticeHeatmap';
import StatisticsDashboard from '../components/StatisticsDashboard';

import type { FC, ReactNode , SyntheticEvent } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `progress-tab-${index}`,
    'aria-controls': `progress-tabpanel-${index}`,
  };
};

/**
 * Progress Dashboard Page
 * Displays various visualizations of user progress
 */
const ProgressDashboardPage: FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Progress Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Track your learning journey and see your progress over time.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="progress dashboard tabs"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: theme.palette.background.default,
            }}
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Curriculum Progress" {...a11yProps(1)} />
            <Tab label="Practice Activity" {...a11yProps(2)} />
            <Tab label="Detailed Stats" {...a11yProps(3)} />
          </Tabs>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Your Statistics
                </Typography>
                <StatisticsDashboard showDetailedStats={false} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Curriculum Progress
                </Typography>
                <CurriculumProgressChart showDetails={false} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Recent Practice Activity
                </Typography>
                <PracticeHeatmap weeks={8} />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Curriculum Progress Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" component="h2" gutterBottom>
              Curriculum Progress
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Track your progress through each learning track and module.
            </Typography>
            <CurriculumProgressChart showDetails />
          </TabPanel>

          {/* Practice Activity Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" component="h2" gutterBottom>
              Practice Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              View your practice session history and activity patterns.
            </Typography>
            <PracticeHeatmap weeks={16} />

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Your most active days are highlighted in darker colors. Hover over each day to see details.
              </Typography>
            </Box>
          </TabPanel>

          {/* Detailed Stats Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" component="h2" gutterBottom>
              Detailed Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Dive deeper into your learning metrics and performance statistics.
            </Typography>
            <StatisticsDashboard showDetailedStats />
          </TabPanel>
        </Paper>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Keep up the good work!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Regular practice is key to mastering keyboard shortcuts. 
            Try to maintain your streak and practice a little each day.`}
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ProgressDashboardPage;
