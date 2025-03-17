import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  styled, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import CourseOverview from './CourseOverview';
import DailyTip from './DailyTip';
import DashboardMascot from './DashboardMascot';
import LessonSelection from './LessonSelection';
import { StatsDisplay } from '../ui';
import { Course, Lesson, Activity } from './CourseOverview';
import { Tip } from './DailyTip';
import { MascotContext } from './DashboardMascot';
import { Track, LessonItem } from './LessonSelection';
import { UserStats } from '../ui/StatsDisplay';

// Define props interface
interface DashboardProps {
  userName: string;
  userStats: UserStats;
  courses: Course[];
  lessons: LessonItem[];
  tracks: Track[];
  activities: Activity[];
  tips: Tip[];
  onLessonSelect: (lessonId: string) => void;
  onViewAllLessons: () => void;
  className?: string;
}

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const MascotContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

// Dashboard component
const Dashboard: React.FC<DashboardProps> = ({
  userName,
  userStats,
  courses,
  lessons,
  tracks,
  activities,
  tips,
  onLessonSelect,
  onViewAllLessons,
  className,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for mascot context
  const [mascotContext, setMascotContext] = useState<MascotContext>('welcome');
  
  // Get active course (first course for demo)
  const activeCourse = courses[0];
  
  // Get upcoming lessons (first 3 unlocked lessons)
  const upcomingLessons = lessons
    .filter(lesson => !lesson.isLocked && !lesson.isCompleted)
    .slice(0, 3)
    .map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      courseId: lesson.trackId,
      duration: lesson.duration,
      xpReward: lesson.xp,
      isCompleted: lesson.isCompleted,
      isLocked: lesson.isLocked,
      icon: lesson.icon,
      tags: lesson.tags,
    })) as Lesson[];
  
  // Get recent activities (first 5)
  const recentActivities = activities.slice(0, 5);
  
  // Handle mascot click
  const handleMascotClick = () => {
    // Cycle through contexts for demo
    const contexts: MascotContext[] = ['welcome', 'streak', 'progress', 'new_lesson', 'idle'];
    const currentIndex = contexts.indexOf(mascotContext);
    const nextIndex = (currentIndex + 1) % contexts.length;
    setMascotContext(contexts[nextIndex]);
  };
  
  return (
    <DashboardContainer className={className}>
      <Container maxWidth="xl">
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {userName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continue your keyboard mastery journey
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Main content - left side */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Course overview */}
              <Grid item xs={12}>
                <CourseOverview
                  course={activeCourse}
                  upcomingLessons={upcomingLessons}
                  recentActivities={recentActivities}
                  onStartLesson={onLessonSelect}
                  onViewAllLessons={onViewAllLessons}
                />
              </Grid>
              
              {/* Stats display (mobile/tablet only) */}
              {isTablet && (
                <Grid item xs={12}>
                  <StatsDisplay 
                    stats={userStats}
                    mode="compact"
                    showAchievements={false}
                  />
                </Grid>
              )}
              
              {/* Daily tip (mobile/tablet only) */}
              {isTablet && (
                <Grid item xs={12}>
                  <DailyTip tips={tips} />
                </Grid>
              )}
              
              {/* Lesson selection */}
              <Grid item xs={12}>
                <SectionTitle variant="h5">
                  Continue Learning
                </SectionTitle>
                <LessonSelection
                  tracks={tracks}
                  lessons={lessons}
                  onLessonSelect={onLessonSelect}
                />
              </Grid>
            </Grid>
          </Grid>
          
          {/* Sidebar - right side (desktop only) */}
          <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid container spacing={3}>
              {/* User stats */}
              <Grid item xs={12}>
                <StatsDisplay 
                  stats={userStats}
                  mode="detailed"
                  showAchievements={true}
                  maxAchievements={3}
                />
              </Grid>
              
              {/* Daily tip */}
              <Grid item xs={12}>
                <DailyTip tips={tips} />
              </Grid>
              
              {/* Mascot */}
              <Grid item xs={12}>
                <MascotContainer>
                  <DashboardMascot
                    context={mascotContext}
                    userStreak={userStats.streak}
                    userName={userName}
                    completedLessons={userStats.lessonsCompleted}
                    totalLessons={lessons.length}
                    onMascotClick={handleMascotClick}
                  />
                </MascotContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard; 