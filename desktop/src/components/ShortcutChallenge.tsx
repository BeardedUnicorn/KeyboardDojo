import React, { useState, useEffect } from 'react';
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
import KeyboardVisualizer from './KeyboardVisualizer';
import { shortcutDetector, formatShortcut, parseShortcut } from '../utils/shortcutDetector';

export interface ShortcutChallengeProps {
  shortcut: string;
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
  
  // Parse the shortcut to get individual keys
  const parsedShortcut = parseShortcut(shortcut);
  
  // Set up the shortcut detector
  useEffect(() => {
    // Register the shortcut
    const shortcutId = `challenge-${shortcut}`;
    
    shortcutDetector.registerShortcut(shortcutId, shortcut, (event) => {
      // Prevent default browser behavior
      event.event.preventDefault();
      
      // Mark as success
      setStatus('success');
      setTimeElapsed((Date.now() - startTime) / 1000);
      
      // Call the success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000); // Delay to show success state
      }
    });
    
    // Set up a listener for any key press to track attempts
    const handleKeyDown = (event: KeyboardEvent) => {
      if (status === 'success') return;
      
      // Get active modifiers
      const modifiers = [];
      if (event.ctrlKey) modifiers.push('Ctrl');
      if (event.altKey) modifiers.push('Alt');
      if (event.shiftKey) modifiers.push('Shift');
      if (event.metaKey) modifiers.push('Meta');
      
      // Create a string representation of the pressed shortcut
      const pressedShortcut = [...modifiers, event.key].join('+');
      
      // If it's not the correct shortcut, show error
      if (pressedShortcut !== shortcut && !isModifierOnly(event)) {
        setStatus('error');
        setAttempts(prev => prev + 1);
        setLastAttempt(pressedShortcut);
        
        // Reset after a short delay
        setTimeout(() => {
          setStatus('waiting');
        }, 1000);
      }
    };
    
    // Helper to check if only modifier keys are pressed
    const isModifierOnly = (event: KeyboardEvent) => {
      return (
        (event.key === 'Control' || 
         event.key === 'Alt' || 
         event.key === 'Shift' || 
         event.key === 'Meta' || 
         event.key === 'OS')
      );
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Clean up
      shortcutDetector.unregisterShortcut(shortcutId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcut, onSuccess, status, startTime]);
  
  // Format the shortcut for display
  const formatShortcutForDisplay = (shortcutStr: string) => {
    return shortcutStr.split('+').map(key => (
      <Chip 
        key={key} 
        label={key} 
        size="small" 
        color="primary" 
        variant="outlined" 
        sx={{ 
          mx: 0.5, 
          fontWeight: 'bold',
          border: '1px solid',
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.background.paper,
        }} 
      />
    ));
  };
  
  // Get application-specific styling
  const getApplicationStyle = () => {
    switch (application) {
      case 'vscode':
        return {
          color: '#0078D7',
          logo: '🔵 VS Code'
        };
      case 'intellij':
        return {
          color: '#FC801D',
          logo: '🟠 IntelliJ'
        };
      case 'cursor':
        return {
          color: '#9B57B6',
          logo: '🟣 Cursor'
        };
      default:
        return {
          color: theme.palette.primary.main,
          logo: '⌨️ Editor'
        };
    }
  };
  
  const appStyle = getApplicationStyle();
  
  // Handle hint button click
  const handleHintClick = () => {
    setShowHint(true);
    if (onHint) {
      onHint();
    }
  };
  
  // Handle skip button click
  const handleSkipClick = () => {
    if (onSkip) {
      onSkip();
    }
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: status === 'success' 
          ? theme.palette.success.main 
          : status === 'error' 
            ? theme.palette.error.main 
            : theme.palette.divider,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Application badge */}
      <Chip 
        label={appStyle.logo}
        size="small"
        sx={{ 
          position: 'absolute',
          top: 10,
          right: 10,
          fontWeight: 'bold',
          backgroundColor: 'rgba(255,255,255,0.9)',
        }}
      />
      
      {/* Challenge header */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2, color: appStyle.color }}>
        Shortcut Challenge
      </Typography>
      
      {/* Challenge description */}
      <Typography variant="h6" gutterBottom>
        {description}
      </Typography>
      
      {/* Context (if provided) */}
      {context && (
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 3, 
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
          }}
        >
          {context}
        </Typography>
      )}
      
      {/* Status indicator */}
      <Box sx={{ mb: 3, mt: 3, textAlign: 'center' }}>
        {status === 'success' ? (
          <Fade in={true}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CheckIcon 
                color="success" 
                sx={{ fontSize: 60, mb: 1 }} 
              />
              <Typography variant="h6" color="success.main">
                Correct! Well done!
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Time: {timeElapsed.toFixed(2)} seconds
              </Typography>
              <Typography variant="body2">
                Attempts: {attempts + 1}
              </Typography>
            </Box>
          </Fade>
        ) : status === 'error' ? (
          <Fade in={true}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ErrorIcon 
                color="error" 
                sx={{ fontSize: 60, mb: 1 }} 
              />
              <Typography variant="h6" color="error.main">
                Not quite right
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                You pressed: {formatShortcutForDisplay(lastAttempt)}
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Press the shortcut: {formatShortcutForDisplay(shortcut)}
          </Typography>
        )}
      </Box>
      
      {/* Hint section */}
      {showHint && (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.warning.main,
          }}
        >
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <HintIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
            <span>
              Press {parsedShortcut.modifiers.join(' + ')} keys together, then press the {parsedShortcut.key} key while holding the modifiers.
            </span>
          </Typography>
        </Paper>
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
      
      {/* Keyboard visualizer */}
      {showKeyboard && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            Keyboard Preview:
          </Typography>
          <KeyboardVisualizer 
            targetKey={parsedShortcut.key} 
            showPressed={true}
            highlightTarget={true}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ShortcutChallenge; 