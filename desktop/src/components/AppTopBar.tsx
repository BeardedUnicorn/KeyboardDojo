import {
  SettingsOutlined as SettingsIcon,
  Keyboard as KeyboardIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { useThemeRedux } from '../hooks/useThemeRedux';
import { osDetectionService } from '../services/osDetectionService';
import { windowManager } from '../utils/windowManager';

import type { FC } from 'react';

interface AppTopBarProps {
  title?: string;
  onOpenSettings?: () => void;
}

const AppTopBar: FC<AppTopBarProps> = ({
  title = 'Keyboard Dojo',
  onOpenSettings,
}) => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeRedux();
  const [isMaximized, setIsMaximized] = useState(false);
  const isMacOS = osDetectionService.isMacOS();

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

  // Add a data attribute to help users understand the draggable area
  const dragAreaProps = {
    'data-tauri-drag-region': true,
    className: 'draggable-area',
  };

  // macOS-style traffic light controls
  const MacOSWindowControls = () => (
    <Box
      sx={{
        display: 'flex',
        WebkitAppRegion: 'no-drag',
        ml: 1.5,
        mr: 2,
      }}
    >
      <Box
        onClick={handleClose}
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: '#ff5f57',
          mx: 0.5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            '&::before': {
              content: '"×"',
              fontSize: '10px',
              color: '#450000',
              fontWeight: 'bold',
            },
          },
        }}
      />
      <Box
        onClick={handleMinimize}
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: '#ffbd2e',
          mx: 0.5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            '&::before': {
              content: '"−"',
              fontSize: '10px',
              color: '#5a3c00',
              fontWeight: 'bold',
            },
          },
        }}
      />
      <Box
        onClick={handleMaximizeRestore}
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: '#28c940',
          mx: 0.5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            '&::before': {
              content: '"+"',
              fontSize: '10px',
              color: '#003600',
              fontWeight: 'bold',
            },
          },
        }}
      />
    </Box>
  );

  // Windows-style window controls
  const WindowsWindowControls = () => (
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
        <Box sx={{ width: 10, height: 1, bgcolor: 'currentColor' }} />
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
        <Box
          sx={{
            width: 10,
            height: 10,
            border: 1,
            borderColor: 'currentColor',
          }}
        />
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
        <Box
          sx={{
            width: 12,
            height: 12,
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              width: 1,
              height: '100%',
              bgcolor: 'currentColor',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
            },
            '&::before': {
              transform: 'translateX(-50%) rotate(45deg)',
            },
            '&::after': {
              transform: 'translateX(-50%) rotate(-45deg)',
            },
          }}
        />
      </IconButton>
    </Box>
  );

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={{
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        height: 48,
        zIndex: theme.zIndex.drawer + 1,
        cursor: 'move', // Visual indicator that this area is draggable
      }}
      {...dragAreaProps}
    >
      <Toolbar
        variant="dense"
        sx={{ minHeight: 48, px: 1 }}
        {...dragAreaProps}
      >
        {/* macOS traffic light controls (left side) */}
        {isMacOS && <MacOSWindowControls />}

        {/* App Logo and Title */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', mr: 2 }}
          {...dragAreaProps}
        >
          <KeyboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} {...dragAreaProps} />

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

        {/* Windows-style window controls (right side) */}
        {!isMacOS && <WindowsWindowControls />}
      </Toolbar>
    </AppBar>
  );
};

export default AppTopBar;
