/**
 * Type definitions for the VIM.io lesson system
 * These types define the structure of interactive Vim tutorials and exercises
 */

/**
 * Represents a single Vim lesson or tutorial exercise
 * Each lesson teaches specific Vim commands or concepts through interactive practice
 */
export interface Lesson {
  /**
   * Unique identifier for the lesson
   * Used for tracking progress and navigation
   */
  id: string
  
  /**
   * Display title for the lesson
   * Should be concise and descriptive (e.g., "Basic Navigation", "Delete Operations")
   */
  title: string
  
  /**
   * Brief description of what the lesson teaches
   * Explains the concepts and commands that will be covered
   */
  description: string
  
  /**
   * The task or challenge for the user to complete
   * Clear instructions on what the user needs to accomplish
   */
  task?: string
  
  /**
   * Initial editor content for the lesson
   * The starting text that users will practice on
   */
  initialContent?: string
  
  /**
   * Starting cursor position (0-indexed)
   * Specifies where the cursor should be placed when the lesson starts
   */
  initialCursorPosition?: { line: number; col: number }
  
  /**
   * Expected final content after task completion
   * Used to validate if the user completed the task correctly
   */
  expectedResult?: string
  
  /**
   * Progressive hints to help the user
   * Array of hints revealed one at a time if the user is stuck
   */
  hints?: string[]
  
  /**
   * Complete solution command sequence
   * The exact key sequence that solves the exercise
   */
  solution?: string
}

/**
 * Represents a category of related lessons
 * Groups lessons by topic or difficulty level
 */
export interface LessonCategory {
  /**
   * Category title (e.g., "Movement", "Editing", "Advanced")
   */
  title: string
  
  /**
   * Description of the category's focus
   * Explains what skills are taught in this category
   */
  description: string
  
  /**
   * Array of lessons in this category
   * Should be ordered by difficulty or logical progression
   */
  lessons: Lesson[]
}