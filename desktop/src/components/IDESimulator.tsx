import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';

export interface IDESimulatorProps {
  code: string;
  targetShortcut: {
    windows: string;
    mac: string;
  };
  onSuccess: () => void;
  onFailure: () => void;
}

const IDESimulator: React.FC<IDESimulatorProps> = ({
  code,
  targetShortcut,
  onSuccess,
  onFailure
}) => {
  const theme = useTheme();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKeyCombo, setLastKeyCombo] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  
  // Determine OS for shortcut display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const currentShortcut = isMac ? targetShortcut.mac : targetShortcut.windows;
  
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
  
  // Clear feedback after a delay
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback]);
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {/* Code display */}
      <Box 
        sx={{ 
          p: 2,
          height: '100%',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: 1.5,
          whiteSpace: 'pre',
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          color: theme.palette.mode === 'dark' ? '#d4d4d4' : '#333',
        }}
      >
        {code}
      </Box>
      
      {/* Shortcut feedback */}
      {feedback && (
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            backgroundColor: feedback.isSuccess ? 'success.main' : 'error.main',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            {feedback.message}
          </Typography>
        </Box>
      )}
      
      {/* Current keys pressed */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 8,
          right: 8,
          p: 1,
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption">
          {lastKeyCombo.length > 0 
            ? `Keys: ${lastKeyCombo.join(' + ')}` 
            : 'Press the shortcut...'}
        </Typography>
      </Box>
      
      {/* Expected shortcut */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 8,
          left: 8,
          p: 1,
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption">
          Expected: {currentShortcut}
        </Typography>
      </Box>
    </Box>
  );
};

export default IDESimulator; 