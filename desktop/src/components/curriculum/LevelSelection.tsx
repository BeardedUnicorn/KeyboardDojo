import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Flag, Star, MenuBook, EmojiEvents, CheckCircle, Lock, Settings } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { PathNodeType } from '../../types/progress/ICurriculum';
import type { IPath, PathNode, ApplicationType } from '../../types/progress/ICurriculum';
import { useAppSelector } from '../../store';
import { selectUserProgress } from '../../store/slices/userProgressSlice';

// Define the level data type
interface LevelData {
  id: number | string;
  icon: React.ReactNode;
  title: string;
  link: string;
  disabled?: boolean;
  completed?: boolean;
  nodeType?: PathNodeType;
}

// Styled components for MUI
const LevelButton = styled(Button)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  padding: 0,
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 8px rgba(0, 0, 0, 0.3)' 
    : '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'scale(1.15)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
      : '0 8px 15px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    transform: 'scale(0.95) translateY(2px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.15)',
  },
}));

// Path Container to hold buttons and path
const PathContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

// Path SVG to draw the connecting lines
const PathSvg = styled('svg')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 0,
  pointerEvents: 'none',
});

interface LevelButtonContainerProps {
  level: LevelData;
  onClick: (id: string | number, nodeType?: PathNodeType) => void;
  isFirst?: boolean;
  isLast?: boolean;
  isEven: boolean;
  index: number;
}

// The individual level button component
const LevelButtonContainer: React.FC<LevelButtonContainerProps> = ({ 
  level, 
  onClick, 
  isFirst, 
  isLast,
  isEven,
  index,
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        position: 'relative',
        ml: isEven ? '40px' : 0,
        mr: isEven ? 0 : '40px',
        my: 3,
        zIndex: 1,
      }}
      data-level-index={index}
    >
      {/* Button background cover - ensures path is completely hidden */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: theme.palette.background.default,
          zIndex: 1,
        })}
      />
      
      <LevelButton
        onClick={() => !level.disabled && onClick(level.id, level.nodeType)}
        disabled={level.disabled}
        sx={(theme) => ({
          backgroundColor: level.completed 
            ? theme.palette.success.main 
            : level.disabled 
              ? theme.palette.action.disabledBackground 
              : theme.palette.primary.main,
          color: level.disabled 
            ? theme.palette.text.disabled 
            : theme.palette.common.white,
          position: 'relative',
          zIndex: 2,
          '&:hover': {
            backgroundColor: level.completed 
              ? theme.palette.success.light 
              : level.disabled 
                ? theme.palette.action.disabledBackground 
                : theme.palette.primary.light,
          },
        })}
        aria-label={level.title}
      >
        {level.disabled ? <Lock /> : level.icon}
      </LevelButton>
      
      {/* Level title */}
      <Typography 
        variant="subtitle2" 
        sx={(theme) => ({ 
          mt: 1,
          fontWeight: 'bold',
          position: 'relative',
          zIndex: 2,
          backgroundColor: theme.palette.background.default,
          px: 1,
          borderRadius: 1,
          color: level.disabled 
            ? theme.palette.text.disabled 
            : theme.palette.text.primary,
        })}
      >
        {level.title}
      </Typography>
    </Box>
  );
};

interface LevelSelectorProps {
  levels: LevelData[];
  onLevelSelect?: (id: string | number, nodeType?: PathNodeType) => void;
}

// The main level selector component with SVG path
const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, onLevelSelect }) => {
  const handleLevelClick = (id: string | number, nodeType?: PathNodeType) => {
    if (onLevelSelect) {
      onLevelSelect(id, nodeType);
    } else if (typeof id === 'string') {
      // Fallback for direct navigation
      window.location.href = id;
    }
  };

  // Create a ref for the path container
  const pathContainerRef = React.useRef<HTMLDivElement>(null);

  // Calculate path points based on button positions
  const [pathPoints, setPathPoints] = React.useState<Array<{x: number, y: number}>>([]);
  
  React.useEffect(() => {
    if (pathContainerRef.current) {
      const container = pathContainerRef.current;
      const buttons = container.querySelectorAll('[data-level-index]');
      const newPoints: Array<{x: number, y: number}> = [];
      
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate center position relative to the container
        const x = rect.left + rect.width / 2 - containerRect.left;
        const y = rect.top + rect.height / 2 - containerRect.top;
        
        newPoints.push({ x, y });
      });
      
      setPathPoints(newPoints);
    }
  }, [levels]); // Recalculate when levels change

  // Generate SVG path
  const generatePath = () => {
    if (pathPoints.length < 2) return '';
    
    let pathData = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    
    for (let i = 1; i < pathPoints.length; i++) {
      const prevPoint = pathPoints[i - 1];
      const currentPoint = pathPoints[i];
      
      // For a smooth curve between points
      const midY = (prevPoint.y + currentPoint.y) / 2;
      
      pathData += ` C ${prevPoint.x} ${midY}, ${currentPoint.x} ${midY}, ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return pathData;
  };

  return (
    <PathContainer ref={pathContainerRef}>
      {/* SVG Path connecting the buttons */}
      {pathPoints.length > 1 && (
        <PathSvg>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4caf50" /> {/* Success color */}
              <stop offset="100%" stopColor="#3f51b5" /> {/* Primary color */}
            </linearGradient>
          </defs>
          <path 
            d={generatePath()} 
            fill="none" 
            stroke="url(#pathGradient)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            strokeDasharray="0"
          />
        </PathSvg>
      )}
      
      {/* Level buttons */}
      {levels.map((level, index) => (
        <LevelButtonContainer
          key={level.id}
          level={level}
          onClick={handleLevelClick}
          isFirst={index === 0}
          isLast={index === levels.length - 1}
          isEven={index % 2 === 0}
          index={index}
        />
      ))}
    </PathContainer>
  );
};

interface LevelSelectionProps {
  path?: IPath | null;
  onSelectNode?: (trackId: ApplicationType, nodeId: string, nodeType: PathNodeType) => void;
}

// Main component with path data handling
const LevelSelection: React.FC<LevelSelectionProps> = ({ path, onSelectNode }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const userProgress = useAppSelector(selectUserProgress);
  const { completedLessons } = userProgress;

  // Convert path data to level data if provided
  const getLevelsFromPath = (): LevelData[] => {
    // Return empty array if path is null or undefined
    if (!path) {
      return [];
    }

    // Convert path nodes to level data
    return path.nodes.map((node, index) => {
      const isCompleted = completedLessons.some((lesson) => lesson.lessonId === node.id);
      
      // Determine if node is locked
      const isLocked = determineIfNodeIsLocked(node);
      
      // Map node type to icon
      let icon = <MenuBook />;
      switch(node.type) {
        case PathNodeType.CHECKPOINT:
          icon = <Flag />;
          break;
        case PathNodeType.CHALLENGE:
          icon = <EmojiEvents />;
          break;
        case PathNodeType.LESSON:
        default:
          icon = isCompleted ? <CheckCircle /> : <MenuBook />;
      }

      return {
        id: node.id,
        icon,
        title: node.title || `Level ${index + 1}`,
        link: `/lesson/${path.trackId}/${node.id}`,
        disabled: isLocked,
        completed: isCompleted,
        nodeType: node.type as PathNodeType,
      };
    });
  };

  // Determine if a node should be locked
  const determineIfNodeIsLocked = (node: PathNode): boolean => {
    // Simple logic - if node has unlockRequirements, check if prerequisites are completed
    if (node.unlockRequirements?.previousNodes?.length) {
      return !node.unlockRequirements.previousNodes.every(
        (prevId) => completedLessons.some((lesson) => lesson.lessonId === prevId),
      );
    }
    return false;
  };

  // Add useEffect to reset selectedLevel when path changes
  React.useEffect(() => {
    setSelectedLevel(null);
  }, [path?.trackId]);

  const handleLevelSelect = (id: string | number, nodeType: PathNodeType = PathNodeType.LESSON) => {
    setSelectedLevel(String(id));
    
    // If onSelectNode prop is provided, use it
    if (onSelectNode && path && path.trackId) {
      onSelectNode(path.trackId, String(id), nodeType);
    }
  };

  // Get levels from path or use sample data
  const levels = React.useMemo(() => getLevelsFromPath(), [path, completedLessons]);

  return (
    <Paper 
      elevation={3} 
      sx={(theme) => ({ 
        p: 4, 
        borderRadius: 2, 
        bgcolor: theme.palette.background.default,
        maxWidth: 600, 
        mx: 'auto',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 16px rgba(0, 0, 0, 0.4)'
            : '0 8px 16px rgba(0, 0, 0, 0.1)',
        },
      })}
    >
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        {path?.title || 'Keyboard Shortcuts Learning Path'}
      </Typography>
      
      <LevelSelector 
        key={`path-${path?.trackId}`} 
        levels={levels} 
        onLevelSelect={handleLevelSelect} 
      />
      
      {selectedLevel && !onSelectNode && (
        <Paper 
          elevation={1} 
          sx={(theme) => ({ 
            mt: 3, 
            p: 2, 
            bgcolor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
          })}
        >
          <Typography>
            Selected level: <Box component="span" sx={(theme) => ({ 
              color: theme.palette.primary.main, 
              fontWeight: 'medium',
            })}>
              {selectedLevel}
            </Box>
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default LevelSelection;
