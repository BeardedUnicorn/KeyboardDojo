import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Close as CloseIcon,
  SettingsOutlined as SettingsIcon,
  Keyboard as KeyboardIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { windowManager } from '../../../shared/src/utils';
import { useThemeContext } from '../contexts/ThemeContext';

interface AppTopBarProps {
  title?: string;
  onOpenSettings?: () => void;
}

const AppTopBar: React.FC<AppTopBarProps> = ({ 
  title = 'Keyboard Dojo',
  onOpenSettings
}) => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
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
    <AppBar 
      position="static" 
      color="primary" 
      elevation={0}
      sx={{ 
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        height: 48,
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1 }}>
        {/* App Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <KeyboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* App Actions - Not draggable */}
        <Box sx={{ display: 'flex', WebkitAppRegion: 'no-drag' }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              size="small"
              sx={{ mx: 0.5 }}
            >
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Settings */}
          {onOpenSettings && (
            <Tooltip title="Settings">
              <IconButton 
                color="inherit" 
                onClick={onOpenSettings}
                size="small"
                sx={{ mx: 0.5 }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Window Controls - Not draggable */}
        <Box sx={{ display: 'flex', WebkitAppRegion: 'no-drag', ml: 1 }}>
          <IconButton
            size="small"
            onClick={handleMinimize}
            sx={{
              color: 'inherit',
              borderRadius: 0,
              width: 40,
              height: 40,
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
              color: 'inherit',
              borderRadius: 0,
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <MaximizeIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: 'inherit',
              borderRadius: 0,
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: theme.palette.error.main,
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppTopBar; 