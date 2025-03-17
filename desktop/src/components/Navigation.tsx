import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Home as HomeIcon,
  Keyboard as KeyboardIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  School as SchoolIcon,
  EmojiEvents as AchievementsIcon,
  Favorite as FavoriteIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useThemeContext } from '../contexts/ThemeContext';

// Drawer widths
const drawerWidth = 240;
const miniDrawerWidth = 56;

interface NavigationItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const Navigation = () => {
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPremium } = useSubscription();
  
  // Get saved drawer state from localStorage or default to mini
  const getSavedDrawerState = (): boolean => {
    const savedState = localStorage.getItem('drawerOpen');
    return savedState ? savedState === 'true' : false; // Default to mini/collapsed
  };
  
  const [open, setOpen] = useState(getSavedDrawerState());

  const handleDrawerToggle = () => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem('drawerOpen', String(newState));
  };

  const navigationItems: NavigationItem[] = [
    {
      text: 'Home',
      path: '/',
      icon: <HomeIcon />
    },
    {
      text: 'Shortcuts',
      path: '/shortcuts',
      icon: <KeyboardIcon />
    },
    {
      text: 'Curriculum',
      path: '/curriculum',
      icon: <SchoolIcon />
    },
    {
      text: 'Achievements',
      path: '/achievements',
      icon: <AchievementsIcon />
    },
    {
      text: 'Subscription',
      path: '/subscription',
      icon: 
        <Badge color="error" variant="dot" invisible={hasPremium}>
          <FavoriteIcon />
        </Badge>
    },
    {
      text: 'Profile',
      path: '/profile',
      icon: <PersonIcon />
    },
    {
      text: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />
    },
    {
      text: 'Progress',
      path: '/progress-dashboard',
      icon: <AssessmentIcon />
    }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : miniDrawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'flex-end' : 'center', 
        p: 1 
      }}>
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={open ? '' : item.text} placement="right">
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 600) {
                    setOpen(false);
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    transition: theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shorter,
                    })
                  }} 
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Navigation; 