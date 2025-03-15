import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, selectAuthError, selectAuthLoading, clearError } from './authSlice';
import { getOAuthRedirectUrl } from '../../api/authService';

/**
 * Login component that handles both OAuth and email/password authentication
 */
const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Clear global error when user makes changes
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(login(formData))
        .unwrap()
        .then(() => {
          navigate(from, { replace: true });
        })
        .catch(() => {
          // Error is handled in the redux slice
        });
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'apple' | 'github') => {
    try {
      const redirectUrl = getOAuthRedirectUrl(provider);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(`Error initiating ${provider} login:`, error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 450,
        mx: 'auto',
        px: 2,
        py: 5,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign in to Keyboard Dojo
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={4}>
        Master keyboard shortcuts and boost your productivity
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper 
        elevation={2}
        sx={{ 
          p: 4, 
          width: '100%',
          borderRadius: 2,
        }}
      >
        {/* OAuth Buttons */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={() => handleOAuthLogin('google')}
            sx={{ mb: 2 }}
            disabled={isLoading}
          >
            Continue with Google
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={<AppleIcon />}
            onClick={() => handleOAuthLogin('apple')}
            sx={{ mb: 2 }}
            disabled={isLoading}
          >
            Continue with Apple
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GitHubIcon />}
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
          >
            Continue with GitHub
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
        
        {/* Email/Password Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            disabled={isLoading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Paper>
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mt: 3,
          width: '100%',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/auth/register" variant="body2">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login; 