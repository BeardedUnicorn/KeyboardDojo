import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';
import Footer from './Footer';
import { isDesktop } from '../../../shared/src/utils';
import AppTopBar from './AppTopBar';
import UserInfo from './UserInfo';
import { useThemeContext } from '../contexts/ThemeContext';
import SettingsPanel from './settings-panel';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { mode, toggleTheme } = useThemeContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };
  
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* App Top Bar (desktop only) */}
      {isDesktop() && <AppTopBar onOpenSettings={handleOpenSettings} />}
      
      {/* Main content area with navigation */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {/* Navigation drawer */}
        <Navigation />
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {/* Header with user info */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box>
              {/* Left side - can be used for breadcrumbs or page title */}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <UserInfo />
            </Box>
          </Box>
          
          {/* Content */}
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          
          {/* Footer */}
          <Footer />
        </Box>
      </Box>
      
      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} onClose={handleCloseSettings} />
    </Box>
  );
};

export default MainLayout; 