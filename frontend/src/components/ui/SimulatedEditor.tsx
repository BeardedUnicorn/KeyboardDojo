import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  Paper, 
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  ContentCopy as CopyIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Refresh as ResetIcon
} from '@mui/icons-material';

// Define editor themes
export type EditorTheme = 'light' | 'dark' | 'system';

// Define editor language
export type EditorLanguage = 
  | 'javascript' 
  | 'typescript' 
  | 'html' 
  | 'css' 
  | 'json' 
  | 'markdown' 
  | 'plaintext';

// Define cursor position
export interface CursorPosition {
  line: number;
  column: number;
}

// Define selection range
export interface SelectionRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

// Define props interface
interface SimulatedEditorProps {
  initialContent?: string;
  language?: EditorLanguage;
  theme?: EditorTheme;
  readOnly?: boolean;
  lineNumbers?: boolean;
  highlightLines?: number[];
  initialCursorPosition?: CursorPosition;
  initialSelection?: SelectionRange;
  onChange?: (content: string) => void;
  onCursorChange?: (position: CursorPosition) => void;
  onSelectionChange?: (selection: SelectionRange | null) => void;
  onKeyPress?: (key: string, ctrlKey: boolean, shiftKey: boolean, altKey: boolean) => void;
  showToolbar?: boolean;
  height?: string | number;
  width?: string | number;
  className?: string;
}

// Styled components
const EditorContainer = styled(Paper, {
  shouldForwardProp: (prop) => !['isFullscreen', 'editorTheme'].includes(prop as string),
})<{ isFullscreen: boolean; editorTheme: EditorTheme }>(({ theme, isFullscreen, editorTheme }) => {
  const isDarkTheme = 
    editorTheme === 'dark' || 
    (editorTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    ...(isFullscreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: theme.zIndex.modal,
      borderRadius: 0,
    }),
    backgroundColor: isDarkTheme ? '#1e1e1e' : '#ffffff',
    color: isDarkTheme ? '#d4d4d4' : '#333333',
  };
});

const EditorToolbar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'editorTheme',
})<{ editorTheme: EditorTheme }>(({ theme, editorTheme }) => {
  const isDarkTheme = 
    editorTheme === 'dark' || 
    (editorTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5, 1),
    borderBottom: `1px solid ${isDarkTheme ? '#444444' : theme.palette.divider}`,
    backgroundColor: isDarkTheme ? '#2d2d2d' : '#f5f5f5',
  };
});

const EditorContent = styled(Box, {
  shouldForwardProp: (prop) => !['hasLineNumbers', 'editorTheme'].includes(prop as string),
})<{ hasLineNumbers: boolean; editorTheme: EditorTheme }>(({ hasLineNumbers, editorTheme }) => {
  const isDarkTheme = 
    editorTheme === 'dark' || 
    (editorTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    backgroundColor: isDarkTheme ? '#1e1e1e' : '#ffffff',
    ...(hasLineNumbers && {
      paddingLeft: '50px',
    }),
  };
});

const LineNumbers = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'editorTheme',
})<{ editorTheme: EditorTheme }>(({ theme, editorTheme }) => {
  const isDarkTheme = 
    editorTheme === 'dark' || 
    (editorTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50px',
    overflow: 'hidden',
    backgroundColor: isDarkTheme ? '#252525' : '#f0f0f0',
    borderRight: `1px solid ${isDarkTheme ? '#444444' : theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    color: isDarkTheme ? '#858585' : '#999999',
    userSelect: 'none',
  };
});

const CodeLine = styled(Box, {
  shouldForwardProp: (prop) => !['isHighlighted', 'editorTheme'].includes(prop as string),
})<{ isHighlighted: boolean; editorTheme: EditorTheme }>(({ theme, isHighlighted, editorTheme }) => {
  const isDarkTheme = 
    editorTheme === 'dark' || 
    (editorTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return {
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    padding: theme.spacing(0, 1),
    minHeight: '1.5em',
    position: 'relative',
    ...(isHighlighted && {
      backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    }),
  };
});

const EditorTextarea = styled('textarea')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  border: 'none',
  padding: theme.spacing(1),
  resize: 'none',
  fontFamily: 'monospace',
  fontSize: '14px',
  lineHeight: 1.5,
  backgroundColor: 'transparent',
  color: 'inherit',
  outline: 'none',
  overflow: 'auto',
}));

const Cursor = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '2px',
  height: '1.2em',
  backgroundColor: theme.palette.primary.main,
  animation: 'blink 1s step-end infinite',
  '@keyframes blink': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
  },
}));

const Selection = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: `${theme.palette.primary.main}40`,
  height: '1.2em',
}));

// Helper function to tokenize code for syntax highlighting
const tokenizeCode = (code: string, language: EditorLanguage): React.ReactNode[] => {
  // This is a simplified tokenizer for demonstration
  // In a real implementation, you would use a proper syntax highlighting library
  
  if (language === 'plaintext') {
    return [<span key="text">{code}</span>];
  }
  
  // Simple regex patterns for basic syntax highlighting
  const patterns: Record<string, { regex: RegExp; className: string }[]> = {
    javascript: [
      { regex: /(\/\/.*)/g, className: 'comment' },
      { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await)\b/g, className: 'keyword' },
      { regex: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'builtin' },
      { regex: /("[^"]*"|'[^']*'|`[^`]*`)/g, className: 'string' },
      { regex: /\b(\d+(\.\d+)?)\b/g, className: 'number' },
    ],
    typescript: [
      { regex: /(\/\/.*)/g, className: 'comment' },
      { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|interface|type|extends|implements)\b/g, className: 'keyword' },
      { regex: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'builtin' },
      { regex: /("[^"]*"|'[^']*'|`[^`]*`)/g, className: 'string' },
      { regex: /\b(\d+(\.\d+)?)\b/g, className: 'number' },
    ],
    html: [
      { regex: /(<!--.*?-->)/g, className: 'comment' },
      { regex: /(<\/?\w+(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^'">\s]+))?)*\s*\/?>)/g, className: 'tag' },
      { regex: /((?<=<[^>]*)\s*\w+(?=\s*=))/g, className: 'attribute' },
      { regex: /("[^"]*"|'[^']*')/g, className: 'string' },
    ],
    css: [
      { regex: /(\/\*.*?\*\/)/g, className: 'comment' },
      { regex: /([.#]\w+(?:-\w+)*)/g, className: 'selector' },
      { regex: /(\w+(?:-\w+)*(?=\s*:))/g, className: 'property' },
      { regex: /(:\s*[^;]+)/g, className: 'value' },
    ],
    json: [
      { regex: /("[^"]*"(?=\s*:))/g, className: 'property' },
      { regex: /("[^"]*")/g, className: 'string' },
      { regex: /\b(\d+(\.\d+)?)\b/g, className: 'number' },
      { regex: /\b(true|false|null)\b/g, className: 'builtin' },
    ],
    markdown: [
      { regex: /^(#{1,6}\s+.*$)/gm, className: 'heading' },
      { regex: /(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_)/g, className: 'emphasis' },
      { regex: /(\[.*?\]\(.*?\))/g, className: 'link' },
      { regex: /(`.*?`)/g, className: 'code' },
      { regex: /(```[\s\S]*?```)/g, className: 'codeblock' },
    ],
  };
  
  // Use the patterns for the specified language, or fallback to plaintext
  const languagePatterns = patterns[language] || [];
  
  // Apply syntax highlighting
  const result = code;
  const segments: { text: string; className?: string }[] = [];
  
  // Split the code into segments based on the patterns
  let lastIndex = 0;
  
  // Process each pattern
  languagePatterns.forEach(({ regex, className }) => {
    let match;
    while ((match = regex.exec(result)) !== null) {
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;
      
      // Add the text before the match
      if (matchStart > lastIndex) {
        segments.push({ text: result.substring(lastIndex, matchStart) });
      }
      
      // Add the matched text with its class
      segments.push({ text: match[0], className });
      
      lastIndex = matchEnd;
    }
  });
  
  // Add any remaining text
  if (lastIndex < result.length) {
    segments.push({ text: result.substring(lastIndex) });
  }
  
  // Convert segments to React elements
  return segments.map((segment, index) => (
    <span key={index} className={segment.className}>
      {segment.text}
    </span>
  ));
};

// SimulatedEditor component
const SimulatedEditor: React.FC<SimulatedEditorProps> = ({
  initialContent = '',
  language = 'plaintext',
  theme: editorTheme = 'system',
  readOnly = false,
  lineNumbers = true,
  highlightLines = [],
  initialCursorPosition,
  initialSelection,
  onChange,
  onCursorChange,
  onSelectionChange,
  onKeyPress,
  showToolbar = true,
  height = '300px',
  width = '100%',
  className,
}) => {
  const theme = useTheme();
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>(
    initialCursorPosition || { line: 0, column: 0 }
  );
  const [selection, setSelection] = useState<SelectionRange | null>(initialSelection || null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Split content into lines
  const lines = content.split('\n');
  
  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (onChange) {
      onChange(newContent);
    }
  };
  
  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyPress) {
      onKeyPress(e.key, e.ctrlKey, e.shiftKey, e.altKey);
    }
  };
  
  // Handle cursor position change
  const handleCursorPositionChange = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    
    // Calculate line and column from selection start
    let line = 0;
    let column = selectionStart;
    
    for (let i = 0; i < lines.length; i++) {
      if (column > lines[i].length) {
        column -= lines[i].length + 1; // +1 for the newline character
        line++;
      } else {
        break;
      }
    }
    
    const newPosition = { line, column };
    setCursorPosition(newPosition);
    
    if (onCursorChange) {
      onCursorChange(newPosition);
    }
    
    // Handle selection
    if (selectionStart !== selectionEnd) {
      // Calculate selection range
      let startLine = 0;
      let startColumn = selectionStart;
      let endLine = 0;
      let endColumn = selectionEnd;
      
      // Calculate start position
      for (let i = 0; i < lines.length; i++) {
        if (startColumn > lines[i].length) {
          startColumn -= lines[i].length + 1;
          startLine++;
        } else {
          break;
        }
      }
      
      // Calculate end position
      for (let i = 0; i < lines.length; i++) {
        if (endColumn > lines[i].length) {
          endColumn -= lines[i].length + 1;
          endLine++;
        } else {
          break;
        }
      }
      
      const newSelection = {
        startLine,
        startColumn,
        endLine,
        endColumn,
      };
      
      setSelection(newSelection);
      
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
    } else {
      setSelection(null);
      
      if (onSelectionChange) {
        onSelectionChange(null);
      }
    }
  };
  
  // Focus the editor
  const focusEditor = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Copy content to clipboard
  const copyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      
      // Reset selection
      if (selection) {
        const selectionStart = getPositionOffset(selection.startLine, selection.startColumn);
        const selectionEnd = getPositionOffset(selection.endLine, selection.endColumn);
        
        textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
      } else {
        const cursorOffset = getPositionOffset(cursorPosition.line, cursorPosition.column);
        textareaRef.current.setSelectionRange(cursorOffset, cursorOffset);
      }
    }
  };
  
  // Reset editor content
  const resetContent = () => {
    setContent(initialContent);
    setCursorPosition(initialCursorPosition || { line: 0, column: 0 });
    setSelection(initialSelection || null);
    
    if (onChange) {
      onChange(initialContent);
    }
  };
  
  // Get character offset from line and column
  const getPositionOffset = (line: number, column: number): number => {
    let offset = 0;
    
    for (let i = 0; i < line; i++) {
      offset += (lines[i]?.length || 0) + 1; // +1 for the newline character
    }
    
    return offset + column;
  };
  
  // Set initial cursor position and selection
  useEffect(() => {
    if (textareaRef.current) {
      if (initialSelection) {
        const selectionStart = getPositionOffset(initialSelection.startLine, initialSelection.startColumn);
        const selectionEnd = getPositionOffset(initialSelection.endLine, initialSelection.endColumn);
        
        textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
      } else if (initialCursorPosition) {
        const cursorOffset = getPositionOffset(initialCursorPosition.line, initialCursorPosition.column);
        textareaRef.current.setSelectionRange(cursorOffset, cursorOffset);
      }
    }
  }, []);
  
  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  
  // Render the editor
  return (
    <EditorContainer 
      ref={containerRef}
      isFullscreen={isFullscreen} 
      editorTheme={editorTheme}
      className={className}
      elevation={isFullscreen ? 24 : 1}
      sx={{ 
        height: isFullscreen ? '100vh' : height,
        width: isFullscreen ? '100vw' : width,
      }}
      onClick={focusEditor}
    >
      {showToolbar && (
        <EditorToolbar editorTheme={editorTheme}>
          <Typography variant="caption" fontFamily="monospace">
            {language.toUpperCase()}
          </Typography>
          
          <Box>
            <Tooltip title="Copy code">
              <IconButton size="small" onClick={copyToClipboard}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Reset">
              <IconButton size="small" onClick={resetContent}>
                <ResetIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
              <IconButton size="small" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <FullscreenExitIcon fontSize="small" />
                ) : (
                  <FullscreenIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </EditorToolbar>
      )}
      
      <EditorContent hasLineNumbers={lineNumbers} editorTheme={editorTheme}>
        {lineNumbers && (
          <LineNumbers editorTheme={editorTheme}>
            {lines.map((_, index) => (
              <Typography key={index} variant="caption" fontFamily="monospace">
                {index + 1}
              </Typography>
            ))}
          </LineNumbers>
        )}
        
        <Box 
          position="relative" 
          width="100%" 
          height="100%" 
          overflow="auto"
          sx={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.5 }}
        >
          {/* Visible code with syntax highlighting */}
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            padding={1}
            sx={{ pointerEvents: 'none' }}
          >
            {lines.map((line, lineIndex) => (
              <CodeLine 
                key={lineIndex} 
                isHighlighted={highlightLines.includes(lineIndex)} 
                editorTheme={editorTheme}
              >
                {tokenizeCode(line, language)}
              </CodeLine>
            ))}
            
            {/* Render cursor */}
            {!readOnly && !selection && (
              <Cursor 
                sx={{ 
                  top: `calc(${cursorPosition.line * 1.5}em + ${theme.spacing(1)})`,
                  left: `calc(${cursorPosition.column}ch + ${theme.spacing(1)})`,
                }}
              />
            )}
            
            {/* Render selection */}
            {!readOnly && selection && (
              <>
                {/* Handle multi-line selections */}
                {Array.from({ length: selection.endLine - selection.startLine + 1 }).map((_, index) => {
                  const currentLine = selection.startLine + index;
                  const lineLength = lines[currentLine]?.length || 0;
                  
                  let startColumn = 0;
                  let width = 0;
                  
                  if (currentLine === selection.startLine && currentLine === selection.endLine) {
                    // Selection within a single line
                    startColumn = selection.startColumn;
                    width = selection.endColumn - selection.startColumn;
                  } else if (currentLine === selection.startLine) {
                    // First line of multi-line selection
                    startColumn = selection.startColumn;
                    width = lineLength - selection.startColumn;
                  } else if (currentLine === selection.endLine) {
                    // Last line of multi-line selection
                    startColumn = 0;
                    width = selection.endColumn;
                  } else {
                    // Middle line of multi-line selection
                    startColumn = 0;
                    width = lineLength;
                  }
                  
                  return (
                    <Selection
                      key={currentLine}
                      sx={{
                        top: `calc(${currentLine * 1.5}em + ${theme.spacing(1)})`,
                        left: `calc(${startColumn}ch + ${theme.spacing(1)})`,
                        width: `${width}ch`,
                      }}
                    />
                  );
                })}
              </>
            )}
          </Box>
          
          {/* Actual textarea for editing (invisible but functional) */}
          <EditorTextarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={handleCursorPositionChange}
            onClick={handleCursorPositionChange}
            readOnly={readOnly}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm="false"
            sx={{ 
              color: 'transparent',
              caretColor: 'transparent',
              ...(readOnly && { cursor: 'default' }),
            }}
          />
        </Box>
      </EditorContent>
    </EditorContainer>
  );
};

export default SimulatedEditor; 