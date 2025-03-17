import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navigation from './Navigation';

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

describe('Navigation Component', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  it('renders the navigation button', () => {
    renderWithRouter();
    expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
  });

  it('opens the drawer when the button is clicked', () => {
    renderWithRouter();
    const button = screen.getByLabelText('open drawer');
    fireEvent.click(button);
    
    // Check if the drawer is open by looking for navigation items
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('navigates when a menu item is clicked', () => {
    renderWithRouter();
    const button = screen.getByLabelText('open drawer');
    fireEvent.click(button);
    
    const practiceLink = screen.getByText('Practice');
    fireEvent.click(practiceLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/practice');
  });
}); 