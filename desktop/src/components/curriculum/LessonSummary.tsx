import {
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  Keyboard as KeyboardIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  useTheme,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  keyframes,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';

import FeedbackAnimation from '../gamification/notifications/FeedbackAnimation';

import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { FC } from 'react';

interface LessonSummaryProps {
  title: string;
  description: string;
  performance: {
    lessonId: string;
    completed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number; // in seconds
    xpEarned: number;
    gemsEarned: number;
    stars: number; // 1-3 stars based on performance
    shortcutsMastered: IShortcut[];
  };
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
}

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LessonSummary: FC<LessonSummaryProps> = memo(({
  title,
  description,
  performance,
  onNext,
  onReplay,
  onHome,
}) => {
  const theme = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Memoize styles
  const styles = useMemo(() => ({
    container: {
      width: '100%',
      p: 2,
    },
    paper: {
      p: 3,
      borderRadius: 2,
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.primary.light + '20',
      position: 'relative',
      overflow: 'hidden',
    },
    header: {
      mb: 4,
      textAlign: 'center',
      animation: `${fadeIn} 0.5s ease-in-out`,
    },
    metricsContainer: {
      mb: 4,
    },
    metricCard: {
      textAlign: 'center',
    },
    metricIcon: {
      fontSize: 40,
      mb: 1,
    },
    gemIcon: {
      width: 40,
      height: 40,
      marginBottom: 8,
      filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none',
    },
    rating: {
      textAlign: 'center',
      mb: 4,
    },
    ratingStars: {
      fontSize: 50,
      '& .MuiRating-iconFilled': {
        color: theme.palette.warning.main,
      },
      '& .MuiRating-iconEmpty': {
        color: theme.palette.action.disabled,
      },
    },
    shortcutList: {
      mb: 4,
    },
    shortcutItem: {
      mb: 1,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 1,
      border: `1px solid ${theme.palette.divider}`,
    },
    shortcutKey: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.main,
      padding: '2px 6px',
      borderRadius: '4px',
      margin: '0 2px',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[1],
      fontFamily: 'monospace',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: 2,
      flexWrap: 'wrap',
    },
    button: {
      minWidth: 120,
    },
  }), [theme]);

  // Animate elements in sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const animationSequence = () => {
      setShowAnimation(true);

      timers.push(setTimeout(() => {
        setShowMetrics(true);
      }, 1000));

      timers.push(setTimeout(() => {
        setShowShortcuts(true);
      }, 2000));

      timers.push(setTimeout(() => {
        setShowButtons(true);
      }, 3000));
    };

    animationSequence();

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // Memoize calculations
  const calculatePercentage = useMemo(() =>
    Math.round((performance.correctAnswers / performance.totalQuestions) * 100),
    [performance.correctAnswers, performance.totalQuestions],
  );

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Determine OS for shortcut display
  const isMac = useMemo(() =>
    navigator.platform.toUpperCase().indexOf('MAC') >= 0,
    [],
  );

  // Memoize shortcut formatting
  const formatShortcut = useCallback((shortcut: IShortcut) => {
    const shortcutStr = isMac && shortcut.shortcutMac ? shortcut.shortcutMac : shortcut.shortcutWindows;
    return shortcutStr.split('+').map((key) => (
      <span
        key={key}
        style={styles.shortcutKey}
      >
        {key.trim()}
      </span>
    ));
  }, [isMac, styles.shortcutKey]);

  // Memoize performance metrics
  const performanceMetrics = useMemo(() => [
    {
      icon: <CheckCircleIcon color="success" sx={styles.metricIcon} />,
      title: 'Accuracy',
      value: `${calculatePercentage}%`,
      subtext: `${performance.correctAnswers} / ${performance.totalQuestions} correct`,
      color: 'success.main',
    },
    {
      icon: <TimerIcon color="info" sx={styles.metricIcon} />,
      title: 'Time Spent',
      value: formatTime(performance.timeSpent),
      subtext: 'minutes:seconds',
      color: 'info.main',
    },
    {
      icon: <EmojiEventsIcon color="primary" sx={styles.metricIcon} />,
      title: 'XP Earned',
      value: `+${performance.xpEarned}`,
      subtext: 'experience points',
      color: 'primary.main',
    },
    {
      icon: (
        <img
          src="/images/gem-icon.png"
          alt="Gems"
          style={styles.gemIcon}
        />
      ),
      title: 'Gems Earned',
      value: `+${performance.gemsEarned}`,
      subtext: 'currency',
      color: 'secondary.main',
    },
  ], [calculatePercentage, performance, formatTime, styles]);

  // Memoize shortcut list
  const ShortcutList = useMemo(() => (
    <List>
      {performance.shortcutsMastered.map((shortcut) => (
        <ListItem
          key={shortcut.id}
          sx={styles.shortcutItem}
        >
          <ListItemIcon>
            <KeyboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={shortcut.name}
            secondary={
              <Box sx={{ mt: 0.5 }}>
                {formatShortcut(shortcut)}
              </Box>
            }
          />
          <Chip
            label="Mastered"
            color="success"
            size="small"
            variant="outlined"
          />
        </ListItem>
      ))}
    </List>
  ), [performance.shortcutsMastered, formatShortcut, styles.shortcutItem]);

  return (
    <Box sx={styles.container}>
      <Paper elevation={3} sx={styles.paper}>
        {showAnimation && (
          <FeedbackAnimation
            type="confetti"
            isVisible
            duration={3000}
            intensity="high"
          />
        )}

        <Box sx={styles.header}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Lesson Complete!
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {description}
            </Typography>
          </motion.div>
        </Box>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: showMetrics ? 1 : 0.9, opacity: showMetrics ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} sx={styles.metricsContainer}>
            {performanceMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={2}>
                  <CardContent sx={styles.metricCard}>
                    {metric.icon}
                    <Typography variant="h6" gutterBottom>
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" color={metric.color}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {metric.subtext}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: showMetrics ? 1 : 0.9, opacity: showMetrics ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={styles.rating}>
            <Typography variant="h6" gutterBottom>
              Performance Rating
            </Typography>
            <Rating
              value={performance.stars}
              readOnly
              max={3}
              icon={<StarIcon fontSize="large" />}
              emptyIcon={<StarIcon fontSize="large" />}
              sx={styles.ratingStars}
            />
          </Box>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: showShortcuts ? 0 : 20, opacity: showShortcuts ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.shortcutList}>
            <Typography variant="h6" gutterBottom>
              Shortcuts Mastered
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {performance.shortcutsMastered.length > 0 ? (
              ShortcutList
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                No shortcuts mastered in this lesson.
              </Typography>
            )}
          </Box>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: showButtons ? 0 : 20, opacity: showButtons ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.buttonContainer}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={onHome}
              sx={styles.button}
            >
              Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onReplay}
              sx={styles.button}
            >
              Replay
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={onNext}
              sx={styles.button}
            >
              Continue
            </Button>
          </Box>
        </motion.div>
      </Paper>
    </Box>
  );
});

LessonSummary.displayName = 'LessonSummary';

export default LessonSummary;
