import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Collapse, 
  Chip,
  Button,
  Divider,
  Grid,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  PlayArrow as PlayArrowIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { 
  ApplicationTrack, 
  ApplicationType, 
  Module, 
  Lesson, 
  DifficultyLevel 
} from '../types/curriculum';
import { curriculumService } from '../services/curriculumService';

interface CurriculumViewProps {
  onSelectLesson?: (trackId: ApplicationType, moduleId: string, lessonId: string) => void;
  onSelectChallenge?: (trackId: ApplicationType, challengeId: string) => void;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({
  onSelectLesson,
  onSelectChallenge,
}) => {
  const theme = useTheme();
  const [selectedTrack, setSelectedTrack] = useState<ApplicationType>('vscode');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [tracks, setTracks] = useState<ApplicationTrack[]>([]);
  
  // Load tracks on component mount
  useEffect(() => {
    const loadedTracks = curriculumService.getApplicationTracks();
    setTracks(loadedTracks);
    
    // Expand the first module by default
    if (loadedTracks.length > 0 && loadedTracks[0].modules.length > 0) {
      setExpandedModules([loadedTracks[0].modules[0].id]);
    }
  }, []);
  
  // Get the current track
  const currentTrack = tracks.find(track => track.id === selectedTrack);
  
  // Handle track change
  const handleTrackChange = (_event: React.SyntheticEvent, newValue: ApplicationType) => {
    setSelectedTrack(newValue);
    
    // Expand the first module of the new track by default
    const track = tracks.find(t => t.id === newValue);
    if (track && track.modules.length > 0) {
      setExpandedModules([track.modules[0].id]);
    } else {
      setExpandedModules([]);
    }
  };
  
  // Handle module expansion toggle
  const handleModuleToggle = (moduleId: string) => {
    setExpandedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };
  
  // Handle lesson selection
  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    if (onSelectLesson) {
      onSelectLesson(selectedTrack, moduleId, lessonId);
    }
  };
  
  // Handle challenge selection
  const handleChallengeSelect = (challengeId: string) => {
    if (onSelectChallenge) {
      onSelectChallenge(selectedTrack, challengeId);
    }
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.warning.main;
      case 'advanced':
        return theme.palette.error.main;
      case 'expert':
        return theme.palette.error.dark;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Get application-specific styling
  const getApplicationStyle = (application: ApplicationType) => {
    switch (application) {
      case 'vscode':
        return {
          color: '#0078D7',
          backgroundColor: '#0078D722',
          icon: '🔵'
        };
      case 'intellij':
        return {
          color: '#FC801D',
          backgroundColor: '#FC801D22',
          icon: '🟠'
        };
      case 'cursor':
        return {
          color: '#9B57B6',
          backgroundColor: '#9B57B622',
          icon: '🟣'
        };
      default:
        return {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.main + '22',
          icon: '⌨️'
        };
    }
  };
  
  // Check if a module is unlocked
  const isModuleUnlocked = (moduleId: string): boolean => {
    return curriculumService.isModuleUnlocked(selectedTrack, moduleId);
  };
  
  // Check if a lesson is unlocked
  const isLessonUnlocked = (moduleId: string, lessonId: string): boolean => {
    return curriculumService.isLessonUnlocked(selectedTrack, moduleId, lessonId);
  };
  
  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: string): boolean => {
    const userProgress = curriculumService.getUserProgress();
    if (!userProgress) return false;
    
    return userProgress.completedLessons.some(cl => cl.lessonId === lessonId);
  };
  
  // Get lesson progress
  const getLessonProgress = (lessonId: string): number => {
    const userProgress = curriculumService.getUserProgress();
    if (!userProgress) return 0;
    
    const currentLesson = userProgress.currentLessons.find(cl => cl.lessonId === lessonId);
    return currentLesson ? currentLesson.progress : 0;
  };
  
  // Render module
  const renderModule = (module: Module) => {
    const isUnlocked = isModuleUnlocked(module.id);
    const isExpanded = expandedModules.includes(module.id);
    const appStyle = getApplicationStyle(selectedTrack);
    
    return (
      <Box key={module.id} sx={{ mb: 2 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            overflow: 'hidden',
            opacity: isUnlocked ? 1 : 0.7,
            border: '1px solid',
            borderColor: isUnlocked ? appStyle.color : theme.palette.divider,
          }}
        >
          {/* Module header */}
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: isUnlocked ? appStyle.backgroundColor : theme.palette.action.disabledBackground,
              cursor: 'pointer',
            }}
            onClick={() => handleModuleToggle(module.id)}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                {!isUnlocked && <LockIcon sx={{ mr: 1, fontSize: 20 }} />}
                {module.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {module.description}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={module.difficulty} 
                size="small" 
                sx={{ 
                  mr: 2,
                  backgroundColor: getDifficultyColor(module.difficulty) + '22',
                  color: getDifficultyColor(module.difficulty),
                  fontWeight: 'bold',
                }} 
              />
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box>
          
          {/* Module content */}
          <Collapse in={isExpanded && isUnlocked}>
            <Divider />
            <List disablePadding>
              {module.lessons.map((lesson, index) => {
                const lessonUnlocked = isLessonUnlocked(module.id, lesson.id);
                const lessonCompleted = isLessonCompleted(lesson.id);
                const lessonProgress = getLessonProgress(lesson.id);
                
                return (
                  <ListItem 
                    key={lesson.id}
                    sx={{ 
                      pl: 4,
                      pr: 2,
                      py: 1.5,
                      opacity: lessonUnlocked ? 1 : 0.7,
                      backgroundColor: index % 2 === 0 ? 'transparent' : theme.palette.action.hover,
                      '&:hover': {
                        backgroundColor: lessonUnlocked ? theme.palette.action.selected : undefined,
                      },
                      cursor: lessonUnlocked ? 'pointer' : 'default',
                    }}
                    onClick={() => lessonUnlocked && handleLessonSelect(module.id, lesson.id)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {lessonCompleted ? (
                        <CheckCircleIcon color="success" />
                      ) : !lessonUnlocked ? (
                        <LockIcon color="disabled" />
                      ) : (
                        <SchoolIcon color="primary" />
                      )}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: lessonCompleted ? 'bold' : 'normal' }}>
                          {lesson.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {lesson.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip 
                              label={`${lesson.shortcuts.length} shortcuts`} 
                              size="small" 
                              sx={{ mr: 1, fontSize: '0.7rem' }} 
                            />
                            <Chip 
                              label={`${lesson.estimatedTime} min`} 
                              size="small" 
                              sx={{ mr: 1, fontSize: '0.7rem' }} 
                            />
                            <Chip 
                              label={`${lesson.xpReward} XP`} 
                              size="small" 
                              sx={{ fontSize: '0.7rem' }} 
                            />
                          </Box>
                        </Box>
                      }
                    />
                    
                    {lessonUnlocked && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLessonSelect(module.id, lesson.id);
                        }}
                        sx={{ ml: 2 }}
                      >
                        {lessonCompleted ? 'Review' : lessonProgress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
          
          {/* Locked module message */}
          {!isUnlocked && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Complete previous modules to unlock this content.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };
  
  // Render mastery challenges
  const renderMasteryChallenges = () => {
    const challenges = curriculumService.getMasteryChallenges(selectedTrack);
    
    if (challenges.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No mastery challenges available yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Complete more lessons to unlock challenges.
          </Typography>
        </Paper>
      );
    }
    
    return (
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <TrophyIcon sx={{ mr: 1 }} color="primary" />
          Mastery Challenges
        </Typography>
        
        <List>
          {challenges.map(challenge => {
            const isUnlocked = curriculumService.isMasteryChallengeUnlocked(selectedTrack, challenge.id);
            
            return (
              <ListItem 
                key={challenge.id}
                sx={{ 
                  opacity: isUnlocked ? 1 : 0.7,
                  '&:hover': {
                    backgroundColor: isUnlocked ? theme.palette.action.hover : undefined,
                  },
                  cursor: isUnlocked ? 'pointer' : 'default',
                }}
                onClick={() => isUnlocked && handleChallengeSelect(challenge.id)}
              >
                <ListItemIcon>
                  {isUnlocked ? (
                    <TrophyIcon color="primary" />
                  ) : (
                    <LockIcon color="disabled" />
                  )}
                </ListItemIcon>
                
                <ListItemText
                  primary={challenge.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {challenge.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Chip 
                          label={`${challenge.shortcuts.length} shortcuts`} 
                          size="small" 
                          sx={{ mr: 1, fontSize: '0.7rem' }} 
                        />
                        <Chip 
                          label={`${challenge.timeLimit / 60} min`} 
                          size="small" 
                          sx={{ mr: 1, fontSize: '0.7rem' }} 
                        />
                        <Chip 
                          label={`${challenge.xpReward} XP`} 
                          size="small" 
                          sx={{ fontSize: '0.7rem' }} 
                        />
                      </Box>
                    </Box>
                  }
                />
                
                {isUnlocked && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<PlayArrowIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChallengeSelect(challenge.id);
                    }}
                  >
                    Start Challenge
                  </Button>
                )}
              </ListItem>
            );
          })}
        </List>
      </Paper>
    );
  };
  
  return (
    <Box>
      {/* Track tabs */}
      <Tabs
        value={selectedTrack}
        onChange={handleTrackChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        {tracks.map(track => {
          const appStyle = getApplicationStyle(track.id);
          
          return (
            <Tab 
              key={track.id}
              value={track.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 1 }}>{appStyle.icon}</Typography>
                  {track.name}
                </Box>
              }
              sx={{ 
                color: track.id === selectedTrack ? appStyle.color : undefined,
                '&.Mui-selected': {
                  color: appStyle.color,
                },
              }}
            />
          );
        })}
      </Tabs>
      
      {/* Track description */}
      {currentTrack && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {currentTrack.name} Shortcuts
          </Typography>
          <Typography variant="body1">
            {currentTrack.description}
          </Typography>
        </Paper>
      )}
      
      {/* Modules */}
      {currentTrack?.modules.map(renderModule)}
      
      {/* Mastery challenges */}
      {renderMasteryChallenges()}
    </Box>
  );
};

export default CurriculumView; 