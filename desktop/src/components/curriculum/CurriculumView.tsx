import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  PlayArrow as PlayArrowIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
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
  ButtonBase,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { curriculumService } from '../../services';

import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type {
  SelectChangeEvent } from '@mui/material';
import type { FC, SyntheticEvent } from 'react';
import type { IApplicationTrack, ICurriculumMetadata, IModule } from '@/types/progress/ICurriculum';
import { ApplicationType } from '@/types/progress/ICurriculum';

interface CurriculumViewProps {
  onSelectLesson?: (trackId: ApplicationType, moduleId: string, lessonId: string) => void;
  onSelectChallenge?: (trackId: ApplicationType, challengeId: string) => void;
}

const CurriculumView: FC<CurriculumViewProps> = ({
  onSelectLesson,
  onSelectChallenge,
}) => {
  const theme = useTheme();
  const [selectedTrack, setSelectedTrack] = useState<ApplicationType>(ApplicationType.VSCODE);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [tracks, setTracks] = useState<IApplicationTrack[]>([]);
  const [curriculums, setCurriculums] = useState<ICurriculumMetadata[]>([]);
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
  const currentTrack = tracks.find((track) => track.id === selectedTrack);

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
  const handleTrackChange = (_event: SyntheticEvent, newValue: ApplicationType) => {
    setSelectedTrack(newValue);

    // Expand the first module by default
    const track = tracks.find((t) => t.id === newValue);
    if (track && track.modules.length > 0) {
      setExpandedModules([track.modules[0].id]);
    } else {
      setExpandedModules([]);
    }
  };

  // Handle module expansion toggle
  const handleModuleToggle = (moduleId: string) => {
    setExpandedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
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

  // Get color for difficulty level
  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.info.main;
      case 'advanced':
        return theme.palette.warning.main;
      case 'expert':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Get style for application tab
  const getApplicationStyle = (application: ApplicationType) => {
    let color = theme.palette.primary.main;
    let icon = <CodeIcon />;

    switch (application) {
      case 'vscode':
        color = '#0078D7';
        icon = <CodeIcon />;
        break;
      case 'intellij':
        color = '#F97A12';
        icon = <CodeIcon />;
        break;
      case 'cursor':
        color = '#00A67D';
        icon = <CodeIcon />;
        break;
      default:
        break;
    }

    return { color, icon };
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

    return userProgress.completedLessons.some((lesson) => lesson.lessonId === lessonId);
  };

  // Get lesson progress
  const getLessonProgress = (lessonId: string): number => {
    const userProgress = curriculumService.getUserProgress();
    if (!userProgress) return 0;

    const currentLesson = userProgress.currentLessons.find(
      (lesson) => lesson.lessonId === lessonId && lesson.trackId === selectedTrack,
    );
    return currentLesson ? currentLesson.progress : 0;
  };

  // Render a module
  const renderModule = (module: IModule) => {
    const isExpanded = expandedModules.includes(module.id);
    const isUnlocked = isModuleUnlocked(module.id);

    return (
      <Box key={module.id} sx={{ mb: 2 }}>
        <Paper
          elevation={2}
          sx={{
            borderLeft: `4px solid ${getDifficultyColor(module.difficulty)}`,
            opacity: isUnlocked ? 1 : 0.7,
          }}
        >
          <ListItem>
            <ButtonBase
              onClick={() => isUnlocked && handleModuleToggle(module.id)}
              disabled={!isUnlocked}
              sx={{
                py: 2,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                opacity: isUnlocked ? 1 : 0.7,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon>
                  {isUnlocked ? (
                    <SchoolIcon color="primary" />
                  ) : (
                    <LockIcon color="disabled" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {module.title}
                      <Chip
                        label={module.difficulty}
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor: getDifficultyColor(module.difficulty),
                          color: 'white',
                        }}
                      />
                    </Typography>
                  }
                  secondary={module.description}
                />
              </Box>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ButtonBase>
          </ListItem>
        </Paper>

        <Collapse in={isExpanded && isUnlocked} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {module.lessons.map((lesson) => {
              const lessonCompleted = isLessonCompleted(lesson.id);
              const lessonUnlocked = isLessonUnlocked(module.id, lesson.id);
              const progress = getLessonProgress(lesson.id);

              return (
                <ListItem key={lesson.id}>
                  <ButtonBase
                    onClick={() => lessonUnlocked && handleLessonSelect(module.id, lesson.id)}
                    disabled={!lessonUnlocked}
                    sx={{
                      pl: 4,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      borderLeft: `4px solid ${
                        lessonCompleted
                          ? theme.palette.success.main
                          : progress > 0
                          ? theme.palette.info.main
                          : 'transparent'
                      }`,
                      ml: 2,
                      my: 1,
                      backgroundColor: theme.palette.background.paper,
                      opacity: lessonUnlocked ? 1 : 0.7,
                    }}
                  >
                    <ListItemIcon>
                      {lessonCompleted ? (
                        <CheckCircleIcon color="success" />
                      ) : lessonUnlocked ? (
                        <PlayArrowIcon color="primary" />
                      ) : (
                        <LockIcon color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={lesson.title}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {lesson.description?.substring(0, 60)}
                            {lesson.description && lesson.description.length > 60 ? '...' : ''}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip
                              label={`XP: ${lesson.xpReward}`}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={`${lesson.estimatedTime || 10} min`}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            {lesson.category && (
                              <Chip
                                label={lesson.category}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            )}
                          </Box>
                        </>
                      }
                    />
                  </ButtonBase>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </Box>
    );
  };

  // Render mastery challenges
  const renderMasteryChallenges = () => {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mastery Challenges
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List>
          {currentTrack?.modules
            .filter((module) => module.id.includes('mastery'))
            .flatMap((module) => module.lessons)
            .map((challenge) => (
              <ListItem key={challenge.id}>
                <ButtonBase
                  onClick={() => handleChallengeSelect(challenge.id)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 1,
                    backgroundColor: theme.palette.background.paper,
                    borderLeft: `4px solid ${getDifficultyColor(challenge.difficulty)}`,
                    p: 1,
                  }}
                >
                  <ListItemIcon>
                    <WorkspacePremiumIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {challenge.title}
                        <Chip
                          label={challenge.difficulty}
                          size="small"
                          sx={{
                            ml: 1,
                            backgroundColor: getDifficultyColor(challenge.difficulty),
                            color: 'white',
                          }}
                        />
                      </Typography>
                    }
                    secondary={challenge.description}
                  />
                </ButtonBase>
              </ListItem>
            ))}
        </List>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Curriculum Selector */}
      {curriculums.length > 1 && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="curriculum-select-label">Curriculum</InputLabel>
          <Select
            labelId="curriculum-select-label"
            id="curriculum-select"
            value={selectedCurriculumId}
            label="Curriculum"
            onChange={handleCurriculumChange}
          >
            {curriculums.map((curriculum) => (
              <MenuItem key={curriculum.id} value={curriculum.id}>
                {curriculum.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Application Track Tabs */}
      <Tabs
        value={selectedTrack}
        onChange={handleTrackChange}
        aria-label="application tracks"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        {tracks.map((track) => {
          const { color, icon } = getApplicationStyle(track.id);
          return (
            <Tab
              key={track.id}
              value={track.id}
              label={track.name}
              icon={icon}
              sx={{
                '&.Mui-selected': {
                  color,
                },
              }}
            />
          );
        })}
      </Tabs>

      {/* Track Description */}
      {currentTrack && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {currentTrack.name}
          </Typography>
          <Typography variant="body1">{currentTrack.description}</Typography>
        </Paper>
      )}

      {/* Modules and Lessons */}
      {currentTrack?.modules
        .filter((module) => !module.id.includes('mastery'))
        .sort((a, b) => a.order - b.order)
        .map((module) => renderModule(module))}

      {/* Mastery Challenges */}
      {currentTrack && renderMasteryChallenges()}
    </Box>
  );
};

export default CurriculumView;
