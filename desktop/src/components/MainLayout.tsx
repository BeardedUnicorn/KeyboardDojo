import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Navigation from './Navigation';
import Footer from './Footer';
import ResponsiveLayout from './ResponsiveLayout';
import { isDesktop } from '../../../shared/src/utils';
import TitleBar from './title-bar';
import { WindowSize } from '../utils/responsive';
import HeartsDisplay from './HeartsDisplay';
import UserInfo from './UserInfo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Title bar (desktop only) */}
      {isDesktop() && <TitleBar />}
      
      {/* Main content area with responsive layout */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <ResponsiveLayout
          sidebar={<Navigation />}
          sidebarPosition="left"
          sidebarWidth={{
            [WindowSize.XS]: 0,
            [WindowSize.SM]: 240,
            [WindowSize.MD]: 280,
            [WindowSize.LG]: 300,
            [WindowSize.XL]: 320
          }}
          showSidebar={{
            [WindowSize.XS]: false,
            [WindowSize.SM]: true,
            [WindowSize.MD]: true,
            [WindowSize.LG]: true,
            [WindowSize.XL]: true
          }}
          spacing={3}
          minContentWidth={320}
          maxContentWidth={1200}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
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
        </ResponsiveLayout>
      </Box>
    </Box>
  );
};

export default MainLayout; 