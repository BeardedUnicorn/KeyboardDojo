import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { isDesktop } from '../../../shared/src/utils';

interface KeyProps {
  keyChar: string;
  width?: number;
  height?: number;
  isPressed?: boolean;
  isTarget?: boolean;
  onClick?: () => void;
}

const Key: React.FC<KeyProps> = ({
  keyChar,
  width = 1,
  height = 1,
  isPressed = false,
  isTarget = false,
  onClick
}) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={isPressed ? 0 : 2}
      onClick={onClick}
      sx={{
        width: `${width * 50}px`,
        height: `${height * 50}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0.5,
        cursor: 'pointer',
        transition: 'all 0.1s ease',
        transform: isPressed ? 'translateY(2px)' : 'none',
        backgroundColor: isTarget 
          ? theme.palette.primary.light 
          : isPressed 
            ? theme.palette.action.selected 
            : theme.palette.background.paper,
        border: isTarget ? `2px solid ${theme.palette.primary.main}` : 'none',
        color: isTarget 
          ? theme.palette.primary.contrastText 
          : theme.palette.text.primary,
        fontWeight: isTarget ? 'bold' : 'normal',
      }}
    >
      <Typography variant="body1">{keyChar}</Typography>
    </Paper>
  );
};

interface KeyboardVisualizerProps {
  targetKey?: string;
  layout?: 'qwerty' | 'dvorak' | 'colemak';
  showPressed?: boolean;
  highlightTarget?: boolean;
}

const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  targetKey,
  layout = 'qwerty',
  showPressed = true,
  highlightTarget = true,
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  // Define keyboard layouts
  const layouts = {
    qwerty: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl']
    ],
    dvorak: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']', 'Backspace'],
      ['Tab', '\'', ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
      ['Caps', 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-', 'Enter'],
      ['Shift', ';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl']
    ],
    colemak: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', ';', '[', ']', '\\'],
      ['Caps', 'a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o', '\'', 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'k', 'm', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl']
    ]
  };
  
  // Key widths for special keys
  const keyWidths: Record<string, number> = {
    'Backspace': 2,
    'Tab': 1.5,
    'Caps': 1.75,
    'Enter': 2.25,
    'Shift': 2.25,
    'Ctrl': 1.25,
    'Win': 1.25,
    'Alt': 1.25,
    'Menu': 1.25,
    'Space': 6.25
  };
  
  useEffect(() => {
    if (!isDesktop() || !showPressed) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setPressedKeys(prev => {
        const updated = new Set(prev);
        updated.add(key);
        return updated;
      });
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setPressedKeys(prev => {
        const updated = new Set(prev);
        updated.delete(key);
        return updated;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showPressed]);
  
  const selectedLayout = layouts[layout];
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        userSelect: 'none',
      }}
    >
      {selectedLayout.map((row, rowIndex) => (
        <Box
          key={`row-${rowIndex}`}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {row.map((keyChar, keyIndex) => {
            const lowerKey = keyChar.toLowerCase();
            const isPressed = showPressed && pressedKeys.has(lowerKey);
            const isTarget = highlightTarget && targetKey?.toLowerCase() === lowerKey;
            const width = keyWidths[keyChar] || 1;
            
            return (
              <Key
                key={`${rowIndex}-${keyIndex}`}
                keyChar={keyChar}
                width={width}
                isPressed={isPressed}
                isTarget={isTarget}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default KeyboardVisualizer; 