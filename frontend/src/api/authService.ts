import { AuthProvider, User } from '../features/auth/authSlice';
import { captureException } from '../utils/sentry';

interface LoginResponse {
  token: string;
  user: User;
}

interface ErrorResponse {
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Email/Password Login
 */
export const loginWithEmail = async (
  email: string, 
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      let errorData;
      try {
        errorData = await response.json() as ErrorResponse;
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      const error = new Error(errorMessage);
      captureException(error, { 
        statusCode: response.status,
        endpoint: '/auth/login',
        email
      });
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Error in loginWithEmail:', error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'loginWithEmail',
      email,
      apiUrl: API_BASE_URL
    });
    throw error;
  }
};

/**
 * Email/Password Registration
 */
export const registerWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      let errorData;
      try {
        errorData = await response.json() as ErrorResponse;
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      const error = new Error(errorMessage);
      captureException(error, { 
        statusCode: response.status,
        endpoint: '/auth/register',
        email
      });
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Error in registerWithEmail:', error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'registerWithEmail',
      email,
      apiUrl: API_BASE_URL
    });
    throw error;
  }
};

/**
 * Get OAuth redirect URL for the specified provider
 */
export const getOAuthRedirectUrl = (provider: AuthProvider): string => {
  try {
    // Use environment variable for redirect URI if available
    const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI || 
      `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/auth/callback/${provider}`;
    
    if (provider === 'google') {
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&prompt=select_account`;
    } else if (provider === 'github') {
      return `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
    } else if (provider === 'apple') {
      return `https://appleid.apple.com/auth/authorize?client_id=${import.meta.env.VITE_APPLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=name email&response_mode=form_post`;
    } else {
      const error = new Error(`Unsupported auth provider: ${provider}`);
      captureException(error, { provider });
      throw error;
    }
  } catch (error) {
    console.error('Error in getOAuthRedirectUrl:', error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'getOAuthRedirectUrl',
      provider
    });
    throw error;
  }
};

/**
 * OAuth Login - Step 2: Process OAuth code
 */
export const processOAuthCallback = async (
  provider: AuthProvider, 
  code: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      let errorMessage = `${provider} login failed`;
      let errorData;
      try {
        errorData = await response.json() as ErrorResponse;
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      const error = new Error(errorMessage);
      captureException(error, { 
        statusCode: response.status,
        endpoint: `/auth/${provider}/callback`,
        provider
      });
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Error in processOAuthCallback:', error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'processOAuthCallback',
      provider,
      apiUrl: API_BASE_URL
    });
    throw error;
  }
};

/**
 * Verify JWT token with the backend
 */
export const verifyToken = async (token: string): Promise<{ valid: boolean; user?: User }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Don't throw an error here, just return invalid
      return { valid: false };
    }

    const data = await response.json();
    return { valid: true, user: data.user };
  } catch (error) {
    console.error('Error in verifyToken:', error);
    captureException(error instanceof Error ? error : new Error(String(error)), {
      context: 'verifyToken',
      apiUrl: API_BASE_URL
    });
    // Return invalid on error
    return { valid: false };
  }
};

/**
 * Helper to get the stored token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Helper to set auth tokens in storage
 */
export const setAuthData = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Helper to clear auth data on logout
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}; 