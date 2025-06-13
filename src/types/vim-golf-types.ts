/**
 * Vim Golf Challenge System Types
 * Defines the structure for gamified VIM learning challenges
 */

import type { VimCommand } from '../utils/vim-command-parser';

/**
 * A single Vim Golf challenge
 */
export interface VimGolfChallenge {
  /** Unique identifier */
  id: string;
  
  /** Challenge title */
  title: string;
  
  /** Challenge description */
  description: string;
  
  /** Difficulty level */
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  /** Category */
  category: 'editing' | 'navigation' | 'text-objects' | 'registers' | 'macros' | 'advanced';
  
  /** Starting text content */
  startingText: string;
  
  /** Target text content */
  targetText: string;
  
  /** Starting cursor position (line, column) */
  startingCursor?: [number, number];
  
  /** Par score (optimal number of keystrokes) */
  parScore: number;
  
  /** Maximum allowed score for completion */
  maxScore: number;
  
  /** Hints for the challenge */
  hints: string[];
  
  /** Solution demonstration */
  solution: {
    /** Sequence of keys */
    keySequence: string[];
    /** Description of each step */
    steps: string[];
    /** Final score */
    score: number;
  };
  
  /** Tags for filtering */
  tags: string[];
  
  /** Validation rules */
  validation?: {
    /** Required commands to use */
    requiredCommands?: string[];
    /** Forbidden commands */
    forbiddenCommands?: string[];
    /** Custom validation function */
    customValidation?: (commands: VimCommand[], finalText: string) => boolean;
  };
}

/**
 * Challenge attempt result
 */
export interface ChallengeAttempt {
  /** Challenge ID */
  challengeId: string;
  
  /** User's keystroke sequence */
  keySequence: string[];
  
  /** VIM commands used */
  commands: VimCommand[];
  
  /** Final score (keystroke count) */
  score: number;
  
  /** Whether challenge was completed successfully */
  completed: boolean;
  
  /** Time taken to complete */
  timeMs: number;
  
  /** Efficiency rating */
  efficiency: 'excellent' | 'good' | 'par' | 'over-par' | 'failed';
  
  /** Timestamp */
  timestamp: number;
  
  /** Achievement earned (if any) */
  achievement?: string;
}

/**
 * User's golf progress
 */
export interface VimGolfProgress {
  /** Total challenges completed */
  challengesCompleted: number;
  
  /** Total score across all challenges */
  totalScore: number;
  
  /** Best scores for each challenge */
  bestScores: Record<string, number>;
  
  /** Challenge completion status */
  completedChallenges: Set<string>;
  
  /** Achievements earned */
  achievements: string[];
  
  /** Streak information */
  streak: {
    current: number;
    longest: number;
    lastAttempt: number;
  };
  
  /** Statistics */
  stats: {
    averageScore: number;
    totalAttempts: number;
    excellentCount: number;
    goodCount: number;
    parCount: number;
  };
}

/**
 * Achievement definitions
 */
export interface Achievement {
  /** Unique identifier */
  id: string;
  
  /** Achievement name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Icon or emoji */
  icon: string;
  
  /** Unlock condition */
  condition: (progress: VimGolfProgress, attempts: ChallengeAttempt[]) => boolean;
  
  /** Points awarded */
  points: number;
  
  /** Rarity level */
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/**
 * Challenge session state
 */
export interface ChallengeSession {
  /** Current challenge */
  challenge: VimGolfChallenge;
  
  /** Session start time */
  startTime: number;
  
  /** Current keystroke sequence */
  keySequence: string[];
  
  /** Current VIM commands */
  commands: VimCommand[];
  
  /** Current text state */
  currentText: string;
  
  /** Current cursor position */
  cursorPosition: [number, number];
  
  /** Whether session is active */
  isActive: boolean;
  
  /** Hints shown */
  hintsShown: number;
  
  /** Validation errors */
  validationErrors: string[];
}

/**
 * Golf mode configuration
 */
export interface VimGolfConfig {
  /** Enable golf mode */
  enabled: boolean;
  
  /** Show live score */
  showLiveScore: boolean;
  
  /** Show hints automatically */
  autoShowHints: boolean;
  
  /** Enable achievements */
  enableAchievements: boolean;
  
  /** Sound effects */
  soundEffects: boolean;
  
  /** Visual feedback */
  visualFeedback: boolean;
  
  /** Save attempts */
  saveAttempts: boolean;
}

/**
 * Default golf configuration
 */
export const DEFAULT_GOLF_CONFIG: VimGolfConfig = {
  enabled: false,
  showLiveScore: true,
  autoShowHints: false,
  enableAchievements: true,
  soundEffects: true,
  visualFeedback: true,
  saveAttempts: true
};

/**
 * Challenge filtering options
 */
export interface ChallengeFilter {
  /** Difficulty levels to include */
  difficulties: VimGolfChallenge['difficulty'][];
  
  /** Categories to include */
  categories: VimGolfChallenge['category'][];
  
  /** Tags to include */
  tags: string[];
  
  /** Only show uncompleted challenges */
  uncompletedOnly: boolean;
  
  /** Sort order */
  sortBy: 'difficulty' | 'category' | 'score' | 'recent';
}