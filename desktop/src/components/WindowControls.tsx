import { useState, useEffect } from 'react';
import { windowService } from '../services';

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

  // Check if the window is maximized on mount and when the window state changes
  useEffect(() => {
    const checkMaximized = async () => {
      const maximized = await windowService.isMaximized();
      setIsMaximized(maximized);
    };

    checkMaximized();

    // In a real implementation, we would listen for window state changes
    // For example, using Tauri's event system
    /*
    const unlisten = await appWindow.onResized(() => {
      checkMaximized();
    });

    return () => {
      unlisten();
    };
    */
  }, []);

  // Handle minimize button click
  const handleMinimize = () => {
    windowService.minimize();
  };

  // Handle maximize/restore button click
  const handleMaximizeRestore = () => {
    windowService.toggleMaximize();
    setIsMaximized(!isMaximized);
  };

  // Handle close button click
  const handleClose = () => {
    windowService.close();
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
    <div style={styles.container}>
      <button
        style={getButtonStyle('minimize')}
        onClick={handleMinimize}
        onMouseEnter={() => handleMouseEnter('minimize')}
        onMouseLeave={handleMouseLeave}
        title="Minimize"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path fill="currentColor" d="M14 8v1H3V8h11z" />
        </svg>
      </button>
      
      <button
        style={getButtonStyle('maximize')}
        onClick={handleMaximizeRestore}
        onMouseEnter={() => handleMouseEnter('maximize')}
        onMouseLeave={handleMouseLeave}
        title={isMaximized ? 'Restore' : 'Maximize'}
      >
        {isMaximized ? (
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M3 5v9h9V5H3zm8 8H4V6h7v7z"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16">
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
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
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