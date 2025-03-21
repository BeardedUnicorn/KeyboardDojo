import { Box, Paper, Chip, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useMemo } from 'react';

import { osDetectionService } from '../../services';

import type { FC, ReactNode } from 'react';

export interface KeyData {
  key: string;
  displayName?: string;
  width?: number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  highlighted?: boolean;
}

interface KeyboardLayout {
  name: string;
  rows: KeyData[][];
}

export interface KeyboardVisualizationProps {
  /**
   * Keys to highlight in the keyboard
   */
  highlightedKeys?: string[];
  /**
   * Key combination to display
   */
  keyCombination?: string[];
  /**
   * Keyboard layout to display
   */
  layout?: 'qwerty' | 'dvorak' | 'colemak';
  /**
   * Size of the keyboard
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show a compact version with only the highlighted keys
   */
  compact?: boolean;
}

const KeyComponent = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'highlighted',
})<{ width?: number; highlighted?: boolean }>(({ theme, width, highlighted }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  minWidth: theme.spacing(width || 4),
  height: theme.spacing(4),
  fontFamily: 'monospace',
  fontWeight: 'bold',
  cursor: 'default',
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(highlighted
    ? {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
      }
    : {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
      }),
}));

const KeyRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
}));

// QWERTY keyboard layout
const qwertyLayout: KeyboardLayout = {
  name: 'QWERTY',
  rows: [
    [
      { key: 'q' },
      { key: 'w' },
      { key: 'e' },
      { key: 'r' },
      { key: 't' },
      { key: 'y' },
      { key: 'u' },
      { key: 'i' },
      { key: 'o' },
      { key: 'p' },
    ],
    [
      { key: 'a' },
      { key: 's' },
      { key: 'd' },
      { key: 'f' },
      { key: 'g' },
      { key: 'h' },
      { key: 'j' },
      { key: 'k' },
      { key: 'l' },
    ],
    [
      { key: 'z' },
      { key: 'x' },
      { key: 'c' },
      { key: 'v' },
      { key: 'b' },
      { key: 'n' },
      { key: 'm' },
    ],
  ],
};

// Dvorak keyboard layout
const dvorakLayout: KeyboardLayout = {
  name: 'Dvorak',
  rows: [
    [
      { key: "'" },
      { key: ',' },
      { key: '.' },
      { key: 'p' },
      { key: 'y' },
      { key: 'f' },
      { key: 'g' },
      { key: 'c' },
      { key: 'r' },
      { key: 'l' },
    ],
    [
      { key: 'a' },
      { key: 'o' },
      { key: 'e' },
      { key: 'u' },
      { key: 'i' },
      { key: 'd' },
      { key: 'h' },
      { key: 't' },
      { key: 'n' },
      { key: 's' },
    ],
    [
      { key: ';' },
      { key: 'q' },
      { key: 'j' },
      { key: 'k' },
      { key: 'x' },
      { key: 'b' },
      { key: 'm' },
      { key: 'w' },
      { key: 'v' },
      { key: 'z' },
    ],
  ],
};

// Colemak keyboard layout
const colemakLayout: KeyboardLayout = {
  name: 'Colemak',
  rows: [
    [
      { key: 'q' },
      { key: 'w' },
      { key: 'f' },
      { key: 'p' },
      { key: 'g' },
      { key: 'j' },
      { key: 'l' },
      { key: 'u' },
      { key: 'y' },
      { key: ';' },
    ],
    [
      { key: 'a' },
      { key: 'r' },
      { key: 's' },
      { key: 't' },
      { key: 'd' },
      { key: 'h' },
      { key: 'n' },
      { key: 'e' },
      { key: 'i' },
      { key: 'o' },
    ],
    [
      { key: 'z' },
      { key: 'x' },
      { key: 'c' },
      { key: 'v' },
      { key: 'b' },
      { key: 'k' },
      { key: 'm' },
    ],
  ],
};

// Modifier keys row
const modifierKeys: KeyData[] = [
  { key: 'control', displayName: 'Ctrl', width: 6 },
  { key: 'alt', displayName: 'Alt', width: 4 },
  { key: 'meta', displayName: osDetectionService.isMacOS() ? '⌘' : 'Win', width: 4 },
  { key: ' ', displayName: 'Space', width: 12 },
  { key: 'shift', displayName: 'Shift', width: 8 },
];

/**
 * Component that visualizes keyboard layouts and highlights specific keys.
 */
const KeyboardVisualization: FC<KeyboardVisualizationProps> = ({
  highlightedKeys = [],
  keyCombination,
  layout = 'qwerty',
  size = 'medium',
  compact = false,
}) => {
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>(qwertyLayout);

  // Update the keyboard layout based on the layout prop
  useEffect(() => {
    switch (layout) {
      case 'dvorak':
        setKeyboardLayout(dvorakLayout);
        break;
      case 'colemak':
        setKeyboardLayout(colemakLayout);
        break;
      default:
        setKeyboardLayout(qwertyLayout);
    }
  }, [layout]);

  // Convert keyCombination to highlightedKeys if provided
  const effectiveHighlightedKeys = keyCombination || highlightedKeys;

  // Scale factors for different sizes
  const scaleFactor = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;

  // Memoize the rows to render calculation to improve performance
  const rowsToRender = useMemo(() => {
    return compact
      ? keyboardLayout.rows.map((row) =>
          row.filter((key) =>
            effectiveHighlightedKeys.includes(key.key.toLowerCase()),
          ),
        ).filter((row) => row.length > 0)
      : keyboardLayout.rows;
  }, [compact, keyboardLayout.rows, effectiveHighlightedKeys]);
  
  // Memoize the modifier keys filtering
  const modifiersToRender = useMemo(() => {
    return compact
      ? modifierKeys.filter((key) =>
          effectiveHighlightedKeys.includes(key.key.toLowerCase()),
        )
      : modifierKeys;
  }, [compact, effectiveHighlightedKeys]);

  // Memoize the description of highlighted keys for screen readers
  const highlightedKeysDescription = useMemo(() => {
    if (!effectiveHighlightedKeys || effectiveHighlightedKeys.length === 0) {
      return 'No keys are currently highlighted on the keyboard.';
    }
    
    const keyNames = effectiveHighlightedKeys.map((key) => {
      const keyName = key === 'meta' 
        ? osDetectionService.isMacOS() ? 'Command' : 'Windows'
        : key === 'control' ? 'Control'
        : key === 'alt' ? 'Alt'
        : key === 'shift' ? 'Shift'
        : key === ' ' ? 'Space'
        : key.charAt(0).toUpperCase() + key.slice(1);
      return keyName;
    });
    
    if (keyCombination) {
      return `Keyboard shortcut: ${keyNames.join(' plus ')}. This combination is displayed visually as highlighted keys on the keyboard.`;
    }
    
    return `Highlighted keys: ${keyNames.join(', ')}. These keys are visually highlighted on the keyboard layout.`;
  }, [effectiveHighlightedKeys, keyCombination]);

  // Memoize the description of the keyboard layout for screen readers
  const keyboardDescription = useMemo(() => {
    const layoutDescription = `${keyboardLayout.name} keyboard layout`;
    const modeDescription = compact ? 'showing only relevant keys' : 'showing all keys';
    const highlightDescription = effectiveHighlightedKeys.length > 0 
      ? `with ${effectiveHighlightedKeys.length} highlighted key${effectiveHighlightedKeys.length > 1 ? 's' : ''}` 
      : 'with no highlighted keys';
    const interactionHint = 'Highlighted keys are focusable with the Tab key.';
    
    return `${layoutDescription} ${modeDescription} ${highlightDescription}. ${interactionHint}`;
  }, [keyboardLayout.name, compact, effectiveHighlightedKeys.length]);

  // Memoize the keyboard layout JSX
  const keyboardJSX = useMemo(() => {
    return (
      <>
        {rowsToRender.map((row, rowIndex) => (
          <KeyRow 
            key={`row-${rowIndex}`} 
            sx={{ transform: `scale(${scaleFactor})` }}
            role="row"
            aria-label={`Row ${rowIndex + 1} of ${rowsToRender.length} in keyboard`}
          >
            {row.map((keyData, keyIndex) => {
              const isHighlighted = effectiveHighlightedKeys.includes(keyData.key.toLowerCase());
              const keyLabel = keyData.displayName || keyData.key.toUpperCase();
              const keyDescription = 
                keyData.key === 'meta' ? (osDetectionService.isMacOS() ? 'Command' : 'Windows') : 
                keyData.key === 'control' ? 'Control' :
                keyData.key === 'alt' ? 'Alt' :
                keyData.key === 'shift' ? 'Shift' :
                keyData.key === ' ' ? 'Space' :
                keyLabel;
              
              return (
                <KeyComponent
                  key={`key-${rowIndex}-${keyData.key}-${keyIndex}`}
                  width={keyData.width}
                  highlighted={isHighlighted}
                  role="button"
                  tabIndex={isHighlighted ? 0 : -1}
                  aria-label={`${keyDescription} key${isHighlighted ? ', highlighted' : ''}`}
                  aria-pressed={isHighlighted}
                  aria-describedby={isHighlighted ? 'keyboard-description' : undefined}
                >
                  {keyLabel}
                </KeyComponent>
              );
            })}
          </KeyRow>
        ))}
        {modifiersToRender.length > 0 && (
          <KeyRow 
            key="modifier-row"
            sx={{ transform: `scale(${scaleFactor})` }}
            role="row"
            aria-label="Modifier keys row, bottom row of keyboard"
          >
            {modifiersToRender.map((keyData, keyIndex) => {
              const isHighlighted = effectiveHighlightedKeys.includes(keyData.key.toLowerCase());
              const keyLabel = keyData.displayName || keyData.key.toUpperCase();
              const keyDescription = 
                keyData.key === 'meta' ? (osDetectionService.isMacOS() ? 'Command' : 'Windows') : 
                keyData.key === 'control' ? 'Control' :
                keyData.key === 'alt' ? 'Alt' :
                keyData.key === 'shift' ? 'Shift' :
                keyData.key === ' ' ? 'Space bar' :
                keyLabel;
              
              return (
                <KeyComponent
                  key={`modifier-${keyData.key}-${keyIndex}`}
                  width={keyData.width}
                  highlighted={isHighlighted}
                  role="button"
                  tabIndex={isHighlighted ? 0 : -1}
                  aria-label={`${keyDescription} key${isHighlighted ? ', highlighted' : ''}`}
                  aria-pressed={isHighlighted}
                  aria-describedby={isHighlighted ? 'keyboard-description' : undefined}
                >
                  {keyLabel}
                </KeyComponent>
              );
            })}
          </KeyRow>
        )}
      </>
    );
  }, [rowsToRender, modifiersToRender, effectiveHighlightedKeys, scaleFactor]);

  // Memoize the key combination JSX
  const keyCombinationJSX = useMemo(() => {
    if (!keyCombination || keyCombination.length === 0) return null;

    // Create an accessible description of the key combination
    const combinationDescription = keyCombination.map((key) => {
      return key === 'meta' 
        ? osDetectionService.isMacOS() ? 'Command' : 'Windows'
        : key === 'control' ? 'Control'
        : key === 'alt' ? 'Alt'
        : key === 'shift' ? 'Shift'
        : key === ' ' ? 'Space'
        : key.charAt(0).toUpperCase() + key.slice(1);
    }).join(' plus ');

    return (
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center" 
        mb={2}
        role="group"
        aria-label={`Keyboard shortcut: ${combinationDescription}`}
        aria-describedby="shortcut-description"
      >
        <div 
          id="shortcut-description" 
          className="visually-hidden" 
          style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: '1px', overflow: 'hidden', position: 'absolute', whiteSpace: 'nowrap', width: '1px' }}
        >
          This shortcut is represented as a series of keys that should be pressed together.
        </div>
        {keyCombination.map((key, index) => (
          <Box key={`combo-${key}-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={
                key === 'meta'
                  ? osDetectionService.isMacOS()
                    ? '⌘'
                    : 'Win'
                  : key === 'control'
                  ? 'Ctrl'
                  : key === 'alt'
                  ? 'Alt'
                  : key === 'shift'
                  ? 'Shift'
                  : key === ' '
                  ? 'Space'
                  : key.charAt(0).toUpperCase() + key.slice(1)
              }
              sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              }}
              role="img"
              aria-label={
                key === 'meta'
                  ? osDetectionService.isMacOS() ? 'Command key' : 'Windows key'
                  : key === 'control' ? 'Control key'
                  : key === 'alt' ? 'Alt key'
                  : key === 'shift' ? 'Shift key'
                  : key === ' ' ? 'Space key'
                  : `${key} key`
              }
            />
            {index < keyCombination.length - 1 && (
              <Typography variant="body1" sx={{ mx: 0.5 }} aria-hidden="true">
                +
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    );
  }, [keyCombination]);

  return (
    <Box
      sx={{
        my: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {keyCombination && keyCombinationJSX}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          minWidth: compact ? 'auto' : 300,
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
        role="region"
        aria-label={keyboardDescription}
      >
        <Typography 
          variant="caption" 
          color="text.secondary" 
          display="block" 
          textAlign="center" 
          mb={1}
          id="keyboard-layout-title"
        >
          {keyboardLayout.name} Layout
        </Typography>
        <Box 
          role="application" 
          aria-label="Keyboard visualization" 
          aria-describedby="keyboard-description"
          aria-labelledby="keyboard-layout-title"
        >
          {keyboardJSX}
          <div 
            id="keyboard-description" 
            className="visually-hidden" 
            style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: '1px', overflow: 'hidden', position: 'absolute', whiteSpace: 'nowrap', width: '1px' }}
          >
            {highlightedKeysDescription}
            {effectiveHighlightedKeys.length > 0 && ' You can tab to the highlighted keys to navigate the keyboard.'}
          </div>
        </Box>
      </Paper>
    </Box>
  );
};

export default KeyboardVisualization;
