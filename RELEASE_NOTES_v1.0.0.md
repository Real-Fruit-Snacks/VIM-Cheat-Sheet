## 🎉 VIM.io v1.0.0

The first official release of VIM.io - a fully offline-capable Vim learning platform running entirely in your browser.

### ✨ Features

- **Complete Vim implementation** via WebAssembly
- **Zero external dependencies** - works completely offline
- **Interactive keystroke visualizer** with WhichKey support
- **Built-in cheat sheet** for quick reference
- **Persistent .vimrc configuration**
- **GitLab Pages ready** deployment

### 📦 Download Options

#### For Quick Deployment (Recommended)
- **vim-io-offline-v1.0.0.tar.gz** (2.2MB) - Minimal bundle with pre-built files only
- **vim-io-offline-v1.0.0.zip** (2.2MB) - Same minimal bundle in ZIP format

#### For Development/Customization
- **vim-io-offline-bundle-20250602.tar.gz** (36MB) - Full bundle with source code and all dependencies

### 🚀 Deployment

Extract the minimal bundle and deploy to any web server:

```bash
tar -xzf vim-io-offline-v1.0.0.tar.gz
cd vim-io-offline-v1.0.0
# Copy gitlab-public contents to your web root
```

For GitLab Pages deployment, see [GITLAB_DEPLOYMENT.md](https://github.com/Real-Fruit-Snacks/VIM.io/blob/gitlab/GITLAB_DEPLOYMENT.md)

### 🔒 Security & Offline Use

- All assets are bundled locally
- No CDN dependencies
- No telemetry or external requests
- CORS headers configured for SharedArrayBuffer support
- Works in air-gapped/offline environments

### 📋 Requirements

- Modern web browser with WebAssembly support
- HTTPS (required for SharedArrayBuffer)
- Web server capable of serving .wasm files with correct MIME types

### 📚 Documentation

- [Deployment Guide](https://github.com/Real-Fruit-Snacks/VIM.io/blob/gitlab/GITLAB_DEPLOYMENT.md)
- [Security Information](https://github.com/Real-Fruit-Snacks/VIM.io/blob/gitlab/SECURITY.md)
- [Troubleshooting](https://github.com/Real-Fruit-Snacks/VIM.io/blob/gitlab/TROUBLESHOOTING.md)

### 🙏 Acknowledgments

Built with vim-wasm by @rhysd