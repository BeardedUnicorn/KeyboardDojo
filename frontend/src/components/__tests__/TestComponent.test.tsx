import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TestComponent from '../TestComponent';
import { renderWithProviders } from '../../test/utils';

describe('TestComponent', () => {
  it('renders the component with the provided title', () => {
    // Arrange
    const title = 'Test Title';
    
    // Act
    renderWithProviders(<TestComponent title={title} />);
    
    // Assert
    expect(screen.getByText(title)).toBeInTheDocument();
  });
  
  it('renders the description text', () => {
    // Arrange
    const title = 'Any Title';
    
    // Act
    renderWithProviders(<TestComponent title={title} />);
    
    // Assert
    expect(screen.getByText(/This is a test component using MUI v6 components/i)).toBeInTheDocument();
  });
  
  it('renders three buttons', () => {
    // Arrange
    const title = 'Any Title';
    
    // Act
    renderWithProviders(<TestComponent title={title} />);
    
    // Assert
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
    expect(screen.getByText('Outlined Button')).toBeInTheDocument();
  });
}); 