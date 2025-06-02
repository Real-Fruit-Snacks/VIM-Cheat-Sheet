#!/bin/bash

# Create a complete offline bundle for transfer to isolated environments
echo "📦 Creating complete offline bundle for VIM.io..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create temporary directory
BUNDLE_NAME="vim-io-offline-bundle-$(date +%Y%m%d)"
TEMP_DIR="/tmp/$BUNDLE_NAME"

echo -e "${YELLOW}Creating bundle: $BUNDLE_NAME${NC}"

# Clean and create temp directory
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Step 1: Copy all necessary files
echo -e "\n${GREEN}Step 1: Copying project files...${NC}"
cp -r src "$TEMP_DIR/"
cp -r public "$TEMP_DIR/"
cp -r gitlab-public "$TEMP_DIR/"
cp package*.json "$TEMP_DIR/"
cp -r *.config.* "$TEMP_DIR/" 2>/dev/null || true
cp -r *.yml "$TEMP_DIR/" 2>/dev/null || true
cp *.md "$TEMP_DIR/"
cp *.sh "$TEMP_DIR/"
cp LICENSE "$TEMP_DIR/" 2>/dev/null || true

# Step 2: Create npm offline cache
echo -e "\n${GREEN}Step 2: Creating offline npm cache...${NC}"
if [ -d "node_modules" ]; then
    echo "Using existing node_modules for cache creation..."
    # Create a minimal npm cache from existing modules
    mkdir -p "$TEMP_DIR/npm-offline-cache"
    cp -r node_modules "$TEMP_DIR/"
    echo "node_modules included for offline use"
else
    echo -e "${YELLOW}Warning: node_modules not found${NC}"
    echo "Run 'npm install' first to include offline npm dependencies"
fi

# Step 3: Create offline installation script
echo -e "\n${GREEN}Step 3: Creating offline installation script...${NC}"
cat > "$TEMP_DIR/install-offline.sh" << 'EOF'
#!/bin/bash

echo "🚀 VIM.io Offline Installation"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "   Please run this script from the VIM.io directory"
    exit 1
fi

# Option 1: Use pre-built files (fastest)
if [ -d "gitlab-public" ]; then
    echo "✅ Pre-built files found in gitlab-public/"
    echo "   These can be deployed directly to GitLab Pages"
    echo ""
    echo "To deploy:"
    echo "1. Push this folder to your GitLab repository"
    echo "2. GitLab Pages will serve the files from gitlab-public/"
    echo ""
fi

# Option 2: Rebuild from source
echo "To rebuild from source (optional):"
echo "1. Ensure Node.js 18+ is installed"
echo "2. Run: npm install --offline"
echo "3. Run: npm run build"
echo ""

# Verify files
echo "📋 Verification:"
if [ -d "gitlab-public" ]; then
    FILE_COUNT=$(find gitlab-public -type f | wc -l)
    echo "✅ Pre-built files: $FILE_COUNT files ready"
fi

if [ -d "node_modules" ]; then
    echo "✅ Node modules: Included for offline rebuilds"
else
    echo "⚠️  Node modules: Not included (rebuild will need npm access)"
fi

echo ""
echo "🎉 Ready for offline deployment!"
EOF

chmod +x "$TEMP_DIR/install-offline.sh"

# Step 4: Create verification script  
echo -e "\n${GREEN}Step 4: Adding verification tools...${NC}"
cp verify-offline-build.sh "$TEMP_DIR/" 2>/dev/null || true
cp generate-checksums.sh "$TEMP_DIR/" 2>/dev/null || true

# Step 5: Generate checksums for bundle
echo -e "\n${GREEN}Step 5: Generating integrity checksums...${NC}"
cd "$TEMP_DIR"
find . -type f -not -path "./npm-offline-cache/*" -not -path "./node_modules/*" | sort | xargs sha256sum > CHECKSUMS.txt
cd - > /dev/null

# Step 6: Create README for the bundle
echo -e "\n${GREEN}Step 6: Creating bundle documentation...${NC}"
cat > "$TEMP_DIR/OFFLINE_BUNDLE_README.md" << 'EOF'
# VIM.io Offline Bundle

This bundle contains everything needed to deploy VIM.io in a completely offline environment.

## 📦 Bundle Contents

- `gitlab-public/` - Pre-built application (ready to deploy)
- `src/` - Source code
- `public/` - Static assets
- `*.md` - All documentation
- `*.sh` - Build and deployment scripts
- `node_modules/` - npm dependencies (if included)
- Configuration files

## 🚀 Quick Deployment (Pre-built)

The fastest way - use the pre-built files:

1. Copy this bundle to your offline environment
2. Navigate to the bundle directory
3. The `gitlab-public/` folder is ready to deploy
4. Push to GitLab and enable Pages

## 🔨 Rebuild from Source (Optional)

If you need to modify and rebuild:

1. Ensure Node.js 18+ is installed
2. Run `./install-offline.sh`
3. Run `npm install --offline` (if node_modules included)
4. Run `npm run build`

## ✅ Verification

- Run `./verify-offline-build.sh` to check the build
- Check `CHECKSUMS.txt` to verify file integrity
- Review `SECURITY.md` for security considerations

## 📚 Documentation

- `README.md` - Main project documentation
- `GITLAB_DEPLOYMENT.md` - GitLab-specific instructions
- `TROUBLESHOOTING.md` - Common issues and solutions
- `BUILD_GUIDE.md` - Build customization options
- `SECURITY.md` - Security considerations

## 🆘 Offline Troubleshooting

Since you're offline, all documentation is included. Check:
1. `TROUBLESHOOTING.md` for common issues
2. Browser console for specific errors
3. Ensure all files were transferred correctly
EOF

# Step 7: Create the bundle
echo -e "\n${GREEN}Step 7: Creating compressed bundle...${NC}"
cd /tmp
tar -czf "$BUNDLE_NAME.tar.gz" "$BUNDLE_NAME"
mv "$BUNDLE_NAME.tar.gz" "$OLDPWD/"
cd - > /dev/null

# Step 8: Create extraction instructions
echo -e "\n${GREEN}Step 8: Creating extraction instructions...${NC}"
cat > "extract-bundle-instructions.txt" << EOF
VIM.io Offline Bundle Extraction Instructions
============================================

1. Transfer $BUNDLE_NAME.tar.gz to your offline environment via USB/secure transfer

2. Extract the bundle:
   tar -xzf $BUNDLE_NAME.tar.gz
   cd $BUNDLE_NAME

3. For quick deployment (recommended):
   - Use the pre-built files in gitlab-public/
   - Push to your GitLab instance
   - Enable GitLab Pages

4. To verify integrity:
   sha256sum -c CHECKSUMS.txt

5. Read OFFLINE_BUNDLE_README.md for detailed instructions

Bundle created: $(date)
Size: $(du -h "$BUNDLE_NAME.tar.gz" | cut -f1)
Files: $(tar -tzf "$BUNDLE_NAME.tar.gz" | wc -l)
EOF

# Cleanup
rm -rf "$TEMP_DIR"

# Final summary
echo -e "\n${GREEN}✅ Offline bundle created successfully!${NC}"
echo -e "Bundle: ${YELLOW}$BUNDLE_NAME.tar.gz${NC}"
echo -e "Size: ${YELLOW}$(du -h "$BUNDLE_NAME.tar.gz" | cut -f1)${NC}"
echo -e "\nNext steps:"
echo "1. Review extract-bundle-instructions.txt"
echo "2. Transfer $BUNDLE_NAME.tar.gz to offline environment"
echo "3. Follow the extraction and deployment instructions"