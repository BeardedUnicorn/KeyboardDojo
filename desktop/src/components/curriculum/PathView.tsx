import {
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  PlayArrow as PlayArrowIcon,
  Flag as FlagIcon,
  School as SchoolIcon,
  Terrain as TerrainIcon,
  Park as ParkIcon,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Button,
  Tooltip,
  Zoom,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef, type FC, type KeyboardEvent as ReactKeyboardEvent } from 'react';

import { curriculumService, useLogger } from '@/services';
import { useAppSelector } from '@/store';
import { PathNodeType } from '@/types/progress/ICurriculum';

import { selectUserProgress, selectXp, selectLevel } from '../../store/slices/userProgressSlice';

import type { ApplicationType, IPath, PathNode } from '@/types/progress/ICurriculum';

// Trail segment component to connect nodes
const TrailConnection: FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isCompleted: boolean;
  isCurved?: boolean;
}> = ({ startX, startY, endX, endY, isCompleted, isCurved = false }) => {
  const theme = useTheme();

  // Calculate control points for curved path
  const midY = startY + (endY - startY) / 2;
  const controlX1 = startX;
  const controlY1 = midY;
  const controlX2 = endX;
  const controlY2 = midY;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {isCurved ? (
        <path
          d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
          stroke={isCompleted ? theme.palette.success.main : theme.palette.grey[400]}
          strokeWidth={5}
          fill="none"
          strokeDasharray={isCompleted ? 'none' : '5,5'}
          strokeLinecap="round"
        />
      ) : (
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={isCompleted ? theme.palette.success.main : theme.palette.grey[400]}
          strokeWidth={5}
          strokeDasharray={isCompleted ? 'none' : '5,5'}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

// Trail decoration component (trees, rocks, etc.)
const UnusedTrailDecoration: FC<{
  x: number;
  y: number;
  type: 'tree' | 'rock' | 'landmark';
  side: 'left' | 'right';
}> = ({ x, y, type, side }) => {
  const theme = useTheme();
  const offsetX = side === 'left' ? -60 : 60;

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${x + offsetX}px`,
        top: `${y}px`,
        color: type === 'tree'
          ? theme.palette.success.light
          : type === 'rock'
            ? theme.palette.grey[500]
            : theme.palette.primary.light,
        opacity: 0.7,
        transform: `scale(${Math.random() * 0.5 + 0.8})`,
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {type === 'tree' && <ParkIcon fontSize="large" />}
      {type === 'rock' && <TerrainIcon fontSize="large" />}
      {type === 'landmark' && <FlagIcon fontSize="large" />}
    </Box>
  );
};

// Node component
const UnusedPathNodeComponent: FC<{
  node: PathNode;
  onClick: (nodeId: string) => void;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  index: number;
}> = ({ node, onClick, isCompleted, isUnlocked, isCurrent, index }) => {
  const theme = useTheme();

  // Determine node style based on type and status
  const getNodeStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: `${node.position?.x || 0}px`,
      top: `${node.position?.y || 0}px`,
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isUnlocked ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      zIndex: 2,
      boxShadow: isCurrent
        ? `0 0 15px ${theme.palette.primary.main}, 0 4px 8px rgba(0,0,0,0.3)`
        : '0 4px 8px rgba(0,0,0,0.2)',
    };

    if (isCompleted) {
      return {
        ...baseStyle,
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
      };
    } else if (isUnlocked) {
      return {
        ...baseStyle,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.text.secondary,
        opacity: 0.7,
      };
    }
  };

  // Get icon based on node type
  const getNodeIcon = () => {
    switch (node.type) {
      case PathNodeType.LESSON:
        return <PlayArrowIcon fontSize="large" aria-hidden="true" />;
      case PathNodeType.CHECKPOINT:
        return <FlagIcon fontSize="large" aria-hidden="true" />;
      case PathNodeType.CHALLENGE:
        return <SchoolIcon fontSize="large" aria-hidden="true" />;
      default:
        return <PlayArrowIcon fontSize="large" aria-hidden="true" />;
    }
  };

  // Get node status text for screen readers
  const getNodeStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isUnlocked) return 'Unlocked';
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
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle1">{node.title || 'Untitled'}</Typography>
          <Typography variant="body2">{node.description || 'No description'}</Typography>
          <Typography variant="caption">
            {isCompleted ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked'}
          </Typography>
        </Box>
      }
      placement="right"
      TransitionComponent={Zoom}
      arrow
      enterDelay={300}
      leaveDelay={100}
    >
      <motion.div
        style={getNodeStyle() as React.CSSProperties}
        onClick={() => isUnlocked && onClick(node.id)}
        whileHover={isUnlocked ? { scale: 1.1, boxShadow: '0 0 10px rgba(0,0,0,0.3)' } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        role="button"
        tabIndex={isUnlocked ? 0 : -1}
        aria-label={`${getNodeTypeText()}: ${node.title || 'Untitled'}, ${getNodeStatusText()}`}
        aria-disabled={!isUnlocked}
        onKeyDown={(e) => {
          if (isUnlocked && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(node.id);
          }
        }}
      >
        {isCompleted ? (
          <CheckCircleIcon fontSize="large" aria-hidden="true" />
        ) : isUnlocked ? (
          getNodeIcon()
        ) : (
          <LockIcon fontSize="large" aria-hidden="true" />
        )}
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            fontWeight: 'bold',
            fontSize: '10px',
            textAlign: 'center',
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.title || 'Untitled'}
        </Typography>
      </motion.div>
    </Tooltip>
  );
};

interface PathViewProps {
  path: IPath;
  onSelectNode: (trackId: ApplicationType, nodeId: string, nodeType: PathNodeType) => void;
}

const PathView: FC<PathViewProps> = ({ path, onSelectNode }) => {
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef<HTMLDivElement>(null);
  const logger = useLogger('PathView');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Get user progress data
  const userProgress = useAppSelector(selectUserProgress);
  const { completedLessons, completedModules } = userProgress;
  const userXp = useAppSelector(selectXp);
  const userLevel = useAppSelector(selectLevel);

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

  // Handle scroll to center the path
  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;

      // Calculate the center position
      const containerWidth = container.scrollWidth;
      const containerHeight = container.scrollHeight;
      const viewportWidth = container.clientWidth;
      const viewportHeight = container.clientHeight;

      // Scroll to center
      container.scrollLeft = (containerWidth - viewportWidth) / 2;
      container.scrollTop = (containerHeight - viewportHeight) / 4; // Scroll to 1/4 from the top
    }
  };

  // Check if a node is completed
  const isNodeCompleted = (nodeId: string): boolean => {
    return (
      completedLessons.some((lesson) => lesson.lessonId === nodeId) ||
      completedModules.some((module) => module.moduleId === nodeId)
    );
  };

  // Check if a node is unlocked
  const isNodeUnlocked = (node: PathNode): boolean => {
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
      if (userXp < node.unlockRequirements.xpRequired) return false;
    }

    // Check level requirement
    if (node.unlockRequirements.levelRequired) {
      if (userLevel < node.unlockRequirements.levelRequired) return false;
    }

    return true;
  };

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    const node = path.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Check if node is unlocked
    if (!isNodeUnlocked(node)) {
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

  // Render trail connections between nodes
  const renderTrailConnections = () => {
    return path.nodes.map((node) => {
      if (!node.connections || node.connections.length === 0) return null;

      return node.connections.map((connectionId) => {
        const connectedNode = path.nodes.find((n) => n.id === connectionId);
        if (!connectedNode) return null;

        const startX = node.position.x;
        const startY = node.position.y;
        const endX = connectedNode.position.x;
        const endY = connectedNode.position.y;
        const isCompleted = isNodeCompleted(node.id) && isNodeCompleted(connectionId);
        const isCurved = Math.abs(startY - endY) < 50 && Math.abs(startX - endX) > 100;

        return (
          <TrailConnection
            key={`${node.id}-${connectionId}`}
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
            isCompleted={isCompleted}
            isCurved={isCurved}
          />
        );
      });
    });
  };

  // Render trail decorations (trees, rocks, etc.)
  const renderTrailDecorations = () => {
    // Get all node positions to avoid placing decorations on nodes
    const nodePositions = path.nodes.map((node) => ({
      x: node.position.x,
      y: node.position.y,
    }));

    // Generate random decorations
    const decorations = [];
    const decorationCount = Math.min(path.nodes.length * 2, 30); // Limit the number of decorations

    for (let i = 0; i < decorationCount; i++) {
      // Generate random position
      const x = Math.floor(Math.random() * 1200) + 100;
      const y = Math.floor(Math.random() * 800) + 100;

      // Check if position is too close to any node
      const isTooClose = nodePositions.some(
        (pos) => Math.abs(pos.x - x) < 80 && Math.abs(pos.y - y) < 80,
      );

      if (!isTooClose) {
        // Generate random decoration type
        const types = ['tree', 'rock', 'landmark'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        const side = Math.random() > 0.5 ? 'left' : 'right';

        decorations.push({ id: `decoration-${i}`, x, y, type, side });
      }
    }

    return decorations.map((decoration) => (
      <Box
        key={decoration.id}
        sx={{
          position: 'absolute',
          left: decoration.x + (decoration.side === 'left' ? -40 : 40),
          top: decoration.y - 20,
          color: theme.palette.text.secondary,
          opacity: 0.7,
          transform: 'scale(0.8)',
          pointerEvents: 'none',
        }}
      >
        {decoration.type === 'tree' && <ParkIcon fontSize="large" />}
        {decoration.type === 'rock' && <TerrainIcon fontSize="large" />}
        {decoration.type === 'landmark' && <FlagIcon fontSize="large" />}
      </Box>
    ));
  };

  // Handle keyboard navigation
  const handleKeyDown = (_e: ReactKeyboardEvent<HTMLDivElement>) => {
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
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          padding: 4,
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Path title */}
        <Typography
          variant="h4"
          sx={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 10,
            backgroundColor: theme.palette.background.paper,
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {path.title}
        </Typography>

        {/* Path description */}
        <Typography
          variant="body1"
          sx={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            maxWidth: '80%',
            zIndex: 10,
          }}
        >
          {path.description}
        </Typography>

        {/* Trail connections */}
        {renderTrailConnections()}

        {/* Trail decorations */}
        {renderTrailDecorations()}

        {/* Path nodes */}
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          {path.nodes.map((node, index) => {
            const isCompleted = isNodeCompleted(node.id);
            const isUnlocked = isNodeUnlocked(node);
            const isCurrent = false; // TODO: Implement current node tracking

            // Find the node component
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
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="subtitle1">{node.title}</Typography>
                      <Typography variant="body2">{node.description}</Typography>
                      {!isUnlocked && (
                        <Typography variant="caption" color="error">
                          Locked - Complete previous nodes first
                        </Typography>
                      )}
                    </Box>
                  }
                  arrow
                  placement="top"
                  TransitionComponent={Zoom}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isUnlocked ? 'pointer' : 'default',
                      backgroundColor: isCompleted
                        ? theme.palette.success.main
                        : isUnlocked
                        ? theme.palette.primary.main
                        : theme.palette.grey[300],
                      color: isCompleted || isUnlocked ? 'white' : theme.palette.text.disabled,
                      border: isCurrent ? `4px solid ${theme.palette.secondary.main}` : 'none',
                      opacity: isUnlocked ? 1 : 0.7,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: isUnlocked ? 'scale(1.1)' : 'none',
                        boxShadow: isUnlocked ? 4 : 1,
                      },
                    }}
                    onClick={() => isUnlocked && handleNodeClick(node.id)}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon fontSize="large" />
                    ) : isUnlocked ? (
                      node.type === PathNodeType.LESSON ? (
                        <SchoolIcon fontSize="large" />
                      ) : node.type === PathNodeType.CHECKPOINT ? (
                        <FlagIcon fontSize="large" />
                      ) : (
                        <PlayArrowIcon fontSize="large" />
                      )
                    ) : (
                      <LockIcon fontSize="large" />
                    )}
                  </Paper>
                </Tooltip>
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: 85,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    width: 120,
                    fontWeight: 'bold',
                    color: isUnlocked ? theme.palette.text.primary : theme.palette.text.disabled,
                  }}
                >
                  {node.title}
                </Typography>
              </motion.div>
            );
          })}
        </Box>

        {/* Center button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
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
