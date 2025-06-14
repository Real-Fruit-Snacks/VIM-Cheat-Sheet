# VIM v0.1.1 - Enhanced User Experience

## 🎉 What's New

This release improves the user experience with a dismissible Limited Mode banner and maintains full offline deployment capability for GitLab Pages.

## ✨ New Features

### Dismissible Limited Mode Banner
- **Added dismiss button** - Users can now close the Limited Mode warning banner
- **Improved UI** - Better styling with hover effects and smooth transitions
- **Session-based** - Banner reappears on page refresh for awareness

## 📦 Download

**File**: `vim-gitlab-offline-v0.1.1-*.tar.gz`  
**Size**: ~3.2 MB  

## ✨ Features

### Complete Offline Package
- Pre-built application - no build process required
- All dependencies included (vim.wasm, fonts, icons)
- Works completely offline after initial load
- GitLab CI/CD configuration included

### Easy Deployment
- Extract and upload to GitLab - that's it!
- Automatic deployment via GitLab Pages
- Comprehensive deployment guide included
- No technical knowledge required

### Full VIM Features
- 🎹 Real VIM experience via WebAssembly
- 🎥 Keystroke visualizer for teaching/streaming
- 🎯 Which-Key command helper
- 📝 Live vimrc configuration
- 📚 Comprehensive cheat sheet
- 💾 Persistent settings

## 🚀 Quick Start

### Online Usage
Visit [VIM Live](https://real-fruit-snacks.github.io/VIM/) to try it immediately!

### Offline Deployment
1. Download the `.tar.gz` file from this release
2. Extract the contents
3. Upload all files to your GitLab repository
4. Push to main branch
5. Access at `https://yourusername.gitlab.io/repo-name/`

See the included `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🛠️ Technical Details

- Built with React 19.1 + TypeScript 5.8
- vim.wasm 0.0.13 for authentic VIM experience
- Vite 6.3.5 optimized production build
- Cross-origin isolation configured
- Compatible with all modern browsers

## 📝 Changes from v0.1.0

### User Experience
- Added dismiss button to Limited Mode banner
- Improved banner styling and hover effects
- Made warning less intrusive for users who understand the limitation

### Bug Fixes
- Updated all "VIMora" references to "VIM" for consistent branding
- Fixed localStorage key naming consistency

### Development
- Improved TypeScript type safety
- Better component organization

## 🤝 Contributing

VIM is open source! Contributions welcome at:
https://github.com/Real-Fruit-Snacks/VIM

## 📄 License

MIT License - See LICENSE file for details.