# Keyboard Key Normalization Architecture

## Overview

The keyboard normalization system provides a consistent approach to handling keyboard events across different operating systems (macOS, Windows, Linux) and keyboard layouts. This document explains the architecture and components involved in key normalization.

## Core Components

The key normalization system consists of four main components:

1. **Key Normalization** (`keyNormalization.ts`)
2. **Shortcut Detector** (`shortcutDetector.ts`)
3. **Shortcut Utils** (`shortcutUtils.ts`)
4. **Keyboard Service** (`keyboardService.ts`)

## Key Normalization Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  KeyboardEvent  │────▶│ Key Normalization│────▶│  Normalized Key │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│  Event Handlers │                           │ Shortcut Matching│
└─────────────────┘                           └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│   UI Actions    │                           │ Callback Actions │
└─────────────────┘                           └─────────────────┘
```

## 1. Key Normalization (`keyNormalization.ts`)

This module provides the core functionality for normalizing key names:

- Converts keys to lowercase for case-insensitive matching
- Handles special keys like "Escape" → "Esc"
- Normalizes arrow keys to "ArrowUp", "ArrowDown", etc.
- Handles OS-specific keys (Command/Meta)
- Provides utility functions for checking modifier keys

### Key Functions:

- `normalizeKey(key: string, options?: NormalizeOptions): string`
- `isModifierKey(key: string): boolean`

## 2. Shortcut Detector (`shortcutDetector.ts`)

The ShortcutDetector is responsible for:

- Tracking active keys using the normalized key format
- Detecting when keyboard shortcuts are triggered
- Managing custom key mappings
- Controlling throttling and debouncing of keyboard events

### Key Functions:

- `normalizeKey(key: string): string` - Adapts the base normalization for shortcut detection
- `matchesShortcut(event: KeyboardEvent, shortcut: ShortcutKey): boolean`
- `handleKeyDown`, `handleKeyUp`, `isKeyPressed`, etc.

## 3. Shortcut Utils (`shortcutUtils.ts`)

Provides utility functions for working with shortcuts:

- Parsing shortcut strings ("Ctrl+Shift+P") to objects
- Formatting shortcut objects to strings
- Normalizing shortcut keys for display
- Converting shortcuts between OS formats

### Key Functions:

- `parseShortcut(shortcutStr: string): ShortcutKey`
- `formatShortcut(shortcut: ShortcutKey): string`
- `normalizeKeyName(key: string): string`

## 4. Keyboard Service (`keyboardService.ts`)

High-level service that:

- Manages global shortcuts
- Provides OS-specific key mappings
- Adapts shortcuts to the current OS
- Exposes a simple API for registering and triggering shortcuts

## Key Normalization Rules

| Input Key      | Normalized Output | Notes                          |
|----------------|-------------------|--------------------------------|
| Escape, escape | esc               | Consistent with VS Code, etc.  |
| Up, up         | arrowup           | Prefixed arrow key format      |
| Down, down     | arrowdown         | Prefixed arrow key format      |
| Left, left     | arrowleft         | Prefixed arrow key format      |
| Right, right   | arrowright        | Prefixed arrow key format      |
| Command, ⌘     | meta              | macOS command key              |
| Win, Windows   | meta              | Windows key                    |
| Control, Ctrl  | ctrl              | Control key                    |
| Option, Alt    | alt               | Alt/Option key                 |

## OS-Specific Considerations

1. **macOS**:
   - Command (⌘) is the primary modifier
   - Option (⌥) maps to Alt

2. **Windows**:
   - Ctrl is the primary modifier 
   - Windows key maps to Meta

3. **Linux**:
   - Ctrl is the primary modifier
   - Super key maps to Meta

## Best Practices

1. **Always normalize keys** before comparison or storage
2. **Check both raw and normalized keys** for maximum compatibility
3. **Use the formatted display versions** when showing shortcuts to users
4. **Consider OS-specific differences** when registering global shortcuts
5. **Use consistent casing** - normalized keys are lowercase for comparison

## Example Usage

```typescript
// Registering a shortcut
keyboardService.registerGlobalShortcut(
  'save-document',
  'Ctrl+S',  // Will be automatically adapted for macOS
  (event) => {
    saveDocument();
  }
);

// Checking key state
if (keyboardService.isKeyPressed('arrowup')) {
  moveCharacterUp();
}
```

## Testing

Each component has dedicated tests:

- `keyboardUtils.test.ts` - Tests for key normalization functions
- `shortcutUtils.test.ts` - Tests for shortcut parsing and formatting
- `shortcutDetector.test.ts` - Tests for shortcut detection and key state management
- `keyboardService.test.ts` - Tests for the high-level keyboard service API

## Related Components

- **OSDetectionService** - Detects the current operating system for shortcut adaptation
- **ThemeSlice** - Uses keyboard shortcuts for theme toggling 

## Extending the Key Normalization System

If you need to extend or modify the key normalization system, follow these guidelines:

### Adding New Special Keys

If you need to add new special key normalizations:

1. Update the `normalizeKey` function in `keyNormalization.ts`:

```typescript
// Example: Adding support for F13-F24 keys
export function normalizeKey(key: string, options?: NormalizeOptions): string {
  // ... existing code ...
  
  // Handle function keys F13-F24
  if (/^f(1[3-9]|2[0-4])$/i.test(key.toLowerCase())) {
    return key.toLowerCase();
  }
  
  // ... rest of function ...
}
```

2. Add tests in `keyboardUtils.test.ts` to verify the new normalization:

```typescript
describe('normalizeKey', () => {
  // ... existing tests ...
  
  it('should normalize extended function keys', () => {
    expect(normalizeKey('F13')).toBe('f13');
    expect(normalizeKey('F24')).toBe('f24');
  });
});
```

### Adding OS-Specific Behavior

To add platform-specific key handling:

1. Update the `OSDetectionService` with any new OS detection logic
2. Modify the normalization functions to use the detected OS:

```typescript
export function normalizeKey(key: string, options?: NormalizeOptions): string {
  const os = options?.os || osDetectionService.getOS();
  
  // OS-specific handling
  if (os === 'macos' && key === 'YourSpecialKey') {
    return 'normalized-special-key';
  }
  
  // ... rest of function ...
}
```

### Creating Custom Shortcut Parsers

For advanced shortcut syntax (e.g., chord sequences like "Ctrl+K Ctrl+S"):

1. Create a new parser in `shortcutUtils.ts`:

```typescript
export function parseChordShortcut(shortcutStr: string): ChordShortcut {
  const sequences = shortcutStr.split(' ').map(parseShortcut);
  return {
    sequences,
    type: 'chord'
  };
}
```

2. Update the ShortcutDetector to handle these new shortcut types:

```typescript
class AdvancedShortcutDetector extends ShortcutDetector {
  private activeSequence: string[] = [];
  
  handleKeyDown(event: KeyboardEvent): void {
    // Track sequence
    this.activeSequence.push(normalizeKey(event.key));
    
    // Check for chord matches
    // ...
    
    super.handleKeyDown(event);
  }
}
```

### Performance Optimization Tips

1. **Memoize frequently used normalizations**:

```typescript
const normalizedKeyCache = new Map<string, string>();

export function normalizeKey(key: string, options?: NormalizeOptions): string {
  const cacheKey = `${key}:${options?.os || 'default'}`;
  
  if (normalizedKeyCache.has(cacheKey)) {
    return normalizedKeyCache.get(cacheKey)!;
  }
  
  // ... normalization logic ...
  
  normalizedKeyCache.set(cacheKey, normalizedKey);
  return normalizedKey;
}
```

2. **Use Sets for active key tracking**:

```typescript
// Instead of arrays
private activeKeys = new Set<string>();

isKeyPressed(key: string): boolean {
  return this.activeKeys.has(normalizeKey(key));
}
```

### Integration with UI Components

To highlight keyboard shortcuts in UI components:

```tsx
const ShortcutHint: React.FC<{ shortcut: string }> = ({ shortcut }) => {
  const formattedShortcut = useFormattedShortcut(shortcut);
  
  return (
    <div className="shortcut-hint">
      {formattedShortcut.split('+').map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="shortcut-separator">+</span>}
          <kbd className="shortcut-key">{key}</kbd>
        </React.Fragment>
      ))}
    </div>
  );
};
```

## Troubleshooting

### Common Issues

1. **Inconsistent shortcut detection**: 
   - Ensure all key normalization paths use the same normalization function
   - Check for different event handling between components
   
2. **Platform-specific problems**:
   - Verify OS detection is working correctly
   - Test on all supported platforms
   
3. **Key not recognized**:
   - Add logging to see what raw key value is being received
   - Check for browser-specific key values
   
4. **Performance issues**:
   - Minimize event listener registrations
   - Use debouncing for frequently triggered shortcuts
   - Profile event handling with browser devtools 