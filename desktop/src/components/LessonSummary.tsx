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
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { FeedbackAnimation } from './index';

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

const LessonSummary: FC<LessonSummaryProps> = ({
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

  // Animate elements in sequence
  useEffect(() => {
    const animationSequence = async () => {
      setShowAnimation(true);

      setTimeout(() => {
        setShowMetrics(true);
      }, 1000);

      setTimeout(() => {
        setShowShortcuts(true);
      }, 2000);

      setTimeout(() => {
        setShowButtons(true);
      }, 3000);
    };

    animationSequence();
  }, []);

  const calculatePercentage = () => {
    return Math.round(
      (performance.correctAnswers / performance.totalQuestions) * 100,
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determine OS for shortcut display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const formatShortcut = (shortcut: IShortcut) => {
    const shortcutStr = isMac && shortcut.shortcutMac 
      ? shortcut.shortcutMac 
      : shortcut.shortcutWindows;
    return shortcutStr.split('+').map((key) => (
      <span
        key={key}
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          padding: '2px 6px',
          borderRadius: '4px',
          margin: '0 2px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
          fontFamily: 'monospace',
        }}
      >
        {key.trim()}
      </span>
    ));
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : `${theme.palette.primary.light}20`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Confetti animation */}
        {showAnimation && (
          <FeedbackAnimation
            type="confetti"
            isVisible
            duration={3000}
            intensity="high"
          />
        )}

        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
            >
              Lesson Complete!
            </Typography>
            <Typography 
              variant="h5" 
              color="primary" 
              gutterBottom
            >
              {title}
            </Typography>
            <Typography 
              variant="body1" 
              color="textSecondary"
            >
              {description}
            </Typography>
          </motion.div>
        </Box>

        {/* Performance Metrics */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: showMetrics ? 1 : 0.9, 
            opacity: showMetrics ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Accuracy */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon 
                    color="success" 
                    sx={{ fontSize: 40, mb: 1 }} 
                  />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                  >
                    Accuracy
                  </Typography>
                  <Typography 
                    variant="h4" 
                    color="success.main"
                  >
                    {calculatePercentage()}%
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                  >
                    {performance.correctAnswers} / {performance.totalQuestions} correct
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Time */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TimerIcon 
                    color="info" 
                    sx={{ fontSize: 40, mb: 1 }} 
                  />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                  >
                    Time Spent
                  </Typography>
                  <Typography 
                    variant="h4" 
                    color="info.main"
                  >
                    {formatTime(performance.timeSpent)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                  >
                    minutes:seconds
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* XP */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EmojiEventsIcon 
                    color="primary" 
                    sx={{ fontSize: 40, mb: 1 }} 
                  />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                  >
                    XP Earned
                  </Typography>
                  <Typography 
                    variant="h4" 
                    color="primary.main"
                  >
                    +{performance.xpEarned}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                  >
                    experience points
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Gems */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <img
                    src="/images/gem-icon.png"
                    alt="Gems"
                    style={{
                      width: 40,
                      height: 40,
                      marginBottom: 8,
                      filter: theme.palette.mode === 'dark' 
                        ? 'brightness(1.2)' 
                        : 'none',
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                  >
                    Gems Earned
                  </Typography>
                  <Typography 
                    variant="h4" 
                    color="secondary.main"
                  >
                    +{performance.gemsEarned}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                  >
                    currency
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Star Rating */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: showMetrics ? 1 : 0.9, opacity: showMetrics ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Performance Rating
            </Typography>
            <Rating
              value={performance.stars}
              readOnly
              max={3}
              icon={<StarIcon fontSize="large" />}
              emptyIcon={<StarIcon fontSize="large" />}
              sx={{
                fontSize: 50,
                '& .MuiRating-iconFilled': {
                  color: theme.palette.warning.main,
                },
                '& .MuiRating-iconEmpty': {
                  color: theme.palette.action.disabled,
                },
              }}
            />
          </Box>
        </motion.div>

        {/* Shortcuts Learned */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: showShortcuts ? 0 : 20, opacity: showShortcuts ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Shortcuts Mastered
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {performance.shortcutsMastered.length > 0 ? (
              <List>
                {performance.shortcutsMastered.map((shortcut) => (
                  <ListItem
                    key={shortcut.id}
                    sx={{
                      mb: 1,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
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
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                No shortcuts mastered in this lesson.
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: showButtons ? 0 : 20, opacity: showButtons ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={onHome}
              sx={{ minWidth: 120 }}
            >
              Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onReplay}
              sx={{ minWidth: 120 }}
            >
              Replay
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={onNext}
              sx={{ minWidth: 120 }}
            >
              Continue
            </Button>
          </Box>
        </motion.div>
      </Paper>
    </Box>
  );
};

export default LessonSummary;
