# VIMora v0.2.0 - Theme System & Enhanced Offline Deployment 🎨

## 🌈 Major New Feature: Theme System!

VIMora now includes a comprehensive theme system with **7 beautiful built-in themes**:

### 🎨 Available Themes:
- **Dark** (Default) - Optimized for extended coding sessions
- **Light** - Clean, bright theme for well-lit environments  
- **High Contrast** - Enhanced visibility with maximum contrast
- **VIM Classic** - Traditional green-on-black terminal aesthetic
- **Solarized Dark** - Popular color scheme with reduced eye strain
- **Solarized Light** - Light variant of the beloved Solarized theme
- **Monokai** - Vibrant colors inspired by the classic code editor theme

### ✨ Theme Features:
- **Instant switching** - Changes apply immediately without reload
- **Persistent selection** - Your theme choice is saved across sessions
- **Comprehensive coverage** - All UI elements adapt to the selected theme
- **CSS Variables** - Easy customization for advanced users
- **Theme Toggle** - New UI component in the header for quick theme switching

## 📦 Download

**File**: `vim-gitlab-offline-v0.2.0-*.tar.gz`  
**Size**: ~3.2 MB  

## ✨ Features

### Complete Offline Package
- Pre-built application - no build process required
- All dependencies included (vim.wasm, fonts, icons)
- Works completely offline after initial load
- GitLab CI/CD configuration included
- **NEW**: All 7 themes included and functional offline

### Easy Deployment
- Extract and upload to GitLab - that's it!
- Automatic deployment via GitLab Pages
- Comprehensive deployment guide included
- No technical knowledge required

### Full VIMora Features
- 🎹 Real VIM experience via WebAssembly
- 🎥 Keystroke visualizer for teaching/streaming
- 🎯 Which-Key command helper
- 📝 Live vimrc configuration
- 📚 Comprehensive cheat sheet
- 💾 Persistent settings
- 🌈 **NEW**: Theme system with 7 built-in themes

## 🚀 Quick Start

### Online Usage:
Visit [VIMora Live](https://real-fruit-snacks.github.io/VIMora/) and click the theme toggle in the header!

### Offline Deployment:
1. Download the `.tar.gz` file
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
- **NEW**: CSS Variables for dynamic theming
- **NEW**: Theme Context Provider for state management

## 📝 Changes from v0.1.0

### New Features:
- 🌈 Complete theme system with 7 built-in themes
- 🎨 Theme toggle UI component in header
- 💾 Persistent theme selection
- 🎯 CSS Variables for easy customization
- 📱 All themes work perfectly offline

### Improvements:
- Enhanced Toast component with theme support
- Updated all UI components to use theme variables
- Better TypeScript type safety
- Improved code organization
- Updated documentation with theme information

### Technical:
- Added ThemeContext and ThemeProvider
- Extended Tailwind configuration for CSS variables
- Fixed TypeScript import issues
- Updated build process for theme support

## 🤝 Contributing

VIMora is open source! Contributions welcome at:
https://github.com/Real-Fruit-Snacks/VIMora

## 📄 License

MIT License - See LICENSE file for details.