import BugReportIcon from '@mui/icons-material/BugReport';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
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
  useTheme,
} from '@mui/material';
import React, { useState, useCallback, useMemo, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { ReactNode, FC } from 'react';
// Mock subscription context
const useSubscription = () => ({ isSubscribed: false, isPro: false, hasPremium: false });
// Mock theme context
const useThemeContext = () => ({ isDarkMode: false, toggleTheme: () => {}, mode: 'light' });
// Mock currency display component with required props
const CurrencyDisplay = ({ _variant, _showLabel }) => null;

// Drawer width when open
const drawerWidth = 240;
// Drawer width when closed (mini variant)
const miniDrawerWidth = 64;

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

export const Navigation: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode: _mode } = useThemeContext();
  const { hasPremium } = useSubscription();

  // Get saved drawer state from localStorage or default to mini
  const savedDrawerState = localStorage.getItem('drawerOpen');
  const [open, setOpen] = useState(savedDrawerState === 'true');

  const handleDrawerToggle = useCallback(() => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem('drawerOpen', String(newState));
  }, [open]);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const isDesktop = useCallback(() => {
    return window.innerWidth >= 600;
  }, []);

  // Navigation items
  const navItems = useMemo<NavItem[]>(() => [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/curriculum', label: 'Lessons', icon: <SchoolIcon /> },
    { path: '/achievements', label: 'Achievements', icon: <EmojiEventsIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
    { path: '/store', label: 'Store', icon: <ShoppingCartIcon /> },
  ], []);

  // Development navigation items
  const devNavItems = useMemo<NavItem[]>(() => [
    { path: '/sentry-test', label: 'Sentry Test', icon: <BugReportIcon /> },
    { path: '/sentry-redux-test', label: 'Sentry Redux', icon: <BugReportIcon /> },
    { path: '/sentry-transaction-test', label: 'Sentry Transactions', icon: <BugReportIcon /> },
  ], []);

  // Calculate top offset for the drawer based on whether we're in desktop mode
  const topOffset = useMemo(() => isDesktop() ? 48 : 0, [isDesktop]); // 48px is the height of our AppTopBar

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Only show dev items in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

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
        marginTop: `${topOffset}px`,
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
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={open ? '' : item.label} placement="right" arrow>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: isActive(item.path)
                    ? theme.palette.action.selected
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path)
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: isActive(item.path)
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Currency display */}
      {open && (
        <Box sx={{ p: 2 }}>
          <CurrencyDisplay _variant="default" _showLabel />
        </Box>
      )}

      {!open && (
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title="Currency" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <CurrencyDisplay _variant="compact" _showLabel={false} />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      )}

      <Divider />

      {/* Bottom navigation items */}
      <List>
        {/* Settings */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleNavigation('/settings')}
            selected={isActive('/settings')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              backgroundColor: isActive('/settings')
                ? theme.palette.action.selected
                : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Tooltip title={open ? '' : 'Settings'} placement="right" arrow>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive('/settings')
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              primary="Settings"
              sx={{
                opacity: open ? 1 : 0,
                color: isActive('/settings')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Subscription */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleNavigation('/subscription')}
            selected={isActive('/subscription')}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              backgroundColor: isActive('/subscription')
                ? theme.palette.action.selected
                : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Tooltip title={open ? '' : 'Subscription'} placement="right" arrow>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: isActive('/subscription')
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                }}
              >
                <WorkspacePremiumIcon color={hasPremium ? 'primary' : 'inherit'} />
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              primary="Subscription"
              sx={{
                opacity: open ? 1 : 0,
                color: isActive('/subscription')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Development section - only shown in development mode */}
      {isDevelopment && (
        <>
          <Divider sx={{ my: 1 }} />
          <List>
            {devNavItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    bgcolor: isActive(item.path)
                      ? 'action.selected'
                      : 'transparent',
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Tooltip title={!open ? item.label : ''} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: isActive(item.path)
                          ? 'primary.main'
                          : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: isActive(item.path)
                        ? 'primary.main'
                        : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default memo(Navigation);
