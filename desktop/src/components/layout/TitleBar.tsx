import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

import { loggerService, windowService } from '../../services';

interface TitleBarProps {
  title?: string;
}

const TitleBar = ({ title = 'Keyboard Dojo' }: TitleBarProps) => {
  const theme = useTheme();
  const [_isMaximized, setIsMaximized] = useState(false);

  // Check if window is maximized on mount and when window state changes
  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const maximized = await windowService.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        loggerService.error('Failed to check if window is maximized:', { error });
      }
    };

    // Initial check
    checkMaximized();

    // Set up event listener for window state changes
    const handleResize = () => {
      checkMaximized();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle minimize button click
  const handleMinimize = () => {
    windowService.minimize();
  };

  // Handle maximize/restore button click
  const handleMaximizeRestore = () => {
    windowService.toggleMaximize();
  };

  // Handle close button click
  const handleClose = () => {
    windowService.close();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '32px',
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      {/* App logo and title */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          ml: 1,
        }}
      >
        <KeyboardIcon 
          sx={{ 
            mr: 1, 
            color: theme.palette.primary.main,
          }} 
        />
        <Typography 
          variant="subtitle2" 
          color="textPrimary"
        >
          {title}
        </Typography>
      </Box>

      {/* Window controls */}
      <Box
        sx={{
          display: 'flex',
          WebkitAppRegion: 'no-drag',
        }}
      >
        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{ 
            borderRadius: 0, 
            height: '32px', 
            width: '46px',
          }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleMaximizeRestore}
          sx={{ 
            borderRadius: 0, 
            height: '32px', 
            width: '46px',
          }}
        >
          <CropSquareIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            borderRadius: 0,
            height: '32px',
            width: '46px',
            '&:hover': {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TitleBar;
