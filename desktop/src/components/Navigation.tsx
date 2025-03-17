import React, { useState } from 'react';
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
  useTheme,
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

const drawerWidth = 240;

interface NavigationItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const Navigation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { hasPremium } = useSubscription();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigationItems: NavigationItem[] = [
    {
      text: 'Home',
      path: '/',
      icon: <HomeIcon />
    },
    {
      text: 'Practice',
      path: '/practice',
      icon: <KeyboardIcon />
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
    <>
      <Box sx={{ position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1100 }}>
        <Tooltip title="Open Navigation" placement="right">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              ml: 0.5,
              backgroundColor: theme.palette.background.paper,
              boxShadow: 1,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              },
              ...(open && { display: 'none' })
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 600) {
                    handleDrawerClose();
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navigation; 