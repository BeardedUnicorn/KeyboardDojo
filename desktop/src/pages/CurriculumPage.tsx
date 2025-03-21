import {
  Refresh as RefreshIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Tabs,
  Tab,
  useMediaQuery,
  Skeleton,
  Stack,
  alpha,
  Fade,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import React, { useState, useEffect, lazy, Suspense } from 'react';

import { LevelProgressBar, StreakDisplay } from '../components';
import { LevelSelection } from '../components/curriculum';
import { vscodePath, intellijPath, cursorPath } from '../data/paths';
import { usePrefetch } from '../hooks';
import { useLogger } from '../services/loggerService';
import { PathNodeType } from '../types/progress/ICurriculum';

import type { IPath } from '../types/progress/ICurriculum';
import type { FC, SyntheticEvent } from 'react';

// Lazy load components
// const PathView = lazy(() => import('../components/curriculum/PathView'));

// Get path data with timeout handling
const getPathData = (type: string): Promise<IPath> => {
  return new Promise((resolve, reject) => {
    try {
      switch (type) {
        case 'vscode':
          resolve(vscodePath);
          break;
        case 'intellij':
          resolve(intellijPath);
          break;
        case 'cursor':
          resolve(cursorPath);
          break;
        default:
          reject(new Error(`Unknown application type: ${type}`));
      }
    } catch (error) {
      console.error(`Error getting ${type} path data:`, error);
      reject(new Error(`Failed to get ${type} path data: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
};

// Fallback to dynamic loading with timeout if needed
const loadPathDataDynamic = async (type: string): Promise<IPath> => {
  const timeoutDuration = 5000; // 5 seconds timeout

  // Create a promise that rejects after a timeout
  const timeoutPromise = new Promise<IPath>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Loading ${type} path data timed out after ${timeoutDuration}ms`));
    }, timeoutDuration);
  });

  // Create the actual data loading promise
  const dataPromise = (async () => {
    try {
      switch (type) {
        case 'vscode':
          return (await import('../data/paths/vscode-path')).vscodePath;
        case 'intellij':
          return (await import('../data/paths/intellij-path')).intellijPath;
        case 'cursor':
          return (await import('../data/paths/cursor-path')).cursorPath;
        default:
          throw new Error(`Unknown application type: ${type}`);
      }
    } catch (error) {
      // Add more detailed error info
      console.error(`Error loading ${type} path data:`, error);
      throw new Error(`Failed to load ${type} path data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  })();

  // Race the data loading against the timeout
  return Promise.race([dataPromise, timeoutPromise]);
};

// Combined function to get path data with fallback
const getPathDataWithFallback = async (type: string): Promise<IPath> => {
  try {
    // First try getting the data directly
    return await getPathData(type);
  } catch (error) {
    console.warn(`Failed to get path data directly, trying dynamic import for ${type}`, error);
    // Fall back to dynamic loading
    return await loadPathDataDynamic(type);
  }
};

// Loading component
const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      minHeight: '200px',
    }}
  >
    <CircularProgress />
  </Box>
);

const CurriculumPage: FC = () => {
  const theme = useTheme();
  const [activeTrack, setActiveTrack] = useState<string>('vscode');
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const logger = useLogger('CurriculumPage');
  const { navigateWithPrefetch } = usePrefetch();
  const [selectedPath, setSelectedPath] = useState<IPath | null>(null);

  // Load initial path data
  useEffect(() => {
    const loadPath = async () => {
      try {
        setIsLoading(true);
        const path = await getPathDataWithFallback('vscode'); // Default to VS Code path
        setSelectedPath(path);
        setError(null);
      } catch (error) {
        logger.error('Failed to load initial path data', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error loading path data';
        setError(`Failed to load initial path data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPath();
  }, [logger]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const path = await getPathDataWithFallback(activeTrack);
      setSelectedPath(path);
      setError(null);
    } catch (error) {
      logger.error('Failed to load path data', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error loading path data';
      setError(`Failed to load path data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    logger.userAction('retryLoading');
    setIsRetrying(true);
    try {
      await loadData();
    } finally {
      setIsRetrying(false);
    }
  };

  // Handle track change
  const handleTrackChange = async (event: SyntheticEvent, newTrack: string) => {
    logger.userAction('changeTrack', { from: activeTrack, to: newTrack });
    setActiveTrack(newTrack);
    setError(null); // Clear any previous errors when changing tracks
    try {
      setIsLoading(true);
      // Use direct import instead of dynamic import to avoid circular dependencies
      const path = await getPathDataWithFallback(newTrack);
      setSelectedPath(path);
    } catch (error) {
      logger.error('Failed to load track', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error loading track data';
      setError(`Failed to load track data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle node selection
  const handleNodeSelect = async (trackId: string, nodeId: string, nodeType: PathNodeType) => {
    logger.userAction('selectNode', { trackId, nodeId, nodeType });

    try {
      await navigateWithPrefetch(`/${nodeType === PathNodeType.LESSON ? 'lesson' : nodeType === PathNodeType.CHECKPOINT ? 'checkpoint' : 'challenge'}/${trackId}/${nodeId}`);
    } catch (error) {
      logger.error('Failed to navigate to node', error);
    }
  };

  return (
    <Fade in timeout={800}>
      <Container
        maxWidth={false}
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack spacing={2} sx={{ width: '100%' }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              variant="filled"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRetry}
                  startIcon={isRetrying ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                  disabled={isRetrying}
                >
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
              }
              sx={{
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '2rem',
                },
              }}
            >
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  Error Loading Content
                </Typography>
                <Typography variant="body2">
                  {error}
                </Typography>
              </Stack>
            </Alert>
          )}

          {/* Header Section */}
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              background: theme.palette.background.paper,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Stack spacing={2}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '60px',
                    height: '4px',
                    background: theme.palette.primary.main,
                    borderRadius: '2px',
                  },
                }}
              >
                Learning Curriculum
              </Typography>

              {/* Progress Section */}
              <Box sx={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LevelProgressBar />
                </Box>
                <Box sx={{ minWidth: isSmall ? '100%' : '200px' }}>
                  <StreakDisplay />
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Track Selection Tabs */}
          <Paper
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Tabs
              value={activeTrack}
              onChange={handleTrackChange}
              variant={isMobile ? 'fullWidth' : 'standard'}
              sx={{
                minHeight: { xs: 48, sm: 56 },
                backgroundColor: theme.palette.background.paper,
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
                '& .MuiTab-root': {
                  minHeight: { xs: 48, sm: 56 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'transparent',
                    transition: 'all 0.3s ease',
                  },
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    '&::before': {
                      background: alpha(theme.palette.primary.main, 0.1),
                    },
                  },
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    '&::before': {
                      background: alpha(theme.palette.primary.main, 0.08),
                    },
                  },
                },
              }}
            >
              <Tab
                label="VS Code"
                value="vscode"
                sx={{
                  fontWeight: activeTrack === 'vscode' ? 'bold' : 'normal',
                }}
              />
              <Tab
                label="IntelliJ"
                value="intellij"
                sx={{
                  fontWeight: activeTrack === 'intellij' ? 'bold' : 'normal',
                }}
              />
              <Tab
                label="Cursor"
                value="cursor"
                sx={{
                  fontWeight: activeTrack === 'cursor' ? 'bold' : 'normal',
                }}
              />
            </Tabs>
          </Paper>

          {/* Path View Container */}
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: 2,
              flexGrow: 1,
              minHeight: { xs: 'calc(100vh - 400px)', sm: 'calc(100vh - 350px)' },
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
              '& > *': {
                height: '100%',
                width: '100%',
              },
            }}
          >
            {isLoading || isRetrying ? (
              <Fade in timeout={300}>
                <Box sx={{ p: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    height={400}
                    sx={{
                      borderRadius: 1,
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%': {
                          opacity: 1,
                        },
                        '50%': {
                          opacity: 0.5,
                        },
                        '100%': {
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Box>
              </Fade>
            ) : error ? (
              <Box
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  height: '100%',
                  color: theme.palette.error.main,
                }}
              >
                <ErrorIcon sx={{ fontSize: 64, opacity: 0.7 }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Failed to Load Content
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isRetrying ? <CircularProgress size={16} /> : <RefreshIcon />}
                  onClick={handleRetry}
                  disabled={isRetrying}
                >
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: 2, height: '100%', width: '100%' }}>
                <LevelSelection 
                  path={selectedPath}
                  onSelectNode={(trackId, nodeId, nodeType) => handleNodeSelect(trackId, nodeId, nodeType)} 
                />
              </Box>
            )}
          </Paper>
        </Stack>
      </Container>
    </Fade>
  );
};

export default CurriculumPage;
