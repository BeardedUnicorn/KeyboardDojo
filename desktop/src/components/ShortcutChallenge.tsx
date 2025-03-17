import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  LinearProgress, 
  Chip,
  Stack,
  Fade,
  useTheme
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  HighlightOff as ErrorIcon,
  Refresh as RefreshIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as HintIcon
} from '@mui/icons-material';
import { shortcutDetector, formatShortcut, parseShortcut, matchesShortcut, getActiveModifiers } from '../utils/shortcutDetector';
import { osDetectionService } from '../services/osDetectionService';

export interface ShortcutChallengeProps {
  shortcut: string;
  shortcutMac?: string;
  shortcutLinux?: string;
  description: string;
  context?: string;
  application?: 'vscode' | 'intellij' | 'cursor';
  onSuccess?: () => void;
  onSkip?: () => void;
  onHint?: () => void;
  showKeyboard?: boolean;
}

const ShortcutChallenge: React.FC<ShortcutChallengeProps> = ({
  shortcut,
  shortcutMac,
  shortcutLinux,
  description,
  context = '',
  application = 'vscode',
  onSuccess,
  onSkip,
  onHint,
  showKeyboard = true,
}) => {
  const theme = useTheme();
  const [status, setStatus] = useState<'waiting' | 'success' | 'error'>('waiting');
  const [attempts, setAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());
  const successHandled = useRef(false);
  
  // Get OS-specific shortcut
  const osSpecificShortcut = osDetectionService.formatShortcut(
    shortcut,
    shortcutMac || shortcut.replace(/Ctrl\+/g, '⌘+').replace(/Alt\+/g, '⌥+'),
    shortcutLinux
  );
  
  // Parse the shortcut
  const parsedShortcut = parseShortcut(osSpecificShortcut);
  
  // Update time elapsed
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Reset state when shortcut changes
  useEffect(() => {
    setStatus('waiting');
    setAttempts(0);
    setLastAttempt('');
    setShowHint(false);
    successHandled.current = false;
  }, [shortcut, shortcutMac, shortcutLinux]);
  
  // Set up keyboard event listeners
  useEffect(() => {
    // Initialize the shortcut detector
    shortcutDetector.initialize();
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if already successful and handled
      if (status === 'success' && successHandled.current) return;
      
      // Check if the shortcut matches
      if (matchesShortcut(event, parsedShortcut)) {
        setStatus('success');
        setAttempts(prev => prev + 1);
        
        // Mark as handled to prevent multiple triggers
        if (!successHandled.current) {
          successHandled.current = true;
          onSuccess?.();
        }
        
        // Prevent default browser behavior
        event.preventDefault();
      } else if (!isModifierOnly(event)) {
        // Only count non-modifier keys as attempts
        setStatus('error');
        setAttempts(prev => prev + 1);
        setLastAttempt(formatShortcut({
          key: event.key,
          modifiers: getActiveModifiers(event)
        }));
        
        // Reset status after a delay
        setTimeout(() => {
          setStatus('waiting');
        }, 1500);
      }
    };
    
    // Helper to check if only modifier keys are pressed
    const isModifierOnly = (event: KeyboardEvent) => {
      return ['Control', 'Alt', 'Shift', 'Meta'].includes(event.key);
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      shortcutDetector.cleanup();
    };
  }, [shortcut, shortcutMac, shortcutLinux, status, onSuccess, parsedShortcut]);
  
  // Format shortcut for display
  const formatShortcutForDisplay = (shortcutStr: string) => {
    const parts = shortcutStr.split('+');
    
    return parts.map(part => {
      // Format special keys based on OS
      switch (part.toLowerCase()) {
        case 'ctrl':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌘' : 'Ctrl'} size="small" sx={{ mr: 0.5 }} />;
        case 'alt':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌥' : 'Alt'} size="small" sx={{ mr: 0.5 }} />;
        case 'shift':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⇧' : 'Shift'} size="small" sx={{ mr: 0.5 }} />;
        case 'meta':
        case 'command':
        case 'cmd':
        case '⌘':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌘' : 'Win'} size="small" sx={{ mr: 0.5 }} />;
        case '⌥':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⌥' : 'Alt'} size="small" sx={{ mr: 0.5 }} />;
        case '⇧':
          return <Chip key={part} label={osDetectionService.isMacOS() ? '⇧' : 'Shift'} size="small" sx={{ mr: 0.5 }} />;
        default:
          return <Chip key={part} label={part} size="small" sx={{ mr: 0.5 }} />;
      }
    });
  };
  
  // Get application-specific styling
  const getApplicationStyle = () => {
    switch (application) {
      case 'vscode':
        return {
          bgcolor: '#1e1e1e',
          color: '#d4d4d4',
          borderColor: '#007acc'
        };
      case 'intellij':
        return {
          bgcolor: '#2b2b2b',
          color: '#a9b7c6',
          borderColor: '#ff5370'
        };
      case 'cursor':
        return {
          bgcolor: '#1a1a1a',
          color: '#e0e0e0',
          borderColor: '#6c38bb'
        };
      default:
        return {};
    }
  };
  
  // Handle hint button click
  const handleHintClick = () => {
    setShowHint(true);
    onHint?.();
  };
  
  // Handle skip button click
  const handleSkipClick = () => {
    onSkip?.();
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: 1,
        borderColor: 'divider'
      }}
    >
      {/* Challenge header */}
      <Typography variant="h6" gutterBottom>
        Shortcut Challenge
      </Typography>
      
      {/* Application context */}
      {context && (
        <Box 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 1,
            ...getApplicationStyle()
          }}
        >
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {context}
          </Typography>
        </Box>
      )}
      
      {/* Challenge description */}
      <Typography variant="body1" gutterBottom>
        {description}
      </Typography>
      
      {/* Shortcut to press */}
      <Box sx={{ my: 3, textAlign: 'center' }}>
        <Typography variant="subtitle2" gutterBottom>
          Press the shortcut:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {formatShortcutForDisplay(osSpecificShortcut)}
        </Box>
      </Box>
      
      {/* Progress and status */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Attempts: {attempts}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Time: {timeElapsed}s
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={status === 'success' ? 100 : 0} 
          color={status === 'error' ? 'error' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      {/* Success message */}
      {status === 'success' && (
        <Fade in={true}>
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'success.light', 
              color: 'success.contrastText',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <CheckIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              Great job! You pressed the correct shortcut.
            </Typography>
          </Box>
        </Fade>
      )}
      
      {/* Error message */}
      {status === 'error' && (
        <Fade in={true}>
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'error.light', 
              color: 'error.contrastText',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ErrorIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              Not quite. You pressed: {lastAttempt}
            </Typography>
          </Box>
        </Fade>
      )}
      
      {/* Hint */}
      {showHint && (
        <Box 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'warning.light', 
            color: 'warning.contrastText',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <HintIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            Hint: Make sure to press {osSpecificShortcut.split('+').join(' + ')} exactly in that order.
          </Typography>
        </Box>
      )}
      
      {/* Action buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {!showHint && (
          <Button 
            variant="outlined" 
            startIcon={<HintIcon />}
            onClick={handleHintClick}
            color="warning"
          >
            Hint
          </Button>
        )}
        
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleSkipClick}
          color="secondary"
        >
          Skip
        </Button>
      </Stack>
    </Paper>
  );
};

export default ShortcutChallenge; 