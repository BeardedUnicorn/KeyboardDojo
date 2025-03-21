import { useState, useEffect, useRef } from 'react';

import { windowService } from '../../services';

// Styles for the window controls
const styles = {
  container: {
    position: 'fixed' as const,
    top: '0',
    right: '0',
    display: 'flex',
    padding: '8px',
    zIndex: 1000,
  },
  button: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#333',
    margin: '0 2px',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    '&:hover': {
      backgroundColor: '#e81123',
      color: 'white',
    },
  },
};

const WindowControls = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const unlistenRef = useRef<(() => void) | null>(null);

  // Check if the window is maximized on mount and when the window state changes
  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const maximized = await windowService.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error('Failed to check if window is maximized:', error);
      }
    };

    // Initial check
    checkMaximized();

    // Set up event listener for window resize using windowService.listen
    const setupResizeListener = () => {
      try {
        // Listen for the 'resize' event - check if window is maximized when resized
        const unlisten = windowService.listen('resize', () => {
          checkMaximized();
        });
        
        // Store the unlisten function for cleanup
        unlistenRef.current = unlisten;
      } catch (error) {
        console.error('Failed to set up window resize listener:', error);
      }
    };

    setupResizeListener();

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      // Call the unlisten function if it exists
      if (unlistenRef.current) {
        unlistenRef.current();
        unlistenRef.current = null;
      }
    };
  }, []);

  // Handle minimize button click
  const handleMinimize = () => {
    try {
      windowService.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };

  // Handle maximize/restore button click
  const handleMaximizeRestore = () => {
    try {
      windowService.toggleMaximize();
      setIsMaximized(!isMaximized);
    } catch (error) {
      console.error('Failed to toggle maximize/restore window:', error);
    }
  };

  // Handle close button click
  const handleClose = () => {
    try {
      windowService.close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  // Button hover handlers
  const handleMouseEnter = (button: string) => {
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  // Get button style based on hover state
  const getButtonStyle = (button: string) => {
    const baseStyle = { ...styles.button };

    if (hoveredButton === button) {
      Object.assign(baseStyle, styles.buttonHover);

      if (button === 'close') {
        baseStyle.background = '#e81123';
        baseStyle.color = 'white';
      }
    }

    return baseStyle;
  };

  return (
    <div 
      style={styles.container}
      role="toolbar"
      aria-label="Window controls"
    >
      <button
        style={getButtonStyle('minimize')}
        onClick={handleMinimize}
        onMouseEnter={() => handleMouseEnter('minimize')}
        onMouseLeave={handleMouseLeave}
        title="Minimize"
        aria-label="Minimize window"
        role="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M14 8v1H3V8h11z" />
        </svg>
      </button>

      <button
        style={getButtonStyle('maximize')}
        onClick={handleMaximizeRestore}
        onMouseEnter={() => handleMouseEnter('maximize')}
        onMouseLeave={handleMouseLeave}
        title={isMaximized ? 'Restore' : 'Maximize'}
        aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
        role="button"
      >
        {isMaximized ? (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M3 5v9h9V5H3zm8 8H4V6h7v7z"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M3 3v10h10V3H3zm9 9H4V4h8v8z"
            />
          </svg>
        )}
      </button>

      <button
        style={getButtonStyle('close')}
        onClick={handleClose}
        onMouseEnter={() => handleMouseEnter('close')}
        onMouseLeave={handleMouseLeave}
        title="Close"
        aria-label="Close window"
        role="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
          />
        </svg>
      </button>
    </div>
  );
};

export default WindowControls;
