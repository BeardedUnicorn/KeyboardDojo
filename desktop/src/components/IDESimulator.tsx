import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Code as CodeIcon,
  Search as SearchIcon,
  FolderOpen as FolderIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';

// Types for IDE simulator
export interface IDEFile {
  name: string;
  language: 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'markdown' | 'java' | 'python';
  content: string;
  active?: boolean;
}

export interface IDESimulatorProps {
  application: 'vscode' | 'intellij' | 'cursor';
  files: IDEFile[];
  activeFile?: string;
  highlightLines?: number[];
  highlightElement?: string;
  showSidebar?: boolean;
  showStatusBar?: boolean;
  showTabs?: boolean;
  width?: string | number;
  height?: string | number;
}

// Helper function to get syntax highlighting class based on language
const getSyntaxClass = (language: string): string => {
  switch (language) {
    case 'javascript':
      return 'language-javascript';
    case 'typescript':
      return 'language-typescript';
    case 'html':
      return 'language-html';
    case 'css':
      return 'language-css';
    case 'json':
      return 'language-json';
    case 'markdown':
      return 'language-markdown';
    case 'java':
      return 'language-java';
    case 'python':
      return 'language-python';
    default:
      return 'language-plaintext';
  }
};

// Helper function to get file icon based on language
const getFileIcon = (language: string): React.ReactNode => {
  switch (language) {
    case 'javascript':
      return <span style={{ color: '#F0DB4F' }}>JS</span>;
    case 'typescript':
      return <span style={{ color: '#007ACC' }}>TS</span>;
    case 'html':
      return <span style={{ color: '#E44D26' }}>HTML</span>;
    case 'css':
      return <span style={{ color: '#264DE4' }}>CSS</span>;
    case 'json':
      return <span style={{ color: '#F0DB4F' }}>JSON</span>;
    case 'markdown':
      return <span style={{ color: '#083FA1' }}>MD</span>;
    case 'java':
      return <span style={{ color: '#ED8B00' }}>JAVA</span>;
    case 'python':
      return <span style={{ color: '#3776AB' }}>PY</span>;
    default:
      return <span>TXT</span>;
  }
};

// Helper function to get application-specific styling
const getApplicationStyle = (application: string) => {
  switch (application) {
    case 'vscode':
      return {
        primaryColor: '#0078D7',
        secondaryColor: '#333333',
        backgroundColor: '#1E1E1E',
        textColor: '#CCCCCC',
        accentColor: '#007ACC',
        tabBarColor: '#252526',
        sidebarColor: '#252526',
        statusBarColor: '#007ACC',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      };
    case 'intellij':
      return {
        primaryColor: '#3C3F41',
        secondaryColor: '#2B2B2B',
        backgroundColor: '#2B2B2B',
        textColor: '#A9B7C6',
        accentColor: '#FC801D',
        tabBarColor: '#3C3F41',
        sidebarColor: '#3C3F41',
        statusBarColor: '#3C3F41',
        fontFamily: '"JetBrains Mono", monospace',
      };
    case 'cursor':
      return {
        primaryColor: '#1A1A1A',
        secondaryColor: '#252525',
        backgroundColor: '#1A1A1A',
        textColor: '#D4D4D4',
        accentColor: '#9B57B6',
        tabBarColor: '#252525',
        sidebarColor: '#252525',
        statusBarColor: '#9B57B6',
        fontFamily: '"SF Mono", monospace',
      };
    default:
      return {
        primaryColor: '#333333',
        secondaryColor: '#252525',
        backgroundColor: '#1E1E1E',
        textColor: '#CCCCCC',
        accentColor: '#007ACC',
        tabBarColor: '#252526',
        sidebarColor: '#252526',
        statusBarColor: '#007ACC',
        fontFamily: 'monospace',
      };
  }
};

const IDESimulator: React.FC<IDESimulatorProps> = ({
  application = 'vscode',
  files = [],
  activeFile,
  highlightLines = [],
  highlightElement,
  showSidebar = true,
  showStatusBar = true,
  showTabs = true,
  width = '100%',
  height = '500px',
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<string>(activeFile || (files.length > 0 ? files[0].name : ''));
  
  // Get the active file content
  const activeFileObj = files.find(file => file.name === activeTab) || files[0];
  
  // Get application-specific styling
  const appStyle = getApplicationStyle(application);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  
  // Format code with line numbers and highlighting
  const formatCode = (content: string, language: string) => {
    const lines = content.split('\n');
    
    return (
      <Box 
        sx={{ 
          fontFamily: 'monospace', 
          fontSize: '14px',
          lineHeight: 1.5,
          overflow: 'auto',
          p: 1,
        }}
      >
        {lines.map((line, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'flex',
              backgroundColor: highlightLines.includes(index + 1) 
                ? `${appStyle.accentColor}33` // 20% opacity
                : 'transparent',
              borderLeft: highlightLines.includes(index + 1)
                ? `2px solid ${appStyle.accentColor}`
                : '2px solid transparent',
              '&:hover': {
                backgroundColor: `${appStyle.secondaryColor}`,
              },
            }}
          >
            <Box 
              sx={{ 
                width: '40px', 
                textAlign: 'right', 
                color: appStyle.textColor + '99', // 60% opacity
                userSelect: 'none',
                pr: 1,
                borderRight: `1px solid ${appStyle.secondaryColor}`,
                mr: 1,
              }}
            >
              {index + 1}
            </Box>
            <Box 
              sx={{ 
                flex: 1,
                whiteSpace: 'pre',
                color: appStyle.textColor,
              }}
              className={getSyntaxClass(language)}
            >
              {line || ' '}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width,
        height,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        backgroundColor: appStyle.backgroundColor,
        color: appStyle.textColor,
        fontFamily: appStyle.fontFamily,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Title bar */}
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: appStyle.primaryColor,
          color: '#FFFFFF',
          p: 0.5,
          pl: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          {application === 'vscode' && 'Visual Studio Code'}
          {application === 'intellij' && 'IntelliJ IDEA'}
          {application === 'cursor' && 'Cursor'}
          {activeTab && ` - ${activeTab}`}
        </Typography>
        <IconButton size="small" sx={{ color: '#FFFFFF' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Menu bar */}
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: appStyle.secondaryColor,
          color: appStyle.textColor,
          p: 0.5,
          pl: 1,
          borderBottom: `1px solid ${appStyle.primaryColor}`,
        }}
      >
        {['File', 'Edit', 'View', 'Navigate', 'Code', 'Help'].map((menu) => (
          <Box 
            key={menu}
            sx={{ 
              px: 1, 
              py: 0.5, 
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: `${appStyle.primaryColor}33`, // 20% opacity
              },
              ...(highlightElement === menu ? {
                backgroundColor: `${appStyle.accentColor}33`, // 20% opacity
                outline: `1px solid ${appStyle.accentColor}`,
              } : {}),
            }}
          >
            {menu}
          </Box>
        ))}
      </Box>
      
      {/* Main content area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        {showSidebar && (
          <Box 
            sx={{ 
              width: '200px',
              backgroundColor: appStyle.sidebarColor,
              borderRight: `1px solid ${appStyle.primaryColor}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Sidebar icons */}
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRight: `1px solid ${appStyle.primaryColor}`,
                backgroundColor: appStyle.backgroundColor,
                py: 1,
                width: '48px',
              }}
            >
              {[
                { icon: <FolderIcon />, name: 'Explorer' },
                { icon: <SearchIcon />, name: 'Search' },
                { icon: <CodeIcon />, name: 'Source Control' },
                { icon: <SettingsIcon />, name: 'Settings' },
              ].map((item, index) => (
                <IconButton 
                  key={index}
                  size="small"
                  sx={{ 
                    color: appStyle.textColor,
                    my: 0.5,
                    ...(highlightElement === item.name ? {
                      color: appStyle.accentColor,
                      backgroundColor: `${appStyle.accentColor}33`, // 20% opacity
                    } : {}),
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>
            
            {/* File explorer */}
            <Box sx={{ flex: 1, p: 1, overflow: 'auto' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                EXPLORER
              </Typography>
              
              {/* Project files */}
              <Box sx={{ ml: 1 }}>
                {files.map((file, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      p: 0.5,
                      borderRadius: 0.5,
                      cursor: 'pointer',
                      fontSize: '13px',
                      backgroundColor: file.name === activeTab 
                        ? `${appStyle.accentColor}33` // 20% opacity
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: `${appStyle.primaryColor}33`, // 20% opacity
                      },
                      ...(highlightElement === `file-${file.name}` ? {
                        outline: `1px solid ${appStyle.accentColor}`,
                      } : {}),
                    }}
                    onClick={() => setActiveTab(file.name)}
                  >
                    <Box sx={{ mr: 1, fontSize: '12px' }}>
                      {getFileIcon(file.language)}
                    </Box>
                    <Typography variant="body2" noWrap>
                      {file.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
        
        {/* Editor area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          {showTabs && (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                minHeight: '36px',
                backgroundColor: appStyle.tabBarColor,
                '& .MuiTabs-indicator': {
                  backgroundColor: appStyle.accentColor,
                },
                '& .MuiTab-root': {
                  minHeight: '36px',
                  textTransform: 'none',
                  color: appStyle.textColor,
                  fontSize: '13px',
                  padding: '0 16px',
                },
              }}
            >
              {files.map((file) => (
                <Tab 
                  key={file.name}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 1, fontSize: '12px' }}>
                        {getFileIcon(file.language)}
                      </Box>
                      {file.name}
                      <IconButton 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          p: 0.25,
                          color: appStyle.textColor,
                          '&:hover': {
                            backgroundColor: `${appStyle.primaryColor}33`, // 20% opacity
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle close tab
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  value={file.name}
                  sx={{
                    backgroundColor: file.name === activeTab 
                      ? appStyle.backgroundColor
                      : appStyle.tabBarColor,
                    borderRight: `1px solid ${appStyle.primaryColor}`,
                    opacity: 1,
                    ...(highlightElement === `tab-${file.name}` ? {
                      outline: `1px solid ${appStyle.accentColor}`,
                    } : {}),
                  }}
                />
              ))}
              <IconButton 
                size="small" 
                sx={{ 
                  minWidth: '36px',
                  height: '36px',
                  color: appStyle.textColor,
                  borderRadius: 0,
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tabs>
          )}
          
          {/* Code editor */}
          <Box 
            sx={{ 
              flex: 1, 
              overflow: 'auto',
              backgroundColor: appStyle.backgroundColor,
            }}
          >
            {activeFileObj && formatCode(activeFileObj.content, activeFileObj.language)}
          </Box>
        </Box>
      </Box>
      
      {/* Status bar */}
      {showStatusBar && (
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            backgroundColor: appStyle.statusBarColor,
            color: '#FFFFFF',
            p: 0.5,
            fontSize: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                px: 1,
                ...(highlightElement === 'status-branch' ? {
                  backgroundColor: `${appStyle.accentColor}66`, // 40% opacity
                  outline: `1px solid ${appStyle.accentColor}`,
                } : {}),
              }}
            >
              <CodeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '14px' }} />
              main
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                px: 1,
                ...(highlightElement === 'status-language' ? {
                  backgroundColor: `${appStyle.accentColor}66`, // 40% opacity
                  outline: `1px solid ${appStyle.accentColor}`,
                } : {}),
              }}
            >
              {activeFileObj?.language.toUpperCase() || 'PLAIN TEXT'}
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                px: 1,
                ...(highlightElement === 'status-encoding' ? {
                  backgroundColor: `${appStyle.accentColor}66`, // 40% opacity
                  outline: `1px solid ${appStyle.accentColor}`,
                } : {}),
              }}
            >
              UTF-8
            </Box>
          </Box>
          
          <Box sx={{ flex: 1 }} />
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              px: 1,
              ...(highlightElement === 'status-position' ? {
                backgroundColor: `${appStyle.accentColor}66`, // 40% opacity
                outline: `1px solid ${appStyle.accentColor}`,
              } : {}),
            }}
          >
            Ln 1, Col 1
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default IDESimulator; 