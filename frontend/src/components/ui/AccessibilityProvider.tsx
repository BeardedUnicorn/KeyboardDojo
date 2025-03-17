import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

// Define accessibility options
export interface AccessibilityOptions {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardMode: boolean;
  screenReaderMode: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
}

// Define context interface
interface AccessibilityContextType {
  options: AccessibilityOptions;
  setOption: <K extends keyof AccessibilityOptions>(
    option: K,
    value: AccessibilityOptions[K]
  ) => void;
  resetOptions: () => void;
}

// Default options
const defaultOptions: AccessibilityOptions = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  keyboardMode: false,
  screenReaderMode: false,
  colorBlindMode: 'none',
};

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Define props interface
interface AccessibilityProviderProps {
  children: React.ReactNode;
}

// AccessibilityProvider component
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Initialize state with stored preferences or defaults
  const [options, setOptions] = useState<AccessibilityOptions>(() => {
    const storedOptions = localStorage.getItem('accessibilityOptions');
    return storedOptions ? JSON.parse(storedOptions) : defaultOptions;
  });
  
  // Check for system preferences
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Update options based on system preferences
  useEffect(() => {
    if (prefersReducedMotion) {
      setOptions((prev) => ({ ...prev, reducedMotion: true }));
    }
  }, [prefersReducedMotion]);
  
  // Save options to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accessibilityOptions', JSON.stringify(options));
    
    // Apply options to document
    document.documentElement.classList.toggle('high-contrast', options.highContrast);
    document.documentElement.classList.toggle('large-text', options.largeText);
    document.documentElement.classList.toggle('reduced-motion', options.reducedMotion);
    document.documentElement.classList.toggle('keyboard-mode', options.keyboardMode);
    document.documentElement.classList.toggle('screen-reader-mode', options.screenReaderMode);
    
    // Apply color blind mode
    document.documentElement.setAttribute('data-color-blind-mode', options.colorBlindMode);
    
    // Set focus outline for keyboard users
    if (options.keyboardMode) {
      const style = document.createElement('style');
      style.id = 'keyboard-focus-styles';
      style.innerHTML = `
        :focus {
          outline: 3px solid #2196f3 !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      const existingStyle = document.getElementById('keyboard-focus-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [options]);
  
  // Set individual option
  const setOption = <K extends keyof AccessibilityOptions>(
    option: K,
    value: AccessibilityOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };
  
  // Reset all options to defaults
  const resetOptions = () => {
    setOptions(defaultOptions);
  };
  
  // Listen for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setOption('keyboardMode', true);
      }
    };
    
    const handleMouseDown = () => {
      setOption('keyboardMode', false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  return (
    <AccessibilityContext.Provider value={{ options, setOption, resetOptions }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use accessibility context
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
};

export default AccessibilityProvider; 