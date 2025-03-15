import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, selectAuthError, selectAuthLoading, clearError } from './authSlice';
import { getOAuthRedirectUrl } from '../../api/authService';

/**
 * Register component for user sign-up with validation
 */
const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

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

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeToTerms(e.target.checked);
    if (e.target.checked) {
      setTermsError('');
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must include uppercase, lowercase, and numbers';
      isValid = false;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Terms agreement
    if (!agreeToTerms) {
      setTermsError('You must agree to the terms and conditions');
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { name, email, password } = formData;
      dispatch(register({ name, email, password }))
        .unwrap()
        .then(() => {
          navigate('/');
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
        Create your account
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={4}>
        Join Keyboard Dojo and master keyboard shortcuts
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
            Sign up with Google
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={<AppleIcon />}
            onClick={() => handleOAuthLogin('apple')}
            sx={{ mb: 2 }}
            disabled={isLoading}
          >
            Sign up with Apple
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GitHubIcon />}
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
          >
            Sign up with GitHub
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
        
        {/* Registration Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            disabled={isLoading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            disabled={isLoading}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeToTerms}
                onChange={handleTermsChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link component={RouterLink} to="/terms" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link component={RouterLink} to="/privacy" target="_blank">
                  Privacy Policy
                </Link>
              </Typography>
            }
          />
          {termsError && (
            <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
              {termsError}
            </Typography>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
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
          Already have an account?{' '}
          <Link component={RouterLink} to="/auth/login" variant="body2">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register; 