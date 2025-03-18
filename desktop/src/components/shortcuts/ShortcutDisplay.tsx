import { Box, Typography, Chip, Stack } from '@mui/material';
import React, { Fragment } from 'react';

import type { IShortcut } from '@/types/curriculum/IShortcut';
import type { FC } from 'react';

interface ShortcutDisplayProps {
  shortcut: IShortcut;
  showDescription?: boolean;
}

const ShortcutDisplay: FC<ShortcutDisplayProps> = ({
  shortcut,
  showDescription = true,
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

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="h6">{shortcut.name}</Typography>
        {shortcut.category && (
          <Chip
            label={shortcut.category}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Stack>

      {showDescription && shortcut.description && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {shortcut.description}
        </Typography>
      )}

      <Stack direction="row" spacing={1} alignItems="center">
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
              }}
            />
            {index < keys.length - 1 && (
              <Typography variant="body2" color="text.secondary">
                +
              </Typography>
            )}
          </Fragment>
        ))}
      </Stack>

      {shortcut.context && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Context: {shortcut.context}
        </Typography>
      )}
    </Box>
  );
};

export default ShortcutDisplay;
