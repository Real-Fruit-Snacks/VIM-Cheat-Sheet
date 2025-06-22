/**
 * Enhanced search functionality with fuzzy matching and intelligent suggestions
 */

import Fuse from 'fuse.js'
import type { ExpandedCommand } from './dataCompression'

type CommandWithCategory = ExpandedCommand & { category: string }
type FuseResult<T = CommandWithCategory> = { item: T; refIndex: number; score?: number }

// Command synonyms for better search
export const COMMAND_SYNONYMS: Record<string, string[]> = {
  'delete': ['remove', 'cut', 'erase'],
  'copy': ['yank', 'duplicate'],
  'paste': ['put', 'insert'],
  'search': ['find', 'locate', '/', '?'],
  'replace': ['substitute', 'change'],
  'undo': ['revert', 'back'],
  'redo': ['forward', 'repeat'],
  'save': ['write', ':w'],
  'quit': ['exit', 'close', ':q'],
  'move': ['navigate', 'go', 'jump'],
  'select': ['highlight', 'visual'],
  'indent': ['tab', 'shift'],
  'comment': ['annotate', 'note'],
  'fold': ['collapse', 'hide'],
  'split': ['divide', 'pane'],
  'buffer': ['file', 'document'],
  'window': ['pane', 'split'],
  'tab': ['indent', 'page']
}

// Common mistakes and their corrections
export const COMMON_MISTAKES: Record<string, string> = {
  'quit': ':q',
  'save': ':w',
  'save and quit': ':wq',
  'force quit': ':q!',
  'delete line': 'dd',
  'copy line': 'yy',
  'paste line': 'p',
  'find': '/',
  'replace': ':%s/',
  'goto line': 'G',
  'goto start': 'gg',
  'goto end': 'G',
  'select all': 'ggVG',
  'new line': 'o',
  'new line above': 'O'
}

// Related commands mapping
export const RELATED_COMMANDS: Record<string, string[]> = {
  'dd': ['d$', 'dw', 'diw', 'dap', 'D'],
  'yy': ['y$', 'yw', 'yiw', 'yap', 'Y'],
  'p': ['P', 'gp', 'gP'],
  'i': ['a', 'I', 'A', 'o', 'O'],
  'v': ['V', 'Ctrl-v', 'gv'],
  '/': ['?', 'n', 'N', '*', '#'],
  'u': ['Ctrl-r', 'U'],
  'w': ['W', 'b', 'B', 'e', 'E'],
  'h': ['j', 'k', 'l', '0', '$'],
  ':w': [':wq', ':x', ':w!'],
  ':q': [':q!', ':qa', ':wq'],
  'gg': ['G', 'Ctrl-d', 'Ctrl-u'],
  'f': ['F', 't', 'T', ';', ','],
  'c': ['cc', 'C', 'ciw', 'caw'],
  'd': ['dd', 'D', 'diw', 'daw'],
  'r': ['R', 's', 'S'],
  '.': ['q', '@', '@@'],
  '>': ['<', '>>', '<<', '='],
  'zz': ['zt', 'zb', 'z.'],
  '%': ['[{', ']}', '[(', '])']
}

// Command workflows
export const COMMAND_WORKFLOWS = [
  {
    name: 'Refactor a function',
    commands: ['vap', 'd', 'o', 'p', '=='],
    description: 'Select function, delete, create new line, paste, fix indentation'
  },
  {
    name: 'Comment multiple lines',
    commands: ['V', 'j', 'j', ':s/^/# /'],
    description: 'Visual line mode, select lines, add comment prefix'
  },
  {
    name: 'Find and replace all',
    commands: [':%s/old/new/g'],
    description: 'Replace all occurrences in file'
  },
  {
    name: 'Delete until character',
    commands: ['dt', '<char>'],
    description: 'Delete everything until specified character'
  },
  {
    name: 'Copy word and paste',
    commands: ['yiw', 'p'],
    description: 'Yank inner word and paste'
  },
  {
    name: 'Jump to matching bracket',
    commands: ['%'],
    description: 'Jump between matching brackets/parentheses'
  },
  {
    name: 'Indent block',
    commands: ['V', 'j', 'j', '>'],
    description: 'Select lines and indent'
  },
  {
    name: 'Search and replace in selection',
    commands: ['v', 'motion', ':s/old/new/g'],
    description: 'Replace only in selected text'
  }
]

export interface SearchOptions {
  threshold?: number
  includeScore?: boolean
  keys?: string[]
  includeMatches?: boolean
  minMatchCharLength?: number
}

export class EnhancedSearch {
  private fuse: Fuse<CommandWithCategory>
  private allCommands: CommandWithCategory[]
  
  constructor(commands: Record<string, ExpandedCommand[]>) {
    // Flatten all commands with category info
    this.allCommands = Object.entries(commands).flatMap(([category, cmds]) =>
      cmds.map(cmd => ({ ...cmd, category }))
    )
    
    // Configure Fuse.js
    const options = {
      keys: [
        { name: 'command', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'mode', weight: 0.1 },
        { name: 'example', weight: 0.1 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      shouldSort: true,
      findAllMatches: true,
      ignoreLocation: true
    }
    
    this.fuse = new Fuse(this.allCommands, options)
  }
  
  search(query: string): CommandWithCategory[] {
    if (!query.trim()) return this.allCommands
    
    // Check for common mistakes first
    const correction = COMMON_MISTAKES[query.toLowerCase()]
    if (correction) {
      const exactMatch = this.allCommands.filter(cmd => cmd.command === correction)
      if (exactMatch.length > 0) {
        return exactMatch
      }
    }
    
    // Expand query with synonyms
    const expandedQueries = this.expandQueryWithSynonyms(query)
    
    // Perform fuzzy search
    let results: FuseResult<CommandWithCategory>[] = []
    for (const q of expandedQueries) {
      const searchResults = this.fuse.search(q)
      results = results.concat(searchResults)
    }
    
    // Remove duplicates and sort by score
    const uniqueResults = this.deduplicateResults(results)
    
    return uniqueResults.map(r => r.item)
  }
  
  private expandQueryWithSynonyms(query: string): string[] {
    const queries = [query]
    const lowerQuery = query.toLowerCase()
    
    // Add synonym expansions
    for (const [term, synonyms] of Object.entries(COMMAND_SYNONYMS)) {
      if (lowerQuery.includes(term)) {
        for (const synonym of synonyms) {
          queries.push(query.replace(new RegExp(term, 'gi'), synonym))
        }
      }
    }
    
    return [...new Set(queries)]
  }
  
  private deduplicateResults(results: FuseResult<CommandWithCategory>[]): FuseResult<CommandWithCategory>[] {
    const seen = new Set<string>()
    return results.filter(result => {
      const key = result.item.command
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).sort((a, b) => (a.score || 0) - (b.score || 0))
  }
  
  getSuggestions(query: string, limit: number = 5): string[] {
    const results = this.search(query)
    return results.slice(0, limit).map(r => r.command)
  }
  
  getRelatedCommands(command: string): ExpandedCommand[] {
    const related = RELATED_COMMANDS[command] || []
    return this.allCommands.filter(cmd => related.includes(cmd.command))
  }
  
  getWorkflowsForCommand(command: string): typeof COMMAND_WORKFLOWS {
    return COMMAND_WORKFLOWS.filter(workflow => 
      workflow.commands.includes(command)
    )
  }
}