import { AuthProvider, User } from '../features/auth/authSlice';

interface LoginResponse {
  token: string;
  user: User;
}

interface ErrorResponse {
  message: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.keyboarddojo.com' // Replace with actual API URL in production
  : 'http://localhost:3000'; // Local development API URL

/**
 * Email/Password Login
 */
export const loginWithEmail = async (
  email: string, 
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return await response.json();
};

/**
 * Email/Password Registration
 */
export const registerWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return await response.json();
};

/**
 * OAuth Login - Step 1: Redirect to Provider
 */
export const getOAuthRedirectUrl = (provider: AuthProvider): string => {
  const redirectUri = encodeURIComponent(
    `${window.location.origin}/auth/callback/${provider}`
  );
  
  switch (provider) {
    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&prompt=select_account`;
    
    case 'github':
      return `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
    
    case 'apple':
      return `https://appleid.apple.com/auth/authorize?client_id=${process.env.REACT_APP_APPLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=name email&response_mode=form_post`;
    
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

/**
 * OAuth Login - Step 2: Process OAuth code
 */
export const processOAuthCallback = async (
  provider: AuthProvider, 
  code: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/${provider}/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || `${provider} login failed`);
  }

  return await response.json();
};

/**
 * Verify JWT token with the backend
 */
export const verifyToken = async (token: string): Promise<{ valid: boolean; user?: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { valid: false };
  }

  const data = await response.json();
  return { valid: true, user: data.user };
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