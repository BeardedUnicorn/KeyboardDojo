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
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { 
  ApplicationTrack, 
  ApplicationType, 
  Module, 
  Lesson, 
  DifficultyLevel,
  CurriculumMetadata
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
  const [curriculums, setCurriculums] = useState<CurriculumMetadata[]>([]);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>('');
  
  // Load curriculums and tracks on component mount
  useEffect(() => {
    // Get all available curriculums
    const availableCurriculums = curriculumService.getCurriculumMetadata();
    setCurriculums(availableCurriculums);
    
    // Set the active curriculum as the selected one
    const activeCurriculum = curriculumService.getActiveCurriculum();
    setSelectedCurriculumId(activeCurriculum.id);
    
    // Load tracks for the active curriculum
    const loadedTracks = curriculumService.getApplicationTracks();
    setTracks(loadedTracks);
    
    // Expand the first module by default
    if (loadedTracks.length > 0 && loadedTracks[0].modules.length > 0) {
      setExpandedModules([loadedTracks[0].modules[0].id]);
    }
  }, []);
  
  // Get the current track
  const currentTrack = tracks.find(track => track.id === selectedTrack);
  
  // Handle curriculum change
  const handleCurriculumChange = (event: SelectChangeEvent<string>) => {
    const curriculumId = event.target.value;
    setSelectedCurriculumId(curriculumId);
    
    // Set the active curriculum in the service
    curriculumService.setActiveCurriculum(curriculumId);
    
    // Load tracks for the selected curriculum
    const loadedTracks = curriculumService.getApplicationTracks();
    setTracks(loadedTracks);
    
    // Reset selected track to the first one if available
    if (loadedTracks.length > 0) {
      setSelectedTrack(loadedTracks[0].id);
      
      // Expand the first module by default
      if (loadedTracks[0].modules.length > 0) {
        setExpandedModules([loadedTracks[0].modules[0].id]);
      } else {
        setExpandedModules([]);
      }
    }
  };
  
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
              cursor: 'pointer',
              backgroundColor: isExpanded ? appStyle.backgroundColor : 'transparent',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: appStyle.backgroundColor,
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={() => handleModuleToggle(module.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1, color: appStyle.color }} />
              <Box>
                <Typography variant="h6" component="div">
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.lessons.length} lessons • {module.difficulty}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isUnlocked && (
                <LockIcon sx={{ mr: 1, color: theme.palette.text.disabled }} />
              )}
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box>
          
          {/* Module content */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" paragraph>
                {module.description}
              </Typography>
              
              <Chip 
                label={module.difficulty} 
                size="small" 
                sx={{ 
                  backgroundColor: getDifficultyColor(module.difficulty) + '22',
                  color: getDifficultyColor(module.difficulty),
                  mb: 2,
                }} 
              />
              
              <List disablePadding>
                {module.lessons.map((lesson) => {
                  const lessonUnlocked = isLessonUnlocked(module.id, lesson.id);
                  const lessonCompleted = isLessonCompleted(lesson.id);
                  const progress = getLessonProgress(lesson.id);
                  
                  return (
                    <ListItem 
                      key={lesson.id}
                      disablePadding
                      sx={{ 
                        mb: 1,
                        opacity: lessonUnlocked ? 1 : 0.7,
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          width: '100%',
                          borderLeft: '4px solid',
                          borderColor: lessonCompleted 
                            ? theme.palette.success.main 
                            : (lessonUnlocked ? appStyle.color : theme.palette.divider),
                        }}
                      >
                        <Box
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            cursor: lessonUnlocked ? 'pointer' : 'default',
                            opacity: lessonUnlocked ? 1 : 0.7,
                            '&:hover': {
                              backgroundColor: lessonUnlocked ? theme.palette.action.hover : 'transparent',
                            },
                          }}
                          onClick={() => lessonUnlocked && handleLessonSelect(module.id, lesson.id)}
                        >
                          <ListItemIcon>
                            {lessonCompleted ? (
                              <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                            ) : (
                              <PlayArrowIcon sx={{ color: lessonUnlocked ? appStyle.color : theme.palette.text.disabled }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={lesson.title}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  label={lesson.difficulty} 
                                  size="small" 
                                  sx={{ 
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: getDifficultyColor(lesson.difficulty) + '22',
                                    color: getDifficultyColor(lesson.difficulty),
                                    mr: 1,
                                  }} 
                                />
                                <Typography variant="caption" component="span">
                                  {lesson.estimatedTime} min • {lesson.xpReward} XP
                                </Typography>
                              </Box>
                            }
                          />
                          {!lessonUnlocked && (
                            <LockIcon sx={{ color: theme.palette.text.disabled, ml: 1 }} />
                          )}
                        </Box>
                      </Paper>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Collapse>
        </Paper>
      </Box>
    );
  };
  
  return (
    <Box>
      {/* Curriculum selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel id="curriculum-select-label">Curriculum</InputLabel>
          <Select
            labelId="curriculum-select-label"
            id="curriculum-select"
            value={selectedCurriculumId}
            onChange={handleCurriculumChange}
            label="Curriculum"
          >
            {curriculums.map((curriculum) => (
              <MenuItem key={curriculum.id} value={curriculum.id}>
                {curriculum.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Track tabs */}
      {tracks.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={selectedTrack}
            onChange={handleTrackChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="application track tabs"
          >
            {tracks.map((track) => (
              <Tab
                key={track.id}
                label={track.name}
                value={track.id}
                icon={<Box component="span">{getApplicationStyle(track.id).icon}</Box>}
                iconPosition="start"
                sx={{
                  '&.Mui-selected': {
                    color: getApplicationStyle(track.id).color,
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      )}
      
      {/* Track description */}
      {currentTrack && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            {currentTrack.description}
          </Typography>
        </Box>
      )}
      
      {/* Modules */}
      {currentTrack && currentTrack.modules.map((module) => renderModule(module))}
      
      {/* No tracks message */}
      {tracks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tracks available for this curriculum.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CurriculumView; 