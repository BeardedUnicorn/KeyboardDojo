import { Box, Typography, Chip, Stack } from '@mui/material';
import React, { Fragment } from 'react';

import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { FC } from 'react';

interface ShortcutDisplayProps {
  shortcut: IShortcut;
  showDescription?: boolean;
  /**
   * Additional context information for screen readers
   */
  accessibilityContext?: string;
  /**
   * ID used to identify this shortcut for accessibility purposes
   */
  shortcutId?: string;
}

const ShortcutDisplay: FC<ShortcutDisplayProps> = ({
  shortcut,
  showDescription = true,
  accessibilityContext,
  shortcutId = `shortcut-${shortcut.id}`,
}) => {
  // Determine which shortcut to display based on OS
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isLinux = navigator.platform.toUpperCase().indexOf('LINUX') >= 0;

  let shortcutText = shortcut.shortcutWindows; // Default to Windows

  if (isMac && shortcut.shortcutMac) {
    shortcutText = shortcut.shortcutMac;
  } else if (isLinux && shortcut.shortcutLinux) {
    shortcutText = shortcut.shortcutLinux;
  }

  // Split the shortcut into individual keys
  const keys = shortcutText.split('+').map((key) => key.trim());

  // Create an accessible description of the shortcut for screen readers
  const getAccessibleDescription = () => {
    const osSpecific = isMac ? 'Mac' : isLinux ? 'Linux' : 'Windows';
    const keyCombo = keys.join(' plus ');
    const description = shortcut.description || '';
    const context = shortcut.context || '';
    const additionalContext = accessibilityContext || '';

    return `${shortcut.name} shortcut: ${keyCombo}. ${description} ${context ? `Used in: ${context}.` : ''} ${additionalContext}`;
  };

  return (
    <Box 
      role="region" 
      aria-labelledby={`${shortcutId}-name`}
      aria-describedby={`${shortcutId}-desc ${shortcutId}-keys`}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="h6" id={`${shortcutId}-name`}>{shortcut.name}</Typography>
        {shortcut.category && (
          <Chip
            label={shortcut.category}
            size="small"
            color="primary"
            variant="outlined"
            aria-label={`Category: ${shortcut.category}`}
          />
        )}
      </Stack>

      {showDescription && shortcut.description && (
        <Typography variant="body2" color="text.secondary" paragraph id={`${shortcutId}-desc`}>
          {shortcut.description}
        </Typography>
      )}

      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center"
        role="group"
        aria-label={`Keyboard shortcut combination for ${shortcut.name}`}
        id={`${shortcutId}-keys`}
      >
        {keys.map((key, index) => (
          <Fragment key={index}>
            <Chip
              label={key}
              sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '4px',
                px: 1,
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
              role="img"
              aria-label={`${key} key`}
              tabIndex={0}
            />
            {index < keys.length - 1 && (
              <Typography variant="body2" color="text.secondary" aria-hidden="true">
                +
              </Typography>
            )}
          </Fragment>
        ))}
      </Stack>

      {shortcut.context && (
        <Typography variant="body2" color="text.secondary" mt={1} id={`${shortcutId}-context`}>
          Context: {shortcut.context}
        </Typography>
      )}
      
      {/* Visually hidden full shortcut description for screen readers */}
      <Typography 
        className="visually-hidden" 
        sx={{ 
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        {getAccessibleDescription()}
      </Typography>
    </Box>
  );
};

export default ShortcutDisplay;
