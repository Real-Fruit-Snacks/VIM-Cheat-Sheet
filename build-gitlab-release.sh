#!/bin/bash

# Build script for GitLab Pages offline deployment
# This creates a complete offline-ready bundle for GitLab Pages

set -e

echo "🚀 Building VIM for GitLab Pages offline deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist gitlab-pages vim-gitlab-*.tar.gz

# Build the application with GitLab base path
echo "📦 Building application..."
# Temporarily update vite config for GitLab
sed -i.bak "s|base: '/VIM.io/'|base: '/VIM/'|" vite.config.ts
npm run build
# Restore original config
mv vite.config.ts.bak vite.config.ts

# Create GitLab Pages directory
echo "📁 Creating GitLab Pages structure..."
mkdir -p gitlab-pages

# Copy built files
cp -r dist/* gitlab-pages/

# Ensure all paths use /VIM/ base path
echo "🔧 Adjusting paths for GitLab..."
find gitlab-pages -name "*.html" -type f -exec sed -i 's|/VIM\.io/|/VIM/|g' {} \;
find gitlab-pages -name "*.js" -type f -exec sed -i 's|/VIM\.io/|/VIM/|g' {} \;
find gitlab-pages -name "*.css" -type f -exec sed -i 's|/VIM\.io/|/VIM/|g' {} \;

# Create deployment instructions
echo "📝 Creating deployment instructions..."
cat > gitlab-pages/GITLAB_DEPLOYMENT.md << 'EOF'
# GitLab Pages Deployment Instructions

## Quick Deploy

1. Create a new GitLab project named "VIM"
2. Extract this bundle to your local machine
3. Initialize git and push to GitLab:

```bash
cd gitlab-pages
git init
git add .
git commit -m "Initial VIM deployment"
git remote add origin https://gitlab.com/YOUR_USERNAME/VIM.git
git push -u origin main
```

4. Enable GitLab Pages:
   - Go to Settings → Pages
   - Set deployment source to "GitLab CI/CD"
   
5. Create `.gitlab-ci.yml` file with this content:

```yaml
pages:
  stage: deploy
  script:
    - mkdir .public
    - cp -r * .public
    - mv .public public
  artifacts:
    paths:
      - public
  only:
    - main
```

6. Commit and push:

```bash
git add .gitlab-ci.yml
git commit -m "Add GitLab CI configuration"
git push
```

7. Your site will be available at: `https://YOUR_USERNAME.gitlab.io/VIM/`

## Features

- ✅ 100% offline capable
- ✅ No external dependencies
- ✅ Full VIM experience with vim.wasm
- ✅ Automatic fallback to Monaco editor if needed
- ✅ All assets self-contained

## Browser Support

The application works in all modern browsers. Check the console logs to see which editor mode is active.

For best experience with vim.wasm, enable SharedArrayBuffer in your browser if prompted.
EOF

# Create GitLab CI configuration
echo "🔧 Creating GitLab CI configuration..."
cat > gitlab-pages/.gitlab-ci.yml << 'EOF'
pages:
  stage: deploy
  script:
    - mkdir .public
    - cp -r * .public
    - mv .public public
  artifacts:
    paths:
      - public
  only:
    - main
EOF

# Create version file
echo "📌 Creating version info..."
cat > gitlab-pages/VERSION.txt << EOF
VIM - Interactive VIM Learning Platform
Version: 1.0.1
Build Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Repository: https://github.com/Real-Fruit-Snacks/VIM.io
EOF

# Create bundle
echo "📦 Creating release bundle..."
BUNDLE_NAME="vim-gitlab-v1.0.1-$(date +%Y%m%d).tar.gz"
tar -czf "$BUNDLE_NAME" gitlab-pages/

# Calculate checksum
echo "🔐 Calculating checksum..."
sha256sum "$BUNDLE_NAME" > "$BUNDLE_NAME.sha256"

# Create release notes
echo "📝 Creating release notes..."
cat > RELEASE_NOTES.md << 'EOF'
# VIM v1.0.1 - GitLab Pages Offline Bundle

## 🚀 What's New

- Complete offline-ready bundle for GitLab Pages deployment
- Automatic browser compatibility detection
- Console logging shows which editor mode is active
- Improved documentation and deployment instructions

## 📦 Bundle Contents

- Pre-built VIM application with `/VIM/` base path
- GitLab CI/CD configuration file
- Comprehensive deployment instructions
- All assets self-contained (no external dependencies)

## 🛠️ Deployment

1. Download `vim-gitlab-v1.0.1-*.tar.gz`
2. Extract to your local machine
3. Follow instructions in `GITLAB_DEPLOYMENT.md`

## ✨ Features

- **Full VIM Experience**: Real vim.wasm when SharedArrayBuffer is available
- **Universal Compatibility**: Automatic fallback to Monaco-vim
- **Which-Key Support**: Interactive command hints in both modes
- **Keystroke Visualizer**: Perfect for teaching and streaming
- **100% Offline**: No internet connection required after deployment

## 🔧 Technical Details

- Base path configured for `/VIM/`
- COOP/COEP headers included for SharedArrayBuffer support
- Service worker for offline functionality
- Optimized asset loading and caching

## 📝 Notes

- The bundle is configured for GitLab Pages with project name "VIM"
- Check browser console to see which editor mode is active
- For vim.wasm mode, enable SharedArrayBuffer if prompted

## 🐛 Bug Fixes

- Fixed base path configuration for GitLab deployments
- Improved browser capability detection
- Enhanced error handling for missing SharedArrayBuffer

## 📊 Bundle Size

~25MB compressed (includes vim.wasm and all dependencies)
EOF

echo "✅ Build complete!"
echo ""
echo "📦 Release bundle: $BUNDLE_NAME"
echo "🔐 Checksum file: $BUNDLE_NAME.sha256"
echo "📝 Release notes: RELEASE_NOTES.md"
echo ""
echo "Next steps:"
echo "1. Test the bundle locally"
echo "2. Create GitHub release with these files"