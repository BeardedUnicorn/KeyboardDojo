import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { store } from '../store';

import { Navigation } from './Navigation';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Navigation Component', () => {
  const renderWithProviders = () => {
    return render(
      <BrowserRouter>
        <Provider store={store}>
          <SubscriptionProvider>
            <Navigation />
          </SubscriptionProvider>
        </Provider>
      </BrowserRouter>,
    );
  };

  it('renders the navigation toggle button', () => {
    renderWithProviders();
    const toggleButton = screen.getByRole('button', { name: /menu/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('opens the drawer when the toggle button is clicked', () => {
    renderWithProviders();
    const toggleButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(toggleButton);
    
    // Check if the drawer is open by looking for navigation items
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Lessons')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('navigates when a menu item is clicked', () => {
    renderWithProviders();
    const toggleButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(toggleButton);
    
    const lessonsLink = screen.getByText('Lessons');
    fireEvent.click(lessonsLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/curriculum');
  });
}); 
