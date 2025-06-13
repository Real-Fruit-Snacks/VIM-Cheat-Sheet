/**
 * Vim Golf Engine - Manages challenges, scoring, and progress tracking
 */

import type {
  VimGolfChallenge,
  ChallengeAttempt,
  VimGolfProgress,
  Achievement,
  ChallengeSession,
  VimGolfConfig,
  ChallengeFilter
} from '../types/vim-golf-types';
import { vimCommandParser } from './vim-command-parser';

/**
 * Built-in achievements
 */
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-challenge',
    name: 'First Steps',
    description: 'Complete your first Vim Golf challenge',
    icon: '🏌️',
    condition: (progress) => progress.challengesCompleted >= 1,
    points: 10,
    rarity: 'common'
  },
  {
    id: 'perfect-score',
    name: 'Eagle',
    description: 'Achieve a perfect par score',
    icon: '🦅',
    condition: (_, attempts) => attempts.some(a => a.efficiency === 'excellent'),
    points: 50,
    rarity: 'rare'
  },
  {
    id: 'streak-5',
    name: 'Hot Streak',
    description: 'Complete 5 challenges in a row',
    icon: '🔥',
    condition: (progress) => progress.streak.current >= 5,
    points: 25,
    rarity: 'rare'
  },
  {
    id: 'efficiency-master',
    name: 'Efficiency Master',
    description: 'Achieve excellent efficiency on 10 challenges',
    icon: '⚡',
    condition: (progress) => progress.stats.excellentCount >= 10,
    points: 100,
    rarity: 'epic'
  },
  {
    id: 'text-object-ninja',
    name: 'Text Object Ninja',
    description: 'Complete all text-object challenges with excellent scores',
    icon: '🥷',
    condition: (_, attempts) => {
      const textObjectChallenges = attempts.filter(a => 
        a.challengeId.includes('text-object') && a.efficiency === 'excellent'
      );
      return textObjectChallenges.length >= 5;
    },
    points: 75,
    rarity: 'epic'
  },
  {
    id: 'vim-master',
    name: 'Vim Master',
    description: 'Complete all challenges with at least par scores',
    icon: '👑',
    condition: (progress, attempts) => {
      return progress.challengesCompleted >= 20 && 
             attempts.every(a => a.efficiency !== 'failed' && a.efficiency !== 'over-par');
    },
    points: 200,
    rarity: 'legendary'
  }
];

/**
 * Built-in challenges
 */
const CHALLENGES: VimGolfChallenge[] = [
  {
    id: 'basic-word-edit',
    title: 'Change a Word',
    description: 'Change "hello" to "world" efficiently',
    difficulty: 'beginner',
    category: 'editing',
    startingText: 'Say hello to everyone',
    targetText: 'Say world to everyone',
    startingCursor: [0, 4],
    parScore: 3,
    maxScore: 10,
    hints: [
      'Use "cw" to change word',
      'Position cursor on the first letter of "hello"',
      'Type the replacement text and press Escape'
    ],
    solution: {
      keySequence: ['c', 'w', 'w', 'o', 'r', 'l', 'd', 'Esc'],
      steps: [
        'Position cursor on "h" in "hello"',
        'Press "cw" to change word',
        'Type "world"',
        'Press Escape to return to normal mode'
      ],
      score: 3
    },
    tags: ['word-editing', 'basic', 'change-operator'],
    validation: {
      requiredCommands: ['cw']
    }
  },
  {
    id: 'line-deletion',
    title: 'Delete Line',
    description: 'Delete the second line',
    difficulty: 'beginner',
    category: 'editing',
    startingText: 'Line 1\nLine 2\nLine 3',
    targetText: 'Line 1\nLine 3',
    startingCursor: [0, 0],
    parScore: 2,
    maxScore: 8,
    hints: [
      'Navigate to line 2',
      'Use "dd" to delete entire line'
    ],
    solution: {
      keySequence: ['j', 'd', 'd'],
      steps: [
        'Press "j" to move to line 2',
        'Press "dd" to delete the line'
      ],
      score: 2
    },
    tags: ['line-editing', 'basic', 'delete-operator']
  },
  {
    id: 'word-inner-object',
    title: 'Change Inner Word',
    description: 'Change just the word "quick" to "slow" without affecting punctuation',
    difficulty: 'intermediate',
    category: 'text-objects',
    startingText: 'The "quick" brown fox',
    targetText: 'The "slow" brown fox',
    startingCursor: [0, 5],
    parScore: 4,
    maxScore: 12,
    hints: [
      'Use text objects for precise editing',
      'Position cursor anywhere in "quick"',
      'Use "ciw" to change inner word'
    ],
    solution: {
      keySequence: ['c', 'i', 'w', 's', 'l', 'o', 'w', 'Esc'],
      steps: [
        'Position cursor anywhere in "quick"',
        'Press "ciw" to change inner word',
        'Type "slow"',
        'Press Escape'
      ],
      score: 4
    },
    tags: ['text-objects', 'inner-word', 'precision'],
    validation: {
      requiredCommands: ['ciw']
    }
  },
  {
    id: 'multiple-line-edit',
    title: 'Multiple Line Navigation',
    description: 'Change "old" to "new" on the last line',
    difficulty: 'intermediate',
    category: 'navigation',
    startingText: 'First line\nSecond line\nThird line with old text\nFourth line\nFifth line with old word',
    targetText: 'First line\nSecond line\nThird line with old text\nFourth line\nFifth line with new word',
    startingCursor: [0, 0],
    parScore: 5,
    maxScore: 15,
    hints: [
      'Navigate to the last line efficiently',
      'Use "G" to go to end of file',
      'Find and change the word'
    ],
    solution: {
      keySequence: ['G', '$', 'b', 'c', 'w', 'n', 'e', 'w', 'Esc'],
      steps: [
        'Press "G" to go to last line',
        'Press "$" to go to end of line',
        'Press "b" to go back to start of "old"',
        'Press "cw" to change word',
        'Type "new"',
        'Press Escape'
      ],
      score: 5
    },
    tags: ['navigation', 'end-of-file', 'word-editing']
  },
  {
    id: 'advanced-text-manipulation',
    title: 'Advanced Text Manipulation',
    description: 'Surround the word "VIM" with square brackets',
    difficulty: 'advanced',
    category: 'advanced',
    startingText: 'I love using VIM for editing',
    targetText: 'I love using [VIM] for editing',
    startingCursor: [0, 0],
    parScore: 7,
    maxScore: 20,
    hints: [
      'Navigate to the word VIM',
      'Use visual mode or text objects',
      'Consider using "ciw" and typing the brackets'
    ],
    solution: {
      keySequence: ['/', 'V', 'I', 'M', 'Enter', 'c', 'i', 'w', '[', 'V', 'I', 'M', ']', 'Esc'],
      steps: [
        'Search for "VIM" with "/VIM"',
        'Press Enter to go to match',
        'Press "ciw" to change inner word',
        'Type "[VIM]"',
        'Press Escape'
      ],
      score: 7
    },
    tags: ['search', 'text-objects', 'advanced-editing']
  }
];

export class VimGolfEngine {
  private progress: VimGolfProgress;
  private attempts: ChallengeAttempt[] = [];
  private currentSession: ChallengeSession | null = null;
  private config: VimGolfConfig;

  constructor(config: VimGolfConfig) {
    this.config = config;
    this.progress = this.loadProgress();
    this.attempts = this.loadAttempts();
  }

  /**
   * Get all available challenges
   */
  getChallenges(filter?: ChallengeFilter): VimGolfChallenge[] {
    let filtered = [...CHALLENGES];

    if (filter) {
      if (filter.difficulties.length > 0) {
        filtered = filtered.filter(c => filter.difficulties.includes(c.difficulty));
      }
      
      if (filter.categories.length > 0) {
        filtered = filtered.filter(c => filter.categories.includes(c.category));
      }
      
      if (filter.tags.length > 0) {
        filtered = filtered.filter(c => 
          filter.tags.some(tag => c.tags.includes(tag))
        );
      }
      
      if (filter.uncompletedOnly) {
        filtered = filtered.filter(c => !this.progress.completedChallenges.has(c.id));
      }

      // Sort
      switch (filter.sortBy) {
        case 'difficulty':
          const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
          filtered.sort((a, b) => 
            difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty)
          );
          break;
        case 'category':
          filtered.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case 'score':
          filtered.sort((a, b) => a.parScore - b.parScore);
          break;
      }
    }

    return filtered;
  }

  /**
   * Get challenge by ID
   */
  getChallenge(id: string): VimGolfChallenge | null {
    return CHALLENGES.find(c => c.id === id) || null;
  }

  /**
   * Start a new challenge session
   */
  startChallenge(challengeId: string): ChallengeSession {
    const challenge = this.getChallenge(challengeId);
    if (!challenge) {
      throw new Error(`Challenge ${challengeId} not found`);
    }

    this.currentSession = {
      challenge,
      startTime: Date.now(),
      keySequence: [],
      commands: [],
      currentText: challenge.startingText,
      cursorPosition: challenge.startingCursor || [0, 0],
      isActive: true,
      hintsShown: 0,
      validationErrors: []
    };

    // Reset the command parser
    vimCommandParser.reset();

    return this.currentSession;
  }

  /**
   * Add keystroke to current session
   */
  addKeystroke(key: string, modifiers: string[] = []): void {
    if (!this.currentSession || !this.currentSession.isActive) {
      return;
    }

    this.currentSession.keySequence.push(key);
    
    // Parse VIM command
    const command = vimCommandParser.addKeystroke(key, modifiers);
    if (command) {
      this.currentSession.commands.push(command);
    }
  }

  /**
   * Update current text state (called by VIM editor)
   */
  updateTextState(text: string, cursorPosition: [number, number]): void {
    if (!this.currentSession || !this.currentSession.isActive) {
      return;
    }

    this.currentSession.currentText = text;
    this.currentSession.cursorPosition = cursorPosition;
  }

  /**
   * Complete current challenge session
   */
  completeChallenge(): ChallengeAttempt | null {
    if (!this.currentSession || !this.currentSession.isActive) {
      return null;
    }

    const session = this.currentSession;
    const timeMs = Date.now() - session.startTime;
    const score = session.keySequence.length;
    const completed = this.validateCompletion(session);

    let efficiency: ChallengeAttempt['efficiency'];
    if (!completed) {
      efficiency = 'failed';
    } else if (score <= session.challenge.parScore) {
      efficiency = 'excellent';
    } else if (score <= session.challenge.parScore * 1.2) {
      efficiency = 'good';
    } else if (score <= session.challenge.parScore * 1.5) {
      efficiency = 'par';
    } else {
      efficiency = 'over-par';
    }

    const attempt: ChallengeAttempt = {
      challengeId: session.challenge.id,
      keySequence: session.keySequence,
      commands: session.commands,
      score,
      completed,
      timeMs,
      efficiency,
      timestamp: Date.now()
    };

    // Update progress if completed
    if (completed) {
      this.updateProgress(attempt);
    }

    // Save attempt
    this.attempts.push(attempt);
    if (this.config.saveAttempts) {
      this.saveAttempts();
    }

    // End session
    this.currentSession.isActive = false;
    this.currentSession = null;

    return attempt;
  }

  /**
   * Validate challenge completion
   */
  private validateCompletion(session: ChallengeSession): boolean {
    const { challenge, currentText, commands } = session;

    // Check if target text matches
    const textMatches = currentText.trim() === challenge.targetText.trim();
    if (!textMatches) {
      session.validationErrors.push('Target text does not match');
      return false;
    }

    // Check validation rules
    if (challenge.validation) {
      const { requiredCommands, forbiddenCommands, customValidation } = challenge.validation;

      // Check required commands
      if (requiredCommands) {
        const usedSequences = commands.map(c => c.sequence);
        const hasRequired = requiredCommands.every(req => 
          usedSequences.some(seq => seq.includes(req))
        );
        if (!hasRequired) {
          session.validationErrors.push(`Must use: ${requiredCommands.join(', ')}`);
          return false;
        }
      }

      // Check forbidden commands
      if (forbiddenCommands) {
        const usedSequences = commands.map(c => c.sequence);
        const hasForbidden = forbiddenCommands.some(forbidden => 
          usedSequences.some(seq => seq.includes(forbidden))
        );
        if (hasForbidden) {
          session.validationErrors.push('Used forbidden commands');
          return false;
        }
      }

      // Custom validation
      if (customValidation && !customValidation(commands, currentText)) {
        session.validationErrors.push('Custom validation failed');
        return false;
      }
    }

    return true;
  }

  /**
   * Update user progress
   */
  private updateProgress(attempt: ChallengeAttempt): void {
    const challengeId = attempt.challengeId;
    const wasCompleted = this.progress.completedChallenges.has(challengeId);

    if (!wasCompleted) {
      this.progress.challengesCompleted++;
      this.progress.completedChallenges.add(challengeId);
    }

    // Update best score
    const currentBest = this.progress.bestScores[challengeId];
    if (!currentBest || attempt.score < currentBest) {
      this.progress.bestScores[challengeId] = attempt.score;
    }

    // Update statistics
    this.progress.stats.totalAttempts++;
    this.progress.totalScore += attempt.score;
    this.progress.stats.averageScore = this.progress.totalScore / this.progress.stats.totalAttempts;

    switch (attempt.efficiency) {
      case 'excellent':
        this.progress.stats.excellentCount++;
        break;
      case 'good':
        this.progress.stats.goodCount++;
        break;
      case 'par':
        this.progress.stats.parCount++;
        break;
    }

    // Update streak
    if (attempt.completed) {
      this.progress.streak.current++;
      this.progress.streak.longest = Math.max(
        this.progress.streak.longest, 
        this.progress.streak.current
      );
    } else {
      this.progress.streak.current = 0;
    }
    this.progress.streak.lastAttempt = Date.now();

    // Check for new achievements
    this.checkAchievements();

    // Save progress
    this.saveProgress();
  }

  /**
   * Check and award achievements
   */
  private checkAchievements(): void {
    for (const achievement of ACHIEVEMENTS) {
      if (this.progress.achievements.includes(achievement.id)) {
        continue; // Already earned
      }

      if (achievement.condition(this.progress, this.attempts)) {
        this.progress.achievements.push(achievement.id);
        // Achievement notification would be handled by UI
      }
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): ChallengeSession | null {
    return this.currentSession;
  }

  /**
   * Get user progress
   */
  getProgress(): VimGolfProgress {
    return { ...this.progress };
  }

  /**
   * Get all achievements
   */
  getAchievements(): Achievement[] {
    return ACHIEVEMENTS;
  }

  /**
   * Get earned achievements
   */
  getEarnedAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter(a => this.progress.achievements.includes(a.id));
  }

  /**
   * Load progress from localStorage
   */
  private loadProgress(): VimGolfProgress {
    const saved = localStorage.getItem('vim-golf-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          completedChallenges: new Set(parsed.completedChallenges || [])
        };
      } catch (e) {
        console.error('Failed to load golf progress:', e);
      }
    }

    return {
      challengesCompleted: 0,
      totalScore: 0,
      bestScores: {},
      completedChallenges: new Set(),
      achievements: [],
      streak: { current: 0, longest: 0, lastAttempt: 0 },
      stats: {
        averageScore: 0,
        totalAttempts: 0,
        excellentCount: 0,
        goodCount: 0,
        parCount: 0
      }
    };
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    const toSave = {
      ...this.progress,
      completedChallenges: Array.from(this.progress.completedChallenges)
    };
    localStorage.setItem('vim-golf-progress', JSON.stringify(toSave));
  }

  /**
   * Load attempts from localStorage
   */
  private loadAttempts(): ChallengeAttempt[] {
    const saved = localStorage.getItem('vim-golf-attempts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load golf attempts:', e);
      }
    }
    return [];
  }

  /**
   * Save attempts to localStorage
   */
  private saveAttempts(): void {
    // Keep only last 100 attempts to avoid storage bloat
    const toSave = this.attempts.slice(-100);
    localStorage.setItem('vim-golf-attempts', JSON.stringify(toSave));
  }

  /**
   * Reset all progress (for testing)
   */
  resetProgress(): void {
    this.progress = {
      challengesCompleted: 0,
      totalScore: 0,
      bestScores: {},
      completedChallenges: new Set(),
      achievements: [],
      streak: { current: 0, longest: 0, lastAttempt: 0 },
      stats: {
        averageScore: 0,
        totalAttempts: 0,
        excellentCount: 0,
        goodCount: 0,
        parCount: 0
      }
    };
    this.attempts = [];
    this.saveProgress();
    this.saveAttempts();
  }
}

// Export singleton instance
export const vimGolfEngine = new VimGolfEngine({
  enabled: false,
  showLiveScore: true,
  autoShowHints: false,
  enableAchievements: true,
  soundEffects: true,
  visualFeedback: true,
  saveAttempts: true
});