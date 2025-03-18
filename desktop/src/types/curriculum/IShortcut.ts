// Shortcut definition
export interface IShortcut {
  id: string;
  name: string;
  shortcutWindows: string;
  shortcutMac?: string;
  shortcutLinux?: string;
  description?: string;
  category?: string;
  context?: string;
}
