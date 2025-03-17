import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useScrollTrigger,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface NavItem {
  label: string;
  path: string;
  auth?: boolean;
  premium?: boolean;
}

// Create a component that elevates on scroll
const ElevationScroll: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      backgroundColor: trigger ? 'white' : 'transparent',
      color: trigger ? 'text.primary' : 'white',
      transition: 'all 0.3s ease-in-out',
      boxShadow: trigger ? undefined : 'none',
    },
  });
};

const Header: React.FC<{ transparentOnHome?: boolean }> = ({ transparentOnHome = true }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [transparent, setTransparent] = useState(transparentOnHome && location.pathname === '/');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const subscription = useSelector((state: RootState) => state.subscription.subscription);
  const isPremium = subscription?.isPremium || false;

  // Update transparency when location changes
  useEffect(() => {
    setTransparent(transparentOnHome && location.pathname === '/');
  }, [location.pathname, transparentOnHome]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation items
  const navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Desktop App', path: '/desktop-comparison' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Dashboard', path: '/dashboard', auth: true },
    { label: 'My Subscription', path: '/subscription', auth: true }
  ];

  // Action buttons based on auth state
  const actionButtons = isAuthenticated ? (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {!isPremium && (
        <Button 
          component={RouterLink} 
          to="/subscription" 
          variant="contained" 
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          Upgrade to Premium
        </Button>
      )}
      <Button 
        component={RouterLink} 
        to="/dashboard" 
        variant="outlined" 
        color={transparent ? "inherit" : "primary"}
        sx={{ fontWeight: 'bold' }}
      >
        Dashboard
      </Button>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button 
        component={RouterLink} 
        to="/login" 
        variant="outlined" 
        color={transparent ? "inherit" : "primary"}
        sx={{ fontWeight: 'bold' }}
      >
        Log In
      </Button>
      <Button 
        component={RouterLink} 
        to="/signup" 
        variant="contained" 
        color="primary"
        sx={{ fontWeight: 'bold' }}
      >
        Sign Up
      </Button>
    </Box>
  );

  // Filter nav items based on auth state
  const filteredNavItems = navItems.filter(item => {
    if (item.auth && !isAuthenticated) return false;
    return true;
  });

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <KeyboardIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6" component="div" fontWeight="bold">
          Keyboard Dojo
        </Typography>
      </Box>
      <Divider />
      <List>
        {filteredNavItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {!isPremium && (
              <Button 
                component={RouterLink} 
                to="/subscription" 
                variant="contained" 
                color="primary"
                fullWidth
              >
                Upgrade to Premium
              </Button>
            )}
            <Button 
              component={RouterLink} 
              to="/logout" 
              variant="outlined" 
              color="primary"
              fullWidth
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button 
              component={RouterLink} 
              to="/login" 
              variant="outlined" 
              color="primary"
              fullWidth
            >
              Log In
            </Button>
            <Button 
              component={RouterLink} 
              to="/signup" 
              variant="contained" 
              color="primary"
              fullWidth
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <ElevationScroll>
        <AppBar 
          position="fixed" 
          color="default"
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: transparent ? 'transparent' : 'white',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ height: 70 }}>
              {/* Logo */}
              <Box 
                component={RouterLink} 
                to="/" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                  color: transparent ? 'white' : 'primary.main'
                }}
              >
                <KeyboardIcon sx={{ mr: 1, fontSize: 32 }} />
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                  Keyboard Dojo
                </Typography>
              </Box>

              {/* Desktop Navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                {filteredNavItems.map((item) => (
                  item.label !== 'Dashboard' && item.label !== 'My Subscription' && (
                    <Button
                      key={item.label}
                      component={RouterLink}
                      to={item.path}
                      sx={{ 
                        mx: 1,
                        color: transparent ? 'white' : 'text.primary',
                        fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                        opacity: location.pathname === item.path ? 1 : 0.8,
                        '&:hover': {
                          bgcolor: 'transparent',
                          opacity: 1,
                        },
                        position: 'relative',
                        '&::after': location.pathname === item.path ? {
                          content: '""',
                          position: 'absolute',
                          width: '50%',
                          height: '3px',
                          backgroundColor: transparent ? 'white' : 'primary.main',
                          bottom: '5px',
                          left: '25%',
                          borderRadius: '10px',
                        } : {},
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                ))}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {actionButtons}
              </Box>

              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, ml: 'auto' }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* This empty Toolbar is needed to push content below the fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default Header; 