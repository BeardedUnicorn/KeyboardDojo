import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, Paper } from '@mui/material';
import { keyframes } from '@mui/system';

// Define key types
export type KeyType = 'regular' | 'wide' | 'extra-wide' | 'space' | 'small';

// Define key data
export interface KeyData {
  key: string;
  type?: KeyType;
  width?: number; // in units, 1 unit = regular key width
  display?: string; // display text (if different from key)
  row: number;
  position: number; // position in row
}

// Define keyboard layout
export type KeyboardLayout = 'standard' | 'compact' | 'mac' | 'windows';

// Define props interface
interface KeyboardVisualizationProps {
  highlightedKeys?: string[];
  pressedKeys?: string[];
  keySequence?: string[];
  showLabels?: boolean;
  layout?: KeyboardLayout;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

// Animations
const pressAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(0.95);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const highlightAnimation = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(66, 135, 245, 0.5);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(66, 135, 245, 0.8);
  }
`;

// Styled components
const KeyboardContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
}));

const KeyboardRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginBottom: theme.spacing(0.5),
  width: '100%',
}));

const KeyCap = styled(Box, {
  shouldForwardProp: (prop) => !['keyType', 'isHighlighted', 'isPressed', 'isAnimated', 'keySize'].includes(prop as string),
})<{ 
  keyType: KeyType; 
  isHighlighted: boolean; 
  isPressed: boolean;
  isAnimated: boolean;
  keySize: 'small' | 'medium' | 'large';
}>(({ theme, keyType, isHighlighted, isPressed, isAnimated, keySize }) => {
  // Determine key dimensions based on size
  const getSizeValue = (small: number, medium: number, large: number) => {
    switch (keySize) {
      case 'small':
        return small;
      case 'large':
        return large;
      case 'medium':
      default:
        return medium;
    }
  };
  
  const baseWidth = getSizeValue(30, 40, 50);
  const baseHeight = getSizeValue(30, 40, 50);
  const fontSize = getSizeValue(10, 12, 14);
  
  // Determine width based on key type
  let width = baseWidth;
  switch (keyType) {
    case 'wide':
      width = baseWidth * 1.5;
      break;
    case 'extra-wide':
      width = baseWidth * 2;
      break;
    case 'space':
      width = baseWidth * 6;
      break;
    case 'small':
      width = baseWidth * 0.8;
      break;
    default:
      width = baseWidth;
  }
  
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${width}px`,
    height: `${baseHeight}px`,
    margin: theme.spacing(0.25),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isPressed 
      ? theme.palette.primary.main 
      : isHighlighted 
        ? `${theme.palette.primary.main}20`
        : theme.palette.background.default,
    color: isPressed 
      ? theme.palette.primary.contrastText 
      : isHighlighted 
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.1s ease',
    fontFamily: 'monospace',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    userSelect: 'none',
    position: 'relative',
    ...(isPressed && isAnimated && {
      animation: `${pressAnimation} 0.2s ease-in-out`,
    }),
    ...(isHighlighted && isAnimated && {
      animation: `${highlightAnimation} 1.5s infinite ease-in-out`,
    }),
  };
});

const KeyLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: '2px',
  right: '2px',
  fontSize: '0.6rem',
  color: theme.palette.text.secondary,
  lineHeight: 1,
}));

// Standard keyboard layout data
const standardLayout: KeyData[] = [
  // Row 1 (number row)
  { key: '`', row: 1, position: 1 },
  { key: '1', row: 1, position: 2 },
  { key: '2', row: 1, position: 3 },
  { key: '3', row: 1, position: 4 },
  { key: '4', row: 1, position: 5 },
  { key: '5', row: 1, position: 6 },
  { key: '6', row: 1, position: 7 },
  { key: '7', row: 1, position: 8 },
  { key: '8', row: 1, position: 9 },
  { key: '9', row: 1, position: 10 },
  { key: '0', row: 1, position: 11 },
  { key: '-', row: 1, position: 12 },
  { key: '=', row: 1, position: 13 },
  { key: 'Backspace', type: 'wide', row: 1, position: 14, display: '⌫' },
  
  // Row 2
  { key: 'Tab', type: 'wide', row: 2, position: 1, display: '⇥' },
  { key: 'q', row: 2, position: 2 },
  { key: 'w', row: 2, position: 3 },
  { key: 'e', row: 2, position: 4 },
  { key: 'r', row: 2, position: 5 },
  { key: 't', row: 2, position: 6 },
  { key: 'y', row: 2, position: 7 },
  { key: 'u', row: 2, position: 8 },
  { key: 'i', row: 2, position: 9 },
  { key: 'o', row: 2, position: 10 },
  { key: 'p', row: 2, position: 11 },
  { key: '[', row: 2, position: 12 },
  { key: ']', row: 2, position: 13 },
  { key: '\\', row: 2, position: 14 },
  
  // Row 3
  { key: 'CapsLock', type: 'wide', row: 3, position: 1, display: 'Caps' },
  { key: 'a', row: 3, position: 2 },
  { key: 's', row: 3, position: 3 },
  { key: 'd', row: 3, position: 4 },
  { key: 'f', row: 3, position: 5 },
  { key: 'g', row: 3, position: 6 },
  { key: 'h', row: 3, position: 7 },
  { key: 'j', row: 3, position: 8 },
  { key: 'k', row: 3, position: 9 },
  { key: 'l', row: 3, position: 10 },
  { key: ';', row: 3, position: 11 },
  { key: "'", row: 3, position: 12 },
  { key: 'Enter', type: 'wide', row: 3, position: 13, display: '⏎' },
  
  // Row 4
  { key: 'Shift', type: 'extra-wide', row: 4, position: 1, display: '⇧' },
  { key: 'z', row: 4, position: 2 },
  { key: 'x', row: 4, position: 3 },
  { key: 'c', row: 4, position: 4 },
  { key: 'v', row: 4, position: 5 },
  { key: 'b', row: 4, position: 6 },
  { key: 'n', row: 4, position: 7 },
  { key: 'm', row: 4, position: 8 },
  { key: ',', row: 4, position: 9 },
  { key: '.', row: 4, position: 10 },
  { key: '/', row: 4, position: 11 },
  { key: 'Shift', type: 'extra-wide', row: 4, position: 12, display: '⇧' },
  
  // Row 5 (bottom row)
  { key: 'Control', type: 'wide', row: 5, position: 1, display: 'Ctrl' },
  { key: 'Meta', type: 'wide', row: 5, position: 2, display: 'Win' },
  { key: 'Alt', type: 'wide', row: 5, position: 3, display: 'Alt' },
  { key: ' ', type: 'space', row: 5, position: 4, display: 'Space' },
  { key: 'Alt', type: 'wide', row: 5, position: 5, display: 'Alt' },
  { key: 'Meta', type: 'wide', row: 5, position: 6, display: 'Win' },
  { key: 'Control', type: 'wide', row: 5, position: 7, display: 'Ctrl' },
];

// Mac keyboard layout data
const macLayout: KeyData[] = [
  // Row 1 (number row)
  { key: '`', row: 1, position: 1 },
  { key: '1', row: 1, position: 2 },
  { key: '2', row: 1, position: 3 },
  { key: '3', row: 1, position: 4 },
  { key: '4', row: 1, position: 5 },
  { key: '5', row: 1, position: 6 },
  { key: '6', row: 1, position: 7 },
  { key: '7', row: 1, position: 8 },
  { key: '8', row: 1, position: 9 },
  { key: '9', row: 1, position: 10 },
  { key: '0', row: 1, position: 11 },
  { key: '-', row: 1, position: 12 },
  { key: '=', row: 1, position: 13 },
  { key: 'Backspace', type: 'wide', row: 1, position: 14, display: '⌫' },
  
  // Row 2
  { key: 'Tab', type: 'wide', row: 2, position: 1, display: '⇥' },
  { key: 'q', row: 2, position: 2 },
  { key: 'w', row: 2, position: 3 },
  { key: 'e', row: 2, position: 4 },
  { key: 'r', row: 2, position: 5 },
  { key: 't', row: 2, position: 6 },
  { key: 'y', row: 2, position: 7 },
  { key: 'u', row: 2, position: 8 },
  { key: 'i', row: 2, position: 9 },
  { key: 'o', row: 2, position: 10 },
  { key: 'p', row: 2, position: 11 },
  { key: '[', row: 2, position: 12 },
  { key: ']', row: 2, position: 13 },
  { key: '\\', row: 2, position: 14 },
  
  // Row 3
  { key: 'CapsLock', type: 'wide', row: 3, position: 1, display: 'Caps' },
  { key: 'a', row: 3, position: 2 },
  { key: 's', row: 3, position: 3 },
  { key: 'd', row: 3, position: 4 },
  { key: 'f', row: 3, position: 5 },
  { key: 'g', row: 3, position: 6 },
  { key: 'h', row: 3, position: 7 },
  { key: 'j', row: 3, position: 8 },
  { key: 'k', row: 3, position: 9 },
  { key: 'l', row: 3, position: 10 },
  { key: ';', row: 3, position: 11 },
  { key: "'", row: 3, position: 12 },
  { key: 'Enter', type: 'wide', row: 3, position: 13, display: '⏎' },
  
  // Row 4
  { key: 'Shift', type: 'extra-wide', row: 4, position: 1, display: '⇧' },
  { key: 'z', row: 4, position: 2 },
  { key: 'x', row: 4, position: 3 },
  { key: 'c', row: 4, position: 4 },
  { key: 'v', row: 4, position: 5 },
  { key: 'b', row: 4, position: 6 },
  { key: 'n', row: 4, position: 7 },
  { key: 'm', row: 4, position: 8 },
  { key: ',', row: 4, position: 9 },
  { key: '.', row: 4, position: 10 },
  { key: '/', row: 4, position: 11 },
  { key: 'Shift', type: 'extra-wide', row: 4, position: 12, display: '⇧' },
  
  // Row 5 (bottom row)
  { key: 'Control', type: 'wide', row: 5, position: 1, display: 'Ctrl' },
  { key: 'Option', type: 'wide', row: 5, position: 2, display: '⌥' },
  { key: 'Command', type: 'wide', row: 5, position: 3, display: '⌘' },
  { key: ' ', type: 'space', row: 5, position: 4, display: 'Space' },
  { key: 'Command', type: 'wide', row: 5, position: 5, display: '⌘' },
  { key: 'Option', type: 'wide', row: 5, position: 6, display: '⌥' },
  { key: 'Control', type: 'wide', row: 5, position: 7, display: 'Ctrl' },
];

// Compact keyboard layout (for smaller displays)
const compactLayout: KeyData[] = [
  // Row 1
  { key: 'q', row: 1, position: 1 },
  { key: 'w', row: 1, position: 2 },
  { key: 'e', row: 1, position: 3 },
  { key: 'r', row: 1, position: 4 },
  { key: 't', row: 1, position: 5 },
  { key: 'y', row: 1, position: 6 },
  { key: 'u', row: 1, position: 7 },
  { key: 'i', row: 1, position: 8 },
  { key: 'o', row: 1, position: 9 },
  { key: 'p', row: 1, position: 10 },
  
  // Row 2
  { key: 'a', row: 2, position: 1 },
  { key: 's', row: 2, position: 2 },
  { key: 'd', row: 2, position: 3 },
  { key: 'f', row: 2, position: 4 },
  { key: 'g', row: 2, position: 5 },
  { key: 'h', row: 2, position: 6 },
  { key: 'j', row: 2, position: 7 },
  { key: 'k', row: 2, position: 8 },
  { key: 'l', row: 2, position: 9 },
  
  // Row 3
  { key: 'Shift', type: 'wide', row: 3, position: 1, display: '⇧' },
  { key: 'z', row: 3, position: 2 },
  { key: 'x', row: 3, position: 3 },
  { key: 'c', row: 3, position: 4 },
  { key: 'v', row: 3, position: 5 },
  { key: 'b', row: 3, position: 6 },
  { key: 'n', row: 3, position: 7 },
  { key: 'm', row: 3, position: 8 },
  { key: 'Backspace', type: 'wide', row: 3, position: 9, display: '⌫' },
  
  // Row 4 (bottom row)
  { key: 'Control', type: 'wide', row: 4, position: 1, display: 'Ctrl' },
  { key: 'Alt', type: 'wide', row: 4, position: 2, display: 'Alt' },
  { key: ' ', type: 'space', row: 4, position: 3, display: 'Space' },
  { key: 'Enter', type: 'wide', row: 4, position: 4, display: '⏎' },
];

// Get layout based on type
const getKeyboardLayout = (layout: KeyboardLayout): KeyData[] => {
  switch (layout) {
    case 'mac':
      return macLayout;
    case 'compact':
      return compactLayout;
    case 'windows':
    case 'standard':
    default:
      return standardLayout;
  }
};

// KeyboardVisualization component
const KeyboardVisualization: React.FC<KeyboardVisualizationProps> = ({
  highlightedKeys = [],
  pressedKeys = [],
  keySequence = [],
  showLabels = false,
  layout = 'standard',
  size = 'medium',
  animated = true,
  className,
}) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [sequenceIndex, setSequenceIndex] = useState<number>(0);
  
  // Get keyboard layout
  const keyboardLayout = getKeyboardLayout(layout);
  
  // Group keys by row
  const keysByRow: Record<number, KeyData[]> = {};
  keyboardLayout.forEach(key => {
    if (!keysByRow[key.row]) {
      keysByRow[key.row] = [];
    }
    keysByRow[key.row].push(key);
  });
  
  // Sort keys by position within each row
  Object.keys(keysByRow).forEach(rowKey => {
    const row = Number(rowKey);
    keysByRow[row].sort((a, b) => a.position - b.position);
  });
  
  // Handle key sequence animation
  useEffect(() => {
    if (keySequence.length === 0) return;
    
    // Reset sequence when it changes
    setSequenceIndex(0);
    setActiveKeys([keySequence[0]]);
    
    // Animate through sequence
    const interval = setInterval(() => {
      setSequenceIndex(prevIndex => {
        // sequenceIndex is used to track the current position in the keySequence array
        const nextIndex = prevIndex + 1;
        
        if (nextIndex >= keySequence.length) {
          // End of sequence, reset
          clearInterval(interval);
          setActiveKeys([]);
          return 0;
        }
        
        // Update active keys
        setActiveKeys([keySequence[nextIndex]]);
        return nextIndex;
      });
    }, 800); // Adjust timing as needed
    
    return () => clearInterval(interval);
  }, [keySequence]);
  
  // Combine highlighted and pressed keys
  const allHighlightedKeys = [...highlightedKeys, ...activeKeys];
  const allPressedKeys = [...pressedKeys];
  
  // Normalize key names for comparison
  const normalizeKey = (key: string): string => {
    return key.toLowerCase();
  };
  
  // Check if a key is highlighted or pressed
  const isKeyHighlighted = (key: string): boolean => {
    return allHighlightedKeys.some(k => normalizeKey(k) === normalizeKey(key));
  };
  
  const isKeyPressed = (key: string): boolean => {
    return allPressedKeys.some(k => normalizeKey(k) === normalizeKey(key));
  };
  
  // Display current sequence position for screen readers (if sequence is active)
  const sequenceAnnouncement = keySequence.length > 0 
    ? `Key ${sequenceIndex + 1} of ${keySequence.length}: ${keySequence[sequenceIndex]}`
    : '';
  
  // Render keyboard
  return (
    <KeyboardContainer className={className}>
      {/* Hidden text for screen readers */}
      {sequenceAnnouncement && (
        <Typography sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }} aria-live="polite">
          {sequenceAnnouncement}
        </Typography>
      )}
      {Object.keys(keysByRow).map(rowKey => {
        const row = Number(rowKey);
        return (
          <KeyboardRow key={row}>
            {keysByRow[row].map((keyData, index) => (
              <KeyCap
                key={`${row}-${index}`}
                keyType={keyData.type || 'regular'}
                isHighlighted={isKeyHighlighted(keyData.key)}
                isPressed={isKeyPressed(keyData.key)}
                isAnimated={animated}
                keySize={size}
              >
                {keyData.display || keyData.key}
                {showLabels && keyData.key !== (keyData.display || keyData.key) && (
                  <KeyLabel variant="caption">{keyData.key}</KeyLabel>
                )}
              </KeyCap>
            ))}
          </KeyboardRow>
        );
      })}
    </KeyboardContainer>
  );
};

export default KeyboardVisualization; 