import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Create a custom theme for the Storybook UI
const theme = create({
  base: 'light',
  
  // Brand
  brandTitle: 'Keyboard Dojo',
  brandUrl: 'https://keyboard-dojo.com',
  
  // UI
  appBg: '#f5f5f5',
  appContentBg: '#ffffff',
  appBorderColor: '#e0e0e0',
  appBorderRadius: 8,
  
  // Typography
  fontBase: '"Segoe UI", "Roboto", sans-serif',
  fontCode: 'monospace',
  
  // Colors
  colorPrimary: '#1976d2',
  colorSecondary: '#1976d2',
  
  // Text colors
  textColor: 'rgba(0, 0, 0, 0.87)',
  textInverseColor: 'rgba(255, 255, 255, 0.87)',
  
  // Toolbar colors
  barTextColor: 'rgba(0, 0, 0, 0.6)',
  barSelectedColor: '#1976d2',
  barBg: '#ffffff',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e0e0e0',
  inputTextColor: 'rgba(0, 0, 0, 0.87)',
  inputBorderRadius: 4,
});

// Apply the theme to the Storybook UI
addons.setConfig({
  theme,
  showToolbar: true,
}); 