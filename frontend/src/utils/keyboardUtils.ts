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

export const isModifierKey = (key: string): boolean => {
  const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta', 'Command'];
  return modifierKeys.includes(key);
};

export const formatKeyCombo = (keys: string[]): string => {
  return keys.map(key => key.charAt(0).toUpperCase() + key.slice(1)).join(' + ');
}; 