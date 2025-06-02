<div align="center">

<img src="public/favicon-detailed.svg" alt="VIM.io Logo" width="120" height="120" />
  
# 🚀 VIM.io

### Master VIM Without Leaving Your Browser
*The Complete VIM Learning Experience - Now with Professional Streaming Tools*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vim](https://img.shields.io/badge/Vim-Wasm-brightgreen.svg)](https://github.com/rhysd/vim.wasm)

**Experience the full power of VIM directly in your browser. Perfect for learning, teaching, and professional content creation.**

[🎮 Try VIM.io. Live](https://real-fruit-snacks.github.io/VIM.io/) | [📖 Features](#-features) | [🎥 For Streamers](#-perfect-for-content-creators) | [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Why VIM.io?

**VIM.io is the most comprehensive browser-based VIM experience available. Whether you're a beginner learning VIM or a content creator teaching others, VIM.io provides professional-grade tools in a zero-setup environment.

### ✨ What Makes VIM.io Special

- **🏃 Zero Setup** - Click and start coding. No installation, no configuration hassles
- **⚡ Real VIM** - Actual VIM compiled to WebAssembly, not a simulator
- **🎥 Pro Streaming Tools** - Built-in keystroke visualizer perfect for tutorials and live coding
- **🎯 Smart Learning** - Which-Key system shows available commands as you type
- **💾 Persistent Everything** - All your settings, configurations, and preferences saved locally
- **📱 Universal Access** - Works on any device with a modern browser
- **🎨 Beautiful Interface** - Terminal-style UI optimized for long coding sessions

## 🖼️ Feature Overview

<div align="center">

| Feature | Description | Perfect For |
|---------|-------------|-------------|
| 🎹 **Native VIM** | Full VIM experience via WebAssembly | Everyone |
| 🎥 **Keystroke Visualizer** | Real-time keystroke display with animations | Streamers & Teachers |
| 🎯 **Which-Key Helper** | Interactive command hints and discovery | Beginners & Learning |
| 📝 **Live Vimrc Editor** | Real-time configuration with instant preview | Customization & Setup |
| 📚 **Comprehensive Cheat Sheet** | Searchable command reference with examples | Quick Reference |
| 💾 **Smart Persistence** | All settings auto-saved locally | Consistent Experience |
| 🎨 **Modern UI** | Clean, distraction-free terminal interface | Professional Use |

</div>

## 🎥 Perfect for Content Creators

VIMora is designed with streamers, YouTubers, and educators in mind:

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
Visit [VIMora Live](https://real-fruit-snacks.github.io/VIM.io/) and start using VIM immediately - no setup required!

### 💻 Run Locally
```bash
# Clone the repository
git clone https://github.com/Real-Fruit-Snacks/VIM.io.git
cd VIM.io

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173/VIM.io/ and experience VIM like never before!

## ⚡ Features Deep Dive

### 🎯 Smart Which-Key System
Never get stuck learning VIM! Our intelligent helper shows you:
- **Available commands** for any key sequence
- **Grouped by functionality** for easy discovery
- **Mode-aware suggestions** - different options for normal/visual/insert modes
- **Visual navigation** with arrow keys or vim-style (j/k)
- **Instant execution** - click or press keys to run commands

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

### 📚 Comprehensive Cheat Sheet
Our reorganized command reference includes:
- **20+ categories** logically organized by workflow
- **Instant search** - find commands quickly
- **Mode indicators** - know when each command applies
- **Usage examples** - see commands in context
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
VIMora implements proper COOP/COEP headers for SharedArrayBuffer support, ensuring:
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
- 📝 **Improving docs** - Help others understand and use VIMora
- 🔧 **Contributing code** - Join our development efforts
- 🎨 **Designing assets** - Improve the visual experience

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/Real-Fruit-Snacks/VIM.io.git
cd VIM.io

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

- **20+ VIM command categories** with comprehensive coverage
- **500+ VIM commands** documented and searchable
- **6 positioning options** for keystroke visualization
- **5 font sizes** for different use cases
- **100% TypeScript** for type safety and developer experience
- **Zero external dependencies** for VIM functionality (uses native vim.wasm)

## 🚀 Roadmap

### **Coming Soon**
- 🎮 **Interactive VIM Tutorial** - Step-by-step guided learning
- 🎯 **Custom Key Bindings** - Personalized shortcuts and mappings
- 🌈 **Theme Customization** - Multiple color schemes and styles
- 📁 **File Management** - Basic file operations and project structure
- 🔄 **Session Persistence** - Save and restore editing sessions

### **Future Possibilities**
- 🤝 **Collaborative Editing** - Multi-user VIM sessions
- 🧩 **Plugin System** - Extend functionality with custom plugins
- 🎨 **Advanced Themes** - More sophisticated visual customization
- 📱 **Mobile Optimization** - Enhanced touch interfaces for tablets/phones

## 📄 License

VIMora is open source software licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[Vim](https://www.vim.org/)** - The legendary text editor that started it all
- **[vim.wasm](https://github.com/rhysd/vim.wasm)** - Making VIM possible in browsers everywhere
- **[React Team](https://react.dev/)** - For the incredible development experience
- **The VIM Community** - Decades of innovation, documentation, and passion

---

<div align="center">

### 🎯 Ready to Master VIM?

*Whether you're learning, teaching, or creating content - VIMora has everything you need.*

<br/>

<a href="https://real-fruit-snacks.github.io/VIM.io/">
  <img src="https://img.shields.io/badge/🚀_Launch_VIMora-00ff00?style=for-the-badge&labelColor=1a1a1a" alt="Launch VIMora" />
</a>

<br/>
<br/>

**⭐ Star us on GitHub** | **🐛 Report Issues** | **💡 Request Features** | **🎥 Share Your Content**

<br/>

Made with ❤️ and lots of ☕ for the VIM community

<br/>

<sub>VIMora - Where VIM Learning Meets Professional Content Creation!</sub>

</div>
