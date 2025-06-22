# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VIM-Cheatsheet is a comprehensive, interactive VIM command reference application. The project was transformed from a VIM editor (VIMora) into the ultimate VIM cheatsheet - a searchable, filterable, and interactive guide to VIM commands with 300+ commands across 14 categories.

## Quick Commands

```bash
# Development
npm run dev              # Start development server on localhost:5173/VIM/
npm run build           # Build for production (TypeScript + Vite)
npm run lint            # Run ESLint
npm run preview         # Preview production build

# Deployment
npm run deploy          # Deploy to GitHub Pages
npm run build:gitlab    # Build for GitLab Pages deployment
npm run predeploy       # Alias for build command
```

## Core Architecture

### Main Application Structure

The application is a single-page React application with a clean, focused architecture:

```
VIM-Cheatsheet
├── Main Interface (VimCheatsheet.tsx)
│   ├── Sidebar Navigation
│   │   ├── Search functionality
│   │   ├── Category filters
│   │   ├── Difficulty & frequency filters
│   │   └── Command builder
│   └── Command Display Grid
│       ├── Command cards with copy functionality
│       ├── Favorites system
│       └── Interactive command builder
├── Data Layer
│   ├── vim-commands.ts (300+ commands in 14 categories)
│   └── key-bindings.ts (interactive key combinations)
└── Utilities
    ├── Local storage persistence
    ├── Command filtering & search
    └── Copy-to-clipboard functionality
```

### Key Components

#### 1. VimCheatsheet Component (`src/components/VimCheatsheet.tsx`)

The main application component that handles:
- **State Management**: Search, filters, favorites, command builder
- **Data Processing**: Command enhancement with difficulty/frequency levels
- **User Interactions**: Copy commands, favorites, search filtering
- **Local Storage**: Persistent favorites across sessions

#### 2. Data Structure (`src/data/vim-commands.ts`)

Comprehensive VIM command database with 14 categories:
- `basicMovement`, `documentNavigation`, `scrolling`, `basicEditing`
- `copyPasteAndRegisters`, `searchAndReplace`, `advancedSearchReplace`
- `visualMode`, `textObjects`, `marksAndJumps`, `indentationAndFormatting`
- `numbersAndCounts`, `macrosAndAdvanced`, `fileOperations`

Each command includes:
```typescript
interface VimCommand {
  command: string      // The VIM command syntax
  description: string  // Human-readable description
  mode?: string       // VIM mode (normal, insert, visual, etc.)
  example?: string    // Usage example or context
}
```

#### 3. Enhanced Features

**Smart Classification System**:
- **Difficulty Levels**: Commands automatically classified as beginner/intermediate/advanced
- **Frequency Indicators**: Essential/common/rare based on typical usage patterns
- **Mode Awareness**: Commands tagged with appropriate VIM modes

**Interactive Features**:
- **Advanced Search**: Full-text search across commands, descriptions, examples
- **Multi-level Filtering**: By category, difficulty, frequency, and mode
- **Command Builder**: Click commands to compose complex sequences
- **Favorites System**: Bookmark frequently used commands with localStorage persistence
- **Copy Functionality**: One-click copying with visual feedback

### Technology Stack

- **Frontend**: React 19.1 + TypeScript
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS for responsive design
- **Build**: Vite 6.3 with optimized chunking
- **Deployment**: GitHub Pages with automated CI/CD

## Development Patterns

### Component Structure

The main component follows React best practices:
```typescript
// State management with hooks
const [searchTerm, setSearchTerm] = useState('')
const [favorites, setFavorites] = useState<Set<string>>(new Set())

// Memoized data processing for performance
const enhancedCommands = useMemo(() => {
  // Process raw commands with difficulty/frequency
}, [])

// Local storage integration
useEffect(() => {
  const saved = localStorage.getItem('vim-cheatsheet-favorites')
  if (saved) setFavorites(new Set(JSON.parse(saved)))
}, [])
```

### Data Enhancement

Commands are enhanced at runtime with:
```typescript
function getDifficultyLevel(command: string, category: string): 'beginner' | 'intermediate' | 'advanced'
function getFrequencyLevel(command: string): 'essential' | 'common' | 'rare'
```

### Filtering Logic

Complex filtering combines multiple criteria:
- Text search across command, description, mode, example
- Category filtering (single category or all)
- Difficulty/frequency filtering
- Sorting by alphabetical, difficulty, frequency, or category

## Configuration Files

### `vite.config.ts` - Build Configuration
- Base path: `/VIM/` for GitHub/GitLab Pages deployment
- Optimized chunk splitting for React vendor code
- Clean, minimal configuration for static site

### `public/_headers` - Security Headers
Simplified headers for static content:
- Content security policy for safe inline scripts/styles
- Caching strategies for optimal performance
- Basic security headers (nosniff, referrer policy)

### `package.json` - Project Metadata
- Name: "VIM-Cheatsheet" 
- Version: "2.0.0"
- Clean dependency list focused on React, TypeScript, Tailwind

## Data Management

### Command Data Structure

The `vimCommands` object in `src/data/vim-commands.ts` contains:
- 14 main categories of VIM commands
- 300+ individual commands with descriptions
- Mode indicators and usage examples
- Consistent formatting and organization

### Local Storage Usage

```typescript
// Favorites persistence
localStorage.setItem('vim-cheatsheet-favorites', JSON.stringify(Array.from(favorites)))

// Loading saved preferences
const savedFavorites = localStorage.getItem('vim-cheatsheet-favorites')
```

## Deployment Architecture

### GitHub Pages Deployment
- Automated via GitHub Actions on push to main
- Clean build without legacy editor dependencies
- Optimized static assets with proper caching headers

### Build Process
1. TypeScript compilation with strict checking
2. Vite build with React vendor chunking
3. Static asset optimization
4. Header configuration for security and performance

## Code Style & Conventions

- **TypeScript**: Strict mode enabled with full type safety
- **React**: Modern hooks-based components
- **Styling**: Tailwind CSS with responsive design patterns
- **Icons**: Lucide React for consistent UI elements
- **No Comments**: Code should be self-documenting unless explicitly requested
- **Prefer Editing**: Always edit existing files rather than creating new ones when possible

## Important Notes

1. **Static Application**: This is a pure frontend application with no backend dependencies
2. **Client-Side Only**: All data processing and storage happens in the browser
3. **Performance Optimized**: Memoized computations and efficient React patterns
4. **Responsive Design**: Works across desktop, tablet, and mobile devices
5. **Accessibility**: Keyboard navigation and screen reader friendly
6. **No Analytics**: Privacy-focused with no external tracking

## Legacy Note

This application was previously a full VIM editor (VIMora) with vim.wasm and Monaco Editor integration. The transformation to a static cheatsheet removed all editor functionality in favor of a focused, fast, and universally compatible command reference tool.