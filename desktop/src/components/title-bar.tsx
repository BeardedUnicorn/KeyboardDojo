import { useState, useEffect } from 'react';
import { windowManager } from '../../../shared/src/utils';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface TitleBarProps {
  title?: string;
}

const TitleBar = ({ title = 'Keyboard Dojo' }: TitleBarProps) => {
  const theme = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Set the window title
    windowManager.setTitle(title);

    // Check if window is maximized
    const checkMaximized = async () => {
      const maximized = await windowManager.isMaximized();
      setIsMaximized(maximized);
    };

    checkMaximized();

    // Listen for window maximize/unmaximize events
    const unlistenMaximize = windowManager.listen('maximize', () => setIsMaximized(true));
    const unlistenUnmaximize = windowManager.listen('unmaximize', () => setIsMaximized(false));

    return () => {
      unlistenMaximize();
      unlistenUnmaximize();
    };
  }, [title]);

  const handleMinimize = () => {
    windowManager.minimize();
  };

  const handleMaximizeRestore = () => {
    if (isMaximized) {
      windowManager.restore();
    } else {
      windowManager.maximize();
    }
  };

  const handleClose = () => {
    windowManager.close();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 32,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        WebkitAppRegion: 'drag', // Make the title bar draggable
        userSelect: 'none',
        px: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <KeyboardIcon fontSize="small" />
        <Typography variant="subtitle2">{title}</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', WebkitAppRegion: 'no-drag' }}>
        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{
            color: theme.palette.primary.contrastText,
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>
        
        <IconButton
          size="small"
          onClick={handleMaximizeRestore}
          sx={{
            color: theme.palette.primary.contrastText,
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CropSquareIcon fontSize="small" />
        </IconButton>
        
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: theme.palette.primary.contrastText,
            borderRadius: 0,
            '&:hover': {
              backgroundColor: theme.palette.error.main,
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