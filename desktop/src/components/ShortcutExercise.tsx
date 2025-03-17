import React, { useState, useEffect, KeyboardEvent } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  useTheme,
  Chip
} from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface ShortcutExerciseProps {
  instructions: string;
  shortcut: {
    windows: string;
    mac: string;
    linux?: string;
  };
  onSuccess: () => void;
  onFailure: () => void;
}

const ShortcutExercise: React.FC<ShortcutExerciseProps> = ({
  instructions,
  shortcut,
  onSuccess,
  onFailure
}) => {
  const theme = useTheme();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKeyCombo, setLastKeyCombo] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  // Determine OS for shortcut display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isLinux = navigator.platform.toUpperCase().indexOf('LINUX') >= 0;
  
  const currentShortcut = isMac 
    ? shortcut.mac 
    : isLinux && shortcut.linux 
      ? shortcut.linux 
      : shortcut.windows;
  
  // Parse shortcut into individual keys
  const parseShortcut = (shortcut: string): string[] => {
    return shortcut.split('+').map(key => key.trim());
  };
  
  const expectedKeys = parseShortcut(currentShortcut);
  
  // Handle key down
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Add key to pressed keys
    const key = e.key.toLowerCase();
    const newPressedKeys = new Set(pressedKeys);
    
    // Map special keys to their names
    let keyName = key;
    if (key === 'control') keyName = 'ctrl';
    if (key === 'meta') keyName = isMac ? 'cmd' : 'win';
    if (key === 'escape') keyName = 'esc';
    
    newPressedKeys.add(keyName);
    setPressedKeys(newPressedKeys);
    
    // Check if the pressed keys match the expected shortcut
    const currentKeys = Array.from(newPressedKeys);
    setLastKeyCombo(currentKeys);
    
    // Check if all expected keys are pressed (case insensitive)
    const expectedLower = expectedKeys.map(k => k.toLowerCase());
    const allExpectedKeysPressed = expectedLower.every(expectedKey => 
      currentKeys.some(pressedKey => pressedKey.toLowerCase() === expectedKey)
    );
    
    // Check if only the expected keys are pressed
    const onlyExpectedKeysPressed = currentKeys.length === expectedLower.length;
    
    if (allExpectedKeysPressed && onlyExpectedKeysPressed) {
      setFeedback({
        message: 'Correct! You used the right shortcut.',
        isSuccess: true
      });
      onSuccess();
    } else if (currentKeys.length >= expectedLower.length) {
      setFeedback({
        message: 'Incorrect shortcut. Try again!',
        isSuccess: false
      });
      onFailure();
    }
  };
  
  // Handle key up
  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    // Remove key from pressed keys
    const key = e.key.toLowerCase();
    const newPressedKeys = new Set(pressedKeys);
    
    // Map special keys to their names
    let keyName = key;
    if (key === 'control') keyName = 'ctrl';
    if (key === 'meta') keyName = isMac ? 'cmd' : 'win';
    if (key === 'escape') keyName = 'esc';
    
    newPressedKeys.delete(keyName);
    setPressedKeys(newPressedKeys);
  };
  
  // Toggle hint
  const handleToggleHint = () => {
    setShowHint(!showHint);
  };
  
  // Clear feedback after a delay
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  
  // Format shortcut for display
  const formatShortcut = (shortcutStr: string) => {
    return shortcutStr.split('+').map((key, index) => (
      <React.Fragment key={index}>
        {index > 0 && <span style={{ margin: '0 4px' }}>+</span>}
        <Chip 
          label={key.trim()} 
          size="small" 
          sx={{ 
            fontFamily: 'monospace',
            backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
          }} 
        />
      </React.Fragment>
    ));
  };
  
  return (
    <Box 
      sx={{ 
        mb: 3,
        position: 'relative',
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: theme.palette.background.default }}>
        <Typography variant="subtitle2" gutterBottom>
          Instructions:
        </Typography>
        <Typography variant="body2" paragraph>
          {instructions}
        </Typography>
        
        {showHint && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Shortcut:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {formatShortcut(currentShortcut)}
            </Box>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<KeyboardIcon />}
          onClick={() => window.focus()}
        >
          Click here and press the shortcut
        </Button>
        
        <Button
          variant="text"
          startIcon={<HelpOutlineIcon />}
          onClick={handleToggleHint}
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </Button>
      </Box>
      
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 2, 
          backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
          borderLeft: '4px solid',
          borderColor: theme.palette.primary.main,
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Current Keys Pressed:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {lastKeyCombo.length > 0 ? (
            lastKeyCombo.map((key, index) => (
              <Chip 
                key={index} 
                label={key} 
                size="small" 
                sx={{ 
                  fontFamily: 'monospace',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }} 
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No keys pressed yet
            </Typography>
          )}
        </Box>
      </Paper>
      
      {feedback && (
        <Alert severity={feedback.isSuccess ? "success" : "error"} sx={{ mb: 2 }}>
          {feedback.message}
        </Alert>
      )}
    </Box>
  );
};

export default ShortcutExercise; 