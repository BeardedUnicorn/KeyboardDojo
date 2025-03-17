import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Home from './home';

describe('Home Component', () => {
  it('renders welcome message', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Welcome to Keyboard Dojo/i)).toBeInTheDocument();
  });

  it('renders progress card', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const progressHeading = screen.getAllByRole('heading').find(
      heading => heading.textContent === 'Progress'
    );
    expect(progressHeading).toBeInTheDocument();
    
    expect(screen.getByText(/track your improvement over time/i)).toBeInTheDocument();
  });

  it('renders achievements card', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const achievementsHeading = screen.getAllByRole('heading').find(
      heading => heading.textContent === 'Achievements'
    );
    expect(achievementsHeading).toBeInTheDocument();
    
    expect(screen.getByText(/Unlock achievements as you improve/i)).toBeInTheDocument();
  });
}); 