import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create the base API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage or other storage
      const token = localStorage.getItem('auth_token');
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  // Define tag types for cache invalidation
  tagTypes: ['UserProgress', 'Achievements', 'Subscription', 'Settings'],
  // Endpoints will be injected in feature-specific API slices
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
// Will be populated when endpoints are added
export const apiHooks = api; 
