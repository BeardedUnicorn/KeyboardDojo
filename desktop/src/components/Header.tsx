import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { currencyService } from '../services';
import { useAppSelector } from '../store';
import { selectXp, selectLevel } from '../store/slices/userProgressSlice';

import CurrencyDisplay from './CurrencyDisplay';
import HeartsDisplay from './HeartsDisplay';
import XPDisplay from './XPDisplay';

import type { FC } from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const xp = useAppSelector(selectXp);
  const level = useAppSelector(selectLevel);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<number>(0);
  const [currency, setCurrency] = useState(0);

  // Load currency on mount
  useEffect(() => {
    setCurrency(currencyService.getBalance());

    // Subscribe to currency changes
    const handleCurrencyChange = (event: any) => {
      setCurrency(event.newBalance);
    };

    currencyService.subscribe(handleCurrencyChange);

    return () => {
      currencyService.unsubscribe(handleCurrencyChange);
    };
  }, []);

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  // Load notifications count
  useEffect(() => {
    // This would typically come from a notifications service
    setNotifications(2);
  }, []);

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Logo and menu toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Keyboard Dojo
          </Typography>
        </Box>

        {/* Right side - User info and actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Hearts display */}
          <HeartsDisplay size="small" showTooltip />

          {/* XP display */}
          <XPDisplay
            xp={xp}
            level={level}
            showProgress={false}
            size="small"
          />

          {/* Currency display */}
          <CurrencyDisplay amount={currency} size="small" />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Achievements */}
          <Tooltip title="Achievements">
            <IconButton
              color="inherit"
              onClick={() => navigate('/achievements')}
            >
              <EmojiEventsIcon />
            </IconButton>
          </Tooltip>

          {/* User profile */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleProfileClick}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={anchorEl ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* ProfilePage menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleNavigate('/profile')}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/subscription')}>
            Subscription
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleNavigate('/settings')}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/logout')}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
