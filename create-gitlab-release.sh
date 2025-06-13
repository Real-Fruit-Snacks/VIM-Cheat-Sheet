#!/bin/bash

# VIMora GitLab Pages Release Builder
# Creates a complete offline-capable deployment package for GitLab Pages

set -e  # Exit on any error

echo "🚀 Building VIMora for GitLab Pages offline deployment..."

# Get version and timestamp
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RELEASE_NAME="vimora-gitlab-offline-v${VERSION}-${TIMESTAMP}"

echo "📦 Creating release: $RELEASE_NAME"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf gitlab-release/
rm -rf *.tar.gz
rm -f release-checksums.txt

# Build the application
echo "🔨 Building application for production..."
npm run build

# Create release directory
echo "📁 Creating GitLab release structure..."
mkdir -p gitlab-release

# Copy built files to public directory (GitLab requirement)
echo "📋 Copying application files..."
mkdir -p gitlab-release/public
cp -r dist/* gitlab-release/public/

# Ensure vim-wasm files are included
echo "🔧 Verifying vim-wasm files..."
if [ ! -d "gitlab-release/public/vim-wasm" ]; then
    echo "❌ Error: vim-wasm files missing from build!"
    exit 1
fi

# Create .gitlab-ci.yml
echo "📄 Creating GitLab CI configuration..."
cat > gitlab-release/.gitlab-ci.yml << 'EOF'
# GitLab CI/CD configuration for VIMora
# Automatic deployment to GitLab Pages

image: alpine:latest

pages:
  stage: deploy
  script:
    - echo "Deploying VIMora to GitLab Pages..."
    - echo "All files are pre-built and ready for deployment"
    - ls -la public/
  artifacts:
    paths:
      - public
  only:
    - main
    - master

# Optional: Add caching for faster subsequent deployments
cache:
  paths:
    - public/
EOF

# Create comprehensive deployment instructions
echo "📖 Creating deployment documentation..."
cat > gitlab-release/DEPLOYMENT_GUIDE.md << 'EOF'
# VIMora GitLab Pages Deployment Guide

## 🚀 Quick Start (3 Steps)

1. **Upload to GitLab**: Upload all files from this package to your GitLab repository
2. **Push to main branch**: GitLab will automatically deploy
3. **Access your site**: Visit `https://yourusername.gitlab.io/your-repo-name/`

## 📦 What's Included

This package contains everything needed for a complete offline VIMora installation:

- ✅ **Pre-built application** - No build process required
- ✅ **All dependencies included** - vim.wasm, fonts, icons, etc.
- ✅ **GitLab CI configuration** - Automatic deployment setup
- ✅ **Security headers** - Cross-origin isolation configured
- ✅ **Offline capability** - Works without internet after initial load

## 📁 File Structure

```
your-gitlab-repo/
├── .gitlab-ci.yml          # GitLab CI/CD configuration
├── public/                 # Application files (GitLab requirement)
│   ├── index.html         # Main entry point
│   ├── assets/            # CSS, JS, and fonts
│   ├── vim-wasm/          # VIM WebAssembly files
│   │   ├── vim.wasm       # VIM binary
│   │   ├── vim.js         # VIM JavaScript wrapper
│   │   └── vim.data       # VIM data files
│   ├── _headers           # Security headers
│   └── *.svg              # Favicon files
└── DEPLOYMENT_GUIDE.md    # This file
```

## 🔧 Deployment Methods

### Method 1: GitLab Web Interface (Easiest)

1. Create a new GitLab repository
2. Go to **Project** → **Repository** → **Files**
3. Click **"+"** → **"Upload file"**
4. Select and upload ALL files from this package
5. Commit to main branch
6. GitLab Pages will automatically deploy

### Method 2: Git Command Line

```bash
# Clone your GitLab repository
git clone https://gitlab.com/yourusername/your-repo.git
cd your-repo

# Copy all files from this package
cp -r /path/to/extracted/vimora-files/* .

# Add, commit, and push
git add .
git commit -m "Deploy VIMora - Browser-based VIM with keystroke visualization"
git push origin main
```

### Method 3: Direct Push

```bash
# In the extracted package directory
git init
git add .
git commit -m "Initial VIMora deployment"
git remote add origin https://gitlab.com/yourusername/your-repo.git
git push -u origin main
```

## 🌐 Accessing Your Site

After deployment, your VIMora instance will be available at:

```
https://yourusername.gitlab.io/your-repo-name/
```

Replace `yourusername` and `your-repo-name` with your actual values.

### First Deployment
- GitLab Pages may take 10-30 minutes to activate on first deployment
- Check **Settings** → **Pages** for deployment status

## ⚙️ Configuration Options

### Custom Domain

1. Go to **Settings** → **Pages**
2. Click **"New Domain"**
3. Enter your custom domain
4. Configure DNS as instructed
5. GitLab provides free SSL certificates

### Access Control (GitLab Premium)

Make your VIMora instance private:
1. Go to **Settings** → **Pages**
2. Toggle **"Access Control"**
3. Only project members can access

## 🛡️ Security Features

This deployment includes:
- **Cross-Origin Isolation**: Required for vim.wasm SharedArrayBuffer
- **Content Security Policy**: Secure default configuration
- **HTTPS Only**: Enforced by GitLab Pages

## 🚨 Troubleshooting

### Site Not Loading
- Ensure ALL files are in the `public/` directory
- Check GitLab CI/CD pipelines for errors
- Verify `.gitlab-ci.yml` is in repository root

### VIM Not Working
- Check browser console for errors
- Ensure `_headers` file was uploaded
- Verify all files in `vim-wasm/` directory exist
- Try a different browser (Chrome/Edge recommended)

### 404 Error
- Wait 10-30 minutes after first deployment
- Check repository name matches URL
- Ensure `index.html` is in `public/` directory

### Slow Loading
- GitLab Pages uses global CDN - initial load may vary
- After first load, app works offline
- All assets are optimized and compressed

## 🌟 Features Available Offline

Once loaded, VIMora works completely offline with:
- 🎹 Full VIM editor (via WebAssembly)
- 🎥 Keystroke visualizer for teaching
- 🎯 Which-Key command helper
- 📝 Live vimrc configuration
- 📚 Comprehensive cheat sheet
- 💾 Local storage persistence

## 🤝 Support

- **Source Code**: https://github.com/Real-Fruit-Snacks/VIMora
- **Live Demo**: https://real-fruit-snacks.github.io/VIMora/
- **Issues**: https://github.com/Real-Fruit-Snacks/VIMora/issues

## 📄 License

VIMora is open source software licensed under the MIT License.

---

**Note**: This is a pre-built package. No development environment or build process is required. Just upload and deploy!
EOF

# Create a README for the package
cat > gitlab-release/README.md << 'EOF'
# VIMora - GitLab Pages Offline Deployment Package

This package contains a complete, pre-built VIMora application ready for GitLab Pages deployment.

## ✨ Features

- 🚀 **Zero Build Process** - Pre-built and ready to deploy
- 🌐 **100% Offline Capable** - All dependencies included
- 🎹 **Real VIM Experience** - Full VIM via WebAssembly
- 🎥 **Keystroke Visualizer** - Perfect for tutorials and streaming
- 📚 **Learning Tools** - Which-Key helper, cheat sheet, practice files

## 🚀 Quick Deploy

1. Upload all files to your GitLab repository
2. Push to main branch
3. Access at: `https://yourusername.gitlab.io/repo-name/`

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📦 Package Contents

- Complete VIMora application (pre-built)
- GitLab CI/CD configuration
- All required assets and dependencies
- Comprehensive deployment documentation

No external dependencies or build process required!
EOF

# Create package
echo "📦 Creating deployment archive..."
cd gitlab-release
tar -czf "../${RELEASE_NAME}.tar.gz" .
cd ..

# Generate checksums
echo "🔐 Generating checksums..."
if command -v sha256sum &> /dev/null; then
    sha256sum "${RELEASE_NAME}.tar.gz" > release-checksums.txt
elif command -v shasum &> /dev/null; then
    shasum -a 256 "${RELEASE_NAME}.tar.gz" > release-checksums.txt
fi

# Display summary
echo ""
echo "✅ GitLab offline deployment package created successfully!"
echo ""
echo "📦 Package: ${RELEASE_NAME}.tar.gz"
echo "📊 Size: $(du -h "${RELEASE_NAME}.tar.gz" | cut -f1)"
echo ""
echo "📋 Package contains:"
echo "  - Complete pre-built VIMora application"
echo "  - All vim.wasm files for offline operation"
echo "  - GitLab CI/CD configuration"
echo "  - Comprehensive deployment guide"
echo "  - No external dependencies"
echo ""

if [ -f release-checksums.txt ]; then
    echo "🔐 SHA256 Checksum:"
    cat release-checksums.txt
    echo ""
fi

echo "🎉 Ready for GitHub release!"
echo "   Upload ${RELEASE_NAME}.tar.gz to your GitHub release"
echo "   Users can extract and deploy to GitLab with zero configuration"