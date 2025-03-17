import React from 'react';
import { Box, styled, useTheme, Typography, Theme } from '@mui/material';
import { fadeIn } from './NinjaMascotAnimations';

// Define node status types
export type NodeStatus = 'completed' | 'current' | 'locked' | 'available';

// Define path layout types
export type PathLayout = 'linear' | 'branching' | 'tree';

// Define node interface
export interface PathNode {
  id: string;
  title: string;
  description?: string;
  status: NodeStatus;
  icon?: React.ReactNode;
  children?: string[]; // IDs of child nodes
  parentId?: string; // ID of parent node
  xp?: number; // Experience points for completing this node
  level?: number; // Level of difficulty
}

// Define props interface
interface ProgressPathProps {
  nodes: PathNode[];
  layout?: PathLayout;
  onNodeClick?: (nodeId: string) => void;
  animate?: boolean;
  className?: string;
}

// Node component
const PathNodeComponent = styled(Box, {
  shouldForwardProp: (prop) => !['nodeStatus', 'isAnimating'].includes(prop as string),
})<{ nodeStatus: NodeStatus; isAnimating: boolean }>(({ theme, nodeStatus, isAnimating }) => {
  // Set styles based on node status
  let statusStyles = {};
  
  switch (nodeStatus) {
    case 'completed':
      statusStyles = {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        border: `2px solid ${theme.palette.success.main}`,
        '&::after': {
          backgroundColor: theme.palette.success.main,
        },
      };
      break;
    case 'current':
      statusStyles = {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        border: `2px solid ${theme.palette.primary.main}`,
        boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
        '&::after': {
          backgroundColor: theme.palette.primary.main,
        },
      };
      break;
    case 'available':
      statusStyles = {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.primary.main}`,
        '&::after': {
          backgroundColor: theme.palette.primary.main,
        },
      };
      break;
    case 'locked':
    default:
      statusStyles = {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.disabled,
        border: `2px solid ${theme.palette.grey[300]}`,
        '&::after': {
          backgroundColor: theme.palette.grey[300],
        },
      };
  }
  
  return {
    position: 'relative',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: nodeStatus === 'locked' ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 2,
    ...(isAnimating && {
      animation: `${fadeIn} 0.5s ease-out forwards`,
    }),
    '&:hover': {
      transform: nodeStatus !== 'locked' ? 'scale(1.05)' : 'none',
      boxShadow: nodeStatus !== 'locked' ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
    },
    ...statusStyles,
  };
});

// Path connector styles
const getConnectorStyles = (isCompleted: boolean, direction: string, theme: Theme) => {
  // Base styles
  const baseStyles = {
    position: 'absolute',
    backgroundColor: isCompleted ? theme.palette.success.main : theme.palette.grey[300],
    transition: 'background-color 0.3s ease',
  };
  
  // Direction-specific styles
  let directionStyles = {};
  
  switch (direction) {
    case 'horizontal':
      directionStyles = {
        height: '4px',
        width: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
      };
      break;
    case 'vertical':
      directionStyles = {
        width: '4px',
        height: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
      };
      break;
    case 'diagonal-right':
      directionStyles = {
        width: '4px',
        height: '100%',
        left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
        transformOrigin: 'top',
      };
      break;
    case 'diagonal-left':
      directionStyles = {
        width: '4px',
        height: '100%',
        left: '50%',
        transform: 'translateX(-50%) rotate(-45deg)',
        transformOrigin: 'top',
      };
      break;
    default:
      directionStyles = {
        height: '4px',
        width: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
      };
  }
  
  return {
    ...baseStyles,
    ...directionStyles,
  };
};

// Node content
const NodeContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: theme.spacing(1),
}));

// Node tooltip
const NodeTooltip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  zIndex: 10,
  minWidth: '150px',
  marginBottom: theme.spacing(1),
  visibility: 'hidden',
  opacity: 0,
  transition: 'opacity 0.2s ease, visibility 0.2s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '8px 8px 0',
    borderStyle: 'solid',
    borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
  },
}));

// Node container
const NodeContainer = styled(Box)({
  position: 'relative',
  '&:hover .node-tooltip': {
    visibility: 'visible',
    opacity: 1,
  },
});

// Linear layout container
const LinearLayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(6),
  padding: theme.spacing(4),
  position: 'relative',
  overflowX: 'auto',
  width: '100%',
}));

// Tree layout container
const TreeLayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  padding: theme.spacing(4),
  position: 'relative',
  width: '100%',
}));

// Tree row
const TreeRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(6),
  position: 'relative',
}));

// ProgressPath component
const ProgressPath: React.FC<ProgressPathProps> = ({
  nodes,
  layout = 'linear',
  onNodeClick,
  animate = false,
  className,
}) => {
  const theme = useTheme();
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);
  
  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.status !== 'locked' && onNodeClick) {
      onNodeClick(nodeId);
    }
  };
  
  // Organize nodes by level for tree layout
  const organizeNodesByLevel = () => {
    const nodesByLevel: Record<number, PathNode[]> = {};
    
    // First, find root nodes (nodes without parents)
    const rootNodes = nodes.filter(node => !node.parentId);
    
    // Assign level 0 to root nodes
    nodesByLevel[0] = rootNodes;
    
    // Function to recursively assign levels
    const assignLevels = (nodeIds: string[], level: number) => {
      const childNodes = nodes.filter(node => node.parentId && nodeIds.includes(node.parentId));
      
      if (childNodes.length > 0) {
        nodesByLevel[level] = [...(nodesByLevel[level] || []), ...childNodes];
        const childIds = childNodes.map(node => node.id);
        assignLevels(childIds, level + 1);
      }
    };
    
    // Start assigning levels from root nodes
    assignLevels(rootNodes.map(node => node.id), 1);
    
    return nodesByLevel;
  };
  
  // Render linear layout
  const renderLinearLayout = () => {
    return (
      <LinearLayoutContainer className={className}>
        {nodes.map((node, index) => {
          const isLast = index === nodes.length - 1;
          
          return (
            <React.Fragment key={node.id}>
              <NodeContainer
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <PathNodeComponent
                  nodeStatus={node.status}
                  isAnimating={animate}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <NodeContent>
                    {node.icon}
                    <Typography variant="caption" fontWeight="bold" textAlign="center">
                      {node.title}
                    </Typography>
                  </NodeContent>
                </PathNodeComponent>
                
                {hoveredNode === node.id && (
                  <NodeTooltip className="node-tooltip">
                    <Typography variant="subtitle2" fontWeight="bold">
                      {node.title}
                    </Typography>
                    {node.description && (
                      <Typography variant="caption" color="text.secondary">
                        {node.description}
                      </Typography>
                    )}
                    {node.xp && (
                      <Typography variant="caption" color="primary">
                        XP: {node.xp}
                      </Typography>
                    )}
                    {node.level && (
                      <Typography variant="caption" color="secondary">
                        Level: {node.level}
                      </Typography>
                    )}
                  </NodeTooltip>
                )}
              </NodeContainer>
              
              {!isLast && (
                <Box position="relative" height="4px" flex={1} sx={getConnectorStyles(node.status === 'completed', 'horizontal', theme)}>
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </LinearLayoutContainer>
    );
  };
  
  // Render tree layout
  const renderTreeLayout = () => {
    const nodesByLevel = organizeNodesByLevel();
    const levels = Object.keys(nodesByLevel).map(Number).sort((a, b) => a - b);
    
    return (
      <TreeLayoutContainer className={className}>
        {levels.map(level => (
          <TreeRow key={level}>
            {nodesByLevel[level].map(node => (
              <NodeContainer
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <PathNodeComponent
                  nodeStatus={node.status}
                  isAnimating={animate}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <NodeContent>
                    {node.icon}
                    <Typography variant="caption" fontWeight="bold" textAlign="center">
                      {node.title}
                    </Typography>
                  </NodeContent>
                </PathNodeComponent>
                
                {hoveredNode === node.id && (
                  <NodeTooltip className="node-tooltip">
                    <Typography variant="subtitle2" fontWeight="bold">
                      {node.title}
                    </Typography>
                    {node.description && (
                      <Typography variant="caption" color="text.secondary">
                        {node.description}
                      </Typography>
                    )}
                    {node.xp && (
                      <Typography variant="caption" color="primary">
                        XP: {node.xp}
                      </Typography>
                    )}
                    {node.level && (
                      <Typography variant="caption" color="secondary">
                        Level: {node.level}
                      </Typography>
                    )}
                  </NodeTooltip>
                )}
                
                {/* Render connectors to children */}
                {node.children && node.children.length > 0 && node.children.map(childId => {
                  const childNode = nodes.find(n => n.id === childId);
                  if (!childNode) return null;
                  
                  return (
                    <Box
                      key={`connector-${node.id}-${childId}`}
                      position="absolute"
                      bottom="-40px"
                      left="50%"
                      height="40px"
                      width="4px"
                      sx={getConnectorStyles(node.status === 'completed', 'vertical', theme)}
                    />
                  );
                })}
              </NodeContainer>
            ))}
          </TreeRow>
        ))}
      </TreeLayoutContainer>
    );
  };
  
  // Render branching layout (combination of linear and tree)
  const renderBranchingLayout = () => {
    // For simplicity, we'll use the tree layout for branching as well
    return renderTreeLayout();
  };
  
  // Render based on layout type
  switch (layout) {
    case 'tree':
      return renderTreeLayout();
    case 'branching':
      return renderBranchingLayout();
    case 'linear':
    default:
      return renderLinearLayout();
  }
};

export default ProgressPath; 