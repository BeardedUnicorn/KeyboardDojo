import {
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Flag as FlagIcon,
  School as SchoolIcon,
  Terrain as TerrainIcon,
  Park as ParkIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  useTheme,
  Button,
  Tooltip,
  Zoom,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';

import { useSound } from '@/hooks/useSound';
import { curriculumService , useLogger } from '@/services';
import { PathNodeType } from '@/types/progress/ICurriculum';
import { useUserProgressRedux } from '@hooks/useUserProgressRedux';

import { usePathConnectionOptimization } from '../hooks/usePathConnectionOptimization';
import { usePathNodeOptimization } from '../hooks/usePathNodeOptimization';

import type {
  IPath,
  PathNode as IPathNode,
  Point, ApplicationType,
} from '@/types/progress/ICurriculum';
import type { CSSProperties , FC , KeyboardEvent as ReactKeyboardEvent } from 'react';

// Trail decoration component (trees, rocks, etc.)
const TrailDecoration: FC<{
  x: number;
  y: number;
  type: 'tree' | 'rock' | 'landmark';
  side: 'left' | 'right';
}> = ({ x, y, type, side }) => {
  const theme = useTheme();
  const offsetX = side === 'left' ? -60 : 60;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x + offsetX}px`,
        top: `${y}px`,
        color: type === 'tree'
          ? theme.palette.success.light
          : type === 'rock'
            ? theme.palette.grey[500]
            : theme.palette.primary.light,
        zIndex: 0,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.7, scale: Math.random() * 0.3 + 0.8 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
      whileHover={{ scale: 1.2, opacity: 1 }}
      aria-hidden="true"
    >
      {type === 'tree' && <ParkIcon fontSize="large" />}
      {type === 'rock' && <TerrainIcon fontSize="large" />}
      {type === 'landmark' && <FlagIcon fontSize="large" />}
    </motion.div>
  );
};

interface PathNodeProps {
  node: IPathNode;
  isActive: boolean;
  isCompleted: boolean;
  onClick: (nodeId: string) => void;
}

// Memoized path node component
const PathNode = memo<PathNodeProps>(({ node, isActive, isCompleted, onClick }) => {
  const theme = useTheme();
  const { playSound } = useSound();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleClick = useCallback(() => {
    if (!isCompleted) {
      playSound('error');
      setFeedbackMessage('Complete previous lessons to unlock this one');
      setShowFeedback(true);
      return;
    }

    playSound('click');
    onClick(node.id);
  }, [node.id, onClick, playSound, isCompleted]);

  const nodeStyles = useMemo(() => ({
    position: 'absolute',
    left: `${node.position?.x || 0}px`,
    top: `${node.position?.y || 0}px`,
    width: node.type === PathNodeType.CHECKPOINT ? '100px' : '80px',
    height: node.type === PathNodeType.CHECKPOINT ? '100px' : '80px',
    borderRadius: node.type === PathNodeType.CHECKPOINT ? '12px' : '50%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isCompleted ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    zIndex: 2,
    boxShadow: isActive
      ? `0 0 20px ${theme.palette.primary.main}, 0 4px 12px rgba(0,0,0,0.3)`
      : '0 4px 8px rgba(0,0,0,0.2)',
    border: `3px solid ${
      isCompleted
        ? theme.palette.success.main
        : theme.palette.primary.main
    }`,
    background: `radial-gradient(
      circle at 30% 30%, 
      ${isCompleted ? theme.palette.success.light : theme.palette.primary.light}, 
      ${isCompleted ? theme.palette.success.main : theme.palette.primary.main}
    )`,
  }), [node.position, node.type, theme, isActive, isCompleted]);

  // Get icon based on node type with enhanced styling
  const getNodeIcon = () => {
    const iconStyle = {
      fontSize: node.type === PathNodeType.CHECKPOINT ? 40 : 32,
      filter: isCompleted 
        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' 
        : 'none',
    };

    switch (node.type) {
      case PathNodeType.LESSON:
        return <PlayArrowIcon sx={iconStyle} aria-hidden="true" />;
      case PathNodeType.CHECKPOINT:
        return <FlagIcon sx={iconStyle} aria-hidden="true" />;
      case PathNodeType.CHALLENGE:
        return <SchoolIcon sx={iconStyle} aria-hidden="true" />;
      default:
        return <PlayArrowIcon sx={iconStyle} aria-hidden="true" />;
    }
  };

  // Get node status text for screen readers
  const getNodeStatusText = () => {
    if (isCompleted) return 'Completed';
    return 'Locked';
  };

  // Get node type text for screen readers
  const getNodeTypeText = () => {
    switch (node.type) {
      case PathNodeType.LESSON:
        return 'Lesson';
      case PathNodeType.CHECKPOINT:
        return 'Checkpoint';
      case PathNodeType.CHALLENGE:
        return 'Challenge';
      default:
        return 'Node';
    }
  };

  return (
    <>
      <Tooltip
        title={
          <Box>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
            >
              {node.title || 'Untitled'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ mt: 0.5 }}
            >
              {node.description || 'No description'}
            </Typography>
            <Box 
              sx={{
                mt: 1,
                pt: 1,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: isCompleted
                    ? 'success.main'
                    : theme.palette.primary.main,
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ opacity: 0.8 }}
              >
                {isCompleted ? 'Completed' : 'Locked'}
              </Typography>
            </Box>
          </Box>
        }
        placement="right"
        TransitionComponent={Zoom}
        arrow
        enterDelay={300}
        leaveDelay={100}
      >
        <motion.div
          style={nodeStyles as any}
          onClick={handleClick}
          whileHover={isCompleted ? {
            scale: 1.1,
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            filter: 'brightness(1.1)',
          } : {}}
          whileTap={isCompleted ? {
            scale: 0.95,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 10,
            },
          } : {}}
          initial={{ 
            opacity: 0, 
            y: -20, 
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 20,
            },
          }}
          role="button"
          tabIndex={isCompleted ? 0 : -1}
          aria-label={`${getNodeTypeText()}: ${
            node.title || 'Untitled'
          }, ${getNodeStatusText()}`}
          aria-disabled={!isCompleted}
        >
          {/* Node content */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: theme.palette.success.main,
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />
              </motion.div>
            )}
          </AnimatePresence>
          {getNodeIcon()}
          {node.type === PathNodeType.CHECKPOINT && (
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textAlign: 'center',
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.title}
            </Typography>
          )}
        </motion.div>
      </Tooltip>

      {/* Feedback snackbar */}
      <Snackbar
        open={showFeedback}
        autoHideDuration={3000}
        onClose={() => setShowFeedback(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setShowFeedback(false)}
          sx={{
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </>
  );
});

PathNode.displayName = 'PathNode';

interface PathConnectionProps {
  start: Point;
  end: Point;
  isCompleted: boolean;
}

// Memoized path connection component
const PathConnection = memo<PathConnectionProps>(({ start, end, isCompleted }) => {
  const theme = useTheme();

  const connectionStyle: CSSProperties = useMemo(() => ({
    position: 'absolute' as const,
    stroke: theme.palette.primary.main,
    strokeWidth: 2,
    transition: 'all 0.3s ease-in-out',
  }), [theme.palette.primary.main]);

  const { path, length } = useMemo(() => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    return {
      path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
      length,
    };
  }, [start, end]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <path
        d={path}
        style={connectionStyle}
        strokeDasharray={length}
        strokeDashoffset={isCompleted ? 0 : length}
      />
    </svg>
  );
});

PathConnection.displayName = 'PathConnection';

interface PathViewProps {
  path: IPath;
  onSelectNode: (trackId: ApplicationType, nodeId: string, nodeType: PathNodeType) => void;
}

const PathView: FC<PathViewProps> = ({ path, onSelectNode }) => {
  const theme = useTheme();
  const userProgressContext = useUserProgressRedux();
  const containerRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const logger = useLogger('PathView');
  const { optimizedConnections, getVisibleConnections } = usePathConnectionOptimization(path.connections);
  const { optimizedNodes, getVisibleNodes } = usePathNodeOptimization(path.nodes);

  // Calculate node positions in a single centered column
  useEffect(() => {
    if (path && path.nodes) {
      const verticalSpacing = 200; // Increased vertical space between nodes
      const startY = 200; // Starting Y position (after title)

      // Sort nodes by their order property
      const sortedNodes = [...path.nodes].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return path.nodes.indexOf(a) - path.nodes.indexOf(b);
      });

      // Update node positions to be in a single centered column
      sortedNodes.forEach((node, index) => {
        node.position = {
          x: window.innerWidth / 2, // Center horizontally
          y: startY + (index * verticalSpacing),
        };
      });
    }
  }, [path]);

  // Validate path data on mount
  useEffect(() => {
    const error = validatePathData(path);
    setValidationError(error);
  }, [path]);

  // Validate path data structure
  const validatePathData = (pathData: IPath): string | null => {
    if (!pathData) {
      return 'Path data is missing';
    }

    if (!pathData.nodes || pathData.nodes.length === 0) {
      return 'Path has no nodes';
    }

    // Check for duplicate node IDs
    const nodeIds = new Set<string>();
    for (const node of pathData.nodes) {
      if (nodeIds.has(node.id)) {
        return `Duplicate node ID found: ${node.id}`;
      }
      nodeIds.add(node.id);
    }

    // Check for invalid connections
    for (const node of pathData.nodes) {
      if (node.connections) {
        for (const connectionId of node.connections) {
          const connectedNode = pathData.nodes.find((n) => n.id === connectionId);
          if (!connectedNode) {
            return `Node ${node.id} has invalid connection to non-existent node ${connectionId}`;
          }
        }
      }
    }

    return null;
  };

  // Handle scroll to center the path
  useEffect(() => {
    if (containerRef.current && !validationError) {
      // Center the container
      handleScroll();
    }
  }, [path, validationError]);

  // Update scroll behavior to focus on top
  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;

      // Calculate the center position
      const containerWidth = container.scrollWidth;
      const viewportWidth = container.clientWidth;

      // Scroll to horizontal center but stay at top
      container.scrollLeft = (containerWidth - viewportWidth) / 2;
      container.scrollTop = 0;
    }
  };

  // Check if a node is completed
  const isNodeCompleted = (nodeId: string): boolean => {
    return userProgressContext.isNodeCompleted(nodeId);
  };

  // Check if a node is unlocked
  const isNodeUnlocked = (nodeId: string): boolean => {
    const node = path.nodes.find((n) => n.id === nodeId);
    if (!node) return false;

    // If no unlock requirements, it's unlocked
    if (!node.unlockRequirements ||
        (!node.unlockRequirements.previousNodes &&
         !node.unlockRequirements.xpRequired &&
         !node.unlockRequirements.levelRequired)) {
      return true;
    }

    // Check previous nodes requirement
    if (node.unlockRequirements.previousNodes && node.unlockRequirements.previousNodes.length > 0) {
      const allPreviousCompleted = node.unlockRequirements.previousNodes.every(
        (prevNodeId) => isNodeCompleted(prevNodeId),
      );
      if (!allPreviousCompleted) return false;
    }

    // Check XP requirement
    if (node.unlockRequirements.xpRequired) {
      const userXp = userProgressContext.getXP();
      if (userXp < node.unlockRequirements.xpRequired) return false;
    }

    // Check level requirement
    if (node.unlockRequirements.levelRequired) {
      const userLevel = userProgressContext.getLevel();
      if (userLevel < node.unlockRequirements.levelRequired) return false;
    }

    return true;
  };

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    const node = path.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Check if node is unlocked
    if (!isNodeUnlocked(nodeId)) {
      logger.debug(`Node ${nodeId} is locked`, { nodeId, nodeType: node.type });
      return;
    }

    // Handle node click based on type
    switch (node.type) {
      case PathNodeType.LESSON:
        if (path.trackId) {
          onSelectNode(path.trackId, nodeId, PathNodeType.LESSON);
        }
        break;
      case PathNodeType.CHECKPOINT:
        if (path.trackId) {
          onSelectNode(path.trackId, nodeId, PathNodeType.CHECKPOINT);
        }
        break;
      case PathNodeType.CHALLENGE:
        if (path.trackId) {
          onSelectNode(path.trackId, nodeId, PathNodeType.CHALLENGE);
        }
        break;
      default:
        logger.error(`Unknown node type: ${node.type}`, null, { nodeId, nodeType: node.type });
    }
  };

  // Update trail connections for single column layout
  const renderTrailConnections = () => {
    return optimizedConnections.map((connection, index) => (
      <PathConnection
        key={`connection-${index}`}
        start={connection.start}
        end={connection.end}
        isCompleted={connection.isCompleted}
      />
    ));
  };

  // Update trail decorations for single column layout
  const renderTrailDecorations = () => {
    const decorations = [];
    const decorationCount = Math.min(path.nodes.length * 2, 30);
    const verticalSpacing = 200;
    const startY = 200;
    const centerX = window.innerWidth / 2;
    const sideOffset = 250; // Increased distance from center

    for (let i = 0; i < decorationCount; i++) {
      const nodeIndex = Math.floor(i / 2);
      const y = startY + (nodeIndex * verticalSpacing) + (Math.random() * 60 - 30);
      const side = i % 2 === 0 ? 'left' : 'right';
      const x = centerX + (side === 'left' ? -sideOffset : sideOffset) + (Math.random() * 40 - 20);

      const types = ['tree', 'rock', 'landmark'] as const;
      const type = types[Math.floor(Math.random() * types.length)];

      decorations.push({ id: `decoration-${i}`, x, y, type, side });
    }

    return decorations.map((decoration) => (
      <TrailDecoration
        key={decoration.id}
        x={decoration.x}
        y={decoration.y}
        type={decoration.type}
        side={decoration.side}
      />
    ));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    // TODO: Implement keyboard navigation
  };

  // If there's a validation error, show an error message
  if (validationError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading path: {validationError}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        component="div"
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Path title */}
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            zIndex: 10,
            backgroundColor: theme.palette.background.paper,
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            position: 'sticky',
            top: 20,
            maxWidth: '90%',
          }}
        >
          {path.title}
        </Typography>

        {/* Path description */}
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            maxWidth: '80%',
            zIndex: 10,
            mt: 2,
            mb: 4,
          }}
        >
          {path.description}
        </Typography>

        {/* Content container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: path.nodes.length * 200 + 400, // Ensure enough space for all nodes
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Trail connections */}
          {renderTrailConnections()}

          {/* Trail decorations */}
          {renderTrailDecorations()}

          {/* Path nodes */}
          {optimizedNodes.map((node, index) => {
            const isCompleted = isNodeCompleted(node.id);
            const isUnlocked = isNodeUnlocked(node.id);
            const isCurrent = false;

            const nodeComponent = curriculumService.findPathNodeById(node.id);
            if (!nodeComponent) return null;

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                style={{
                  position: 'absolute',
                  left: node.position.x - 40,
                  top: node.position.y - 40,
                  zIndex: 1,
                }}
              >
                <PathNode
                  node={node}
                  isActive={isCurrent}
                  isCompleted={isCompleted}
                  onClick={handleNodeClick}
                />
              </motion.div>
            );
          })}
        </Box>

        {/* Center button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 10,
          }}
          onClick={handleScroll}
        >
          Center
        </Button>
      </Box>
    </Box>
  );
};

export default PathView;
