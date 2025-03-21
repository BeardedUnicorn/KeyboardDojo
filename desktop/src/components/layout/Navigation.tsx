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
  Typography,
  Link,
} from '@mui/material';
import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSubscriptionRedux } from '@hooks/useSubscriptionRedux';

import type { ReactNode, FC, KeyboardEvent } from 'react';
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
  /**
   * Description for screen readers (optional, more detailed than label)
   */
  ariaDescription?: string;
}

interface NavigationProps {
  /**
   * ID used for accessibility purposes
   */
  navigationId?: string;
}

export const Navigation: FC<NavigationProps> = ({ 
  navigationId = 'main-navigation',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode: _mode } = useThemeContext();
  const { hasPremium } = useSubscriptionRedux();
  const mainContentRef = useRef<HTMLDivElement>(null);

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

  // Skip to content function
  const skipToContent = useCallback(() => {
    // Find the main content element and focus it
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Navigation items with enhanced accessibility descriptions
  const navItems = useMemo<NavItem[]>(() => [
    { 
      path: '/', 
      label: 'Home', 
      icon: <HomeIcon aria-hidden="true" />,
      ariaDescription: 'Go to home page with your dashboard and quick access to recent activities',
    },
    { 
      path: '/curriculum', 
      label: 'Lessons', 
      icon: <SchoolIcon aria-hidden="true" />,
      ariaDescription: 'Access curriculum and lesson materials for keyboard training',
    },
    { 
      path: '/achievements', 
      label: 'Achievements', 
      icon: <EmojiEventsIcon aria-hidden="true" />,
      ariaDescription: 'View your achievements, badges, and accomplishments', 
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: <PersonIcon aria-hidden="true" />,
      ariaDescription: 'Access your user profile, statistics, and personal information', 
    },
    { 
      path: '/store', 
      label: 'Store', 
      icon: <ShoppingCartIcon aria-hidden="true" />,
      ariaDescription: 'Visit the store to purchase premium features and content', 
    },
  ], []);

  // Development navigation items
  const devNavItems = useMemo<NavItem[]>(() => [
    { 
      path: '/sentry-test', 
      label: 'Sentry Test', 
      icon: <BugReportIcon aria-hidden="true" />,
      ariaDescription: 'Testing tool for Sentry error reporting',
    },
    { 
      path: '/sentry-redux-test', 
      label: 'Sentry Redux', 
      icon: <BugReportIcon aria-hidden="true" />,
      ariaDescription: 'Testing tool for Sentry Redux integration',
    },
    { 
      path: '/sentry-transaction-test', 
      label: 'Sentry Transactions', 
      icon: <BugReportIcon aria-hidden="true" />,
      ariaDescription: 'Testing tool for Sentry transaction monitoring',
    },
  ], []);

  // Calculate top offset for the drawer based on whether we're in desktop mode
  const topOffset = useMemo(() => isDesktop() ? 48 : 0, [isDesktop]); // 48px is the height of our AppTopBar

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(path);
    }
  }, [handleNavigation]);

  // Only show dev items in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <>
      {/* Skip to content link - visible on focus only */}
      <Link
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          skipToContent();
        }}
        sx={{
          position: 'absolute',
          top: '-40px',
          left: 0,
          padding: '8px',
          backgroundColor: theme.palette.background.paper,
          zIndex: 1500,
          transition: 'top 0.2s ease-in-out',
          color: theme.palette.primary.main,
          textDecoration: 'none',
          fontWeight: 'medium',
          ':focus': {
            top: '0',
            outline: `2px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        Skip to main content
      </Link>

      <Box
        component="nav"
        aria-label="Main navigation"
        id={navigationId}
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
          <IconButton 
            onClick={handleDrawerToggle}
            aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={open}
            aria-controls={navigationId}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <Divider />

        {/* Navigation items */}
        <List role="menu" aria-label="Main navigation menu">
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={open ? '' : item.label} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  onKeyDown={(e) => handleKeyDown(e, item.path)}
                  selected={isActive(item.path)}
                  role="menuitem"
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  aria-label={item.ariaDescription || item.label}
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
                    '&:focus-visible': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: '-2px',
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
                  {!open && (
                    <Typography sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                      {item.label}
                    </Typography>
                  )}
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
                aria-label="Currency information"
              >
                <CurrencyDisplay _variant="compact" _showLabel={false} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}

        <Divider />

        {/* Bottom navigation items */}
        <List role="menu" aria-label="Settings and additional options">
          {/* Settings */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleNavigation('/settings')}
              onKeyDown={(e) => handleKeyDown(e, '/settings')}
              selected={isActive('/settings')}
              role="menuitem"
              aria-current={isActive('/settings') ? 'page' : undefined}
              aria-label="Settings: Customize application preferences and account settings"
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
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: '-2px',
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
                  <SettingsIcon aria-hidden="true" />
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
              {!open && (
                <Typography sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                  Settings
                </Typography>
              )}
            </ListItemButton>
          </ListItem>

          {/* Premium navigation if the user has premium */}
          {hasPremium && (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleNavigation('/premium')}
                onKeyDown={(e) => handleKeyDown(e, '/premium')}
                selected={isActive('/premium')}
                role="menuitem"
                aria-current={isActive('/premium') ? 'page' : undefined}
                aria-label="Premium Features: Access your exclusive premium content and features"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: isActive('/premium')
                    ? theme.palette.action.selected
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: '-2px',
                  },
                }}
              >
                <Tooltip title={open ? '' : 'Premium'} placement="right" arrow>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isActive('/premium')
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    }}
                  >
                    <WorkspacePremiumIcon aria-hidden="true" />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary="Premium"
                  sx={{
                    opacity: open ? 1 : 0,
                    color: isActive('/premium')
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                />
                {!open && (
                  <Typography sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                    Premium
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          )}

          {/* Development navigation items */}
          {isDevelopment && (
            <>
              <Divider />
              <List role="menu" aria-label="Development options">
                {devNavItems.map((item) => (
                  <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
                    <Tooltip title={open ? '' : item.label} placement="right" arrow>
                      <ListItemButton
                        onClick={() => handleNavigation(item.path)}
                        onKeyDown={(e) => handleKeyDown(e, item.path)}
                        selected={isActive(item.path)}
                        role="menuitem"
                        aria-current={isActive(item.path) ? 'page' : undefined}
                        aria-label={item.ariaDescription || item.label}
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
                          '&:focus-visible': {
                            outline: `2px solid ${theme.palette.primary.main}`,
                            outlineOffset: '-2px',
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
                        {!open && (
                          <Typography sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                            {item.label}
                          </Typography>
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </List>
      </Box>
    </>
  );
};

export default Navigation;
