import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { isDesktop } from '../../../shared/src/utils';

// Drawer widths
const drawerWidth = 240;
const miniDrawerWidth = 56;

interface NavigationItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();
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

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/lessons', label: 'Lessons', icon: <SchoolIcon /> },
    { path: '/achievements', label: 'Achievements', icon: <EmojiEventsIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  // Calculate top offset for the drawer based on whether we're in desktop mode
  const topOffset = isDesktop() ? 48 : 0; // 48px is the height of our AppTopBar

  return (
    <Box
      component="nav"
      sx={{
        width: open ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        // Adjust top position to account for the AppTopBar
        height: '100%',
      }}
    >
      {/* Drawer header with toggle button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          padding: theme.spacing(0, 1),
          minHeight: 56,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Navigation items */}
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={open ? '' : item.label} placement="right">
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
                  primary={item.label} 
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
      
      <Divider />
      
      {/* Bottom navigation items */}
      <List>
        {/* Premium/Subscription */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            selected={location.pathname === '/subscription'}
            onClick={() => {
              navigate('/subscription');
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
            <Tooltip title={hasPremium ? 'Premium Active' : 'Upgrade to Premium'}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: hasPremium ? 'warning.main' : 'inherit',
                }}
              >
                <WorkspacePremiumIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText 
              primary={hasPremium ? 'Premium Active' : 'Upgrade'} 
              sx={{ 
                opacity: open ? 1 : 0,
                transition: theme.transitions.create('opacity'),
                '& .MuiTypography-root': {
                  color: hasPremium ? theme.palette.warning.main : 'inherit',
                  fontWeight: hasPremium ? 'bold' : 'regular',
                }
              }} 
            />
          </ListItemButton>
        </ListItem>
        
        {/* Settings */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            selected={location.pathname === '/settings'}
            onClick={() => {
              navigate('/settings');
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
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Settings" 
              sx={{ 
                opacity: open ? 1 : 0,
                transition: theme.transitions.create('opacity'),
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Navigation; 