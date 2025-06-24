# VIM Cheatsheet

<div align="center">
  <a href="https://real-fruit-snacks.github.io/VIM/">
    <img src="public/favicon-detailed.svg" alt="VIM Cheatsheet" width="100" />
  </a>
  
  <p><strong>Interactive VIM reference with 315+ commands and 30 workflow demos</strong></p>
  
  <p>
    <a href="https://real-fruit-snacks.github.io/VIM/"><strong>🚀 Open VIM Cheatsheet →</strong></a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/version-4.0.0-blue.svg" alt="Version 4.0.0" />
    <img src="https://img.shields.io/badge/React-19.1-61DAFB.svg" alt="React 19.1" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg" alt="TypeScript 5.8" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
  </p>
</div>

## 🎉 Version 4.0.0 - Offline GitLab Pages Release

### What's New
- **Full Offline Support** - Service Worker with comprehensive caching strategy
- **GitLab CI/CD** - Automated deployment pipeline for GitLab Pages
- **PWA Ready** - Installable with offline functionality and app manifest
- **Enhanced Performance** - Improved caching for faster load times
- **Offline Documentation** - All VIM help files cached for offline access

## Features

- **315+ Interactive Commands** - Animated examples with before/after states
- **64 Workflow Demos** - Multi-step real-world VIM workflows with auto-play
  - Developer workflows (refactoring, debugging, testing)
  - Writer workflows (editing, formatting, spell-checking)
  - SysAdmin workflows (log analysis, config management, automation)
  - Security workflows (auditing, incident response, vulnerability management)
- **VIM-Style Navigation** - Use `j/k`, `/`, `gg/G` just like VIM
- **Performance Optimized** - 216KB bundle with virtual scrolling
- **Offline Ready** - Complete offline support with Service Worker caching
- **Mobile Friendly** - Touch gestures and responsive design
- **PWA Support** - Install as app on desktop or mobile

## Quick Start

### Online (Recommended)
Visit **[real-fruit-snacks.github.io/VIM](https://real-fruit-snacks.github.io/VIM/)** in any modern browser.

### Local Development
```bash
git clone https://github.com/Real-Fruit-Snacks/VIM.git
cd VIM
npm install
npm run dev  # Opens at localhost:5173/VIM/
```

### Build & Deploy
```bash
npm run build      # Production build
npm run preview    # Preview build locally
npm run deploy     # Deploy to GitHub Pages
npm run lint       # Code quality check
```

## Architecture

### Performance-First Design
- **Virtual Scrolling** with react-window for 315+ commands
- **Advanced Code Splitting** - Separate chunks for React, icons, search, data
- **Debounced Search** (300ms) with fuzzy matching
- **Bundle Size**: 216KB main bundle (46% smaller than v2.0)

### Component Structure
```
src/
├── components/
│   ├── VimCheatsheetEnhanced.tsx      # Main app (800+ lines)
│   ├── VimCommandExampleAnimated.tsx  # Interactive command demos
│   ├── VimDemo.tsx                    # Multi-step workflow demos
│   ├── VirtualCommandList.tsx         # Performance-optimized list
│   └── SearchSuggestions.tsx          # Fuzzy search with suggestions
├── data/
│   ├── vim-commands.ts                # 315+ command definitions
│   ├── vim-examples.ts                # Interactive example states
│   └── vim-demos.ts                   # 30 workflow demonstrations
└── hooks/
    ├── useDebounce.ts                 # Search optimization
    ├── useKeyboardNavigation.ts       # VIM-style navigation
    └── useSwipeGesture.ts             # Mobile touch support
```

### Data Layer
- **399 lines** of structured command definitions
- **8,583 lines** of interactive example states  
- **30 comprehensive demos** from beginner to advanced
- **16 official VIM help files** for offline documentation

## Deployment Options

### GitHub Pages
Automatically deployed at [real-fruit-snacks.github.io/VIM](https://real-fruit-snacks.github.io/VIM/)

```bash
npm run deploy  # Deploy to GitHub Pages
```

### GitLab Pages (NEW in v4.0.0)
Full CI/CD pipeline included for GitLab Pages deployment:

1. **Push to GitLab:**
   ```bash
   git remote add gitlab https://gitlab.com/your-username/vim-cheatsheet.git
   git push gitlab main
   ```

2. **Automatic Deployment:**
   - GitLab CI/CD automatically builds and deploys on push
   - Available at: `https://your-username.gitlab.io/vim-cheatsheet`

3. **Manual Build:**
   ```bash
   npm run build:gitlab  # Creates gitlab-public/ directory
   ```

### Self-Hosting / Offline Deployment
Perfect for corporate or offline environments:

```bash
# Build for production
npm run build

# Contents in dist/ are fully self-contained
# - No external dependencies
# - Service Worker for offline support
# - All VIM help files included
```

Serve the `dist/` directory with any static file server.

### Docker (Optional)
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

## Development

### Code Quality
- **TypeScript Strict Mode** - Zero type errors
- **ESLint** - Consistent code style
- **Performance Monitoring** - Bundle analysis with Vite

### Adding Commands
1. Add command definition to `src/data/vim-commands.ts`
2. Add interactive example to `src/data/vim-examples.ts`
3. Test the example renders correctly

### Adding Workflow Demos
1. Define demo structure in `src/data/vim-demos.ts`
2. Create step-by-step workflow with realistic scenarios
3. Test auto-play and manual navigation

## Offline Support (NEW in v4.0.0)

### Service Worker Features
- **Automatic Caching** - All assets cached on first visit
- **Offline Fallback** - Graceful offline page when network unavailable  
- **Background Updates** - Checks for updates hourly
- **Smart Caching** - Network-first for HTML, cache-first for assets

### PWA Installation
1. Visit the site in Chrome/Edge/Firefox
2. Click "Install" in address bar or menu
3. Use fully offline as desktop/mobile app

## Browser Support

| Browser | Version | Support | PWA |
|---------|---------|---------|-----|
| Chrome  | 88+     | ✅ Full | ✅ |
| Firefox | 85+     | ✅ Full | ✅ |
| Safari  | 14+     | ✅ Full | ⚠️  |
| Edge    | 88+     | ✅ Full | ✅ |

ES2015 target ensures optimal performance on modern browsers.

## Performance Metrics

| Metric | Value |
|--------|-------|
| Main Bundle | 216KB |
| Total Build | ~1.7MB |
| Load Time | <1s |
| Search Response | <300ms |

## Technology Stack

- **React 19.1** + **TypeScript 5.8**
- **Vite 6.3** build system
- **Tailwind CSS** for styling
- **Fuse.js** for fuzzy search
- **react-window** for virtual scrolling
- **Service Worker** for offline support
- **GitLab CI/CD** for automated deployment

## Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Add/improve** commands or demos
4. **Test** your changes
5. **Submit** a pull request

All 315 commands have been verified for VIM accuracy. Please maintain this standard.

## License

MIT License - see [LICENSE](LICENSE) file.

---

<div align="center">
  <p><strong>Made by VIM users, for VIM users</strong></p>
  <p><a href="https://real-fruit-snacks.github.io/VIM/">🚀 Start using VIM Cheatsheet</a></p>
</div>