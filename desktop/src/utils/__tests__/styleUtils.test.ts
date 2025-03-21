import { describe, test, expect, vi } from 'vitest';
import * as styleUtils from '../styleUtils';
import { createTheme } from '@mui/material/styles';

// Create a mock theme for testing
const mockTheme = createTheme();

describe('styleUtils', () => {
  describe('constants', () => {
    test('borderRadius contains expected values', () => {
      expect(styleUtils.borderRadius).toEqual({
        none: 0,
        small: 4,
        medium: 8,
        large: 12,
        round: 9999,
      });
    });

    test('shadowLevels contains expected values', () => {
      expect(styleUtils.shadowLevels).toEqual({
        none: 0,
        low: 1,
        medium: 2,
        high: 4,
        elevated: 8,
      });
    });

    test('spacing contains expected values', () => {
      expect(styleUtils.spacing).toEqual({
        none: 0,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
      });
    });

    test('zIndex contains expected values', () => {
      expect(styleUtils.zIndex).toEqual({
        base: 0,
        content: 1,
        overlay: 10,
        modal: 100,
        tooltip: 1000,
        notification: 1100,
      });
    });
  });

  describe('getContrastText', () => {
    test('returns contrast text color from theme for a given background color', () => {
      const mockContrastText = '#ffffff';
      const mockBackgroundColor = '#000000';
      
      // Mock the getContrastText function from the theme
      const originalGetContrastText = mockTheme.palette.getContrastText;
      mockTheme.palette.getContrastText = vi.fn().mockReturnValue(mockContrastText);
      
      const result = styleUtils.getContrastText(mockBackgroundColor, mockTheme);
      expect(mockTheme.palette.getContrastText).toHaveBeenCalledWith(mockBackgroundColor);
      expect(result).toBe(mockContrastText);
      
      // Restore the original function
      mockTheme.palette.getContrastText = originalGetContrastText;
    });
  });

  describe('getThemeColor', () => {
    test('returns correct color for non-text color keys', () => {
      const result = styleUtils.getThemeColor('primary', 'main', mockTheme);
      expect(result).toBe(mockTheme.palette.primary.main);
    });

    test('returns correct color for text color key', () => {
      const result = styleUtils.getThemeColor('text', 'primary', mockTheme);
      expect(result).toBe(mockTheme.palette.text.primary);
    });
  });

  describe('getThemeSpacing', () => {
    test('returns theme spacing when given a number', () => {
      const mockSpacingValue = '8px';
      const originalSpacing = mockTheme.spacing;
      mockTheme.spacing = vi.fn().mockReturnValue(mockSpacingValue);
      
      const result = styleUtils.getThemeSpacing(1, mockTheme);
      expect(mockTheme.spacing).toHaveBeenCalledWith(1);
      expect(result).toBe(mockSpacingValue);
      
      // Restore the original function
      mockTheme.spacing = originalSpacing;
    });

    test('returns theme spacing when given a string key', () => {
      const mockSpacingValue = '16px';
      const originalSpacing = mockTheme.spacing;
      mockTheme.spacing = vi.fn().mockReturnValue(mockSpacingValue);
      
      const result = styleUtils.getThemeSpacing('md', mockTheme);
      // Value should be converted to MUI spacing units (md = 16px, divided by 8 = 2 units)
      expect(mockTheme.spacing).toHaveBeenCalledWith(2);
      expect(result).toBe(mockSpacingValue);
      
      // Restore the original function
      mockTheme.spacing = originalSpacing;
    });
  });

  describe('getThemeShadow', () => {
    test('returns the correct shadow from the theme', () => {
      // Low shadow level corresponds to index 1 in theme.shadows
      const result = styleUtils.getThemeShadow('low', mockTheme);
      expect(result).toBe(mockTheme.shadows[1]);
    });

    test('returns no shadow for none level', () => {
      const result = styleUtils.getThemeShadow('none', mockTheme);
      expect(result).toBe(mockTheme.shadows[0]);
    });

    test('returns elevated shadow for elevated level', () => {
      const result = styleUtils.getThemeShadow('elevated', mockTheme);
      expect(result).toBe(mockTheme.shadows[8]);
    });
  });

  describe('getCardStyle', () => {
    test('returns default card style', () => {
      const result = styleUtils.getCardStyle(mockTheme);
      expect(result).toEqual({
        backgroundColor: mockTheme.palette.background.paper,
        borderRadius: styleUtils.borderRadius.medium,
        boxShadow: mockTheme.shadows[styleUtils.shadowLevels.low],
        overflow: 'hidden',
      });
    });

    test('returns card style with custom elevation and radius', () => {
      const result = styleUtils.getCardStyle(mockTheme, 'high', 'large');
      expect(result).toEqual({
        backgroundColor: mockTheme.palette.background.paper,
        borderRadius: styleUtils.borderRadius.large,
        boxShadow: mockTheme.shadows[styleUtils.shadowLevels.high],
        overflow: 'hidden',
      });
    });
  });

  describe('getButtonStyle', () => {
    test('returns default contained button style', () => {
      const result = styleUtils.getButtonStyle(mockTheme);
      expect(result).toEqual({
        borderRadius: styleUtils.borderRadius.medium,
        fontWeight: 500,
        textTransform: 'none',
        backgroundColor: mockTheme.palette.primary.main,
        color: mockTheme.palette.primary.contrastText,
      });
    });

    test('returns outlined button style', () => {
      const result = styleUtils.getButtonStyle(mockTheme, 'secondary', 'outlined');
      expect(result).toEqual({
        borderRadius: styleUtils.borderRadius.medium,
        fontWeight: 500,
        textTransform: 'none',
        backgroundColor: 'transparent',
        color: mockTheme.palette.secondary.main,
        border: `1px solid ${mockTheme.palette.secondary.main}`,
      });
    });

    test('returns text button style', () => {
      const result = styleUtils.getButtonStyle(mockTheme, 'error', 'text');
      expect(result).toEqual({
        borderRadius: styleUtils.borderRadius.medium,
        fontWeight: 500,
        textTransform: 'none',
        backgroundColor: 'transparent',
        color: mockTheme.palette.error.main,
      });
    });
  });

  describe('getTextStyle', () => {
    test('returns default text style', () => {
      const result = styleUtils.getTextStyle(mockTheme);
      expect(result).toEqual({
        ...mockTheme.typography.body1,
        color: mockTheme.palette.text.primary,
      });
    });

    test('returns text style with secondary color', () => {
      const result = styleUtils.getTextStyle(mockTheme, 'body1', 'secondary');
      expect(result).toEqual({
        ...mockTheme.typography.body1,
        color: mockTheme.palette.text.secondary,
      });
    });

    test('returns text style with specific variant and error color', () => {
      const result = styleUtils.getTextStyle(mockTheme, 'h2', 'error');
      expect(result).toEqual({
        ...mockTheme.typography.h2,
        color: mockTheme.palette.error.main,
      });
    });
  });

  describe('getContainerStyle', () => {
    test('returns default container style', () => {
      const result = styleUtils.getContainerStyle(mockTheme);
      expect(result).toEqual({
        padding: mockTheme.spacing(styleUtils.spacing.md / 8),
        margin: mockTheme.spacing(styleUtils.spacing.none / 8),
        backgroundColor: mockTheme.palette.background.default,
      });
    });

    test('returns container style with custom padding and margin', () => {
      const result = styleUtils.getContainerStyle(mockTheme, 'lg', 'sm');
      expect(result).toEqual({
        padding: mockTheme.spacing(styleUtils.spacing.lg / 8),
        margin: mockTheme.spacing(styleUtils.spacing.sm / 8),
        backgroundColor: mockTheme.palette.background.default,
      });
    });
  });

  describe('getFlexStyle', () => {
    test('returns default flex style', () => {
      const result = styleUtils.getFlexStyle(mockTheme);
      expect(result).toEqual({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      });
    });

    test('returns flex style with custom direction, alignment, and justification', () => {
      const result = styleUtils.getFlexStyle(mockTheme, 'column', 'flex-start', 'space-between');
      expect(result).toEqual({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      });
    });
  });
}); 