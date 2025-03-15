import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { AuthProvider, oauthLogin } from './authSlice';

/**
 * Component to handle OAuth callback and process the authorization code
 */
const OAuthCallback = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { provider } = useParams<{ provider: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuth = async () => {
      // Get the authorization code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setError('No authorization code received from the provider.');
        return;
      }

      if (!provider || !['google', 'apple', 'github'].includes(provider)) {
        setError('Invalid or unsupported OAuth provider.');
        return;
      }

      try {
        // Dispatch the oauthLogin action with the code and provider
        await dispatch(
          oauthLogin({
            provider: provider as AuthProvider,
            code,
          })
        ).unwrap();

        // Redirect to dashboard on success
        navigate('/');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Authentication failed. Please try again.'
        );
      }
    };

    processOAuth();
  }, [dispatch, navigate, provider]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 450, mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          <a href="/auth/login">Return to login page</a>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        Completing your sign-in...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Please wait while we authenticate you with {provider}
      </Typography>
    </Box>
  );
};

export default OAuthCallback; 