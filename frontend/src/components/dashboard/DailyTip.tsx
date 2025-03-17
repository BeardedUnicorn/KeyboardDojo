import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  styled, 
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Lightbulb as LightbulbIcon,
  FormatQuote as QuoteIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';

// Define tip interface
export interface Tip {
  id: string;
  content: string;
  author?: string;
  source?: string;
  category: 'productivity' | 'keyboard' | 'editor' | 'coding' | 'motivation';
  isQuote: boolean;
}

// Define props interface
interface DailyTipProps {
  tips: Tip[];
  onShare?: (tip: Tip) => void;
  onSave?: (tip: Tip, isSaved: boolean) => void;
  onRefresh?: () => void;
  className?: string;
}

// Styled components
const TipContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  position: 'relative',
  overflow: 'hidden',
}));

const CategoryIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'category',
})<{ category: Tip['category'] }>(({ theme, category }) => {
  let color;
  
  switch (category) {
    case 'productivity':
      color = theme.palette.success.main;
      break;
    case 'keyboard':
      color = theme.palette.primary.main;
      break;
    case 'editor':
      color = theme.palette.info.main;
      break;
    case 'coding':
      color = theme.palette.secondary.main;
      break;
    case 'motivation':
      color = theme.palette.warning.main;
      break;
    default:
      color = theme.palette.primary.main;
  }
  
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    backgroundColor: color,
  };
});

const TipContent = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  marginBottom: theme.spacing(1),
  position: 'relative',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const QuoteIconStyled = styled(QuoteIcon)(({ theme }) => ({
  position: 'absolute',
  top: -5,
  left: 0,
  color: `${theme.palette.text.secondary}40`,
  transform: 'scaleX(-1)',
}));

const TipIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: `${theme.palette.primary.main}20`,
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
}));

const TipHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const TipFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

const TipActions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

// DailyTip component
const DailyTip: React.FC<DailyTipProps> = ({
  tips,
  onShare,
  onSave,
  onRefresh,
  className,
}) => {
  const theme = useTheme();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [savedTips, setSavedTips] = useState<string[]>([]);
  
  // Get current tip
  const currentTip = tips[currentTipIndex];
  
  // Check if current tip is saved
  const isSaved = savedTips.includes(currentTip.id);
  
  // Handle refresh
  const handleRefresh = () => {
    const nextIndex = (currentTipIndex + 1) % tips.length;
    setCurrentTipIndex(nextIndex);
    
    if (onRefresh) {
      onRefresh();
    }
  };
  
  // Handle save
  const handleSave = () => {
    const newSavedTips = isSaved
      ? savedTips.filter(id => id !== currentTip.id)
      : [...savedTips, currentTip.id];
    
    setSavedTips(newSavedTips);
    
    if (onSave) {
      onSave(currentTip, !isSaved);
    }
  };
  
  // Handle share
  const handleShare = () => {
    if (onShare) {
      onShare(currentTip);
    }
  };
  
  // Get category color
  const getCategoryColor = () => {
    switch (currentTip.category) {
      case 'productivity':
        return theme.palette.success.main;
      case 'keyboard':
        return theme.palette.primary.main;
      case 'editor':
        return theme.palette.info.main;
      case 'coding':
        return theme.palette.secondary.main;
      case 'motivation':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <TipContainer className={className}>
      <CategoryIndicator category={currentTip.category} />
      
      <TipHeader>
        <TipIcon>
          {currentTip.isQuote ? <QuoteIcon /> : <LightbulbIcon />}
        </TipIcon>
        
        <Typography variant="subtitle1" fontWeight="bold">
          Daily {currentTip.isQuote ? 'Quote' : 'Tip'}
        </Typography>
      </TipHeader>
      
      <TipContent variant="body1">
        {currentTip.isQuote && <QuoteIconStyled fontSize="large" />}
        {currentTip.content}
      </TipContent>
      
      {currentTip.author && (
        <Typography variant="body2" color="text.secondary" align="right">
          — {currentTip.author}
          {currentTip.source && `, ${currentTip.source}`}
        </Typography>
      )}
      
      <TipFooter>
        <Typography 
          variant="caption" 
          sx={{ 
            textTransform: 'uppercase', 
            fontWeight: 'bold',
            color: getCategoryColor(),
            letterSpacing: '0.5px',
          }}
        >
          {currentTip.category}
        </Typography>
        
        <TipActions>
          <Tooltip title={isSaved ? 'Unsave' : 'Save for later'}>
            <IconButton size="small" onClick={handleSave} color={isSaved ? 'primary' : 'default'}>
              {isSaved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton size="small" onClick={handleShare}>
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Show another tip">
            <IconButton size="small" onClick={handleRefresh}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TipActions>
      </TipFooter>
    </TipContainer>
  );
};

export default DailyTip; 