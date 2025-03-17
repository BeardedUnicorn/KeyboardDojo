import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { 
  loginWithEmail, 
  registerWithEmail, 
  processOAuthCallback,
  setAuthData,
  clearAuthData
} from '../../api/authService';

// Types
export type AuthProvider = 'google' | 'apple' | 'github' | 'email';

export interface User {
  userId: string;
  id: string;
  email: string;
  name: string;
  displayName?: string;
  photoURL?: string;
  picture?: string;
  authProvider: AuthProvider;
  isAdmin: boolean;
  isPremium: boolean;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Check if user is already authenticated from localStorage
const loadAuthStateFromStorage = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to parse auth data from localStorage:', error);
  }
  
  return {};
};

// Initialize state with persisted data, if any
const persistedState = loadAuthStateFromStorage();
const mergedInitialState = {
  ...initialState,
  ...persistedState,
};

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Use the actual API service function
      const data = await loginWithEmail(email, password);
      
      // Store in localStorage for persistence
      setAuthData(data.token, data.user);
      
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Network error or server is down';
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Use the actual API service function
      const data = await registerWithEmail(name, email, password);
      
      // Store in localStorage for persistence
      setAuthData(data.token, data.user);
      
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const oauthLogin = createAsyncThunk(
  'auth/oauthLogin',
  async (
    { provider, code }: { provider: AuthProvider; code: string },
    { rejectWithValue }
  ) => {
    try {
      // Use the actual API service function
      const data = await processOAuthCallback(provider, code);
      
      // Store in localStorage for persistence
      setAuthData(data.token, data.user);
      
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthData();
  return null;
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: mergedInitialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
      })
      
      // OAuth Login
      .addCase(oauthLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(oauthLogin.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(oauthLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'OAuth login failed';
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

// Actions
export const { clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer; 