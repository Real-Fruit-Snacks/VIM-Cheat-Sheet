#!/bin/bash

# VIM.io GitLab Pages Release Builder
# This script creates a complete deployment package for GitLab Pages hosting

set -e  # Exit on any error

echo "🚀 Building VIM.io for GitLab Pages deployment..."

# Get current version from package.json
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RELEASE_NAME="vim-gitlab-pages-v${VERSION}-${TIMESTAMP}"

echo "📦 Creating release: $RELEASE_NAME"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf gitlab-pages/
rm -rf *.tar.gz
rm -f checksums.txt

# Build the application
echo "🔨 Building application..."
npm run build

# Create GitLab Pages directory structure
echo "📁 Creating GitLab Pages structure..."
mkdir -p gitlab-pages

# Copy built files
echo "📋 Copying built application..."
cp -r dist/* gitlab-pages/

# Create GitLab Pages specific files
echo "📄 Creating GitLab Pages configuration..."

# Create .gitlab-ci.yml for GitLab Pages
cat > gitlab-pages/.gitlab-ci.yml << 'EOF'
# GitLab CI/CD configuration for VIM.io deployment
# This file enables automatic deployment to GitLab Pages

image: alpine:latest

pages:
  stage: deploy
  script:
    - echo "Deploying VIM.io to GitLab Pages..."
    - ls -la public/
  artifacts:
    paths:
      - public
  only:
    - main
    - master

before_script:
  - echo "VIM.io - Interactive VIM Learning Platform"
  - echo "Repository: https://github.com/Real-Fruit-Snacks/VIM"
  - echo "Visit live demo: https://real-fruit-snacks.github.io/VIM/"
EOF

# Move built files to public directory (GitLab Pages requirement)
echo "🔄 Organizing for GitLab Pages..."
mkdir -p gitlab-pages/public
mv gitlab-pages/*.html gitlab-pages/public/ 2>/dev/null || true
mv gitlab-pages/*.js gitlab-pages/public/ 2>/dev/null || true
mv gitlab-pages/*.css gitlab-pages/public/ 2>/dev/null || true
mv gitlab-pages/assets gitlab-pages/public/ 2>/dev/null || true

# Copy remaining files to public
for file in gitlab-pages/*; do
    if [[ -f "$file" && "$file" != *".gitlab-ci.yml" ]]; then
        mv "$file" gitlab-pages/public/
    fi
done

# Create deployment instructions
cat > gitlab-pages/DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# VIM.io GitLab Pages Deployment Guide

## Quick Start

1. **Create a new GitLab repository** or use an existing one
2. **Upload all files** from this package to your repository
3. **Ensure the files are in the root** of your repository (not in a subfolder)
4. **Push to GitLab** - GitLab Pages will automatically deploy your site

## File Structure

Your GitLab repository should look like this:
```
your-repo/
├── .gitlab-ci.yml          # GitLab CI/CD configuration
├── public/                 # Built application files
│   ├── index.html         # Main HTML file
│   ├── assets/            # CSS, JS, and other assets
│   ├── favicon-*.svg      # Favicon files
│   ├── _headers           # Security headers
│   ├── coi-serviceworker.js # Cross-origin isolation
│   └── vim-wasm/          # VIM WebAssembly files
└── DEPLOYMENT_INSTRUCTIONS.md # This file
```

## Deployment Steps

### Option 1: GitLab Web Interface
1. Go to your GitLab repository
2. Click "+" → "Upload file"
3. Upload all files from this package
4. Commit the changes
5. GitLab Pages will automatically build and deploy

### Option 2: Git Command Line
```bash
# Clone your GitLab repository
git clone https://gitlab.com/yourusername/your-repo.git
cd your-repo

# Copy all files from this package
cp -r /path/to/extracted/files/* .

# Commit and push
git add .
git commit -m "Deploy VIM.io Interactive Learning Platform"
git push origin main
```

### Option 3: GitLab CLI
```bash
# If you have GitLab CLI installed
glab repo clone yourusername/your-repo
cd your-repo
cp -r /path/to/extracted/files/* .
git add .
git commit -m "Deploy VIM.io Interactive Learning Platform"
git push
```

## Accessing Your Site

After deployment, your site will be available at:
- `https://yourusername.gitlab.io/your-repo-name/`

Replace `yourusername` and `your-repo-name` with your actual GitLab username and repository name.

## Configuration

### Custom Domain (Optional)
To use a custom domain:
1. Go to your GitLab project → Settings → Pages
2. Add your custom domain
3. Configure DNS to point to GitLab Pages

### SSL Certificate
GitLab Pages automatically provides SSL certificates for both gitlab.io domains and custom domains.

## Features

This deployment includes:
- ✅ **100% Offline Capable** - No external dependencies
- ✅ **Cross-Origin Isolation** - Full vim.wasm support
- ✅ **Progressive Web App** - Can be installed as desktop app
- ✅ **Responsive Design** - Works on all devices
- ✅ **Practice Files** - Pre-loaded learning scenarios
- ✅ **Keystroke Visualizer** - Perfect for tutorials
- ✅ **Which-Key System** - Interactive command discovery

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| ✅ Chrome/Edge | Full Support | Recommended |
| ✅ Firefox | Full Support | Latest versions |
| ✅ Safari | Full Support | macOS/iOS |
| ❌ Internet Explorer | Not Supported | Use modern browser |

## Troubleshooting

### Common Issues

**Pages not deploying:**
- Check that `.gitlab-ci.yml` is in the repository root
- Ensure all files are in the `public/` directory
- Check GitLab CI/CD pipeline status

**Site shows 404:**
- Verify `index.html` is in the `public/` directory
- Check GitLab Pages settings in your project

**VIM features not working:**
- Ensure `_headers` file is deployed for cross-origin isolation
- Check browser console for any security errors
- Verify all files in `vim-wasm/` directory are present

**Performance issues:**
- GitLab Pages uses global CDN for fast loading
- All assets are optimized and compressed
- Enable browser caching for better performance

## Support

- **Original Project:** https://github.com/Real-Fruit-Snacks/VIM
- **Live Demo:** https://real-fruit-snacks.github.io/VIM/
- **Issues:** https://github.com/Real-Fruit-Snacks/VIM/issues

## License

This project is licensed under the MIT License.
EOF

# Create README for the package
cat > gitlab-pages/README.md << 'EOF'
# VIM.io - GitLab Pages Deployment Package

This package contains everything you need to deploy VIM.io on GitLab Pages.

## What's Included

- ✅ **Complete Application** - All built files ready for deployment
- ✅ **GitLab CI/CD Configuration** - Automatic deployment setup
- ✅ **Detailed Instructions** - Step-by-step deployment guide
- ✅ **Offline Capability** - No external dependencies required
- ✅ **Cross-Origin Isolation** - Full vim.wasm support enabled

## Quick Deploy

1. Create a new GitLab repository
2. Upload all files from this package
3. Push to GitLab - automatic deployment starts
4. Access your site at `https://yourusername.gitlab.io/repo-name/`

See `DEPLOYMENT_INSTRUCTIONS.md` for detailed setup guide.

## Features

- 🎹 **Native VIM Experience** - Real VIM via WebAssembly
- 📁 **Practice Files** - Pre-loaded learning scenarios
- 🎥 **Keystroke Visualizer** - Perfect for tutorials and streaming
- 🎯 **Which-Key Helper** - Interactive command discovery
- 📝 **Live Vimrc Editor** - Real-time configuration
- 📚 **Comprehensive Cheat Sheet** - Searchable command reference
- 💾 **Smart Persistence** - All settings auto-saved

Perfect for educators, content creators, and VIM learners!
EOF

# Package everything
echo "📦 Creating deployment bundle..."
tar -czf "${RELEASE_NAME}.tar.gz" gitlab-pages/

# Generate checksums
echo "🔐 Generating checksums..."
if command -v sha256sum &> /dev/null; then
    sha256sum "${RELEASE_NAME}.tar.gz" > checksums.txt
elif command -v shasum &> /dev/null; then
    shasum -a 256 "${RELEASE_NAME}.tar.gz" > checksums.txt
else
    echo "Warning: No checksum utility found"
fi

# Display results
echo ""
echo "✅ GitLab Pages deployment package created successfully!"
echo ""
echo "📁 Package: ${RELEASE_NAME}.tar.gz"
echo "📊 Size: $(du -h "${RELEASE_NAME}.tar.gz" | cut -f1)"
echo ""
echo "📦 Contents:"
echo "  - Complete built application"
echo "  - GitLab CI/CD configuration (.gitlab-ci.yml)"
echo "  - Detailed deployment instructions"
echo "  - All required assets for offline operation"
echo ""
echo "🚀 Ready for GitLab Pages deployment!"
echo "   Extract and upload to any GitLab repository"
echo "   GitLab will automatically deploy to Pages"
echo ""

if [[ -f checksums.txt ]]; then
    echo "🔐 Checksum:"
    cat checksums.txt
    echo ""
fi

echo "📖 Next steps:"
echo "   1. Create GitHub release with this package"
echo "   2. Users can download and deploy to GitLab Pages"
echo "   3. See DEPLOYMENT_INSTRUCTIONS.md for details"