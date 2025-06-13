#!/bin/bash

# Create a minimal offline bundle with just pre-built files for deployment
echo "📦 Creating minimal offline bundle for VIM..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create bundle name with version
VERSION="1.0.0"
BUNDLE_NAME="vim-offline-v${VERSION}"
TEMP_DIR="/tmp/$BUNDLE_NAME"

echo -e "${YELLOW}Creating minimal bundle: $BUNDLE_NAME${NC}"

# Clean and create temp directory
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Step 1: Copy only essential files for deployment
echo -e "\n${GREEN}Step 1: Copying deployment files...${NC}"
cp -r gitlab-public "$TEMP_DIR/"
cp .gitlab-ci.yml "$TEMP_DIR/"
cp .gitlab-ci-minimal.yml "$TEMP_DIR/"
cp GITLAB_DEPLOYMENT.md "$TEMP_DIR/"
cp TROUBLESHOOTING.md "$TEMP_DIR/"
cp SECURITY.md "$TEMP_DIR/"
cp verify-offline-build.sh "$TEMP_DIR/" 2>/dev/null || true
cp checksums.txt "$TEMP_DIR/"

# Step 2: Create simple deployment script
echo -e "\n${GREEN}Step 2: Creating deployment script...${NC}"
cat > "$TEMP_DIR/deploy.sh" << 'EOF'
#!/bin/bash

echo "🚀 VIM.io Offline Deployment Script"
echo "=================================="

# Check if gitlab-public exists
if [ ! -d "gitlab-public" ]; then
    echo "❌ Error: gitlab-public directory not found!"
    exit 1
fi

echo "✅ Pre-built files found in gitlab-public/"
echo ""

echo "📋 Deployment Options:"
echo ""
echo "1. GitLab Pages Deployment:"
echo "   - Push this folder to your GitLab repository"
echo "   - GitLab CI will automatically deploy from gitlab-public/"
echo ""
echo "2. Static Web Server:"
echo "   - Serve the gitlab-public/ directory with any web server"
echo "   - Ensure proper CORS headers (see _headers file)"
echo ""
echo "3. Verification:"
echo "   - Run: cd gitlab-public && sha256sum -c ../checksums.txt"
echo "   - This verifies file integrity"
echo ""

# Quick integrity check
if command -v sha256sum >/dev/null 2>&1; then
    echo "🔒 Running integrity check..."
    cd gitlab-public
    if sha256sum -c ../checksums.txt >/dev/null 2>&1; then
        echo "✅ All files verified successfully!"
    else
        echo "⚠️  Warning: Some files may have been modified"
    fi
    cd ..
fi

echo ""
echo "📚 See GITLAB_DEPLOYMENT.md for detailed instructions"
echo "🔧 See TROUBLESHOOTING.md if you encounter issues"
echo "🔒 See SECURITY.md for security considerations"
EOF

chmod +x "$TEMP_DIR/deploy.sh"

# Step 3: Create README specifically for the bundle
echo -e "\n${GREEN}Step 3: Creating bundle README...${NC}"
cat > "$TEMP_DIR/README.md" << 'EOF'
# VIM.io Offline Deployment Bundle

## 🚀 Quick Start

This bundle contains the pre-built VIM.io application ready for immediate deployment.

### What's Included
- `gitlab-public/` - Complete pre-built application (7.8MB)
- `.gitlab-ci.yml` - GitLab CI configuration  
- `deploy.sh` - Quick deployment script
- Documentation files
- `checksums.txt` - File integrity verification

### Deployment Steps

#### Option 1: GitLab Pages (Recommended)
1. Extract this bundle
2. Push to your GitLab repository
3. GitLab Pages will serve from `gitlab-public/`

```bash
# In your GitLab project
git add .
git commit -m "Deploy VIM.io"
git push origin main
```

#### Option 2: Any Web Server
```bash
# Serve the gitlab-public directory
cd gitlab-public
python -m http.server 8080
# OR
npx serve .
```

### Verification
```bash
# Verify file integrity
cd gitlab-public
sha256sum -c ../checksums.txt
```

### No Internet Required
- All files are pre-built and bundled
- No npm install needed
- No external dependencies
- Works completely offline

### Documentation
- `GITLAB_DEPLOYMENT.md` - Detailed GitLab instructions
- `TROUBLESHOOTING.md` - Common issues and solutions
- `SECURITY.md` - Security considerations

## System Requirements
- Modern web browser (Chrome, Firefox, Edge)
- Web server or GitLab instance
- ~8MB disk space

## License
MIT License - See the main repository for details
EOF

# Step 4: Generate bundle checksums
echo -e "\n${GREEN}Step 4: Generating bundle checksums...${NC}"
cd "$TEMP_DIR"
find . -type f | sort | xargs sha256sum > BUNDLE_CHECKSUMS.txt
cd - > /dev/null

# Step 5: Create the bundle
echo -e "\n${GREEN}Step 5: Creating compressed bundle...${NC}"
cd /tmp
tar -czf "$BUNDLE_NAME.tar.gz" "$BUNDLE_NAME"
zip -r "$BUNDLE_NAME.zip" "$BUNDLE_NAME" >/dev/null 2>&1
mv "$BUNDLE_NAME.tar.gz" "$OLDPWD/"
mv "$BUNDLE_NAME.zip" "$OLDPWD/"
cd - > /dev/null

# Cleanup
rm -rf "$TEMP_DIR"

# Final summary
echo -e "\n${GREEN}✅ Minimal offline bundles created successfully!${NC}"
echo -e "\nCreated files:"
echo -e "1. ${YELLOW}$BUNDLE_NAME.tar.gz${NC} ($(du -h "$BUNDLE_NAME.tar.gz" | cut -f1))"
echo -e "2. ${YELLOW}$BUNDLE_NAME.zip${NC} ($(du -h "$BUNDLE_NAME.zip" | cut -f1))"
echo -e "\nThese bundles contain:"
echo "- Pre-built application (ready to deploy)"
echo "- GitLab CI configuration"
echo "- All documentation"
echo "- Deployment scripts"
echo -e "\n${GREEN}Ready to upload to GitHub Releases!${NC}"