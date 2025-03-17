import React from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';
import Footer from './Footer';
import { isDesktop } from '../../../shared/src/utils';
import TitleBar from './title-bar';
import HeartsDisplay from './HeartsDisplay';
import UserInfo from './UserInfo';
import { useThemeContext } from '../contexts/ThemeContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useThemeContext();
  
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
      {/* Title bar (desktop only) */}
      {isDesktop() && <TitleBar />}
      
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
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {/* Header with user info and hearts display */}
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
              <HeartsDisplay size="small" />
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
    </Box>
  );
};

export default MainLayout; 