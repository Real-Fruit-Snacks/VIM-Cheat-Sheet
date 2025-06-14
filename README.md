<div align="center">

<img src="public/favicon-detailed.svg" alt="VIM Logo" width="120" height="120" />
  
# 🚀 VIM

### Master VIM Without Leaving Your Browser
*A Lightweight VIM Experience with Real-Time Keystroke Visualization*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vim](https://img.shields.io/badge/Vim-Wasm-brightgreen.svg)](https://github.com/rhysd/vim.wasm)

**Experience VIM directly in your browser with a clean, focused interface and real-time keystroke visualization.**

[🎮 Try VIM Live](https://real-fruit-snacks.github.io/VIM/) | [📖 Features](#-features) | [🎥 For Streamers](#-perfect-for-content-creators) | [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Why VIM?

**VIM** is a streamlined browser-based VIM experience focused on the essentials. Perfect for learning VIM basics and showcasing your keystrokes while coding.

### ✨ What Makes VIM Special

- **🏃 Zero Setup** - Click and start coding. No installation, no configuration hassles
- **⚡ Real VIM** - Actual VIM compiled to WebAssembly, not a simulator
- **🎥 Keystroke Visualizer** - Real-time display of your keystrokes for teaching and streaming
- **🎯 Which-Key Helper** - Shows available commands as you type (when supported)
- **💾 Persistent Everything** - All your settings, configurations, and preferences saved locally
- **📱 Universal Access** - Works on any device with a modern browser
- **🎨 Beautiful Interface** - Terminal-style UI optimized for long coding sessions
- **🌈 7 Built-in Themes** - Dark, Light, High Contrast, VIM Classic, Solarized, and Monokai
- **🏢 Offline Deployment** - Full GitLab Pages support for internal/offline hosting

## 🖼️ Feature Overview

<div align="center">

| Feature | Description | Perfect For |
|---------|-------------|-------------|
| 🎹 **Native VIM** | Full VIM experience via WebAssembly | Everyone |
| 🎥 **Keystroke Visualizer** | Real-time keystroke display with animations | Streamers & Teachers |
| 🎯 **Which-Key Helper** | Interactive command hints (when supported) | Beginners & Learning |
| 📝 **Live Vimrc Editor** | Real-time configuration with instant preview | Customization & Setup |
| 📚 **Cheat Sheet** | Command reference with examples | Quick Reference |
| 💾 **Smart Persistence** | All settings auto-saved locally | Consistent Experience |
| 🎨 **Clean UI** | Distraction-free terminal interface | Focused Work |
| 🌈 **Theme System** | 7 built-in themes with instant switching | Personalization |
| 🏢 **Offline Ready** | Deploy to GitLab/internal networks | Enterprise Use |

</div>

## 🎥 Perfect for Content Creators

VIM includes a professional keystroke visualizer perfect for streamers, YouTubers, and educators:

### **Professional Keystroke Visualizer**
- ✨ **Real-time display** of every keystroke with smooth animations
- 🎯 **6 positioning options** - corner placements or center overlay
- 🎨 **5 font sizes** from compact to presentation-friendly
- ⏱️ **Configurable duration** - control how long keystrokes stay visible
- 🎬 **Fade animations** for professional, polished appearance
- 💾 **Persistent settings** - your preferences saved across sessions

### **Educational Features**
- 📖 **Which-Key integration** - viewers can see available commands
- 🎯 **Command discovery** - perfect for teaching VIM concepts
- 📚 **Built-in reference** - comprehensive cheat sheet always available
- 🎨 **Clean interface** - focus stays on the content, not the tools

## 🚀 Quick Start

### 🌐 Use Online (Recommended)
Visit [VIM Live](https://real-fruit-snacks.github.io/VIM/) and start using VIM immediately - no setup required!

**Browser Compatibility:** VIM works in ALL browsers! If your browser doesn't support SharedArrayBuffer, it automatically falls back to a Monaco-based VIM emulation with full Which-Key support. Check the browser console to see which mode is active.

### 💻 Run Locally
```bash
# Clone the repository
git clone https://github.com/Real-Fruit-Snacks/VIM.git
cd VIM

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173/VIM/ and start using VIM!

### 🏢 Deploy to GitLab (Offline/Internal Networks)
```bash
# Generate offline deployment package
./create-gitlab-release.sh

# This creates a tarball with:
# - Complete production build
# - GitLab CI/CD configuration
# - Deployment documentation
# - All assets for offline use
```

## ⚡ Features Deep Dive

### 🎯 Which-Key Helper
When supported by your browser, the Which-Key system shows you:
- **Available commands** for any key sequence
- **Mode-aware suggestions** - different options for normal/visual/insert modes
- **Visual navigation** for easy discovery

### 🎥 Professional Keystroke Visualizer
Transform your content creation with our advanced visualizer:

**Positioning Options:**
- Top-left, top-right, bottom-left, bottom-right corners
- Center-left, center-right for non-intrusive placement

**Customization:**
- 5 font sizes: `xs`, `small`, `medium`, `large`, `xl`
- Configurable display duration (1-10 seconds)
- Smooth fade-in/fade-out animations
- Auto-adapts to your VIM usage patterns

**Perfect for:**
- 📺 Live streaming on Twitch/YouTube
- 🎓 Educational content creation
- 📹 Tutorial recording
- 👥 Pair programming sessions

### 📝 Advanced Vimrc Editor
Professional VIM configuration made easy:
- **Comprehensive defaults** - sensible starting configuration
- **Real-time application** - see changes instantly without restart
- **Line-by-line validation** - clear feedback on configuration errors
- **Syntax highlighting** - proper vimscript formatting
- **Error recovery** - detailed feedback when commands fail
- **Auto-save** - your configuration persists across sessions

### 📚 Cheat Sheet
Quick command reference includes:
- **Essential VIM commands** organized by category
- **Mode indicators** - know when each command applies
- **Keyboard shortcut** - press `?` anytime to open

## 🛠️ Technology Stack

Built with cutting-edge web technologies for optimal performance:

- **[vim.wasm 0.0.13](https://github.com/rhysd/vim.wasm)** - Native VIM in WebAssembly
- **[React 19.1.0](https://react.dev/)** - Modern reactive UI framework
- **[TypeScript 5.8.3](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 3.4.17](https://tailwindcss.com/)** - Responsive, modern styling
- **[Vite 6.3.5](https://vitejs.dev/)** - Lightning-fast development and builds
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icons

## 🌐 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| ✅ **Chrome/Edge** | **Recommended** | Full support, optimal performance |
| ⚠️ **Firefox** | Supported | Requires SharedArrayBuffer configuration |
| 🔧 **Safari** | Supported | Enable cross-origin restrictions in dev menu |
| ❌ **Internet Explorer** | Not Supported | Requires modern browser features |

### Firefox Setup
Enable `dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled` in `about:config`

### Safari Setup
Enable "Disable Cross-Origin Restrictions" in the Developer menu

## 🏗️ Architecture & Performance

### **Cross-Origin Isolation**
VIM implements proper COOP/COEP headers for SharedArrayBuffer support, ensuring:
- ✅ Native WebAssembly performance
- ✅ Full VIM feature compatibility
- ✅ Secure cross-origin isolation

### **Intelligent Focus Management**
Advanced focus handling ensures:
- 🎯 VIM always receives keyboard input when appropriate
- 🔒 Respects legitimate form inputs and modals
- ⚡ Seamless user experience across all interactions

### **Optimized Resource Loading**
- 📦 Dynamic WebAssembly module loading
- 🚀 Lazy component initialization
- 💾 Efficient local storage management
- 🎨 Smooth animations with CSS optimizations

## 🌈 Theme System

VIM includes a comprehensive theme system with 7 built-in themes:

### Available Themes
- **🌙 Dark** (Default) - Optimized for extended coding sessions
- **☀️ Light** - Clean, bright theme for well-lit environments
- **🔍 High Contrast** - Enhanced visibility with maximum contrast
- **💚 VIM Classic** - Traditional green-on-black terminal aesthetic
- **🌅 Solarized Dark** - Popular color scheme with reduced eye strain
- **🌤️ Solarized Light** - Light variant of the beloved Solarized theme
- **🎨 Monokai** - Vibrant colors inspired by the classic code editor theme

### Theme Features
- **Instant switching** - Changes apply immediately without reload
- **Persistent selection** - Your theme choice is saved across sessions
- **Comprehensive coverage** - All UI elements adapt to the selected theme
- **CSS Variables** - Easy customization for advanced users

## 🎨 UI/UX Design

### **Terminal-Style Interface**
- 🖥️ Authentic terminal aesthetics with macOS-style window controls
- 🌙 Dark theme optimized for extended coding sessions
- 📱 Fully responsive design for any screen size
- ✨ Smooth animations and transitions throughout

### **Accessibility**
- ⌨️ Full keyboard navigation support
- 🎯 Clear focus indicators and states
- 📢 Screen reader compatible structure
- 🎨 High contrast for better visibility

## 🤝 Contributing

We welcome contributions of all kinds! Whether you're:

- 🐛 **Reporting bugs** - Help us improve reliability
- 💡 **Suggesting features** - Share your ideas for enhancements  
- 📝 **Improving docs** - Help others understand and use VIM
- 🔧 **Contributing code** - Join our development efforts
- 🎨 **Designing assets** - Improve the visual experience
- 🌐 **Testing browser compatibility** - Ensure VIM works everywhere

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/Real-Fruit-Snacks/VIM.git
cd VIM

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run TypeScript checking
npx tsc --noEmit

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality Standards
- ✅ TypeScript for all new code
- ✅ Professional commenting and documentation
- ✅ Responsive design principles
- ✅ Accessibility best practices
- ✅ Performance optimization

## 📊 Project Stats

- **Real VIM** via WebAssembly (vim.wasm)
- **6 positioning options** for keystroke visualization
- **5 font sizes** for different use cases
- **100% TypeScript** for type safety and developer experience
- **Zero external dependencies** for VIM functionality
- **Universal browser compatibility** with automatic fallback mode

## 🏢 Offline/GitLab Deployment

VIM can be deployed on internal networks or GitLab Pages for organizations that need offline access:

### Quick GitLab Deployment
```bash
# Create deployment package
./create-gitlab-release.sh

# Package includes:
# - Pre-built production files
# - GitLab CI/CD configuration
# - Deployment documentation
# - All necessary assets
```

### Features for Enterprise
- **🔒 Self-hosted** - Complete control over your deployment
- **🌐 No internet required** - Works entirely offline after deployment
- **📦 Single package** - Everything needed in one tarball
- **🚀 GitLab CI/CD ready** - Automated deployment pipeline included
- **📖 Comprehensive docs** - Step-by-step deployment guide

### Deployment Options
1. **GitLab Pages** - Automatic deployment with included `.gitlab-ci.yml`
2. **Static Server** - Serve the `public/` directory with any web server
3. **Docker/Kubernetes** - Containerize for scalable deployments
4. **Corporate CDN** - Host on internal content delivery networks

## 📄 License

VIM is open source software licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[Vim](https://www.vim.org/)** - The legendary text editor that started it all
- **[vim.wasm](https://github.com/rhysd/vim.wasm)** - Making VIM possible in browsers everywhere
- **[React Team](https://react.dev/)** - For the incredible development experience
- **The VIM Community** - Decades of innovation, documentation, and passion

<sub>VIM - A Clean, Focused VIM Experience in Your Browser!</sub>

</div>
