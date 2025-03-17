import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  styled, 
  Chip, 
  Button,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  AccessTime as TimeIcon,
  Star as StarIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';

// Define props interface
export interface LessonCardProps {
  title: string;
  description: string;
  duration: number; // in minutes
  xp: number;
  isCompleted: boolean;
  isLocked: boolean;
  icon?: React.ReactNode;
  tags?: string[];
  onClick: () => void;
  className?: string;
}

// Styled components
const CardContainer = styled(Paper, {
  shouldForwardProp: (prop) => 
    prop !== 'isCompleted' && prop !== 'isLocked',
})<{ isCompleted: boolean; isLocked: boolean }>(({ theme, isCompleted, isLocked }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: isLocked ? 'not-allowed' : 'pointer',
  opacity: isLocked ? 0.7 : 1,
  '&:hover': {
    boxShadow: isLocked ? theme.shadows[1] : theme.shadows[3],
    transform: isLocked ? 'none' : 'translateY(-2px)',
  },
  '&::after': isCompleted ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    backgroundColor: theme.palette.success.main,
  } : {},
}));

const LessonIcon = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(1.5),
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const TagChip = styled(Chip)({
  height: 24,
  fontSize: '0.7rem',
  backgroundColor: `rgba(25, 118, 210, 0.1)`,
  color: '#1976d2',
});

const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  marginRight: theme.spacing(2),
  '& svg': {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
  },
}));

const StatusOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLocked',
})<{ isLocked: boolean }>(({ theme, isLocked }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: isLocked ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  zIndex: 1,
}));

// Helper function to format duration
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// LessonCard component
const LessonCard: React.FC<LessonCardProps> = ({
  title,
  description,
  duration,
  xp,
  isCompleted,
  isLocked,
  icon,
  tags,
  onClick,
  className,
}) => {
  // Handle click
  const handleClick = () => {
    if (!isLocked) {
      onClick();
    }
  };
  
  return (
    <CardContainer 
      isCompleted={isCompleted} 
      isLocked={isLocked} 
      className={className}
      onClick={handleClick}
    >
      {/* Status overlay for locked lessons */}
      <StatusOverlay isLocked={isLocked}>
        <Tooltip title="Complete previous lessons to unlock">
          <LockIcon fontSize="large" color="action" />
        </Tooltip>
      </StatusOverlay>
      
      {/* Card content */}
      <Box display="flex" alignItems="flex-start" mb={1.5} sx={{ zIndex: 2 }}>
        <LessonIcon>
          {icon || <PlayIcon />}
        </LessonIcon>
        
        <Box sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {title}
            </Typography>
            {isCompleted && (
              <Tooltip title="Completed">
                <CheckIcon color="success" fontSize="small" sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}>
            {description}
          </Typography>
        </Box>
      </Box>
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <TagsContainer>
          {tags.map((tag, index) => (
            <TagChip key={index} label={tag} size="small" />
          ))}
        </TagsContainer>
      )}
      
      {/* Spacer to push button to bottom */}
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Metadata and action */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Box display="flex">
          <MetaItem>
            <TimeIcon />
            {formatDuration(duration)}
          </MetaItem>
          <MetaItem>
            <StarIcon />
            {xp} XP
          </MetaItem>
        </Box>
        
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          disabled={isLocked}
          onClick={handleClick}
          sx={{ minWidth: 'auto', px: 1.5 }}
        >
          {isCompleted ? 'Review' : 'Start'}
        </Button>
      </Box>
    </CardContainer>
  );
};

export default LessonCard; 