<div align="center">

<img src="public/favicon-detailed.svg" alt="VIM Logo" width="120" height="120" />
  
# 🚀 VIM

### Master VIM Without Leaving Your Browser
*The Complete VIM Learning Experience - Now with Professional Streaming Tools*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vim](https://img.shields.io/badge/Vim-Wasm-brightgreen.svg)](https://github.com/rhysd/vim.wasm)

**Experience the full power of VIM directly in your browser. Perfect for learning, teaching, and professional content creation.**

[🎮 Try VIM Live](https://real-fruit-snacks.github.io/VIM/) | [📖 Features](#-features) | [🎥 For Streamers](#-perfect-for-content-creators) | [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Why VIM?

**VIM** is the most comprehensive browser-based VIM experience available. Whether you're a beginner learning VIM or a content creator teaching others, VIM provides professional-grade tools in a zero-setup environment.

### ✨ What Makes VIM Special

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
| 📁 **Practice Files** | Pre-loaded sample files for real-world scenarios | Learning & Practice |
| 🎥 **Keystroke Visualizer** | Real-time keystroke display with animations | Streamers & Teachers |
| 🎯 **Which-Key Helper** | Interactive command hints and discovery | Beginners & Learning |
| 📝 **Live Vimrc Editor** | Real-time configuration with instant preview | Customization & Setup |
| 📚 **Comprehensive Cheat Sheet** | Searchable command reference with examples | Quick Reference |
| 💾 **Smart Persistence** | All settings auto-saved locally | Consistent Experience |
| 🎨 **Modern UI** | Clean, distraction-free terminal interface | Professional Use |

</div>

## 🎥 Perfect for Content Creators

VIM is designed with streamers, YouTubers, and educators in mind:

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

**Browser Compatibility:** VIM now works in ALL browsers! If your browser doesn't support SharedArrayBuffer, it automatically falls back to a Monaco-based VIM emulation with full Which-Key support. Check the browser console to see which mode is active.

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

Open http://localhost:5173 and experience VIM like never before!

## ⚡ Features Deep Dive

### 📁 Practice Files System
Learn VIM with real-world scenarios! Our practice files feature includes:
- **6 diverse practice scenarios** - Code editing, prose writing, config files, and data manipulation
- **Multiple categories** - JavaScript, Python, prose editing, config management, CSV data, and log analysis
- **Difficulty levels** - Beginner, intermediate, and advanced challenges
- **Task-based learning** - Each file comes with specific editing tasks to practice
- **Instant loading** - Click and start practicing immediately
- **Syntax highlighting** - Proper language detection and highlighting

**Practice scenarios include:**
- 🔧 **Code Refactoring** - Clean up JavaScript functions with VIM efficiency
- 🐍 **Python Editing** - Work with classes, functions, and imports
- ✍️ **Prose Writing** - Format text, fix grammar, and structure paragraphs  
- ⚙️ **Config Management** - Edit NGINX configurations and system files
- 📊 **Data Processing** - Manipulate CSV data and extract information
- 📝 **Log Analysis** - Parse and analyze server logs efficiently

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
- 📝 **Improving docs** - Help others understand and use VIM.io
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

- **6 practice file scenarios** with real-world editing challenges
- **20+ VIM command categories** with comprehensive coverage
- **500+ VIM commands** documented and searchable
- **6 positioning options** for keystroke visualization
- **5 font sizes** for different use cases
- **100% TypeScript** for type safety and developer experience
- **Zero external dependencies** for VIM functionality (uses native vim.wasm)
- **Universal browser compatibility** with automatic fallback mode

## 📄 License

VIM is open source software licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[Vim](https://www.vim.org/)** - The legendary text editor that started it all
- **[vim.wasm](https://github.com/rhysd/vim.wasm)** - Making VIM possible in browsers everywhere
- **[React Team](https://react.dev/)** - For the incredible development experience
- **The VIM Community** - Decades of innovation, documentation, and passion

<sub>VIM - Where VIM Learning Meets Professional Content Creation!</sub>

</div>
