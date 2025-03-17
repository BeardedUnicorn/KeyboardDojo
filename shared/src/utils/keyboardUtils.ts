/**
 * Utility functions for keyboard event handling
 */

/**
 * Checks if two arrays of key strings are equivalent, accounting for key aliases
 * @param a First array of keys
 * @param b Second array of keys
 * @returns True if the arrays are equivalent
 */
export const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  
  // Map of key aliases to standardize key names
  const keyAliases: Record<string, string[]> = {
    'control': ['ctrl', 'control'],
    'command': ['cmd', 'command', 'meta'],
    'option': ['alt', 'option'],
    'escape': ['esc', 'escape'],
  };
  
  return a.every((val, index) => {
    const aKey = val.toLowerCase();
    const bKey = b[index].toLowerCase();
    
    // Direct match
    if (aKey === bKey) return true;
    
    // Check aliases
    for (const [, aliases] of Object.entries(keyAliases)) {
      if (aliases.includes(aKey) && aliases.includes(bKey)) {
        return true;
      }
    }
    
    return false;
  });
};

/**
 * Checks if a key is a modifier key
 * @param key The key to check
 * @returns True if the key is a modifier key
 */
export const isModifierKey = (key: string): boolean => {
  const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta', 'Command'];
  return modifierKeys.includes(key);
};

/**
 * Formats an array of keys into a readable key combination string
 * @param keys Array of keys to format
 * @returns Formatted key combination string
 */
export const formatKeyCombo = (keys: string[]): string => {
  return keys.map(key => key.charAt(0).toUpperCase() + key.slice(1)).join(' + ');
}; 