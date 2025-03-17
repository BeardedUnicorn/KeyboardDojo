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

  it('renders practice card', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Quick Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/Start a quick typing practice session/i)).toBeInTheDocument();
  });

  it('renders speed test card', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Speed Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Test your typing speed and accuracy/i)).toBeInTheDocument();
  });

  it('renders progress card', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Track your improvement over time/i)).toBeInTheDocument();
  });

  it('renders achievements card', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/View your earned achievements/i)).toBeInTheDocument();
  });
}); 