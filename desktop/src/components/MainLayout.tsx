import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { useXP } from '../hooks/useXP';

import AppTopBar from './AppTopBar';
import { CurrencyNotification } from './CurrencyNotification';
import Footer from './Footer';
import LevelUpNotification from './LevelUpNotification';
import { Navigation } from './Navigation';
import { SettingsPanel } from './settings';

import type { ReactNode, FC } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { isLevelingUp, level, levelTitle } = useXP();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Check if we're on desktop
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth >= 600);

  // Handle opening settings panel
  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  // Handle closing settings panel
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  // Show level up notification when level changes
  useEffect(() => {
    if (isLevelingUp) {
      setShowLevelUp(true);
    }
  }, [isLevelingUp]);

  // Update isDesktopView when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth >= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* App Top Bar (desktop only) */}
      {isDesktopView && <AppTopBar onOpenSettings={handleOpenSettings} />}

      {/* Main content area with navigation */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          // pt: isDesktopView ? '48px' : 0, // Add padding top for the AppTopBar on desktop
        }}
      >
        {/* Side Navigation */}
        <Navigation />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            height: isDesktopView ? 'calc(100vh - 48px)' : '100vh',
          }}
        >
          {children}

          {/* Footer (mobile only) */}
          {!isDesktopView && <Footer />}
        </Box>
      </Box>

      {/* Settings Panel */}
      <SettingsPanel
        open={settingsOpen}
        onClose={handleCloseSettings}
      />

      {/* Level Up Notification */}
      {showLevelUp && (
        <LevelUpNotification
          level={level}
          title={levelTitle}
          onClose={() => setShowLevelUp(false)}
          autoHideDuration={5000}
        />
      )}

      {/* Currency Notification */}
      <CurrencyNotification />
    </Box>
  );
};

export default MainLayout;
