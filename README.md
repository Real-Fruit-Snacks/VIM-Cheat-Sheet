<div align="center">
  <a href="https://real-fruit-snacks.github.io/VIM/">
    <img src="public/favicon-detailed.svg" alt="VIMora Logo" width="100" />
  </a>
  
  <h1>VIMora</h1>
  
  <p align="center">
    <strong>Professional VIM Experience in Your Browser</strong>
  </p>
  
  <p align="center">
    Real VIM. Zero Setup. Built for Developers & Educators.
  </p>
  
  <p align="center">
    <a href="https://real-fruit-snacks.github.io/VIM/"><strong>Try VIMora Now →</strong></a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#quick-start">Quick Start</a>
    ·
    <a href="#documentation">Docs</a>
  </p>
  
  <p align="center">
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
    </a>
    <a href="https://github.com/Real-Fruit-Snacks/VIM/releases/latest">
      <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
    </a>
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-19.1-61DAFB.svg?logo=react" alt="React" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript" alt="TypeScript" />
    </a>
    <a href="https://github.com/rhysd/vim.wasm">
      <img src="https://img.shields.io/badge/Powered%20by-vim.wasm-019733.svg?logo=vim" alt="vim.wasm" />
    </a>
  </p>
</div>

<br />

<div align="center">
  <p><em>Full VIM experience with real-time keystroke visualization and interactive command hints</em></p>
</div>

---

## Why VIMora?

VIMora brings the complete VIM experience to your browser with **zero installation required**. Whether you're learning VIM, teaching others, or need a quick editor on any device, VIMora delivers professional-grade functionality with an intuitive interface.

### Key Benefits

<table>
  <tr>
    <td width="50%">
      <h4>🚀 Instant Access</h4>
      <p>No downloads, no configuration. Click and start editing with full VIM capabilities in seconds.</p>
    </td>
    <td width="50%">
      <h4>🎯 Real VIM Engine</h4>
      <p>Powered by vim.wasm - authentic VIM compiled to WebAssembly, not a simulation.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>🎓 Built for Learning</h4>
      <p>Interactive command hints and keystroke visualization make VIM accessible to beginners.</p>
    </td>
    <td width="50%">
      <h4>📱 Universal Compatibility</h4>
      <p>Works on any modern browser with intelligent fallback for maximum compatibility.</p>
    </td>
  </tr>
</table>

## Features

### Core Capabilities

- **Native VIM Experience** - Full VIM functionality via WebAssembly
- **Dual Implementation** - Automatic fallback ensures it works everywhere
- **Live Configuration** - Real-time vimrc editing with instant preview
- **Persistent Settings** - All preferences saved locally across sessions
- **Practice Files** - Built-in examples for learning VIM techniques

### For Educators & Content Creators

#### Professional Keystroke Visualizer
- Real-time display with smooth animations
- 6 position presets for any recording setup
- Adjustable size and display duration
- Perfect for tutorials and live streaming

#### Interactive Learning Tools
- **Which-Key System** - Shows available commands as you type
- **Mode Indicators** - Clear visual feedback for current VIM mode
- **Command Reference** - Built-in cheat sheet (press `?`)

## Quick Start

### Online (Recommended)

Visit [vimora.app](https://real-fruit-snacks.github.io/VIM/) to start using VIMora immediately.

### Local Development

```bash
# Clone and setup
git clone https://github.com/Real-Fruit-Snacks/VIM.git
cd VIM
npm install

# Start development server
npm run dev

# Open http://localhost:5173/VIM/
```

### Enterprise Deployment

For air-gapped or internal networks:

```bash
# Generate offline deployment package
./create-gitlab-release.sh

# Package includes everything needed for internal deployment
# See releases for pre-built packages
```

## Browser Support

| Browser | Support Level | Notes |
|---------|--------------|-------|
| Chrome/Edge 90+ | ✅ Full | Native vim.wasm with optimal performance |
| Firefox 89+ | ✅ Full | Enable SharedArrayBuffer flag for vim.wasm* |
| Safari 15.2+ | ✅ Full | Enable developer settings for vim.wasm* |
| Mobile Browsers | ✅ Supported | Monaco VIM mode with touch optimization |

*Automatic fallback to Monaco VIM if configuration not enabled

## Architecture Overview

```
VIMora
├── Hybrid Editor System
│   ├── vim.wasm (Native VIM)
│   └── Monaco VIM (Fallback)
├── Interactive Features
│   ├── Which-Key Helper
│   ├── Keystroke Visualizer
│   └── Live Vimrc Editor
└── Smart Browser Detection
    └── Automatic Implementation Selection
```

### Technology Stack

- **Frontend**: React 19.1 + TypeScript 5.8
- **VIM Engine**: vim.wasm 0.0.13
- **Editor Fallback**: Monaco Editor + monaco-vim
- **Styling**: Tailwind CSS 3.4
- **Build**: Vite 6.3 with optimized chunking

## Documentation

### For Users
- [Getting Started Guide](docs/getting-started.md)
- [Keyboard Shortcuts](docs/shortcuts.md)
- [Configuration Guide](docs/configuration.md)

### For Developers
- [Architecture Documentation](docs/architecture.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [API Reference](docs/api.md)

## Contributing

We welcome contributions! VIMora is built by the community, for the community.

### Ways to Contribute

- **Report Issues** - Help us improve stability
- **Suggest Features** - Share your ideas
- **Submit PRs** - Contribute code improvements
- **Improve Docs** - Help others get started
- **Test Browsers** - Ensure universal compatibility

See our [Contributing Guide](CONTRIBUTING.md) for details.

## Performance

- **Initial Load**: ~3.2MB (with code splitting)
- **Time to Interactive**: <2s on modern connections
- **Memory Usage**: ~50MB (vim.wasm) / ~30MB (Monaco)
- **Offline Ready**: Full functionality after initial load

## Security

- No data leaves your browser
- All configuration stored locally
- Open source and auditable
- No tracking or analytics

## License

VIMora is open source software licensed under the [MIT License](LICENSE).

## Acknowledgments

Built on the shoulders of giants:

- [Vim](https://www.vim.org/) - The timeless text editor
- [vim.wasm](https://github.com/rhysd/vim.wasm) - VIM in the browser
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code's editor
- [React](https://react.dev/) - UI framework

---

<div align="center">
  <p>
    <a href="https://real-fruit-snacks.github.io/VIM/"><strong>Start Using VIMora →</strong></a>
  </p>
  <p>
    <sub>Made with ❤️ by developers, for developers</sub>
  </p>
</div>