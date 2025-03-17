export { default as GradientText } from './GradientText';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Section } from './Section';
export { default as NinjaMascot } from './NinjaMascot';
export { default as MascotDialogue } from './MascotDialogue';
export { default as ProgressPath } from './ProgressPath';
export type { PathNode, NodeStatus, PathLayout } from './ProgressPath';
export { default as LessonCard } from './LessonCard';
export type { LessonCardProps } from './LessonCard';
export { default as CompletionIndicator } from './CompletionIndicator';
export type { IndicatorType, IndicatorSize } from './CompletionIndicator';
export { default as UnlockAnimation } from './UnlockAnimation';
export type { UnlockAnimationType } from './UnlockAnimation';
export { default as SimulatedEditor } from './SimulatedEditor';
export type { 
  EditorTheme, 
  EditorLanguage, 
  CursorPosition, 
  SelectionRange 
} from './SimulatedEditor';
export { default as KeyboardVisualization } from './KeyboardVisualization';
export type { 
  KeyType, 
  KeyData, 
  KeyboardLayout 
} from './KeyboardVisualization';
export { default as Feedback } from './Feedback';
export type { 
  FeedbackType, 
  FeedbackAnimation, 
  FeedbackPosition 
} from './Feedback';
export { default as StatsDisplay } from './StatsDisplay';
export type { 
  Achievement, 
  UserStats, 
  StatsDisplayMode 
} from './StatsDisplay';
export { default as AnswerAnimation } from './AnswerAnimation';
export type { 
  AnswerAnimationType, 
  AnswerResult 
} from './AnswerAnimation';
export { default as LevelCompletion } from './LevelCompletion';
export type { CelebrationType } from './LevelCompletion';
export { default as ScreenTransition } from './ScreenTransition';
export type { TransitionType } from './ScreenTransition';
export { default as UIFeedbackAnimation } from './FeedbackAnimation';
export type { FeedbackAnimationType as UIFeedbackAnimationType } from './FeedbackAnimation';
export { default as LoadingState } from './LoadingState';
export type { LoadingType, LoadingSize } from './LoadingState';
export { default as BackgroundPattern } from './BackgroundPattern';
export type { PatternType } from './BackgroundPattern';

export { default as ResponsiveContainer } from './ResponsiveContainer';
export type { ContainerSize } from './ResponsiveContainer';

export { default as AccessibilityProvider, useAccessibility } from './AccessibilityProvider';
export type { AccessibilityOptions } from './AccessibilityProvider';

export { default as AccessibilityMenu } from './AccessibilityMenu';

export { default as PerformanceMonitor } from './PerformanceMonitor';
export type { 
  PerformanceMetric, 
  PerformanceEntry, 
  PerformanceMonitorProps 
} from './PerformanceMonitor';

export { default as VisualRegressionTester } from './VisualRegressionTester';
export type { 
  ScreenshotData,
  VisualRegressionTesterProps 
} from './VisualRegressionTester';

export { default as ProjectSummary } from './ProjectSummary';
export type { ProjectSummaryProps } from './ProjectSummary'; 