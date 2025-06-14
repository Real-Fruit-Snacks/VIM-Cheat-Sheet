# VIM v0.1.3 - Critical Fixes & Improved UX

## 🎉 What's New

This release fixes critical issues with the Monaco VIM fallback mode, improves the Limited Mode banner, and ensures the keystroke visualizer works properly in all modes.

## 🐛 Major Bug Fixes

### Fixed Keystroke Visualizer in Monaco Mode
- ✅ **Keystroke visualizer now works in fallback mode** - Was previously not displaying keystrokes
- ✅ **Enabled by default** - Changed from disabled to enabled for better user experience
- ✅ **Improved event forwarding** - Better synthetic KeyboardEvent creation with error handling

### Fixed Monaco VIM Status Bar Layout
- ✅ **No more content jumping** - Status bar is now absolutely positioned
- ✅ **Content stays visible** - Fixed issue where top lines would go under header
- ✅ **Proper space reservation** - Added bottom padding to prevent overlap

### Improved Limited Mode Banner
- ✅ **Dismiss button always visible** - Fixed overlap with fallback mode indicator
- ✅ **Better visual design** - Clear warning icon and improved contrast
- ✅ **Removed redundant labels** - Cleaner UI without duplicate mode indicators

## 📦 Offline GitLab Deployment Package

**File**: `vim-gitlab-offline-v0.1.3-*.tar.gz`  
**Size**: ~3.2 MB  

### Package Contents
- ✅ Complete pre-built application with all fixes
- ✅ All JavaScript, CSS, and assets
- ✅ vim.wasm binaries for offline operation
- ✅ Service worker for cross-origin isolation
- ✅ GitLab CI/CD configuration (`.gitlab-ci.yml`)
- ✅ Deployment documentation
- ✅ No external dependencies - works 100% offline

### Deployment Steps
1. Download `vim-gitlab-offline-v0.1.3-*.tar.gz`
2. Extract: `tar -xzf vim-gitlab-offline-v0.1.3-*.tar.gz`
3. Push contents to your GitLab repository
4. GitLab Pages will automatically deploy
5. Access at: `https://yourusername.gitlab.io/repo-name/`

## ✨ Complete Feature Set

- 🎹 Real VIM experience (vim.wasm when available, Monaco fallback)
- 🎥 **Working** keystroke visualizer in ALL modes
- 🎯 Which-Key command helper
- 📝 Live vimrc configuration with instant preview
- 📚 Comprehensive cheat sheet
- 💾 Persistent settings across sessions
- 🚫 Dismissible Limited Mode banner
- 📱 Responsive design for all devices

## 🛠️ Technical Details

- Built with React 19.1 + TypeScript 5.8
- vim.wasm 0.0.13 for authentic VIM experience
- Monaco Editor with monaco-vim for fallback mode
- Vite 6.3.5 optimized production build
- Cross-origin isolation properly configured
- Service worker included for SharedArrayBuffer support

## 📝 Changes from v0.1.2

### Bug Fixes
- Fixed keystroke visualizer not working in Monaco VIM mode
- Fixed Monaco status bar causing layout shifts
- Fixed Limited Mode banner dismiss button being hidden
- Removed redundant mode indicators for cleaner UI

### Improvements
- Keystroke visualizer enabled by default
- Better error handling for keyboard events
- Improved banner layout with proper spacing
- Enhanced visual hierarchy with shadows and contrast

### Technical
- Added ref pattern for onKeyPress callback to prevent stale closures
- Absolute positioning for Monaco status bar
- Proper z-index management for overlapping elements
- Better TypeScript type safety

## 🚀 Quick Start

### Online Usage
Visit [VIM Live](https://real-fruit-snacks.github.io/VIM/) - all features now work correctly!

### Offline/Internal Network Deployment
Perfect for:
- 🏢 Corporate networks without internet access
- 🔒 Secure environments
- 🚀 Fast local access
- 📡 Air-gapped systems

## 🤝 Contributing

VIM is open source! Contributions welcome at:
https://github.com/Real-Fruit-Snacks/VIM

## 📄 License

MIT License - See LICENSE file for details.