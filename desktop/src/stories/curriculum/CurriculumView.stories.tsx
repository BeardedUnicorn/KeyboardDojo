import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
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
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { ApplicationType } from '@/types/progress/ICurriculum';
import type { DifficultyLevel } from '@/types/curriculum/DifficultyLevel';
import type { IApplicationTrack, ICurriculumMetadata, IModule } from '@/types/progress/ICurriculum';
import type { SelectChangeEvent } from '@mui/material';
import type { SyntheticEvent } from 'react';

// Define mock data
const mockCurriculum = {
  id: 'default-curriculum',
  name: 'Default Curriculum',
  description: 'The default curriculum for Keyboard Dojo',
  version: '1.0.0',
  modules: [
    {
      id: 'module-1',
      name: 'Module 1: Basics',
      description: 'Learn the basics of keyboard shortcuts',
      order: 1,
      lessons: [
        {
          id: 'lesson-1-1',
          name: 'Lesson 1: Navigation',
          description: 'Basic navigation shortcuts',
          type: 'lesson',
          difficulty: 'beginner',
          shortcutIds: ['shortcut-1', 'shortcut-2'],
          completed: true,
          locked: false,
          order: 1,
        },
        {
          id: 'lesson-1-2',
          name: 'Lesson 2: Editing',
          description: 'Basic editing shortcuts',
          type: 'lesson',
          difficulty: 'beginner',
          shortcutIds: ['shortcut-3', 'shortcut-4'],
          completed: false,
          locked: false,
          order: 2,
        },
      ],
    },
    {
      id: 'module-2',
      name: 'Module 2: Intermediate',
      description: 'Intermediate keyboard shortcuts',
      order: 2,
      lessons: [
        {
          id: 'lesson-2-1',
          name: 'Lesson 1: Advanced Navigation',
          description: 'Advanced navigation shortcuts',
          type: 'lesson',
          difficulty: 'intermediate',
          shortcutIds: ['shortcut-5', 'shortcut-6'],
          completed: false,
          locked: false,
          order: 1,
        },
      ],
    },
  ],
};

// Mock tracks
const mockTracks = [
  { 
    id: ApplicationType.VSCODE, 
    name: 'VS Code', 
    description: 'Visual Studio Code shortcuts',
    modules: mockCurriculum.modules
  },
  { 
    id: ApplicationType.INTELLIJ, 
    name: 'IntelliJ', 
    description: 'IntelliJ IDEA shortcuts',
    modules: mockCurriculum.modules
  },
];

// Create a mock Redux store with curriculum data
const createMockStore = (userProgressState: 'new' | 'partial' | 'advanced') => {
  const userProgress = getUserProgressForState(userProgressState);
  
  return configureStore({
    reducer: {
      curriculum: (state = {
        isLoading: false,
        error: null,
        activeCurriculum: mockCurriculum,
        tracks: mockTracks
      }) => state,
      progress: (state = {
        isLoading: false,
        error: null,
        completedLessons: userProgress.completedLessons,
        currentLessons: userProgress.currentLessons
      }) => state,
      user: (state = { isPremium: true }) => state,
      app: (state = { isInitialized: true }) => state
    }
  });
};

// Mock user progress for different states
function getUserProgressForState(userProgressState: 'new' | 'partial' | 'advanced') {
  if (userProgressState === 'new') {
    return { 
      completedLessons: [],
      currentLessons: []
    };
  } else if (userProgressState === 'partial') {
    return { 
      completedLessons: [{ lessonId: 'lesson-1-1', trackId: ApplicationType.VSCODE }],
      currentLessons: [{ lessonId: 'lesson-1-2', trackId: ApplicationType.VSCODE, progress: 50 }]
    };
  } else if (userProgressState === 'advanced') {
    return { 
      completedLessons: [
        { lessonId: 'lesson-1-1', trackId: ApplicationType.VSCODE },
        { lessonId: 'lesson-1-2', trackId: ApplicationType.VSCODE }
      ],
      currentLessons: [{ lessonId: 'lesson-2-1', trackId: ApplicationType.VSCODE, progress: 30 }]
    };
  }
  return { completedLessons: [], currentLessons: [] };
}

// Redux Provider Wrapper
const ReduxWrapper: React.FC<{
  children: React.ReactNode;
  userProgressState: 'new' | 'partial' | 'advanced';
}> = ({ children, userProgressState }) => {
  const store = React.useMemo(() => createMockStore(userProgressState), [userProgressState]);
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

// Create a simplified test-only version of CurriculumView
const TestCurriculumView: React.FC<{
  userProgressState: 'new' | 'partial' | 'advanced';
  onSelectLesson?: (trackId: ApplicationType, moduleId: string, lessonId: string) => void;
  onSelectChallenge?: (trackId: ApplicationType, challengeId: string) => void;
}> = ({ 
  userProgressState,
  onSelectLesson, 
  onSelectChallenge 
}) => {
  const theme = useTheme();
  const [selectedTrack, setSelectedTrack] = useState<ApplicationType>(ApplicationType.VSCODE);
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1']);
  const curriculums = [
    {
      id: 'default-curriculum',
      name: 'Default Curriculum',
      description: 'The default curriculum for Keyboard Dojo',
      version: '1.0.0'
    }
  ];
  const selectedCurriculumId = 'default-curriculum';
  const userProgress = getUserProgressForState(userProgressState);

  // Get the current track
  const currentTrack = mockTracks.find((track) => track.id === selectedTrack);

  // Handle curriculum change
  const handleCurriculumChange = (event: SelectChangeEvent<string>) => {
    // No-op in test component
    console.log('Curriculum changed:', event.target.value);
  };

  // Handle track change
  const handleTrackChange = (_event: SyntheticEvent, newValue: ApplicationType) => {
    setSelectedTrack(newValue);

    // Expand the first module by default
    const track = mockTracks.find((t) => t.id === newValue);
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

  // Check if a module is unlocked - always true in test
  const isModuleUnlocked = () => true;

  // Check if a lesson is unlocked - always true in test
  const isLessonUnlocked = () => true;

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: string): boolean => {
    if (userProgressState === 'new') return false;
    if (userProgressState === 'partial') return lessonId === 'lesson-1-1';
    if (userProgressState === 'advanced') return ['lesson-1-1', 'lesson-1-2'].includes(lessonId);
    return false;
  };

  // Get lesson progress
  const getLessonProgress = (lessonId: string): number => {
    const currentLesson = userProgress.currentLessons.find(
      (lesson) => lesson.lessonId === lessonId && lesson.trackId === selectedTrack,
    );
    return currentLesson ? currentLesson.progress : 0;
  };

  // Render a module
  const renderModule = (module: IModule) => {
    const isExpanded = expandedModules.includes(module.id);
    const isUnlocked = isModuleUnlocked();

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
                      {module.title || module.name}
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
              const lessonUnlocked = isLessonUnlocked();
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
                      primary={lesson.title || lesson.name}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {lesson.description?.substring(0, 60)}
                            {lesson.description && lesson.description.length > 60 ? '...' : ''}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip
                              label={`XP: ${lesson.xpReward || 10}`}
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
                        {challenge.title || challenge.name}
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
        {mockTracks.map((track) => {
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

// Using a more generic type for the meta to avoid type issues
const meta = {
  title: 'Curriculum/CurriculumView',
  component: TestCurriculumView,
  parameters: {
    layout: 'fullscreen',
    jest: {
      timeout: 180000, // 3 minutes
    }
  },
  tags: ['dev', 'test'],
  decorators: [
    (Story, context) => {
      const { userProgressState } = context.args;
      return (
        <ReduxWrapper userProgressState={userProgressState || 'new'}>
          <Story />
        </ReduxWrapper>
      );
    }
  ],
} satisfies Meta<typeof TestCurriculumView>;

export default meta;
type Story = StoryObj<typeof TestCurriculumView>;

export const NewUser: Story = {
  args: {
    userProgressState: 'new',
    onSelectLesson: (trackId, moduleId, lessonId) => {
      console.log(`Selected lesson: ${lessonId} in module ${moduleId} of track ${trackId}`);
    },
    onSelectChallenge: (trackId, challengeId) => {
      console.log(`Selected challenge: ${challengeId} in track ${trackId}`);
    }
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const PartialProgress: Story = {
  args: {
    userProgressState: 'partial',
    onSelectLesson: (trackId, moduleId, lessonId) => {
      console.log(`Selected lesson: ${lessonId} in module ${moduleId} of track ${trackId}`);
    },
    onSelectChallenge: (trackId, challengeId) => {
      console.log(`Selected challenge: ${challengeId} in track ${trackId}`);
    }
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
};

export const AdvancedProgress: Story = {
  args: {
    userProgressState: 'advanced',
    onSelectLesson: (trackId, moduleId, lessonId) => {
      console.log(`Selected lesson: ${lessonId} in module ${moduleId} of track ${trackId}`);
    },
    onSelectChallenge: (trackId, challengeId) => {
      console.log(`Selected challenge: ${challengeId} in track ${trackId}`);
    }
  },
  parameters: {
    jest: {
      timeout: 180000, // 3 minutes
    }
  }
}; 