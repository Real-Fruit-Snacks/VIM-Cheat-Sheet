<div align="center">
  <a href="https://real-fruit-snacks.github.io/VIM/">
    <img src="public/favicon-detailed.svg" alt="VIM Cheatsheet Logo" width="100" />
  </a>
  
  <h1>VIM Cheatsheet</h1>
  
  <p align="center">
    <strong>The Ultimate Interactive VIM Reference</strong>
  </p>
  
  <p align="center">
    315+ Commands • Interactive Examples • Offline Ready • Performance Optimized
  </p>
  
  <p align="center">
    <a href="https://real-fruit-snacks.github.io/VIM/"><strong>🚀 Use VIM Cheatsheet →</strong></a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#interactive-examples">Examples</a>
    ·
    <a href="#deployment">Deploy</a>
  </p>
  
  <p align="center">
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
    </a>
    <a href="https://github.com/Real-Fruit-Snacks/VIM/releases/latest">
      <img src="https://img.shields.io/badge/version-3.0.0-blue.svg" alt="Version 3.0.0" />
    </a>
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-19.1-61DAFB.svg?logo=react" alt="React 19.1" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript" alt="TypeScript 5.8" />
    </a>
  </p>
</div>

<br />

<div align="center">
  <p><em>Performance-first VIM command reference with interactive examples, VIM-style navigation, and comprehensive offline support</em></p>
</div>

---

## 🎯 Why This VIM Cheatsheet?

This isn't just another VIM reference—it's a **performance-optimized, interactive learning platform** designed for VIM users of all levels. Built with modern web technologies and optimized for both online and offline use.

### ✨ What Makes It Special

<table>
  <tr>
    <td width="50%">
      <h4>🎮 Interactive Examples</h4>
      <p>315+ animated command demonstrations with cursor movement, before/after states, and realistic scenarios.</p>
    </td>
    <td width="50%">
      <h4>⚡ Performance Optimized</h4>
      <p>216KB main bundle (46% smaller than v2.0), virtual scrolling, and advanced code splitting for lightning-fast performance.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>⌨️ VIM-Style Navigation</h4>
      <p>Navigate with <code>j/k</code>, search with <code>/</code>, jump with <code>gg/G</code> - just like VIM!</p>
    </td>
    <td width="50%">
      <h4>🌐 Offline Ready</h4>
      <p>Complete offline support with integrated VIM documentation. Perfect for GitLab Pages and air-gapped environments.</p>
    </td>
  </tr>
</table>

## 🚀 Version 3.0.0 - Major Performance Release

### 🏎️ Revolutionary Performance Improvements
- **46% Bundle Size Reduction**: From 400KB to **216KB main bundle**  
- **Advanced Code Splitting**: Manual chunks for react-vendor, lucide-icons, search-utils, virtual-list, vim-data
- **Virtual Scrolling**: Handle 315+ commands smoothly with react-window
- **Debounced Search**: 300ms optimized search with lodash.debounce
- **Data Compression**: Smart payload reduction strategies

### ⌨️ VIM-Style Keyboard Navigation
- **`j/k`** - Navigate up/down through commands (just like VIM!)
- **`/`** - Focus search input
- **`gg`** - Jump to top of command list  
- **`G`** - Jump to bottom of command list
- **`?`** - Show/hide keyboard shortcuts help
- **`Esc`** - Close modals and dismiss help

### 🎯 Enhanced Search & Discovery
- **Fuzzy Search** with Fuse.js - Find commands even with typos
- **Command Synonyms** - Search "delete" to find "cut", "remove", etc.
- **Typo Correction** - "Did you mean..." suggestions
- **Related Commands** - Discover similar commands
- **Enhanced Filtering** - By category, difficulty, and frequency

## 🌟 Features

### Core Capabilities
- **315+ VIM Commands** - Complete coverage across all VIM functionality
- **24 Organized Categories** - From basic movement to advanced macros  
- **Interactive Examples** - Animated demonstrations for every command
- **Integrated Documentation** - 16 official VIM help files included offline
- **Favorites System** - Save frequently used commands
- **Mobile Responsive** - Touch-friendly with swipe gestures
- **Performance Optimized** - Virtual scrolling and efficient rendering

### 🎮 Interactive Examples System
Every command features:
- **Before/After State Visualization** - See exact text changes
- **Animated Cursor Movement** - Understand cursor positioning
- **Mode Indicators** - Visual feedback for Normal/Insert/Visual modes
- **Realistic Scenarios** - Practical examples you'll actually encounter
- **Step-by-Step Explanations** - Clear descriptions of command behavior

### 📚 Integrated VIM Documentation
- **16 Official VIM Help Files** - Complete offline documentation
- **Context-Aware Help** - Click help icon next to any command
- **Full-Text Search** - Search across all help documentation
- **Cross-References** - Navigate between related help topics
- **Syntax Highlighting** - Properly formatted VIM help syntax

### 🏗️ Technical Architecture

**Performance-First Design:**
- **Virtual Scrolling** - Handles large command lists efficiently
- **Advanced Code Splitting** - Optimized bundle loading
- **Data Compression** - Reduced payload sizes
- **Modern ES2015 Target** - Optimized for modern browsers

**Component Architecture:**
- `VimCheatsheetEnhanced.tsx` - Main application (800+ lines)
- `VimCommandExampleAnimated.tsx` - Interactive demonstrations
- `VimHelpViewer.tsx` - Integrated documentation viewer
- `SearchSuggestions.tsx` - Intelligent search with fuzzy matching
- Custom hooks: `useDebounce`, `useKeyboardNavigation`, `useSwipeGesture`

## 📱 Mobile & Accessibility

- **Touch-Friendly Design** - 44px minimum touch targets
- **Swipe Gestures** - Intuitive mobile navigation
- **Responsive Sidebar** - Optimized for mobile screens
- **Keyboard Navigation** - Full accessibility support
- **Error Boundaries** - Graceful failure handling

## 🚀 Quick Start

### 🌐 Online (Recommended)
Visit **[VIM Cheatsheet](https://real-fruit-snacks.github.io/VIM/)** - works instantly in any modern browser.

### 💻 Local Development
```bash
# Clone and setup
git clone https://github.com/Real-Fruit-Snacks/VIM.git
cd VIM
npm install

# Start development server (runs on localhost:5173/VIM/)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 🧪 Code Quality
```bash
# Linting (ESLint with TypeScript rules)
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## 🌐 Deployment Options

### GitHub Pages (Current)
The application is automatically deployed to GitHub Pages at [real-fruit-snacks.github.io/VIM](https://real-fruit-snacks.github.io/VIM/).

### GitLab Pages (Offline Ready)
Perfect for offline and air-gapped environments:

#### Option 1: Download Release
1. Download the latest release from [GitHub Releases](https://github.com/Real-Fruit-Snacks/VIM/releases/latest)
2. Extract `vim-cheatsheet-v3.0.0-gitlab-pages.zip`
3. Upload contents to your GitLab Pages repository
4. Enable GitLab Pages in project settings

#### Option 2: Build from Source
```bash
# Build for GitLab Pages
npm run build:gitlab

# Contents ready in gitlab-public/ directory
```

#### GitLab CI/CD Integration
Add this `.gitlab-ci.yml` to your repository:
```yaml
pages:
  script:
    - mkdir public
    - cp -r dist/* public/
  artifacts:
    paths:
      - public
  only:
    - main
```

### Self-Hosting
The application is completely self-contained with no external dependencies - perfect for:
- Corporate intranets
- Air-gapped environments  
- Offline development environments
- Custom domain hosting

## 📊 Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Main Bundle** | 216KB | 46% reduction from v2.0 |
| **Total Build Size** | ~1.7MB | Including all help files |
| **Load Time** | <1s | On modern connections |
| **Memory Usage** | ~15MB | Lightweight and efficient |
| **Search Response** | <300ms | Debounced for optimal UX |

### Bundle Analysis
- `vim-data-*.js` - 190KB (command data and examples)
- `index-*.js` - 217KB (main application code)
- `search-utils-*.js` - 18KB (Fuse.js and search logic)
- `virtual-list-*.js` - 12KB (react-window components)
- `react-vendor-*.js` - 11KB (React libraries)
- `lucide-icons-*.js` - 5KB (icon components)

## 🌍 Browser Support

| Browser | Version | Support | Performance |
|---------|---------|---------|-------------|
| **Chrome** | 88+ | ✅ Full | Optimal |
| **Firefox** | 85+ | ✅ Full | Excellent |
| **Safari** | 14+ | ✅ Full | Great |
| **Edge** | 88+ | ✅ Full | Optimal |
| **Mobile** | Modern | ✅ Full | Touch-optimized |

*ES2015 target ensures compatibility with all modern browsers while maintaining optimal performance.*

## 🛠️ Technology Stack

### Frontend
- **React 19.1** - Latest React with optimized performance
- **TypeScript 5.8** - Full type safety and developer experience
- **Tailwind CSS** - Utility-first responsive design
- **Lucide React** - Beautiful, consistent icon system

### Build & Performance
- **Vite 6.3** - Lightning-fast build tool with HMR
- **Terser** - Advanced JavaScript minification
- **Manual Code Splitting** - Optimized bundle loading
- **Tree Shaking** - Dead code elimination

### Search & UX
- **Fuse.js** - Fuzzy search with typo tolerance
- **react-window** - Virtual scrolling for performance
- **lodash.debounce** - Optimized search debouncing

### Data & Content
- **399 lines** - Structured command definitions (`vim-commands.ts`)
- **8,583 lines** - Interactive example states (`vim-examples.ts`)
- **16 help files** - Official VIM documentation (offline)

## 🎯 Command Categories

All **315+ commands** organized across **24 categories**:

| Category | Commands | Description |
|----------|----------|-------------|
| **Basic Movement** | 13 | h, j, k, l, w, b, e, 0, ^, $ |
| **Advanced Movement** | 22 | Paragraph, screen, document navigation |
| **Insert Mode** | 8 | i, a, o, A, I, O, and variants |
| **Editing Commands** | 19 | Delete, change, copy operations |
| **Visual Mode** | 11 | Text selection and visual operations |
| **Search and Replace** | 15 | Finding and replacing text |
| **File Operations** | 12 | Opening, saving, managing files |
| **Window Management** | 14 | Splitting and managing windows |
| **Buffer Management** | 8 | Working with multiple files |
| **Registers and Clipboard** | 12 | Copy/paste with registers |
| **Marks and Jumps** | 15 | Navigation bookmarks |
| **Macros and Advanced** | 10 | Recording and playback |
| **Text Objects** | 16 | Sophisticated text selection |
| **Fold Operations** | 12 | Code folding and unfolding |
| **Tab Management** | 7 | Working with tabs |
| **Undo and Redo** | 6 | Change history navigation |
| **Command Line** | 18 | Ex commands and command-line mode |
| **Navigation Commands** | 13 | Jumping and positioning |
| **Indentation** | 8 | Code formatting and indentation |
| **Case Conversion** | 6 | Changing text case |
| **Completion** | 5 | Auto-completion features |
| **Spell Checking** | 8 | Spell check and correction |
| **Help System** | 6 | Getting help and documentation |
| **Diff Mode** | 5 | Comparing and merging files |

## 🤝 Contributing

We welcome contributions to make this the definitive VIM reference!

### Ways to Contribute
- **Enhance Examples** - Improve interactive command demonstrations
- **Verify Accuracy** - Ensure 100% VIM compatibility
- **Improve Performance** - Optimize rendering and search
- **Add Features** - Implement new functionality
- **Fix Issues** - Report bugs and submit fixes
- **Documentation** - Improve help content and examples

### Development Guidelines
- **TypeScript Strict Mode** - Full type safety required
- **ESLint Configuration** - Follow project coding standards  
- **Performance First** - Consider bundle size and performance impact
- **Accessibility** - Maintain keyboard navigation and screen reader support
- **Mobile Friendly** - Test on mobile devices and touch interfaces

### Command Accuracy
All 315 commands have been meticulously verified for accuracy. If you find discrepancies:
1. Open an issue with the incorrect command
2. Provide the correct VIM behavior with version context
3. Include test cases demonstrating the correct behavior

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with ❤️ for the VIM community:

- **[Vim](https://www.vim.org/)** - The legendary text editor that inspired this project
- **[React](https://react.dev/)** - The UI framework powering our interactive examples
- **[Tailwind CSS](https://tailwindcss.com/)** - Beautiful, responsive styling system
- **[Lucide](https://lucide.dev/)** - Gorgeous, consistent icon library
- **[Fuse.js](https://fusejs.io/)** - Powerful fuzzy search capabilities
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and development server

### Special Thanks
- VIM community for comprehensive command verification
- Contributors who helped achieve 100% command coverage
- Users who provided feedback and feature suggestions

---

<div align="center">
  <p>
    <a href="https://real-fruit-snacks.github.io/VIM/"><strong>🚀 Start Using VIM Cheatsheet →</strong></a>
  </p>
  <p>
    <a href="https://github.com/Real-Fruit-Snacks/VIM/releases/latest"><strong>📦 Download for Offline Use →</strong></a>
  </p>
  <p>
    <sub>Made by VIM users, for VIM users | Version 3.0.0 | 315+ Commands | Performance Optimized</sub>
  </p>
</div>