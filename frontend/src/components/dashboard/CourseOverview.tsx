import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  styled, 
  Divider, 
  Button, 
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import { 
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { LessonCard } from '../ui';

// Define course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  track: string;
  icon?: React.ReactNode;
  color?: string;
}

// Define lesson interface
export interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: number; // in minutes
  xpReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  icon?: React.ReactNode;
  tags?: string[];
}

// Define activity interface
export interface Activity {
  id: string;
  type: 'lesson_completed' | 'achievement_earned' | 'streak_milestone' | 'level_up';
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
  icon?: React.ReactNode;
}

// Define props interface
interface CourseOverviewProps {
  course: Course;
  upcomingLessons: Lesson[];
  recentActivities: Activity[];
  onStartLesson: (lessonId: string) => void;
  onViewAllLessons: () => void;
  className?: string;
}

// Styled components
const OverviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const CourseHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

const CourseIcon = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: `${theme.palette.primary.main}20`,
}));

const ProgressStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
}));

const UpcomingLessonsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ActivityIcon = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
}));

const ActivityTimestamp = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
}));

const XpChip = styled(Chip)(({ theme }) => ({
  backgroundColor: `${theme.palette.success.main}20`,
  color: theme.palette.success.main,
  fontWeight: 'bold',
  height: 24,
}));

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Helper function to get activity icon
const getActivityIcon = (activity: Activity): React.ReactNode => {
  if (activity.icon) {
    return activity.icon;
  }
  
  switch (activity.type) {
    case 'lesson_completed':
      return <CheckIcon />;
    case 'achievement_earned':
      return <TrophyIcon />;
    case 'streak_milestone':
      return <TimeIcon />;
    case 'level_up':
      return <StarIcon />;
    default:
      return <CheckIcon />;
  }
};

// CourseOverview component
const CourseOverview: React.FC<CourseOverviewProps> = ({
  course,
  upcomingLessons,
  recentActivities,
  onStartLesson,
  onViewAllLessons,
  className,
}) => {
  const theme = useTheme();
  
  // Calculate progress percentage
  const progressPercentage = Math.round((course.completedLessons / course.totalLessons) * 100);
  
  // Get difficulty color
  const getDifficultyColor = () => {
    switch (course.difficulty) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.warning.main;
      case 'advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <OverviewContainer className={className}>
      {/* Course Header */}
      <CourseHeader>
        <CourseIcon style={{ backgroundColor: course.color || theme.palette.primary.main }}>
          {course.icon || <PlayIcon />}
        </CourseIcon>
        
        <Box sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="center" mb={0.5}>
            <Typography variant="h5" fontWeight="bold">
              {course.title}
            </Typography>
            <Chip 
              label={course.difficulty.toUpperCase()} 
              size="small" 
              sx={{ 
                ml: 1.5, 
                backgroundColor: `${getDifficultyColor()}20`,
                color: getDifficultyColor(),
                fontWeight: 'bold',
              }} 
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {course.description}
          </Typography>
        </Box>
      </CourseHeader>
      
      {/* Progress Section */}
      <ProgressContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" fontWeight="bold">
            Course Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {progressPercentage}% Complete
          </Typography>
        </Box>
        
        <ProgressBar variant="determinate" value={progressPercentage} />
        
        <ProgressStats>
          <Typography variant="body2" color="text.secondary">
            {course.completedLessons} of {course.totalLessons} lessons completed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <TimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            {course.estimatedHours} hours estimated
          </Typography>
        </ProgressStats>
      </ProgressContainer>
      
      <Divider />
      
      {/* Upcoming Lessons Section */}
      <UpcomingLessonsContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SectionTitle variant="h6">
            Upcoming Lessons
          </SectionTitle>
          <Button 
            endIcon={<ArrowIcon />} 
            onClick={onViewAllLessons}
            size="small"
          >
            View All
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {upcomingLessons.map((lesson) => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <LessonCard
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                xp={lesson.xpReward}
                isCompleted={lesson.isCompleted}
                isLocked={lesson.isLocked}
                icon={lesson.icon}
                tags={lesson.tags}
                onClick={() => onStartLesson(lesson.id)}
              />
            </Grid>
          ))}
        </Grid>
      </UpcomingLessonsContainer>
      
      <Divider />
      
      {/* Recent Activity Section */}
      <Box mt={3}>
        <SectionTitle variant="h6">
          Recent Activity
        </SectionTitle>
        
        <List disablePadding>
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} disableGutters>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                <ActivityIcon>
                  {getActivityIcon(activity)}
                </ActivityIcon>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" fontWeight="bold">
                      {activity.title}
                    </Typography>
                    {activity.xpEarned && (
                      <XpChip 
                        size="small" 
                        label={`+${activity.xpEarned} XP`} 
                        icon={<StarIcon fontSize="small" />}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <ActivityTimestamp>
                      {formatDate(activity.timestamp)}
                    </ActivityTimestamp>
                  </Box>
                }
              />
            </ActivityItem>
          ))}
        </List>
      </Box>
    </OverviewContainer>
  );
};

export default CourseOverview; 