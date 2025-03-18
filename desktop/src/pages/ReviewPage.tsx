import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { curriculumService ,
  spacedRepetitionService,
  xpService
, useLogger } from '@/services';

import ReviewSession from '../components/review/ReviewSession';

import type { ReviewSession as ReviewSessionType, PerformanceRating } from '../services/spacedRepetitionService';
import type { FC } from 'react';

interface ReviewResult {
  shortcutId: string;
  performance: PerformanceRating;
  responseTime: number;
}

interface ReviewStats {
  totalShortcuts: number;
  dueShortcuts: number;
  averageEaseFactor: number;
  masteryLevel: number;
}

const ReviewPage: FC = () => {
  const navigate = useNavigate();
  const logger = useLogger('ReviewPage');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<ReviewSessionType | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalShortcuts: 0,
    dueShortcuts: 0,
    averageEaseFactor: 0,
    masteryLevel: 0,
  });

  // Memoize styles
  const styles = useMemo(() => ({
    container: {
      py: 4,
    },
    loadingContainer: {
      py: 4,
      textAlign: 'center',
    },
    loadingText: {
      mt: 2,
    },
    errorAlert: {
      mb: 3,
    },
    resultCard: {
      mb: 4,
    },
    performanceGrid: {
      mb: 2,
    },
    performanceChip: {
      mr: 1,
      mb: 1,
    },
    statsCard: {
      mb: 3,
    },
    buttonContainer: {
      mt: 3,
      display: 'flex',
      gap: 2,
    },
  }), []);

  // Load review data
  useEffect(() => {
    logger.component('mount');

    const loadData = async () => {
      try {
        setLoading(true);

        const shortcuts = curriculumService.getAllShortcuts();

        if (!shortcuts || shortcuts.length === 0) {
          logger.warn('No shortcuts found in the curriculum');
          setError('No shortcuts found in the curriculum');
          setLoading(false);
          return;
        }

        spacedRepetitionService.initializeSystem(shortcuts);
        const stats = spacedRepetitionService.getStatistics();
        setStats(stats);

        logger.debug('Review data loaded successfully', {
          totalShortcuts: stats.totalShortcuts,
          dueShortcuts: stats.dueShortcuts,
        });

        setLoading(false);
      } catch (err) {
        logger.error('Error loading review data:', err);
        setError('Failed to load review data. Please try again later.');
        setLoading(false);
      }
    };

    loadData();

    return () => {
      logger.component('unmount');
    };
  }, [logger]);

  // Memoize handlers
  const handleStartSession = useCallback(() => {
    try {
      logger.userAction('startReviewSession');

      const newSession = spacedRepetitionService.createReviewSession({
        maxItems: 10,
        focusOnDifficult: true,
      });

      if (!newSession.shortcuts || newSession.shortcuts.length === 0) {
        logger.warn('No shortcuts due for review at this time');
        setError('No shortcuts due for review at this time');
        return;
      }

      logger.info('Review session created', {
        sessionId: newSession.id,
        shortcutsCount: newSession.shortcuts.length,
      });

      setSession(newSession);
      setShowResults(false);
      setError(null);
    } catch (err) {
      logger.error('Error creating review session:', err);
      setError('Failed to create review session. Please try again later.');
    }
  }, [logger]);

  const handleCompleteSession = useCallback((results: ReviewResult[]) => {
    try {
      if (!session) {
        logger.error('Cannot complete session: No active session');
        return;
      }

      logger.userAction('completeReviewSession', {
        sessionId: session.id,
        resultsCount: results.length,
      });

      spacedRepetitionService.completeReviewSession(session, results);

      const goodResults = results.filter((r) => r.performance === 'good' || r.performance === 'easy').length;
      const xpAwarded = Math.round((goodResults / results.length) * 50);

      if (xpAwarded > 0) {
        xpService.addXP(xpAwarded, 'Completed review session');
        logger.info('XP awarded for review session', { xpAwarded });
      }

      const updatedStats = spacedRepetitionService.getStatistics();
      setStats(updatedStats);
      setResults(results);
      setShowResults(true);

      logger.info('Review session completed successfully', {
        sessionId: session.id,
        resultsCount: results.length,
        xpAwarded,
      });
    } catch (err) {
      logger.error('Error completing review session:', err);
      setError('Failed to complete review session. Your progress may not be saved.');
    }
  }, [session, logger]);

  const handleBackToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Memoize performance metrics
  const performanceMetrics = useMemo(() => {
    if (!results.length) return null;

    const totalItems = results.length;
    const performanceCounts = results.reduce(
      (counts, result) => {
        counts[result.performance]++;
        return counts;
      },
      { again: 0, hard: 0, good: 0, easy: 0 },
    );

    const averageResponseTime = results.reduce(
      (sum, result) => sum + result.responseTime,
      0,
    ) / totalItems;

    return {
      totalItems,
      performanceCounts,
      averageResponseTime,
    };
  }, [results]);

  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="body1" sx={styles.loadingText}>
          Loading review data...
        </Typography>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="md" sx={styles.container}>
        <Alert severity="error" sx={styles.errorAlert}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleBackToHome}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // Render active session
  if (session) {
    return (
      <ReviewSession
        session={session}
        onComplete={handleCompleteSession}
      />
    );
  }

  // Render results
  if (showResults && performanceMetrics) {
    const { totalItems, performanceCounts, averageResponseTime } = performanceMetrics;

    return (
      <Container maxWidth="md" sx={styles.container}>
        <Typography variant="h4" gutterBottom>
          Review Session Complete
        </Typography>

        <Card variant="outlined" sx={styles.resultCard}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Summary
            </Typography>

            <Grid container spacing={2} sx={styles.performanceGrid}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
                <Typography variant="h6">
                  {totalItems}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Average Response Time
                </Typography>
                <Typography variant="h6">
                  {(averageResponseTime / 1000).toFixed(1)}s
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Mastery Level
                </Typography>
                <Typography variant="h6">
                  {stats.masteryLevel.toFixed(1)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Due Shortcuts
                </Typography>
                <Typography variant="h6">
                  {stats.dueShortcuts}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Performance Breakdown
            </Typography>

            <Box>
              <Chip
                label={`Easy: ${performanceCounts.easy}`}
                color="success"
                variant="outlined"
                sx={styles.performanceChip}
              />
              <Chip
                label={`Good: ${performanceCounts.good}`}
                color="primary"
                variant="outlined"
                sx={styles.performanceChip}
              />
              <Chip
                label={`Hard: ${performanceCounts.hard}`}
                color="warning"
                variant="outlined"
                sx={styles.performanceChip}
              />
              <Chip
                label={`Again: ${performanceCounts.again}`}
                color="error"
                variant="outlined"
                sx={styles.performanceChip}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Box sx={styles.buttonContainer}>
              <Button variant="outlined" onClick={handleBackToHome}>
                Back to Home
              </Button>
              <Button variant="contained" onClick={handleStartSession}>
                Start New Session
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Container>
    );
  }

  // Render initial state
  return (
    <Container maxWidth="md" sx={styles.container}>
      <Typography variant="h4" gutterBottom>
        Review Shortcuts
      </Typography>

      <Card variant="outlined" sx={styles.statsCard}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Progress
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Total Shortcuts
              </Typography>
              <Typography variant="h6">
                {stats.totalShortcuts}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Due for Review
              </Typography>
              <Typography variant="h6">
                {stats.dueShortcuts}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Mastery Level
              </Typography>
              <Typography variant="h6">
                {stats.masteryLevel.toFixed(1)}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Average Ease
              </Typography>
              <Typography variant="h6">
                {stats.averageEaseFactor.toFixed(1)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={styles.buttonContainer}>
        <Button
          variant="contained"
          onClick={handleStartSession}
          disabled={stats.dueShortcuts === 0}
        >
          Start Review Session
        </Button>
        <Button variant="outlined" onClick={handleBackToHome}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default memo(ReviewPage);
